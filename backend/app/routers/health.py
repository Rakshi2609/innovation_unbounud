from fastapi import APIRouter, Request
from app.core.config import settings

router = APIRouter(tags=["health"])

@router.get("/health/live")
async def liveness():
    return {
        "status": "alive",
        "service": settings.project_name,
        "environment": settings.environment
    }

@router.get("/health/status")
async def system_status(request: Request):
    orchestrator = request.app.state.orchestrator
    return {
        "status": "healthy",
        "service": settings.project_name,
        "policy_documents_indexed": len(orchestrator.policy_store.get_indexed_files()),
        "ml_service_configured_url": settings.ml_service_url,
        "ml_fallback_enabled": settings.use_mock_ml_fallback,
        "reranker_active": settings.enable_reranker
    }
