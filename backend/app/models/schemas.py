from pydantic import BaseModel, Field, model_validator
from typing import List, Dict, Optional, Any, Literal
from datetime import datetime

# ---------------------------------------------------------------------------
# 1. Customer & Financial Input Schemas
# ---------------------------------------------------------------------------
class FinancialMetrics(BaseModel):
    monthly_income: float = Field(..., description="Verified or reported monthly income")
    monthly_expenses: float = Field(..., description="Average monthly recurring expenses")
    existing_debt: float = Field(..., description="Total outstanding debt balance")
    credit_utilization: float = Field(..., ge=0.0, le=1.0, description="Revolving credit utilization ratio")
    recent_delinquencies: int = Field(0, description="Count of missed payments in last 12 months")
    savings_balance: float = Field(0.0, description="Liquid emergency savings reserve")
    income_volatility_score: Optional[float] = Field(None, ge=0.0, le=1.0, description="Variance in monthly earnings")

class TransactionMetadata(BaseModel):
    transaction_id: Optional[str] = None
    amount: float = 0.0
    merchant_category: Optional[str] = None
    channel: str = "web_portal" # mobile_app, atm, pos, web_portal
    device_trust_score: Optional[float] = 1.0 # 0.0 to 1.0
    location: Optional[str] = "Domestic"
    is_international: bool = False

class CustomerProfile(BaseModel):
    customer_id: str
    name: str = "Valued Customer"
    occupation: str = "Salaried Professional"
    employment_type: str = "Full-Time"
    credit_score: Optional[int] = None
    account_age_months: int = 12
    financial_metrics: FinancialMetrics
    recent_transaction: Optional[TransactionMetadata] = None

    @model_validator(mode='before')
    @classmethod
    def reconcile_name(cls, data: Any) -> Any:
        if isinstance(data, dict):
            if "customer_name" in data and "name" not in data:
                data["name"] = data["customer_name"]
            elif "name" in data and "customer_name" not in data:
                data["customer_name"] = data["name"]
        return data

# ---------------------------------------------------------------------------
# 2. ML Prediction Contract (Tanush's Interface)
# ---------------------------------------------------------------------------
class RiskFactor(BaseModel):
    factor: str
    weight: float
    description: str

class MLRiskPrediction(BaseModel):
    prediction_id: str
    customer_id: str
    risk_score: float = Field(..., ge=0.0, le=1.0, description="Normalized risk score from 0 (safe) to 1 (critical)")
    risk_class: Literal["LOW", "MEDIUM", "HIGH", "CRITICAL"]
    confidence: float = Field(..., ge=0.0, le=1.0, description="Model certainty")
    risk_type: str = "credit_distress"
    top_factors: List[RiskFactor] = Field(default_factory=list)
    model_version: str = "v1.0.0-xgb"
    evaluation_metrics: Optional[Dict[str, float]] = None

class MLPredictionRequest(BaseModel):
    customer_id: str
    features: Dict[str, Any]
    metadata: Optional[Dict[str, Any]] = None

# ---------------------------------------------------------------------------
# 3. Policy & RAG Citation Schemas
# ---------------------------------------------------------------------------
class PolicyCitation(BaseModel):
    source_file: str
    policy_name: str
    section: str
    clause: str
    snippet: str
    relevance_score: float

class RAGContextResult(BaseModel):
    query_used: str
    citations: List[PolicyCitation] = Field(default_factory=list)
    retrieval_confidence: float = 1.0

# ---------------------------------------------------------------------------
# 4. Copilot Grounded Reasoning & Explainability Output
# ---------------------------------------------------------------------------
class ActionRecommendation(BaseModel):
    action_type: Literal["APPROVE", "REQUIRE_DOCUMENTATION", "RESTRUCTURE_LOAN", "STEP_UP_AUTH", "ESCALATE_REVIEW", "DECLINE"]
    title: str
    rationale: str
    eligible_programs: List[str] = Field(default_factory=list)

class CaseExplanation(BaseModel):
    summary: str
    factor_breakdown: List[str]
    policy_alignment: str
    evidence_citations: List[PolicyCitation]
    recommendations: List[ActionRecommendation]

class CopilotCaseAssessment(BaseModel):
    case_id: str
    customer_id: str
    status: Literal["PENDING_REVIEW", "APPROVED", "RESTRUCTURED", "FLAGGED", "DECLINED"] = "PENDING_REVIEW"
    created_at: str
    customer: CustomerProfile
    ml_prediction: MLRiskPrediction
    explanation: CaseExplanation
    rag_citations: List[PolicyCitation]
    confidence_score: float

# ---------------------------------------------------------------------------
# 5. Human-in-the-Loop Decision Schemas
# ---------------------------------------------------------------------------
class OfficerDecisionRequest(BaseModel):
    officer_id: str
    officer_name: str
    decision: Literal["APPROVE", "REQUEST_INFO", "RESTRUCTURE", "FLAG_FRAUD", "DECLINE"]
    action_taken: str
    notes: Optional[str] = None
    override_ml: bool = False
    override_reason: Optional[str] = None

class OfficerDecisionResponse(BaseModel):
    case_id: str
    status: str
    officer_id: str
    decided_at: str
    audit_id: str
    notes: Optional[str] = None

# ---------------------------------------------------------------------------
# 6. Realtime Event Envelope
# ---------------------------------------------------------------------------
class EventEnvelope(BaseModel):
    version: int = 1
    event_id: str
    sequence: int = 0
    occurred_at: str
    case_id: str
    event_type: str
    payload: Dict[str, Any]
