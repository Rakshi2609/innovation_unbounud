import httpx
import logging
from typing import Optional, Dict, Any, List
from app.models.schemas import CustomerProfile, MLRiskPrediction, RiskFactor
from app.ml.mock_engine import MockFinancialMLEngine
from app.core.config import settings

logger = logging.getLogger(__name__)

class MLResponseAdapter:
    """
    Adapter normalizing raw responses from external statistical ML prediction services
    into standardized MLRiskPrediction contracts.
    """
    @classmethod
    def adapt(cls, data: Dict[str, Any], customer: CustomerProfile) -> MLRiskPrediction:
        # Handle variations in risk score naming (risk_score, probability, default_prob)
        raw_score = data.get("risk_score") or data.get("probability_of_default") or data.get("probability", 0.5)
        risk_score = float(raw_score)

        # Handle risk class normalization
        risk_class = data.get("risk_class")
        if not risk_class:
            if risk_score >= 0.80:
                risk_class = "CRITICAL"
            elif risk_score >= 0.60:
                risk_class = "HIGH"
            elif risk_score >= 0.35:
                risk_class = "MEDIUM"
            else:
                risk_class = "LOW"

        # Handle top factors / feature importances
        raw_factors = data.get("top_factors", [])
        factors: List[RiskFactor] = []
        if isinstance(raw_factors, list):
            for rf in raw_factors:
                if isinstance(rf, dict):
                    factors.append(RiskFactor(
                        factor=rf.get("factor", "feature_importance"),
                        weight=float(rf.get("weight", 0.1)),
                        description=rf.get("description", "Statistical model contributing factor")
                    ))
        elif isinstance(raw_factors, dict):
            for k, v in raw_factors.items():
                factors.append(RiskFactor(
                    factor=k,
                    weight=float(v),
                    description=f"Model factor weight: {v}"
                ))

        return MLRiskPrediction(
            prediction_id=data.get("prediction_id", f"PRED-{customer.customer_id}"),
            customer_id=customer.customer_id,
            risk_score=round(risk_score, 3),
            risk_class=risk_class,
            confidence=float(data.get("confidence", 0.88)),
            risk_type=data.get("risk_type", "credit_distress"),
            top_factors=factors,
            model_version=data.get("model_version", "v1.0.0-remote-xgboost"),
            model_source="ONLINE_ML_SERVICE",
            is_fallback=False,
            is_safety_validated=True,
            autonomous_action_allowed=False,
            evaluation_metrics=data.get("evaluation_metrics", {})
        )


class MLRiskClient:
    """
    Client connecting to Statistical ML prediction service via MLResponseAdapter with automated fallback.
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
                    return MLResponseAdapter.adapt(data, customer)
                else:
                    logger.warning(f"Remote ML service returned HTTP {resp.status_code}, activating fallback engine.")
        except Exception as e:
            logger.info(f"Remote ML service unreachable at {self.service_url} ({e}), activating local fallback engine.")

        # Fallback to local deterministic ML engine and clearly mark as fallback
        fallback_pred = MockFinancialMLEngine.predict(customer)
        return fallback_pred
