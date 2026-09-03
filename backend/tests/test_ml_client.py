import pytest
from app.models.schemas import CustomerProfile, FinancialMetrics, TransactionMetadata
from app.ml.mock_engine import MockFinancialMLEngine
from app.ml.client import MLRiskClient

@pytest.mark.asyncio
async def test_ml_client_distress_prediction():
    customer = CustomerProfile(
        customer_id="TEST-001",
        name="Test User",
        financial_metrics=FinancialMetrics(
            monthly_income=50000.0,
            monthly_expenses=46000.0,
            existing_debt=220000.0,
            credit_utilization=0.92,
            recent_delinquencies=2,
            savings_balance=5000.0
        )
    )
    client = MLRiskClient()
    pred = await client.predict_risk(customer)

    assert pred.risk_class in ["HIGH", "CRITICAL"]
    assert pred.risk_score > 0.60
    assert pred.risk_type == "credit_distress"
    assert len(pred.top_factors) > 0

@pytest.mark.asyncio
async def test_ml_client_fraud_anomaly_prediction():
    customer = CustomerProfile(
        customer_id="TEST-002",
        name="Senior Citizen User",
        financial_metrics=FinancialMetrics(
            monthly_income=30000.0,
            monthly_expenses=12000.0,
            existing_debt=0.0,
            credit_utilization=0.05,
            recent_delinquencies=0,
            savings_balance=250000.0
        ),
        recent_transaction=TransactionMetadata(
            amount=150000.0,
            device_trust_score=0.10,
            is_international=True
        )
    )
    client = MLRiskClient()
    pred = await client.predict_risk(customer)

    assert pred.risk_class in ["HIGH", "CRITICAL"]
    assert pred.risk_type == "payment_fraud"
    assert any("device_trust" in f.factor for f in pred.top_factors)
