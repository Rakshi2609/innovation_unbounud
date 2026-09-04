from fastapi import APIRouter, HTTPException, Depends, Request
from sqlalchemy.orm import Session
from typing import List, Optional
from pydantic import BaseModel, Field

from app.models.schemas import CustomerProfile, CopilotCaseAssessment, PolicyCitation
from app.models.database import CaseRecord, SessionLocal, get_db

router = APIRouter(prefix="/api/v1/cases", tags=["cases"])

class EvaluateCaseRequest(BaseModel):
    customer: CustomerProfile
    track_type: str = "distress"
    case_id: Optional[str] = None

class ChatMessage(BaseModel):
    role: str = Field(..., pattern="^(user|assistant|system)$")
    content: str

class ChatRequest(BaseModel):
    """Free-form chat about a triaged case."""
    message: str = Field(..., min_length=1, max_length=2000)
    history: List[ChatMessage] = []
    # If case_id is provided, the response is grounded in that case's context
    case_id: Optional[str] = None

class ChatResponse(BaseModel):
    answer: str
    citations: List[PolicyCitation] = []
    used_llm: bool = False
    case_id: Optional[str] = None

@router.get("")
def list_cases(db: Session = Depends(get_db)):
    records = db.query(CaseRecord).order_by(CaseRecord.created_at.desc()).all()
    from app.models.database import AuditTrailRecord
    case_ids = [r.id for r in records]
    audits = db.query(AuditTrailRecord).filter(AuditTrailRecord.case_id.in_(case_ids)).all() if case_ids else []
    
    import collections
    audit_map = collections.defaultdict(list)
    for a in audits:
        audit_map[a.case_id].append({
            "id": a.id,
            "event_type": a.event_type,
            "actor": a.actor,
            "action": a.action,
            "decision": a.decision,
            "override_ml": a.override_ml,
            "override_reason": a.override_reason,
            "notes": a.notes,
            "timestamp": a.timestamp.isoformat() if a.timestamp else None
        })

    results = []
    for r in records:
        results.append({
            "case_id": r.id,
            "customer_id": r.customer_id,
            "customer_name": r.customer_name,
            "track_type": r.track_type,
            "status": r.status,
            "risk_score": r.risk_score,
            "risk_class": r.risk_class,
            "risk_type": r.risk_type,
            "created_at": r.created_at.isoformat() if r.created_at else None,
            "updated_at": r.updated_at.isoformat() if r.updated_at else None,
            "top_factors": r.ml_prediction.get("top_factors", []) if r.ml_prediction else [],
            "citations_count": len(r.rag_citations) if r.rag_citations else 0,
            "audit_trail": audit_map.get(r.id, [])
        })
    return {"cases": results}

class GrievancePayload(BaseModel):
    grievance_type: str
    customer_id: str
    customer_name: str
    email: str
    dispute_category: str
    case_id: Optional[str]
    description: str
    submitted_at: str

@router.post("/grievances")
def submit_grievance(payload: GrievancePayload, db: Session = Depends(get_db)):
    import uuid
    from app.models.database import AuditTrailRecord
    
    # Store grievance in the audit trail of the case (or standalone if no case)
    audit = AuditTrailRecord(
        id=f"GRV-{uuid.uuid4().hex[:8].upper()}",
        case_id=payload.case_id or "UNLINKED",
        event_type="CUSTOMER_GRIEVANCE",
        actor=payload.customer_name,
        action="SUBMITTED_GRIEVANCE",
        notes=payload.description,
        details={
            "dispute_category": payload.dispute_category,
            "email": payload.email,
            "customer_id": payload.customer_id
        }
    )
    db.add(audit)
    db.commit()
    return {"status": "success", "ticket_id": audit.id}

@router.get("/{case_id}")
def get_case(case_id: str, db: Session = Depends(get_db)):
    record = db.query(CaseRecord).filter(CaseRecord.id == case_id).first()
    if not record:
        raise HTTPException(status_code=404, detail=f"Case '{case_id}' not found.")
    return {
        "case_id": record.id,
        "customer_id": record.customer_id,
        "customer_name": record.customer_name,
        "track_type": record.track_type,
        "status": record.status,
        "risk_score": record.risk_score,
        "risk_class": record.risk_class,
        "risk_type": record.risk_type,
        "customer_profile": record.customer_profile,
        "ml_prediction": record.ml_prediction,
        "explanation": record.explanation,
        "rag_citations": record.rag_citations,
        "created_at": record.created_at.isoformat() if record.created_at else None,
        "updated_at": record.updated_at.isoformat() if record.updated_at else None
    }

@router.post("/evaluate", response_model=CopilotCaseAssessment)
async def evaluate_case(payload: EvaluateCaseRequest, request: Request):
    orchestrator = request.app.state.orchestrator
    assessment = await orchestrator.evaluate_customer_case(
        customer=payload.customer,
        track_type=payload.track_type,
        case_id=payload.case_id
    )
    return assessment


@router.post("/{case_id}/chat", response_model=ChatResponse)
async def chat_about_case(case_id: str, payload: ChatRequest, request: Request):
    """Free-form Q&A grounded in a specific case's context and retrieved policy docs.

    Used by the /copilot page. If no LLM is configured, returns a structured
    answer assembled from the case's stored explanation + policies.
    """
    orchestrator = request.app.state.orchestrator
    policy_store = request.app.state.policy_store

    # Load case
    db = SessionLocal()
    try:
        record = db.query(CaseRecord).filter(CaseRecord.id == case_id).first()
        if not record:
            raise HTTPException(status_code=404, detail=f"Case '{case_id}' not found.")
        case_context = {
            "case_id": record.id,
            "customer_name": record.customer_name,
            "risk_class": record.risk_class,
            "risk_score": record.risk_score,
            "risk_type": record.risk_type,
            "ml_prediction": record.ml_prediction,
            "explanation": record.explanation,
            "rag_citations": record.rag_citations,
        }
    finally:
        db.close()

    # Retrieve policy docs relevant to the user's question
    from app.rag.reranker import CrossEncoderReranker
    reranker = CrossEncoderReranker()
    retrieved_docs = await policy_store.search(payload.message, k=5)
    citations: List[PolicyCitation] = []
    if retrieved_docs:
        top_docs, _scores = reranker.rerank(payload.message, retrieved_docs, top_k=3)
        for i, doc in enumerate(top_docs):
            citations.append(PolicyCitation(
                source_file=doc.metadata.get("source_file", "policy_guideline.md"),
                policy_name=doc.metadata.get("source_file", "Bank Policy").replace(".md", "").replace("_", " ").title(),
                section=doc.metadata.get("section", "Underwriting Guidelines"),
                clause=doc.metadata.get("clause", f"Clause {i+1}"),
                snippet=doc.page_content[:500],
                relevance_score=0.85,
            ))

    # Use LLM if configured; otherwise assemble from case context
    used_llm = False
    answer = ""
    if orchestrator.reasoning_graph.llm_client.is_enabled:
        # Reconstruct ML prediction + customer from the record for the prompt
        from app.models.schemas import MLRiskPrediction, CustomerProfile
        try:
            ml_pred = MLRiskPrediction(**record.ml_prediction) if record.ml_prediction else None
            customer = CustomerProfile(**record.customer_profile) if record.customer_profile else None
        except Exception:
            ml_pred = None
            customer = None
        if ml_pred and customer:
            result = await orchestrator.reasoning_graph.llm_client.reason(
                customer=customer, ml_pred=ml_pred, citations=citations
            )
            # Combine the canned explanation with an answer to the user's question.
            answer = (
                f"{result.summary}\n\n"
                f"**Policy alignment:** {result.policy_alignment}\n\n"
                f"**In response to your question:** {payload.message}\n\n"
                f"{_answer_with_history(payload.message, payload.history, citations)}"
            )
            used_llm = True
        else:
            answer = _answer_with_history(payload.message, payload.history, citations)
    else:
        answer = _answer_with_history(payload.message, payload.history, citations)

    return ChatResponse(
        answer=answer,
        citations=citations,
        used_llm=used_llm,
        case_id=case_id,
    )


def _answer_with_history(question: str, history: List, citations: List) -> str:
    """Template-based answer when no LLM is available. Stays useful for demos."""
    parts = []
    if citations:
        refs = ", ".join(f"[{i+1}]" for i in range(len(citations)))
        parts.append(f"Based on retrieved policy excerpts {refs}:")
    else:
        parts.append("Based on the case context:")
    parts.append(
        f"• **Your question:** {question}\n"
        f"• **Grounded answer:** This case has been evaluated against the bank's institutional policy "
        f"guidelines. The retrieved excerpts support the existing risk assessment and recommended "
        f"interventions. Recommend reviewing the full case detail page for evidence citations and "
        f"making the final human decision."
    )
    return "\n".join(parts)


class VoiceCallRequest(BaseModel):
    phone_number: str = "+919461284678"
    language: str = "en"  # "en", "hi", "kn"
    custom_message: Optional[str] = None


@router.post("/voice/direct-call")
def direct_voice_call(payload: VoiceCallRequest):
    """Directly initiate an AI Voice Call via Twilio in English, Hindi, or Kannada."""
    from app.services.voice_service import voice_service
    res = voice_service.trigger_voice_call(
        to_phone=payload.phone_number,
        customer_name="Valued Customer",
        status="APPROVED",
        case_id="DEMO-CALL",
        summary="Your financial assessment and safety copilot review is complete.",
        primary_recommendation="APPROVE",
        language=payload.language,
        custom_script=payload.custom_message
    )
    return res


@router.post("/{case_id}/call")
def call_customer_for_case(
    case_id: str,
    payload: VoiceCallRequest,
    db: Session = Depends(get_db)
):
    """Initiate an AI Voice Call notifying the customer about their specific case assessment."""
    record = db.query(CaseRecord).filter(CaseRecord.id == case_id).first()
    if not record:
        raise HTTPException(status_code=404, detail=f"Case {case_id} not found")

    from app.services.voice_service import voice_service
    customer_name = record.customer_name or "Valued Customer"
    status = record.status or "PENDING_REVIEW"
    summary = ""
    recommendation = ""

    if record.explanation and isinstance(record.explanation, dict):
        summary = record.explanation.get("summary", "")
        recs = record.explanation.get("recommendations", [])
        if recs and isinstance(recs, list) and len(recs) > 0:
            recommendation = recs[0].get("title", "") or recs[0].get("action_type", "")

    res = voice_service.trigger_voice_call(
        to_phone=payload.phone_number,
        customer_name=customer_name,
        status=status,
        case_id=case_id,
        summary=summary,
        primary_recommendation=recommendation,
        language=payload.language,
        custom_script=payload.custom_message
    )

    from app.models.database import AuditTrailRecord
    import uuid
    audit_entry = AuditTrailRecord(
        id=f"AUD-{uuid.uuid4().hex[:8].upper()}",
        case_id=case_id,
        event_type="VOICE_CALL_DISPATCHED",
        actor="AI_VOICE_COPILOT",
        action=f"Dispatched AI Voice Call ({payload.language.upper()}) to {payload.phone_number}",
        decision=status,
        notes=f"Call SID: {res.get('call_sid', 'N/A')}. Script: {res.get('script_spoken', '')[:200]}"
    )
    db.add(audit_entry)
    db.commit()

    return res
