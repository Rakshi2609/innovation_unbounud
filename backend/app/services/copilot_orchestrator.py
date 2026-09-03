import os
import json
import uuid
import logging
from typing import List, Optional, Dict, Any
from datetime import datetime, timezone
from sqlalchemy.orm import Session

from app.models.schemas import (
    CustomerProfile,
    MLRiskPrediction,
    CopilotCaseAssessment,
    OfficerDecisionRequest,
    OfficerDecisionResponse,
    EventEnvelope
)
from app.models.database import CaseRecord, AuditTrailRecord, PolicyDocumentRecord, SessionLocal
from app.rag.store import FinancialPolicyStore
from app.rag.graph import FinancialReasoningGraph
from app.ml.client import MLRiskClient
from app.realtime.bus import event_bus
from app.realtime.websocket import ws_manager
from app.core.config import settings

logger = logging.getLogger(__name__)

class CopilotOrchestrator:
    def __init__(self, policy_store: FinancialPolicyStore):
        self.policy_store = policy_store
        self.ml_client = MLRiskClient()
        self.reasoning_graph = FinancialReasoningGraph(policy_store=self.policy_store)

    async def initialize_data(self):
        """Indexes policies and seeds default sample cases into database."""
        # 1. Index policies
        indexed_chunks = self.policy_store.index_directory(settings.policies_dir)
        logger.info(f"Initialized policy knowledge base: {indexed_chunks} chunks indexed across {len(self.policy_store.get_indexed_files())} files.")

        # 2. Seed cases if DB is empty
        db = SessionLocal()
        try:
            count = db.query(CaseRecord).count()
            if count == 0 and os.path.exists(os.path.join(settings.data_dir, "sample_cases.json")):
                with open(os.path.join(settings.data_dir, "sample_cases.json"), "r") as f:
                    samples = json.load(f)
                logger.info(f"Seeding {len(samples)} initial financial cases into database...")
                for item in samples:
                    profile = CustomerProfile(**item)
                    prediction = await self.ml_client.predict_risk(profile)
                    assessment = await self.reasoning_graph.execute(
                        case_id=item["case_id"],
                        customer=profile,
                        ml_prediction=prediction
                    )
                    record = CaseRecord(
                        id=assessment.case_id,
                        customer_id=profile.customer_id,
                        customer_name=profile.name,
                        track_type=item.get("track_type", "distress"),
                        status="PENDING_REVIEW",
                        risk_score=prediction.risk_score,
                        risk_class=prediction.risk_class,
                        risk_type=prediction.risk_type,
                        ml_prediction=prediction.model_dump(),
                        explanation=assessment.explanation.model_dump(),
                        rag_citations=[c.model_dump() for c in assessment.rag_citations],
                        customer_profile=profile.model_dump(),
                        created_at=datetime.now(timezone.utc),
                        updated_at=datetime.now(timezone.utc)
                    )
                    db.add(record)
                db.commit()
                logger.info("Sample financial cases successfully seeded.")
        except Exception as e:
            logger.error(f"Error during orchestrator initialization: {e}", exc_info=True)
        finally:
            db.close()

    async def evaluate_customer_case(self, customer: CustomerProfile, track_type: str = "distress", case_id: Optional[str] = None) -> CopilotCaseAssessment:
        cid = case_id or f"CASE-{datetime.now().strftime('%Y')}-{uuid.uuid4().hex[:6].upper()}"

        # 1. Statistical ML Prediction Layer
        ml_prediction = await self.ml_client.predict_risk(customer)

        # 2. Grounded LangGraph RAG Reasoning
        assessment = await self.reasoning_graph.execute(
            case_id=cid,
            customer=customer,
            ml_prediction=ml_prediction
        )

        # 3. Persist to Database
        db = SessionLocal()
        try:
            existing = db.query(CaseRecord).filter(CaseRecord.id == cid).first()
            if not existing:
                record = CaseRecord(
                    id=cid,
                    customer_id=customer.customer_id,
                    customer_name=customer.name,
                    track_type=track_type,
                    status="PENDING_REVIEW",
                    risk_score=ml_prediction.risk_score,
                    risk_class=ml_prediction.risk_class,
                    risk_type=ml_prediction.risk_type,
                    ml_prediction=ml_prediction.model_dump(),
                    explanation=assessment.explanation.model_dump(),
                    rag_citations=[c.model_dump() for c in assessment.rag_citations],
                    customer_profile=customer.model_dump(),
                    created_at=datetime.now(timezone.utc),
                    updated_at=datetime.now(timezone.utc)
                )
                db.add(record)
            else:
                existing.risk_score = ml_prediction.risk_score
                existing.risk_class = ml_prediction.risk_class
                existing.risk_type = ml_prediction.risk_type
                existing.ml_prediction = ml_prediction.model_dump()
                existing.explanation = assessment.explanation.model_dump()
                existing.rag_citations = [c.model_dump() for c in assessment.rag_citations]
                existing.customer_profile = customer.model_dump()
                existing.updated_at = datetime.now(timezone.utc)

            # Audit record for ML Evaluation
            audit = AuditTrailRecord(
                id=f"AUDIT-{uuid.uuid4().hex[:8].upper()}",
                case_id=cid,
                event_type="ML_EVALUATION_AND_RAG_GROUNDING",
                actor="AI_COPILOT",
                action="Risk Assessment Generated",
                decision=None,
                override_ml=False,
                notes=f"Assessed as {ml_prediction.risk_class} risk ({ml_prediction.risk_score*100:.1f}%) with {len(assessment.rag_citations)} policy citations.",
                details={"risk_score": ml_prediction.risk_score, "risk_class": ml_prediction.risk_class},
                timestamp=datetime.now(timezone.utc)
            )
            db.add(audit)
            db.commit()
        finally:
            db.close()

        # 4. Broadcast Realtime Event
        evt = await event_bus.publish(
            case_id=cid,
            event_type="case.evaluated",
            payload={
                "case_id": cid,
                "customer_name": customer.name,
                "risk_class": ml_prediction.risk_class,
                "risk_score": ml_prediction.risk_score,
                "risk_type": ml_prediction.risk_type,
                "status": "PENDING_REVIEW"
            }
        )
        await ws_manager.broadcast_event(evt)

        return assessment

    async def process_officer_decision(self, case_id: str, request: OfficerDecisionRequest) -> OfficerDecisionResponse:
        db = SessionLocal()
        try:
            case = db.query(CaseRecord).filter(CaseRecord.id == case_id).first()
            if not case:
                raise ValueError(f"Case {case_id} not found.")

            # Status mapping
            new_status = {
                "APPROVE": "APPROVED",
                "REQUEST_INFO": "PENDING_REVIEW",
                "RESTRUCTURE": "RESTRUCTURED",
                "FLAG_FRAUD": "FLAGGED",
                "DECLINE": "DECLINED"
            }.get(request.decision, "PENDING_REVIEW")

            case.status = new_status
            case.updated_at = datetime.now(timezone.utc)

            audit_id = f"AUDIT-{uuid.uuid4().hex[:8].upper()}"
            audit_record = AuditTrailRecord(
                id=audit_id,
                case_id=case_id,
                event_type="HUMAN_OFFICER_DECISION",
                actor=f"{request.officer_name} ({request.officer_id})",
                action=request.action_taken,
                decision=request.decision,
                override_ml=request.override_ml,
                override_reason=request.override_reason,
                notes=request.notes,
                details={"new_status": new_status, "decision": request.decision},
                timestamp=datetime.now(timezone.utc)
            )
            db.add(audit_record)
            db.commit()

            # Broadcast human decision event
            evt = await event_bus.publish(
                case_id=case_id,
                event_type="human.decided",
                payload={
                    "case_id": case_id,
                    "officer_id": request.officer_id,
                    "decision": request.decision,
                    "status": new_status,
                    "override_ml": request.override_ml,
                    "notes": request.notes
                }
            )
            await ws_manager.broadcast_event(evt)

            return OfficerDecisionResponse(
                case_id=case_id,
                status=new_status,
                officer_id=request.officer_id,
                decided_at=datetime.now(timezone.utc).isoformat(),
                audit_id=audit_id,
                notes=request.notes
            )
        finally:
            db.close()
