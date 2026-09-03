from sqlalchemy import create_engine, Column, Integer, String, Float, Boolean, DateTime, JSON, Text
from sqlalchemy.orm import declarative_base, sessionmaker
import datetime
import os
from app.core.config import settings

os.makedirs(os.path.dirname(settings.db_path), exist_ok=True)
engine = create_engine(
    f"sqlite:///{settings.db_path}",
    connect_args={"check_same_thread": False}
)
SessionLocal = sessionmaker(autocommit=False, autoflush=False, bind=engine)
Base = declarative_base()

class CaseRecord(Base):
    __tablename__ = "financial_cases"

    id = Column(String, primary_key=True, index=True) # CASE-XXXX
    customer_id = Column(String, index=True)
    customer_name = Column(String)
    track_type = Column(String) # distress, fraud, gig_resilience, safe_payments, accessibility
    status = Column(String, default="PENDING_REVIEW") # PENDING_REVIEW, APPROVED, RESTRUCTURED, FLAGGED, DECLINED
    risk_score = Column(Float)
    risk_class = Column(String)
    risk_type = Column(String)
    ml_prediction = Column(JSON) # Full ML model prediction dump
    explanation = Column(JSON) # Copilot explanation & recommendation
    rag_citations = Column(JSON) # Policy citations
    customer_profile = Column(JSON) # Snapshot of financial inputs
    created_at = Column(DateTime, default=datetime.datetime.utcnow)
    updated_at = Column(DateTime, default=datetime.datetime.utcnow, onupdate=datetime.datetime.utcnow)

class AuditTrailRecord(Base):
    __tablename__ = "audit_trail"

    id = Column(String, primary_key=True, index=True) # AUDIT-XXXX
    case_id = Column(String, index=True)
    event_type = Column(String) # ML_EVAL, RAG_RETRIEVAL, HUMAN_DECISION, POLICY_OVERRIDE
    actor = Column(String) # system, AI_COPILOT, officer_id
    action = Column(String)
    decision = Column(String, nullable=True)
    override_ml = Column(Boolean, default=False)
    override_reason = Column(Text, nullable=True)
    notes = Column(Text, nullable=True)
    details = Column(JSON, default=dict)
    timestamp = Column(DateTime, default=datetime.datetime.utcnow)

class PolicyDocumentRecord(Base):
    __tablename__ = "policy_documents"

    id = Column(String, primary_key=True)
    filename = Column(String, unique=True, index=True)
    title = Column(String)
    category = Column(String) # lending, fraud, hardship, compliance
    chunks_count = Column(Integer, default=0)
    indexed_at = Column(DateTime, default=datetime.datetime.utcnow)

Base.metadata.create_all(bind=engine)

def get_db():
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()
