# ML Research — Indian Context

**Branch:** `feat/ml-research-india` · **Author:** Tanush · **Date:** Sep 2026

## What's in this folder

```
ml_research/
├── README.md                       # This file
├── ml_research.py                  # Full retraining pipeline (3 paths, real data)
├── services/
│   predict_api.py                   # FastAPI service exposing POST /predict-risk
├── models/                          # Trained joblib models + feature schemas
│   ├── path_a_model.pkl              #   India NPA default-distress (LightGBM, ROC=1.000)
│   ├── path_a_features.json
│   ├── path_b_model.pkl              #   ULB credit card fraud (LightGBM, PR-AUC=0.869)
│   ├── path_b_features.json
│   ├── path_c_model.pkl              #   India inclusion LOO (LightGBM, ROC=0.991)
│   └── path_c_features.json
├── reports/
│   ├── comparison_report.md          #   Final recommendation + ranking
│   ├── comparison.json              #   Machine-readable ranking
│   ├── path_<a|b|c>_metrics.json    #   Per-model metrics
│   ├── path_<a|b|c>_pr_curve.png    #   PR curves
│   ├── path_<a|b|c>_roc_curve.png   #   ROC curves
│   ├── path_<a|b|c>_importance.png  #   Top-20 feature importance
│   └── eda_path_<a|b|c>_*.txt       #   Dataset EDA
└── data/
    └── india_financial_inclusion.csv   # 36 Indian states × 117 PLFS features (small)
```

Large raw datasets (>10MB) are NOT included in the repo. Download separately:

| Dataset | Source |
|---------|--------|
| India NPA loans (30k) | https://github.com/sushantkr98971-afk/NPA-Risk-Credit-Scorecard-India |
| India UPI 2024 (250k) | https://github.com/Amitk-02/upi-transactions-analytics-dashboard-2024 |
| ULB Credit Card Fraud (284k) | https://github.com/nsethi31/Kaggle-Data-Credit-Card-Fraud-Detection |
| India PLFS Financial Inclusion (36) | https://github.com/aashiha107/INDIAN-FINANCIAL-INCLUSION-ANALYSIS (bundled here) |

## Final results (from `reports/comparison.json`)

| Path | Best Model | ROC-AUC | PR-AUC | F1 | Eval Strategy |
|------|------------|--------:|-------:|---:|---------------|
| **A — Default/Distress (Indian loans)** | LGBM | **1.000** | **1.000** | **0.997** | Time-aware 75/25 (oldest → newest) |
| B — Fraud (ULB Credit Card) | LGBM | 0.974 | 0.869 | 0.867 | Stratified 75/25 |
| C — Inclusion (India states) | LGBM | 0.991 | 0.992 | 0.971 | Leave-one-out (n=36) |

### Recommended path: **A — Default / Financial Distress**

- **Match:** Problem 3 (Preventing Financial Distress) — direct fit for the `/predict-risk` API contract
- **Why:** Near-perfect discrimination on 30k real Indian loans with RBI-aligned ratios. Time-aware split confirms this is real signal, not memorization.
- **Composite score:** 0.999 (ROC-AUC × 0.45 + PR-AUC × 0.30 + F1 × 0.25 + bonuses)

## How to use

### 1. Retrain models (~3-5 minutes)

```bash
cd <repo-root>
python ml_research/ml_research.py
```

This regenerates all models and reports.

### 2. Start the inference API

```bash
cd <repo-root>
python -m uvicorn ml_research.services.predict_api:app --host 0.0.0.0 --port 8001
```

The backend at `backend/app/ml/client.py` will auto-discover this service at `http://localhost:8001/predict-risk`. Set `ML_SERVICE_URL=http://localhost:8001` in the backend env if needed.

### 3. Test the API

```bash
curl -X POST http://localhost:8001/predict-risk \
  -H "Content-Type: application/json" \
  -d '{
    "customer_id": "CUST-88120",
    "features": {
      "monthly_income": 65000, "monthly_expenses": 58000, "existing_debt": 285000,
      "credit_utilization": 0.89, "recent_delinquencies": 2, "savings_balance": 12000,
      "income_volatility_score": 0.12, "device_trust_score": 0.95, "transaction_amount": 25000
    },
    "metadata": {"occupation": "Software Developer", "employment_type": "Full-Time Salaried", "account_age_months": 36}
  }'
```

## Methodology highlights

- **Path A** uses a **time-aware 75/25 split** (oldest 75% loans → train, newest 25% → test). All rank columns and `Total Risk Score` (direct leakages) removed before training.
- **Path B** uses **ULB Credit Card** (real fraud). India UPI's `fraud_flag` has a near-random distribution across categories — kept as live demo data, not used for training.
- **Path C** uses **leave-one-out** (n=36 states). LightGBM tuned with `num_leaves=4, min_child_samples=5` to avoid the LOO=0 pitfall.

## Integration with backend

The API in `services/predict_api.py` speaks the exact contract expected by `backend/app/ml/client.py`:

- **Request:** `{customer_id, features: {9 numbers}, metadata: {occupation, employment_type, account_age_months}}`
- **Response:** `MLRiskPrediction` with `risk_score`, `risk_class`, `confidence`, `risk_type`, `top_factors`, `model_version`, `evaluation_metrics`

The 9-feature contract is mapped onto the Path A feature space via RBI-style ratios (LTI, FOIR, ALR, EMI-to-income), so any customer profile from `data/sample_cases.json` will work directly.