# 🏦 AI Financial Safety & Lending Copilot — Backend

High-performance, modular backend combining statistical ML risk prediction, policy retrieval-augmented generation (RAG), and human-in-the-loop governance.

## 🏗️ Architecture Layers

```
   [Customer / Transaction Input]
                 │
                 ▼
┌────────────────────────────────────────────────────────┐
│  1. Statistical ML Risk Inference Layer                │
│     - POST /predict-risk                               │
│     - Returns: risk_score, risk_class, top_factors     │
└──────────────────────────┬─────────────────────────────┘
                           │
                           ▼
┌────────────────────────────────────────────────────────┐
│  2. Policy RAG & Hybrid Retrieval                      │
│     - Qdrant Vector Search (FastEmbed + BM25)          │
│     - Cross-Encoder Re-Ranking & Citation Numbering    │
│     - Automated PII Masking (SSN, Phone, Email)        │
└──────────────────────────┬─────────────────────────────┘
                           │
                           ▼
┌────────────────────────────────────────────────────────┐
│  3. LangGraph Grounded Reasoning Engine                │
│     - Decomposes ML factors into numeric findings      │
│     - Grounds reasoning in policy clauses [1], [2]     │
│     - Generates actionable intervention options        │
└──────────────────────────┬─────────────────────────────┘
                           │
                           ▼
┌────────────────────────────────────────────────────────┐
│  4. Real-Time EventBus & Audit Engine                  │
│     - Broadcasts live case alerts via WebSockets       │
│     - Immutable SQLite / MongoDB audit trail logging   │
└──────────────────────────┬─────────────────────────────┘
                           │
                           ▼
┌────────────────────────────────────────────────────────┐
│  5. Human Bank Officer Decision Gateway                │
│     - Review Evidence, Citations & ML Risk Breakdown   │
│     - Action: Approve | Restructure | Flag | Escalate  │
└────────────────────────────────────────────────────────┘
```

---

## ⚡ Quick Start

```bash
# 1. Activate virtual environment
source .venv/bin/activate

# 2. Install dependencies
pip install -r backend/requirements.txt

# 3. Run FastAPI server
uvicorn app.main:app --app-dir backend --host 0.0.0.0 --port 8000 --reload
```

---

## 🔌 ML Model Integration Guide

The backend is completely decoupled from model weights. The ML model service should expose:

### `POST /predict-risk`
* **Input Schema**:
  ```json
  {
    "customer_id": "CUST-88120",
    "features": {
      "monthly_income": 65000.0,
      "monthly_expenses": 58000.0,
      "existing_debt": 285000.0,
      "credit_utilization": 0.89,
      "recent_delinquencies": 2,
      "savings_balance": 12000.0,
      "income_volatility_score": 0.12,
      "device_trust_score": 0.95,
      "transaction_amount": 25000.0
    },
    "metadata": {
      "occupation": "Software Developer",
      "employment_type": "Full-Time Salaried",
      "account_age_months": 36
    }
  }
  ```

* **Output Schema**:
  ```json
  {
    "prediction_id": "PRED-88391",
    "customer_id": "CUST-88120",
    "risk_score": 0.84,
    "risk_class": "HIGH",
    "confidence": 0.89,
    "risk_type": "credit_distress",
    "top_factors": [
      {
        "factor": "credit_utilization",
        "weight": 0.42,
        "description": "Revolving credit utilization is 89.0%, exceeding safe 30% guideline."
      },
      {
        "factor": "cashflow_compression",
        "weight": 0.35,
        "description": "Monthly recurring commitments consume 89.2% of net income."
      }
    ],
    "model_version": "v1.2.0-xgboost-distress",
    "evaluation_metrics": {
      "auc_roc": 0.914,
      "f1_score": 0.862
    }
  }
  ```

*Note: If the remote ML service is offline, the backend's built-in statistical mock engine automatically acts as an exact-conforming fallback.*
