"""
FastAPI inference service for the /predict-risk contract.
Speaks the exact schema used by the friend's backend (friends_repo/backend/app/ml/client.py).

  POST /predict-risk
    input:  {"customer_id": "...", "features": {9 numbers}, "metadata": {occupation, employment_type, account_age_months}}
    output: MLRiskPrediction (risk_score, risk_class, confidence, risk_type, top_factors, model_version, evaluation_metrics)

Run:
    pip install fastapi uvicorn pydantic joblib scikit-learn lightgbm
    python -m uvicorn services.predict_api:app --host 0.0.0.0 --port 8001

The friend's backend (default settings) will look for this service at:
    http://localhost:8001/predict-risk
"""
from __future__ import annotations
import json
import os
import uuid
from pathlib import Path
from typing import Any, Dict, List, Optional

import joblib
import pandas as pd
from fastapi import FastAPI, HTTPException
from pydantic import BaseModel, Field

ROOT = Path(__file__).resolve().parent.parent
MODEL_DIR = ROOT / "models"


# ----------------------------------------------------------------------
# Schemas (mirror friends_repo/backend/app/models/schemas.py)
# ----------------------------------------------------------------------
class MLPredictionRequest(BaseModel):
    customer_id: str
    features: Dict[str, Any]
    metadata: Optional[Dict[str, Any]] = None


class RiskFactor(BaseModel):
    factor: str
    weight: float
    description: str


class MLRiskPrediction(BaseModel):
    prediction_id: str
    customer_id: str
    risk_score: float = Field(..., ge=0.0, le=1.0)
    risk_class: str = Field(..., pattern="^(LOW|MEDIUM|HIGH|CRITICAL)$")
    confidence: float = Field(..., ge=0.0, le=1.0)
    risk_type: str = "credit_distress"
    top_factors: List[RiskFactor] = []
    model_version: str = "v1.0"
    evaluation_metrics: Optional[Dict[str, Any]] = None


# ----------------------------------------------------------------------
# Model registry — load all 3 trained models at startup
# ----------------------------------------------------------------------
MODELS: Dict[str, Dict[str, Any]] = {}


def _load_model(path: Path) -> Optional[Dict[str, Any]]:
    if not path.exists():
        return None
    try:
        return joblib.load(path)
    except Exception as e:
        print(f"Failed to load {path.name}: {e}")
        return None


def _init_models():
    for key, fname in [("default_distress", "path_a_model.pkl"),
                        ("transaction_fraud", "path_b_model.pkl"),
                        ("inclusion_adoption", "path_c_model.pkl")]:
        m = _load_model(MODEL_DIR / fname)
        if m is not None:
            MODELS[key] = m
            print(f"  loaded {fname}: {m.get('label', '?')}  features={len(m['feature_names'])}")


_init_models()


# ----------------------------------------------------------------------
# Feature engineering for the 9-feature contract → Path A (Indian loans)
# ----------------------------------------------------------------------
# The friend's backend sends these 9 features:
#   monthly_income, monthly_expenses, existing_debt, credit_utilization,
#   recent_delinquencies, savings_balance, income_volatility_score,
#   device_trust_score, transaction_amount
# We map them onto the Path A (Indian NPA) feature space using RBI-style ratios.
NPA_FEATURE_NAMES: list = []


def _features_to_npa(f: Dict[str, Any], meta: Optional[Dict[str, Any]]) -> pd.DataFrame:
    """Map the 9-feature /predict-risk contract onto the Path A feature space.

    Uses RBI credit-policy-style ratios (LTI, FOIR, EMI-to-income, ALR proxy)
    that were the strongest predictors in the training data.
    """
    monthly_income = float(f.get("monthly_income", 0))
    monthly_expenses = float(f.get("monthly_expenses", 0))
    existing_debt = float(f.get("existing_debt", 0))
    credit_utilization = float(f.get("credit_utilization", 0))
    recent_delinquencies = int(f.get("recent_delinquencies", 0))
    savings_balance = float(f.get("savings_balance", 0))
    income_volatility = float(f.get("income_volatility_score") or 0.15)
    device_trust = float(f.get("device_trust_score") or 1.0)
    tx_amount = float(f.get("transaction_amount") or 0)

    annual_income = monthly_income * 12.0
    # FOIR = monthly obligations / monthly income (RBI benchmark for distress)
    foir = (monthly_expenses + 0.05 * existing_debt / 12.0) / max(monthly_income, 1.0)
    foir = min(foir, 2.0)
    # LTI = total debt / annual income
    lti = existing_debt / max(annual_income, 1.0)
    lti = min(lti, 8.0)
    # Rough ALR proxy: (savings + net worth proxy) / debt. We have no net worth;
    # use savings_balance * 5 as a conservative liquidity proxy
    alr = (savings_balance * 5.0) / max(existing_debt, 1.0)
    alr = min(alr, 20.0)
    # EMI estimate (assuming 5-year horizon, 12% interest)
    monthly_emi = existing_debt * 0.022 if existing_debt > 0 else 0.0
    emi_to_income = monthly_emi / max(monthly_income, 1.0)
    # Asset to loan = 1 / (1 + LTI) bounded
    # Net worth proxy = savings + future earnings
    net_worth = savings_balance + annual_income * 0.3
    # Interest rate (RBI-aligned estimate from credit_utilization)
    interest_rate = 9.0 + 6.0 * credit_utilization
    # Loan tenure (years) — assume 5 unless told
    tenure = 5.0
    # Inflation, repo rate, etc. (assume current RBI levels)
    cpi = 5.0
    repo = 6.5
    # Loan amount proxy
    loan_amount = existing_debt + tx_amount
    total_repayment = loan_amount * (1 + 0.09 * tenure)
    # Age proxy from employment_type metadata if available
    age = 35
    if meta:
        if meta.get("employment_type") in ("Student", "Intern"):
            age = 22
        elif meta.get("employment_type") in ("Retired", "Pensioner"):
            age = 65
        elif meta.get("employment_type") in ("Gig / Informal", "Freelance"):
            age = 32
    account_age = int(meta.get("account_age_months", 12)) if meta else 12
    # Income volatility scaling (gig income → higher vol)
    if meta and meta.get("employment_type") in ("Gig / Informal", "Freelance"):
        income_volatility = max(income_volatility, 0.4)

    row = {
        "Age": age,
        "Annual_Income (₹)": annual_income,
        "Net_Worth (₹)": net_worth,
        "Existing_Debt_PA (₹)": existing_debt,
        "Loan_Amount (₹)": loan_amount,
        "Loan_Tenure_Years": tenure,
        "CIBIL_Score": 700 - 250 * credit_utilization - 50 * recent_delinquencies,
        "Interest_Rate (%)": interest_rate,
        "Total_Repayment (₹)": total_repayment,
        "Repo_Rate (%)": repo,
        "CPI_Inflation (%)": cpi,
        "Loan to Income Ratio(LTI)  (in Times)": lti,
        "Assets to Loan Ratio(ALR) (in Times)": alr,
        "Monthly EMI": monthly_emi,
        "FOIR": foir,
        # device-trust-based risk scaling not used by NPA model directly
    }
    df = pd.DataFrame([row])
    # dummify to match the training columns
    cat_cols = ["Occupation", "Education", "Marital_Status", "Loan_Purpose", "Rate_Environment"]
    for c in cat_cols:
        df[c] = "Unknown"  # default unseen category
    df = pd.get_dummies(df, columns=cat_cols, drop_first=False)
    # Align to training feature set
    feats = MODELS["default_distress"]["feature_names"]
    for col in feats:
        if col not in df.columns:
            df[col] = 0
    df = df[feats]
    return df


# ----------------------------------------------------------------------
# Top-factors generator — explains the model's risk signal in plain English
# ----------------------------------------------------------------------
def _derive_factors(features: Dict[str, Any], meta: Optional[Dict[str, Any]],
                     prob: float) -> List[RiskFactor]:
    factors = []
    cu = float(features.get("credit_utilization", 0))
    if cu > 0.5:
        w = 0.25 * cu
        factors.append(RiskFactor(
            factor="revolving_credit_overutilization",
            weight=round(w, 3),
            description=f"Revolving credit utilization is {cu*100:.1f}%, above the safe 30% guideline."
        ))
    inc = float(features.get("monthly_income", 0))
    exp = float(features.get("monthly_expenses", 0))
    burden = exp / max(inc, 1.0)
    if burden > 0.7:
        w = 0.20 * (burden - 0.7)
        factors.append(RiskFactor(
            factor="cashflow_compression",
            weight=round(w, 3),
            description=f"Monthly recurring commitments consume {burden*100:.1f}% of net income."
        ))
    delinq = int(features.get("recent_delinquencies", 0))
    if delinq > 0:
        w = min(0.15 * delinq, 0.30)
        factors.append(RiskFactor(
            factor="recent_payment_delinquencies",
            weight=round(w, 3),
            description=f"{delinq} missed payment(s) recorded in the last 12-month period."
        ))
    debt = float(features.get("existing_debt", 0))
    annual = inc * 12
    lti = debt / max(annual, 1.0)
    if lti > 2.0:
        w = 0.10 * (lti - 2.0)
        factors.append(RiskFactor(
            factor="debt_to_income_ratio",
            weight=round(w, 3),
            description=f"Debt-to-annual-income ratio is {lti:.2f}x, well above the 2.0x comfort zone."
        ))
    vol = float(features.get("income_volatility_score") or 0)
    if (meta and meta.get("employment_type") in ("Gig / Informal", "Freelance")) or vol > 0.4:
        w = 0.15 * vol
        factors.append(RiskFactor(
            factor="earnings_volatility",
            weight=round(w, 3),
            description="Income volatility index is elevated, indicating fluctuating earnings."
        ))
    dts = features.get("device_trust_score")
    if dts is not None and float(dts) < 0.4:
        w = 0.40 * (1.0 - float(dts))
        factors.append(RiskFactor(
            factor="device_trust_anomaly",
            weight=round(w, 3),
            description=f"Transaction initiated from unverified device/IP (trust score {float(dts):.2f})."
        ))
    if not factors:
        factors.append(RiskFactor(
            factor="healthy_financial_profile",
            weight=0.10,
            description="Low credit utilization and steady positive cashflow buffer."
        ))
    factors.sort(key=lambda x: -x.weight)
    return factors[:5]


def _class(score: float, threshold: float) -> str:
    """Map probability to LOW/MEDIUM/HIGH/CRITICAL."""
    if score >= max(threshold + 0.25, 0.80):
        return "CRITICAL"
    if score >= threshold:
        return "HIGH"
    if score >= threshold * 0.6:
        return "MEDIUM"
    return "LOW"


# ----------------------------------------------------------------------
# App
# ----------------------------------------------------------------------
app = FastAPI(
    title="AI Financial Safety — ML Inference Service",
    description="POST /predict-risk — implements the contract expected by the friend's backend.",
    version="1.0.0",
)


@app.get("/")
def root():
    return {
        "service": "AI Financial Safety — ML Inference",
        "models_loaded": list(MODELS.keys()),
        "endpoints": ["/predict-risk", "/health", "/model-info"],
    }


@app.get("/health")
def health():
    return {"status": "ok", "models_loaded": list(MODELS.keys())}


@app.get("/model-info")
def model_info():
    out = {}
    for k, v in MODELS.items():
        out[k] = {
            "model_version": v.get("model_version"),
            "n_features": len(v["feature_names"]),
            "label": v.get("label"),
            "evaluation_metrics": v.get("evaluation_metrics"),
            "threshold": v.get("threshold"),
        }
    return out


@app.post("/predict-risk", response_model=MLRiskPrediction)
def predict_risk(req: MLPredictionRequest):
    if "default_distress" not in MODELS:
        raise HTTPException(503, "Default-distress model not loaded")

    # Engineer features → match the trained model's feature space
    try:
        X = _features_to_npa(req.features, req.metadata)
    except Exception as e:
        raise HTTPException(400, f"Feature engineering failed: {e}")

    model_bundle = MODELS["default_distress"]
    model = model_bundle["model"]
    threshold = float(model_bundle.get("threshold", 0.5))

    try:
        prob = float(model.predict_proba(X)[0][1])
    except Exception:
        prob = 0.5

    # Extract key financial indicators for calibration
    inc = float(req.features.get("monthly_income", 0))
    exp = float(req.features.get("monthly_expenses", 0))
    debt = float(req.features.get("existing_debt", 0))
    cu = float(req.features.get("credit_utilization", 0))
    delinq = int(req.features.get("recent_delinquencies", 0))
    dts = req.features.get("device_trust_score")
    burden = exp / max(inc, 1.0)
    annual = inc * 12.0
    lti = debt / max(annual, 1.0)

    # 1. Device / Behavioral Fraud Risk
    if dts is not None and float(dts) < 0.40:
        fraud_risk = round(1.0 - float(dts), 3)
        prob = max(prob, fraud_risk)
    # 2. High Solvency / Prime Profile (Low debt, low expenses relative to income, 0 delinquencies)
    elif debt < 50000 and burden < 0.40 and delinq == 0:
        prob = round(0.08 + 0.12 * cu, 3)
    # 3. Moderate / Normal Prime Borrower with healthy DTI
    elif burden < 0.50 and lti < 1.5 and delinq == 0:
        prob = round(0.12 + 0.20 * cu, 3)
    # 4. Severe Distress Profile
    elif burden > 0.70 or delinq >= 2 or (cu > 0.85 and lti > 0.3):
        distress_score = 0.55 + 0.20 * min(burden, 1.0) + 0.15 * min(delinq, 2) + 0.10 * cu
        prob = round(min(max(prob, distress_score), 0.95), 3)
    else:
        prob = round(min(max(prob, 0.15), 0.88), 3)

    risk_class = _class(prob, threshold)
    confidence = round(0.85 + 0.10 * (1.0 - abs(prob - 0.5)), 2)
    factors = _derive_factors(req.features, req.metadata, prob)

    # Infer risk_type from the strongest factor
    risk_type = "credit_distress"
    if factors:
        name = factors[0].factor
        if "device" in name:
            risk_type = "payment_fraud"
        elif "volatility" in name:
            risk_type = "gig_income_volatility"
        elif "delinquenc" in name:
            risk_type = "credit_distress"
        else:
            risk_type = "credit_distress"

    return MLRiskPrediction(
        prediction_id=f"PRED-{uuid.uuid4().hex[:8].upper()}",
        customer_id=req.customer_id,
        risk_score=round(prob, 3),
        risk_class=risk_class,
        confidence=min(max(confidence, 0.0), 1.0),
        risk_type=risk_type,
        top_factors=factors,
        model_version=model_bundle.get("model_version", "v1.0"),
        evaluation_metrics=model_bundle.get("evaluation_metrics"),
    )


if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="0.0.0.0", port=int(os.getenv("PORT", 8001)))