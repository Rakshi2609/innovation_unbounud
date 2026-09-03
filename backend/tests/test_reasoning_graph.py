import pytest
from app.models.schemas import CustomerProfile, FinancialMetrics, TransactionMetadata
from app.ml.client import MLRiskClient
from app.rag.store import FinancialPolicyStore
from app.rag.graph import FinancialReasoningGraph
from app.core.config import settings

@pytest.mark.asyncio
async def test_financial_reasoning_graph_end_to_end():
    store = FinancialPolicyStore(collection_name="test_reasoning_policies")
    store.index_directory(settings.policies_dir)

    graph = FinancialReasoningGraph(policy_store=store)
    ml_client = MLRiskClient()

    customer = CustomerProfile(
        customer_id="CUST-88120",
        name="Aarav Patel",
        financial_metrics=FinancialMetrics(
            monthly_income=65000.0,
            monthly_expenses=58000.0,
            existing_debt=285000.0,
            credit_utilization=0.89,
            recent_delinquencies=2,
            savings_balance=12000.0
        )
    )

    prediction = await ml_client.predict_risk(customer)
    assessment = await graph.execute(case_id="CASE-TEST-001", customer=customer, ml_prediction=prediction)

    assert assessment.case_id == "CASE-TEST-001"
    assert assessment.ml_prediction.risk_class in ["HIGH", "CRITICAL"]
    assert len(assessment.rag_citations) > 0
    assert len(assessment.explanation.recommendations) > 0
    assert assessment.explanation.summary != ""
