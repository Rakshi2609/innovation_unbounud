import httpx
import logging
from typing import Optional, Dict, Any
from app.models.schemas import CustomerProfile, MLRiskPrediction, MLPredictionRequest
from app.ml.mock_engine import MockFinancialMLEngine
from app.core.config import settings

logger = logging.getLogger(__name__)

class MLRiskClient:
    """
    Client connecting to Tanush's ML prediction service with automated fallback.
    """
    def __init__(self, service_url: Optional[str] = None, timeout: float = 5.0):
        self.service_url = service_url or settings.ml_service_url
        self.timeout = timeout

    async def predict_risk(self, customer: CustomerProfile) -> MLRiskPrediction:
        payload = {
            "customer_id": customer.customer_id,
            "features": {
                "monthly_income": customer.financial_metrics.monthly_income,
                "monthly_expenses": customer.financial_metrics.monthly_expenses,
                "existing_debt": customer.financial_metrics.existing_debt,
                "credit_utilization": customer.financial_metrics.credit_utilization,
                "recent_delinquencies": customer.financial_metrics.recent_delinquencies,
                "savings_balance": customer.financial_metrics.savings_balance,
                "income_volatility_score": customer.financial_metrics.income_volatility_score,
                "device_trust_score": customer.recent_transaction.device_trust_score if customer.recent_transaction else None,
                "transaction_amount": customer.recent_transaction.amount if customer.recent_transaction else 0.0,
            },
            "metadata": {
                "occupation": customer.occupation,
                "employment_type": customer.employment_type,
                "account_age_months": customer.account_age_months,
            }
        }

        try:
            async with httpx.AsyncClient(timeout=self.timeout) as client:
                resp = await client.post(f"{self.service_url}/predict-risk", json=payload)
                if resp.status_code == 200:
                    data = resp.json()
                    logger.info(f"Successfully received ML prediction from remote service for {customer.customer_id}")
                    return MLRiskPrediction(**data)
                else:
                    logger.warning(f"Remote ML service returned status {resp.status_code}, falling back to local ML engine.")
        except Exception as e:
            logger.info(f"Remote ML service offline or unreachable ({e}), using high-fidelity local ML engine.")

        # Fallback to local deterministic ML engine
        return MockFinancialMLEngine.predict(customer)
