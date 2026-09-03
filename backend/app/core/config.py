from pydantic_settings import BaseSettings, SettingsConfigDict
from typing import List
import os

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

    # Storage Paths
    data_dir: str = os.path.abspath("backend/data")
    policies_dir: str = os.path.abspath("backend/data/policies")
    db_path: str = os.path.abspath("backend/data/financial_copilot.db")
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

settings = Settings()
