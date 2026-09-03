from pydantic_settings import BaseSettings, SettingsConfigDict
from typing import List
import os
from pathlib import Path

# Project root = repo root (parent of backend/), so paths resolve correctly
# regardless of where uvicorn / pytest is invoked from.
_BACKEND_DIR = Path(__file__).resolve().parent.parent.parent  # backend/app/core/config.py → backend/
_REPO_ROOT = _BACKEND_DIR.parent


class Settings(BaseSettings):
    model_config = SettingsConfigDict(
        env_file=".env",
        env_file_encoding="utf-8",
        extra="ignore"
    )

    project_name: str = "AI Financial Safety & Lending Copilot"
    api_v1_prefix: str = "/api/v1"
    environment: str = "development"
    log_level: str = "INFO"

    # CORS
    cors_origins: str = "http://localhost:3000,http://localhost:3001,http://127.0.0.1:3000"

    # Storage Paths — absolute, derived from this file's location, not CWD
    data_dir: str = str(_BACKEND_DIR / "data")
    policies_dir: str = str(_BACKEND_DIR / "data" / "policies")
    db_path: str = str(_BACKEND_DIR / "data" / "financial_copilot.db")
    qdrant_collection: str = "financial_policies"

    # ML Inference Endpoint (Statistical ML Service)
    ml_service_url: str = "http://localhost:8001"
    ml_timeout_seconds: float = 5.0
    use_mock_ml_fallback: bool = True

    # LLM Settings
    groq_api_key: str = ""
    default_llm_model: str = "llama-3.1-8b-instant"
    llm_temperature: float = 0.1

    # RAG parameters
    retrieval_k: int = 5
    rerank_top_k: int = 3
    enable_reranker: bool = True

    @property
    def cors_origin_list(self) -> List[str]:
        return [orig.strip() for orig in self.cors_origins.split(",") if orig.strip()]

    @property
    def is_llm_enabled(self) -> bool:
        """True only when a Groq key is configured and non-empty."""
        return bool(self.groq_api_key and self.groq_api_key.strip())


settings = Settings()
