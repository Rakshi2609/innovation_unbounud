from contextlib import asynccontextmanager
from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware

from app.core.config import settings
from app.core.logging import setup_logging
from app.rag.store import FinancialPolicyStore
from app.services.copilot_orchestrator import CopilotOrchestrator

from app.routers.health import router as health_router
from app.routers.cases import router as cases_router
from app.routers.documents import router as documents_router
from app.routers.decisions import router as decisions_router
from app.routers.realtime import router as realtime_router

setup_logging(settings.log_level)

@asynccontextmanager
async def lifespan(app: FastAPI):
    # Initialize RAG store and Copilot orchestrator asynchronously
    policy_store = FinancialPolicyStore(collection_name=settings.qdrant_collection)
    orchestrator = CopilotOrchestrator(policy_store=policy_store)
    await orchestrator.initialize_data()

    app.state.policy_store = policy_store
    app.state.orchestrator = orchestrator

    yield

app = FastAPI(
    title=settings.project_name,
    description="AI Financial Safety & Lending Copilot — Grounded RAG & Human-in-the-Loop Decision Support Backend",
    version="1.0.0",
    lifespan=lifespan
)

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

app.include_router(health_router)
app.include_router(cases_router)
app.include_router(documents_router)
app.include_router(decisions_router)
app.include_router(realtime_router)
