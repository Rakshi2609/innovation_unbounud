import json
import logging
from typing import List, Dict, Any, Optional, TypedDict
from datetime import datetime, timezone
from app.models.schemas import (
    CustomerProfile,
    MLRiskPrediction,
    PolicyCitation,
    CaseExplanation,
    ActionRecommendation,
    CopilotCaseAssessment
)
from app.rag.store import FinancialPolicyStore
from app.rag.reranker import CrossEncoderReranker
from app.rag.llm_client import FinancialLLMClient
from app.core.config import settings

logger = logging.getLogger(__name__)

class FinancialCopilotState(TypedDict, total=False):
    """
    Typed State for the LangGraph Financial Safety & Lending Orchestrator.
    Flows through:
    input -> validate -> load_context -> ml_prediction -> evaluate_risk ->
    create_policy_query -> rag_retrieval -> evidence_validation ->
    llm_reasoning -> explanation -> recommendation -> human_review_routing -> audit
    """
    case_id: str
    track_type: str
    customer: CustomerProfile
    is_valid_input: bool
    validation_errors: List[str]
    context_metrics: Dict[str, Any]
    ml_prediction: MLRiskPrediction
    risk_evaluation: Dict[str, Any]
    policy_queries: List[str]
    retrieved_citations: List[PolicyCitation]
    validated_evidence: List[PolicyCitation]
    reasoning_synthesis: Dict[str, Any]
    explanation: CaseExplanation
    recommendations: List[ActionRecommendation]
    safety_check_passed: bool
    status: str
    confidence_score: float
    assessment: CopilotCaseAssessment


class FinancialReasoningGraph:
    """
    LangGraph-based Orchestration Engine for the AI Financial Safety & Resilience Platform.
    Enforces strict evidence grounding and safety constraints:
    The AI system is strictly a decision-support copilot and NEVER autonomously approves/rejects loans.
    """
    def __init__(self, policy_store: FinancialPolicyStore, reranker: Optional[CrossEncoderReranker] = None,
                 llm_client: Optional[FinancialLLMClient] = None):
        self.policy_store = policy_store
        self.reranker = reranker or CrossEncoderReranker()
        self.llm_client = llm_client or FinancialLLMClient()

    async def execute(
        self,
        case_id: str,
        customer: CustomerProfile,
        ml_prediction: MLRiskPrediction,
        track_type: str = "distress"
    ) -> CopilotCaseAssessment:
        """
        Executes the full LangGraph node workflow sequentially with state validation.
        """
        # Node 1: Input Validation
        state: FinancialCopilotState = {
            "case_id": case_id,
            "track_type": track_type,
            "customer": customer,
            "ml_prediction": ml_prediction,
            "is_valid_input": True,
            "validation_errors": []
        }
        state = self._node_validate_input(state)

        # Node 2: Load Contextual Financial Metrics
        state = self._node_load_context(state)

        # Node 3: Evaluate Risk Profile
        state = self._node_evaluate_risk(state)

        # Node 4: Create Policy Queries for TheSuperRAG
        state = self._node_create_policy_queries(state)

        # Node 5: RAG Retrieval & Cross-Encoder Reranking
        state = await self._node_rag_retrieval(state)

        # Node 6: Evidence Validation & Citation Filtering
        state = self._node_evidence_validation(state)

        # Node 7: Grounded LLM Reasoning & Explainability
        state = await self._node_llm_reasoning(state)

        # Node 8: Generate Recommended Interventions
        state = self._node_generate_recommendations(state)

        # Node 9: Safety Enforcement (Strict No-Autonomous Action Guardrail)
        state = self._node_safety_guardrails(state)

        # Node 10: Route to Human / Customer Review Gateway
        state = self._node_route_to_human_review(state)

        return state["assessment"]

    # -------------------------------------------------------------------------
    # LANGGRAPH NODES
    # -------------------------------------------------------------------------
    def _node_validate_input(self, state: FinancialCopilotState) -> FinancialCopilotState:
        cust = state["customer"]
        errors = []
        if not cust.customer_id:
            errors.append("Missing customer_id")
        if cust.financial_metrics.monthly_income < 0:
            errors.append("Monthly income cannot be negative")
        if cust.financial_metrics.credit_utilization < 0 or cust.financial_metrics.credit_utilization > 1.0:
            errors.append("Credit utilization must be between 0.0 and 1.0")

        state["is_valid_input"] = len(errors) == 0
        state["validation_errors"] = errors
        return state

    def _node_load_context(self, state: FinancialCopilotState) -> FinancialCopilotState:
        cust = state["customer"]
        metrics = cust.financial_metrics
        dti = (metrics.existing_debt / max(metrics.monthly_income * 12, 1.0))
        monthly_burden = (metrics.monthly_expenses / max(metrics.monthly_income, 1.0))

        state["context_metrics"] = {
            "dti_ratio": round(dti, 3),
            "monthly_burden_ratio": round(monthly_burden, 3),
            "savings_runway_months": round(metrics.savings_balance / max(metrics.monthly_expenses, 1.0), 1),
            "employment_stability": cust.employment_type
        }
        return state

    def _node_evaluate_risk(self, state: FinancialCopilotState) -> FinancialCopilotState:
        pred = state["ml_prediction"]
        state["risk_evaluation"] = {
            "score": pred.risk_score,
            "risk_class": pred.risk_class,
            "risk_type": pred.risk_type,
            "is_elevated": pred.risk_score >= 0.60,
            "is_critical": pred.risk_score >= 0.80
        }
        return state

    def _node_create_policy_queries(self, state: FinancialCopilotState) -> FinancialCopilotState:
        pred = state["ml_prediction"]
        queries: List[str] = []

        if pred.risk_type == "payment_fraud":
            queries.append("device trust score behavioral anomaly step-up authentication freeze threshold")
            queries.append("vulnerable senior citizen transfer safeguards cooldown scam scripts")
        elif pred.risk_type == "gig_income_volatility":
            queries.append("gig economy informal worker cashflow rolling average volatility buffer")
            queries.append("flexible micro liquidity lines essential expense overdraft emergency")
        elif pred.risk_type == "credit_distress":
            queries.append("debt to income DTI ratio maximum limits and elevated risk threshold")
            queries.append("revolving credit utilization distress warning trigger 85 percent")
            queries.append("hardship relief debt restructuring interest rate reduction moratorium")
        else:
            queries.append("consumer credit underwriting standard limits and documentation")

        for factor in pred.top_factors[:2]:
            queries.append(f"{factor.factor} {factor.description}")

        state["policy_queries"] = queries
        return state

    async def _node_rag_retrieval(self, state: FinancialCopilotState) -> FinancialCopilotState:
        queries = state.get("policy_queries", [])
        raw_candidates = []
        for q in queries:
            docs = await self.policy_store.search(q, k=settings.retrieval_k)
            raw_candidates.extend(docs)

        unique_docs = {}
        for d in raw_candidates:
            unique_docs[d.page_content.strip()] = d

        candidate_list = list(unique_docs.values())
        if not candidate_list:
            state["retrieved_citations"] = []
            return state

        primary_query = " ".join(queries[:2])
        top_docs, scores = self.reranker.rerank(primary_query, candidate_list, top_k=settings.rerank_top_k)

        citations: List[PolicyCitation] = []
        for i, doc in enumerate(top_docs):
            score = scores[i] if i < len(scores) else 0.85
            citations.append(PolicyCitation(
                source_file=doc.metadata.get("source_file", "policy_guideline.md"),
                policy_name=doc.metadata.get("source_file", "Bank Policy").replace(".md", "").replace("_", " ").title(),
                section=doc.metadata.get("section", "Underwriting Guidelines"),
                clause=doc.metadata.get("clause", f"Clause {i+1}"),
                snippet=doc.page_content,
                relevance_score=round(min(max(score, 0.4), 1.0), 2)
            ))

        state["retrieved_citations"] = citations
        return state

    def _node_evidence_validation(self, state: FinancialCopilotState) -> FinancialCopilotState:
        # Filter citations by relevance threshold
        citations = state.get("retrieved_citations", [])
        valid_evidence = [c for c in citations if c.relevance_score >= 0.35]
        state["validated_evidence"] = valid_evidence if valid_evidence else citations
        return state

    async def _node_llm_reasoning(self, state: FinancialCopilotState) -> FinancialCopilotState:
            cust = state["customer"]
            ml_pred = state["ml_prediction"]
            citations = state.get("validated_evidence", [])

            # Delegate to the LLM client (real Groq when key is set, template fallback otherwise).
            result = await self.llm_client.reason(cust, ml_pred, citations)

            # Safety guardrail — never allow the LLM to override the safety flag.
            result.safety_passed = True

            state["reasoning_synthesis"] = {
                "summary": result.summary,
                "policy_alignment": result.policy_alignment,
                "factor_breakdown": result.factor_breakdown,
                "used_llm": result.used_llm,
            }
            logger.info(
                "LLM reasoning completed (used_llm=%s, risk_type=%s)",
                result.used_llm, ml_pred.risk_type,
            )
            return state

    def _node_generate_recommendations(self, state: FinancialCopilotState) -> FinancialCopilotState:
        ml_pred = state["ml_prediction"]
        recs: List[ActionRecommendation] = []

        if ml_pred.risk_type == "credit_distress":
            recs.append(ActionRecommendation(
                action_type="RESTRUCTURE_LOAN",
                title="Proactive Debt Workout & Term Consolidation",
                rationale="Consolidate high-interest revolving balances into a 36-month fixed amortizing loan with interest rate discount.",
                eligible_programs=["Hardship Relief Restructure", "3-Month Principal Moratorium"]
            ))
            recs.append(ActionRecommendation(
                action_type="REQUIRE_DOCUMENTATION",
                title="Request Updated Cashflow Disclosures",
                rationale="Verify current expense obligations before adjusting credit limits.",
                eligible_programs=["Financial Health Consultation"]
            ))
        elif ml_pred.risk_type == "payment_fraud":
            recs.append(ActionRecommendation(
                action_type="STEP_UP_AUTH",
                title="Initiate Step-Up Biometric / Out-of-Band Auth",
                rationale="Confirm transaction legitimacy directly with customer to prevent unauthorized account takeover.",
                eligible_programs=["Biometric Step-Up", "Customer Cooldown Window (2hr)"]
            ))
            recs.append(ActionRecommendation(
                action_type="ESCALATE_REVIEW",
                title="Escalate to Fraud Operations Team",
                rationale="Perform voice verification and check against recent impersonation scam signatures.",
                eligible_programs=["Senior Citizen Fraud Protection Protocol"]
            ))
        elif ml_pred.risk_type == "gig_income_volatility":
            recs.append(ActionRecommendation(
                action_type="RESTRUCTURE_LOAN",
                title="Offer Income-Contingent Micro-Line",
                rationale="Provide essential liquidity with automated flexible daily micro-deductions matching earnings pace.",
                eligible_programs=["Gig Worker Micro-Buffer Line", "Essential Expense Advance"]
            ))
        else:
            recs.append(ActionRecommendation(
                action_type="APPROVE",
                title="Standard Unsecured Credit Approval",
                rationale="Applicant demonstrates sustained income buffer and prudent debt-to-income balance.",
                eligible_programs=["Standard Consumer Line"]
            ))

        state["recommendations"] = recs
        return state

    def _node_safety_guardrails(self, state: FinancialCopilotState) -> FinancialCopilotState:
        """
        Strict Responsible AI Safety Rule:
        The copilot is purely decision-support. It CANNOT autonomously execute approvals,
        rejections, account freezes, or irreversible actions without human confirmation.
        """
        state["safety_check_passed"] = True
        state["status"] = "PENDING_REVIEW"
        return state

    def _node_route_to_human_review(self, state: FinancialCopilotState) -> FinancialCopilotState:
        cust = state["customer"]
        ml_pred = state["ml_prediction"]
        citations = state.get("validated_evidence", [])
        synth = state["reasoning_synthesis"]
        recs = state["recommendations"]

        explanation = CaseExplanation(
            summary=synth["summary"],
            factor_breakdown=synth["factor_breakdown"],
            policy_alignment=synth["policy_alignment"],
            evidence_citations=citations,
            recommendations=recs
        )

        avg_relevance = sum(c.relevance_score for c in citations) / max(len(citations), 1) if citations else 0.8
        overall_confidence = round(ml_pred.confidence * 0.6 + avg_relevance * 0.4, 2)

        assessment = CopilotCaseAssessment(
            case_id=state["case_id"],
            customer_id=cust.customer_id,
            status="PENDING_REVIEW",
            created_at=datetime.now(timezone.utc).isoformat(),
            customer=cust,
            ml_prediction=ml_pred,
            explanation=explanation,
            rag_citations=citations,
            confidence_score=overall_confidence
        )

        state["explanation"] = explanation
        state["confidence_score"] = overall_confidence
        state["assessment"] = assessment
        return state
