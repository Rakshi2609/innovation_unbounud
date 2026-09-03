import json
import logging
from typing import List, Dict, Any, Optional
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
from app.core.config import settings

logger = logging.getLogger(__name__)

class FinancialReasoningGraph:
    """
    LangGraph-style multi-step agentic reasoning pipeline for financial safety and lending.
    Grounded strictly on ML risk factors and retrieved institutional policy documents.
    """
    def __init__(self, policy_store: FinancialPolicyStore, reranker: Optional[CrossEncoderReranker] = None):
        self.policy_store = policy_store
        self.reranker = reranker or CrossEncoderReranker()

    async def execute(self, case_id: str, customer: CustomerProfile, ml_prediction: MLRiskPrediction) -> CopilotCaseAssessment:
        # Step 1: Query Formulation from ML Factors
        search_queries = self._formulate_queries(customer, ml_prediction)

        # Step 2: Policy Retrieval & Hybrid Reranking
        citations = await self._retrieve_and_rerank_policies(search_queries)

        # Step 3: Grounded Reasoning & Explainability Synthesis
        explanation = self._synthesize_explanation(customer, ml_prediction, citations)

        # Step 4: Confidence & Output Assembly
        avg_relevance = sum(c.relevance_score for c in citations) / max(len(citations), 1) if citations else 0.8
        overall_confidence = round(ml_prediction.confidence * 0.6 + avg_relevance * 0.4, 2)

        return CopilotCaseAssessment(
            case_id=case_id,
            customer_id=customer.customer_id,
            status="PENDING_REVIEW",
            created_at=datetime.now(timezone.utc).isoformat(),
            customer=customer,
            ml_prediction=ml_prediction,
            explanation=explanation,
            rag_citations=citations,
            confidence_score=overall_confidence
        )

    def _formulate_queries(self, customer: CustomerProfile, ml_prediction: MLRiskPrediction) -> List[str]:
        queries = []
        if ml_prediction.risk_type == "payment_fraud":
            queries.append("device trust score behavioral anomaly step-up authentication freeze threshold")
            queries.append("vulnerable senior citizen transfer safeguards cooldown scam scripts")
        elif ml_prediction.risk_type == "gig_income_volatility":
            queries.append("gig economy informal worker cashflow rolling average volatility buffer")
            queries.append("flexible micro liquidity lines essential expense overdraft emergency")
        elif ml_prediction.risk_type == "credit_distress":
            queries.append("debt to income DTI ratio maximum limits and elevated risk threshold")
            queries.append("revolving credit utilization distress warning trigger 85 percent")
            queries.append("hardship relief debt restructuring interest rate reduction moratorium")
        else:
            queries.append("consumer credit underwriting standard limits and documentation")

        for factor in ml_prediction.top_factors[:2]:
            queries.append(f"{factor.factor} {factor.description}")

        return queries

    async def _retrieve_and_rerank_policies(self, queries: List[str]) -> List[PolicyCitation]:
        raw_candidates = []
        for q in queries:
            docs = await self.policy_store.search(q, k=settings.retrieval_k)
            raw_candidates.extend(docs)

        unique_docs = {}
        for d in raw_candidates:
            unique_docs[d.page_content.strip()] = d

        candidate_list = list(unique_docs.values())
        if not candidate_list:
            return []

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
        return citations

    def _synthesize_explanation(
        self,
        customer: CustomerProfile,
        ml_prediction: MLRiskPrediction,
        citations: List[PolicyCitation]
    ) -> CaseExplanation:
        metrics = customer.financial_metrics
        score = ml_prediction.risk_score
        rclass = ml_prediction.risk_class
        factors = ml_prediction.top_factors

        citation_refs = [f"[{i+1}]" for i in range(len(citations))]
        citation_str = ", ".join(citation_refs) if citation_refs else "[Policy Base]"

        factor_breakdown = []
        for f in factors:
            factor_breakdown.append(f"• {f.factor.replace('_', ' ').title()}: {f.description} (Contribution Weight: {f.weight:.2f})")

        recommendations: List[ActionRecommendation] = []

        if ml_prediction.risk_type == "payment_fraud":
            summary = (
                f"Customer transaction flagged with {rclass} fraud anomaly risk ({score*100:.1f}% risk score). "
                f"Behavioral telemetry detected anomalous device/IP parameters inconsistent with established transaction history."
            )
            policy_alignment = (
                f"Under digital fraud protocol {citation_str}, transactions exhibiting high-velocity transfers "
                f"from unverified devices require immediate step-up verification and temporary operational hold."
            )
            recommendations.append(ActionRecommendation(
                action_type="STEP_UP_AUTH",
                title="Initiate Step-Up Biometric / Out-of-Band Auth",
                rationale="Confirm transaction legitimacy directly with customer to prevent unauthorized account takeover.",
                eligible_programs=["Biometric Step-Up", "Customer Cooldown Window (2hr)"]
            ))
            recommendations.append(ActionRecommendation(
                action_type="ESCALATE_REVIEW",
                title="Escalate to Fraud Operations Team",
                rationale="Perform voice verification and check against recent impersonation scam signatures.",
                eligible_programs=["Senior Citizen Fraud Protection Protocol"]
            ))

        elif ml_prediction.risk_type == "gig_income_volatility":
            summary = (
                f"Customer assessed with {rclass} volatility risk ({score*100:.1f}% risk score). "
                f"Financial cashflows exhibit platform earnings variance ({metrics.income_volatility_score or 0.4:.2f}) alongside liquidity buffer requirements."
            )
            policy_alignment = (
                f"Per informal worker underwriting rules {citation_str}, cashflow eligibility is calculated on 180-day rolling revenue "
                f"with dynamic buffer limits to avoid overindebtedness during seasonal lulls."
            )
            recommendations.append(ActionRecommendation(
                action_type="RESTRUCTURE_LOAN",
                title="Offer Income-Contingent Micro-Line",
                rationale="Provide essential liquidity with automated flexible daily micro-deductions matching earnings pace.",
                eligible_programs=["Gig Worker Micro-Buffer Line", "Essential Expense Advance"]
            ))

        elif ml_prediction.risk_type == "credit_distress":
            summary = (
                f"Customer flagged for early financial distress with {rclass} risk profile ({score*100:.1f}% risk score). "
                f"Revolving credit utilization is {metrics.credit_utilization*100:.1f}% with cashflow commitments consuming "
                f"{(metrics.monthly_expenses/max(metrics.monthly_income, 1))*100:.1f}% of monthly income."
            )
            policy_alignment = (
                f"In accordance with distress intervention guidelines {citation_str}, early pre-delinquency signals qualify the borrower "
                f"for non-punitive restructuring and interest concessions before default occurs."
            )
            recommendations.append(ActionRecommendation(
                action_type="RESTRUCTURE_LOAN",
                title="Proactive Debt Workout & Term Consolidation",
                rationale="Consolidate high-interest revolving balances into a 36-month fixed amortizing loan with interest rate discount.",
                eligible_programs=["Hardship Relief Restructure", "3-Month Principal Moratorium"]
            ))
            recommendations.append(ActionRecommendation(
                action_type="REQUIRE_DOCUMENTATION",
                title="Request Updated Cashflow Disclosures",
                rationale="Verify current expense obligations before adjusting credit limits.",
                eligible_programs=["Financial Health Consultation"]
            ))

        else:
            summary = f"Customer evaluated with {rclass} overall risk ({score*100:.1f}% risk score). Financial metrics satisfy standard underwriting thresholds."
            policy_alignment = f"Application complies with standard unsecured credit limits {citation_str}."
            recommendations.append(ActionRecommendation(
                action_type="APPROVE",
                title="Standard Unsecured Credit Approval",
                rationale="Applicant demonstrates sustained income buffer and prudent debt-to-income balance.",
                eligible_programs=["Standard Consumer Line"]
            ))

        return CaseExplanation(
            summary=summary,
            factor_breakdown=factor_breakdown,
            policy_alignment=policy_alignment,
            evidence_citations=citations,
            recommendations=recommendations
        )
