from fastapi import APIRouter, HTTPException, Depends, Request
from sqlalchemy.orm import Session
from typing import List, Optional
from pydantic import BaseModel

from app.models.schemas import CustomerProfile, CopilotCaseAssessment
from app.models.database import CaseRecord, SessionLocal, get_db

router = APIRouter(prefix="/api/v1/cases", tags=["cases"])

class EvaluateCaseRequest(BaseModel):
    customer: CustomerProfile
    track_type: str = "distress"
    case_id: Optional[str] = None

@router.get("")
def list_cases(db: Session = Depends(get_db)):
    records = db.query(CaseRecord).order_by(CaseRecord.created_at.desc()).all()
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
            "citations_count": len(r.rag_citations) if r.rag_citations else 0
        })
    return {"cases": results}

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
