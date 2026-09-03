# 🛡️ AI Financial Safety & Lending Copilot

> **An Agentic Decision-Support Platform combining Statistical ML Risk Scoring, Grounded Policy RAG, and Human-in-the-Loop Governance.**

[![FastAPI](https://img.shields.io/badge/FastAPI-0.115+-009688.svg?logo=fastapi&logoColor=white)](https://fastapi.tiangolo.com)
[![Next.js](https://img.shields.io/badge/Next.js-16.2+-black.svg?logo=next.js&logoColor=white)](https://nextjs.org)
[![Python](https://img.shields.io/badge/Python-3.12-blue.svg?logo=python&logoColor=white)](https://python.org)
[![Tests](https://img.shields.io/badge/Tests-9%20Passed-brightgreen.svg)]()
[![Branch](https://img.shields.io/badge/Branch-rakshith-orange.svg)](https://github.com/Rakshi2609/innovation_unbounud/tree/rakshith)

---

## 📌 1. Project Overview & Hackathon Strategy

The **AI Financial Safety & Lending Copilot** is designed to empower banks and lenders to triage credit risk, prevent financial distress, protect vulnerable customers from fraud, and support informal/gig workers with evidence-backed decision support.

### The 5 Target Banking Tracks:
1. **Protecting Vulnerable Customers from Digital Financial Fraud**
2. **Making Digital Banking Truly Accessible**
3. **Preventing Financial Distress Before It Becomes a Crisis**
4. **Financial Resilience for Gig and Informal Workers**
5. **Safe and Inclusive Digital Payments**

### Core Philosophy:
> *"The ML model calculates statistical probability. The RAG system finds the institutional policies. The LangGraph AI explains the situation with citations. The Human Bank Officer makes the final financial decision."*

---

## 👥 2. Team Work Breakdown

```
 ┌──────────────────────────────────────────────┐ ┌──────────────────────────────────────────────┐
 │             TANUSH'S ROLE                    │ │             RAKSHITH'S ROLE                  │
 │       (Data Science & ML Modeling)           │ │        (Backend, RAG, Reasoning & API)       │
 ├──────────────────────────────────────────────┤ ├──────────────────────────────────────────────┤
 │ • Financial dataset research (Kaggle/Public) │ │ • Financial Case & Policy Schemas            │
 │ • Statistical ML Model (XGBoost / LightGBM)  │ │ • Hybrid RAG Store (Qdrant + BM25)           │
 │ • Model evaluation (AUC-ROC, F1, Shapley)    │ │ • Cross-Encoder Re-Ranking & PII Redactor    │
 │ • Feature importance & risk classifications  │ │ • LangGraph Grounded Reasoning Engine        │
 │ • Inference API endpoint (POST /predict-risk)│ │ • Real-Time EventBus & WebSockets            │
 │                                              │ │ • Human-in-the-Loop Review & Audit Logging   │
 └──────────────────────────────────────────────┘ └──────────────────────────────────────────────┘
```

---

## 🏛️ 3. Architecture & Data Flow

```
   [Customer / Transaction Input]
                 │
                 ▼
┌────────────────────────────────────────────────────────┐
│  1. Statistical ML Risk Inference (Tanush's Layer)     │
│     - POST /predict-risk                               │
│     - Returns: risk_score, risk_class, top_factors     │
└──────────────────────────┬─────────────────────────────┘
                           │
                           ▼
┌────────────────────────────────────────────────────────┐
│  2. Policy RAG & Hybrid Retrieval (TheSuperRAG Layer)  │
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
│  4. Real-Time EventBus & Audit Engine (E-mrg Layer)    │
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

## ⚡ 4. Quick Start (Running Server & Client)

### Prerequisites:
* Python 3.12+
* Node.js v20+ & npm

### Step 1: Start the Backend Server
```bash
# 1. Activate virtual environment & install backend requirements
python3 -m venv .venv
source .venv/bin/activate
pip install -r backend/requirements.txt

# 2. Launch FastAPI backend
uvicorn app.main:app --app-dir backend --host 0.0.0.0 --port 8000 --reload
```
* **API Server**: `http://localhost:8000`
* **Swagger Docs**: `http://localhost:8000/docs`
* **Health Check**: `http://localhost:8000/health/status`

### Step 2: Start the Frontend Client
```bash
# In a separate terminal:
cd TheSuperRAG-main/frontend
npm install
npm run dev -- -p 3001
```
* **Web Client**: `http://localhost:3001`

---

## 🧪 5. Automated Verification & Testing

The backend includes a comprehensive test suite testing ML predictions, RAG retrieval, PII redaction, LangGraph reasoning, and human-in-the-loop decision recording.

Run all tests:
```bash
.venv/bin/pytest backend/tests/ -v
```

```
backend/tests/test_api_endpoints.py::test_health_endpoints PASSED
backend/tests/test_api_endpoints.py::test_list_and_get_cases PASSED
backend/tests/test_api_endpoints.py::test_evaluate_and_human_decision_workflow PASSED
backend/tests/test_ml_client.py::test_ml_client_distress_prediction PASSED
backend/tests/test_ml_client.py::test_ml_client_fraud_anomaly_prediction PASSED
backend/tests/test_rag_retrieval.py::test_pii_redaction PASSED
backend/tests/test_rag_retrieval.py::test_policy_store_indexing_and_search PASSED
backend/tests/test_rag_retrieval.py::test_reranker_scoring PASSED
backend/tests/test_reasoning_graph.py::test_financial_reasoning_graph_end_to_end PASSED

======================== 9 passed in 1.63s =========================
```

---

## 🔌 6. Tanush's ML Model Integration Contract

The backend is completely decoupled from model weights. Tanush can serve his model at `http://localhost:8001`:

### `POST /predict-risk`
#### Input Schema:
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

#### Output Schema:
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
*(If Tanush's remote service is offline, the backend's built-in statistical mock engine acts as an exact-conforming fallback).*

---

## 📡 7. Backend API Reference

| Method | Endpoint | Description |
| :--- | :--- | :--- |
| `GET` | `/health/live` | Service liveness probe |
| `GET` | `/health/status` | Vector store & ML bridge status |
| `GET` | `/api/v1/cases` | List all triaged financial cases |
| `GET` | `/api/v1/cases/{id}` | Get full case risk assessment, citations & explanation |
| `POST` | `/api/v1/cases/evaluate` | Evaluate customer profile through ML + RAG reasoning |
| `POST` | `/api/v1/cases/{id}/decision` | Record human officer decision (`APPROVE`, `RESTRUCTURE`, `FLAG_FRAUD`, etc.) |
| `GET` | `/api/v1/cases/{id}/audit` | Immutable audit trail for compliance |
| `GET` | `/api/v1/documents` | List indexed policy guideline files |
| `POST` | `/api/v1/documents/upload` | Ingest and index new banking policy documents |
| `WS` | `/api/v1/ws/cases` | WebSocket real-time event feed |
| `GET` | `/api/v1/events/stream` | Server-Sent Events (SSE) stream |

---

## 🔒 8. Privacy, Security & Governance

1. **Synthetic Test Data Guarantee**: All sample cases, account balances, and identifiers used in testing and demo are synthetic test fixtures.
2. **Local PII Redaction**: Document loaders automatically scrub SSNs, emails, phone numbers, and card numbers prior to vectorization or LLM prompting.
3. **Strict Human Governance**: AI outputs are decision-support recommendations only. All consequential financial decisions require explicit human officer authorization with mandatory audit logging.
