from fastapi import APIRouter, HTTPException, Depends, Request
from sqlalchemy.orm import Session
from app.models.schemas import OfficerDecisionRequest, OfficerDecisionResponse
from app.models.database import AuditTrailRecord, get_db

router = APIRouter(prefix="/api/v1/cases", tags=["decisions"])

@router.post("/{case_id}/decision", response_model=OfficerDecisionResponse)
async def record_human_decision(
    case_id: str,
    payload: OfficerDecisionRequest,
    request: Request
):
    orchestrator = request.app.state.orchestrator
    try:
        response = await orchestrator.process_officer_decision(case_id, payload)
        return response
    except ValueError as e:
        raise HTTPException(status_code=404, detail=str(e))
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Failed recording decision: {e}")

@router.get("/{case_id}/audit")
def get_case_audit_trail(case_id: str, db: Session = Depends(get_db)):
    records = db.query(AuditTrailRecord).filter(AuditTrailRecord.case_id == case_id).order_by(AuditTrailRecord.timestamp.asc()).all()
    return {
        "case_id": case_id,
        "audit_trail": [
            {
                "id": r.id,
                "event_type": r.event_type,
                "actor": r.actor,
                "action": r.action,
                "decision": r.decision,
                "override_ml": r.override_ml,
                "override_reason": r.override_reason,
                "notes": r.notes,
                "details": r.details,
                "timestamp": r.timestamp.isoformat() if r.timestamp else None
            }
            for r in records
        ]
    }
