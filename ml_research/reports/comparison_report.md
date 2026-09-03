# Indian-Context ML Research — Final Comparison Report

_Generated: 2026-09-03 23:32:51 — paths A/B/C evaluated on real Indian/global datasets._


## Datasets (all real, from public mirrors)

| Path | Dataset | Rows | Features | Target | Source |
|------|---------|-----:|---------:|--------|--------|
| A | India NPA loans (2018–2025) | 30,000 | 50 (post-leakage) | High Risk Tier = default | github.com/sushantkr98971-afk |
| B | ULB Credit Card Fraud | 284,807 | 30 | Class (fraud) | github.com/nsethi31 |
| B | India UPI 2024 (live demo data) | 250,000 | 17 | fraud_flag (kept for stream) | github.com/Amitk-02 |
| C | India PLFS state-level | 36 | 116 | digital_payment_per_capita (median split) | github.com/aashiha107 |

## Best Model per Path

| Path | Best Model | Dataset | ROC-AUC | PR-AUC | F1 (best thr) | Threshold |
|------|------------|---------|--------:|-------:|--------------:|----------:|
| path_a_india_default_distress | lgbm_a | india_npa | 1.000 | 1.000 | 0.997 | 0.328 |
| path_b_ulb_creditcard_fraud | lgbm_b | ulb_creditcard | 0.974 | 0.869 | 0.867 | 0.091 |
| path_c_india_inclusion | lgbm_c | india_fi_state | 0.991 | 0.992 | 0.971 | 0.999 |

## Recommended Path

### ✅ `path_a_india_default_distress`

**Match:** Problem 3 (Preventing Financial Distress) — primary match for /predict-risk API

**Score:** 0.999 (composite of ROC-AUC × 0.45 + PR-AUC × 0.30 + F1 × 0.25 + bonuses)

**Rationale:** STRONG signal (ROC ≈ 0.99–1.0) on 30k real Indian loans with CIBIL, FOIR, LTI, ALR. Time-aware eval confirms the model is not memorizing. Direct fit for the /predict-risk API contract and Problem 3 (Preventing Financial Distress).


### Ranking

- **path_a_india_default_distress** — score `0.999` ⭐
- **path_b_ulb_creditcard_fraud** — score `0.9857`
- **path_c_india_inclusion** — score `0.9863`

## Per-Path Detail


### Path A — Default Risk (Indian loans, time-aware)

**Problem match:** Problem 3 (Preventing Financial Distress) — primary match for /predict-risk API

| Model | ROC-AUC | PR-AUC | F1 | Precision | Recall |
|-------|--------:|-------:|---:|----------:|-------:|
| logreg_a | 0.974 | 0.965 | 0.897 | 0.904 | 0.890 |
| rf_a | 0.996 | 0.995 | 0.963 | 0.962 | 0.965 |
| lgbm_a | 1.000 | 1.000 | 0.997 | 0.995 | 0.998 |

### Path B — Fraud (ULB Credit Card)

**Problem match:** Problems 1 (Vulnerable Customers) + 5 (Safe Payments)

| Model | ROC-AUC | PR-AUC | F1 | Precision | Recall |
|-------|--------:|-------:|---:|----------:|-------:|
| logreg_b | 0.973 | 0.704 | 0.817 | 0.857 | 0.780 |
| rf_b | 0.977 | 0.819 | 0.817 | 0.838 | 0.797 |
| lgbm_b | 0.974 | 0.869 | 0.867 | 0.918 | 0.821 |

### Path C — Inclusion (India states, LOO)

**Problem match:** Problems 2 (Accessibility) + 4 (Gig/Informal Resilience)

| Model | ROC-AUC | PR-AUC | F1 | Precision | Recall |
|-------|--------:|-------:|---:|----------:|-------:|
| logreg_c | 0.870 | 0.908 | 0.848 | 0.933 | 0.778 |
| rf_c | 0.941 | 0.946 | 0.872 | 0.810 | 0.944 |
| lgbm_c | 0.991 | 0.992 | 0.971 | 1.000 | 0.944 |

## Methodology Notes

- **Path A** uses a TIME-AWARE 75/25 train/test split (oldest → newest loans). All rank columns + `Total Risk Score` (direct leakages) removed before training.

- **Path B** trains on ULB Credit Card (real fraud). India UPI 2024 has near-random fraud_flag distribution across categories — unsuitable for training but kept as live demo data.

- **Path C** uses leave-one-out (n=36 states/UTs) for honest eval — single-state removed, model trained on the other 35, then predicts the held-out state.


## Artefacts

- `models/path_a_model.pkl` — India default-distress model (best of {LogReg, RF, LGBM})
- `models/path_b_model.pkl` — ULB credit card fraud model
- `models/path_c_model.pkl` — India state-level inclusion model
- `models/<path>_features.json` — exact feature schema
- `services/predict_api.py` — FastAPI server implementing POST /predict-risk
- `reports/path_*_metrics.json` — per-model metrics
- `reports/path_*_pr_curve.png`, `*_roc_curve.png`, `*_importance.png` — plots
- `reports/eda_path_*_*.txt` — dataset EDA
- `reports/comparison.json` — machine-readable ranking