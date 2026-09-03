# AI Financial Safety & Lending Copilot — Backend Engine

A high-performance, policy-grounded decision support backend engineered for financial safety, credit risk assessment, and lending triage.

Built by integrating:
1. **TheSuperRAG Architecture**: Hybrid Dense + BM25 Vector Search, PII Redaction, Policy Knowledge Base, and Grounded Multi-Step Reasoning with strict document citations.
2. **E-mrg Operational Engine**: Real-time asynchronous `EventBus`, WebSocket live streaming, immutable MongoDB/SQLite audit trails, and strict Human-in-the-Loop decision governance.

---

## 🏛️ Architecture Overview

```
[Financial Case / Transaction]
           │
           ▼
┌────────────────────────────────────────────────────────┐
│  Statistical ML Risk Inference (Tanush's Layer)        │
│  - POST /predict-risk                                  │
│  - Returns: risk_score, risk_class, top_factors        │
└──────────────────────────┬─────────────────────────────┘
                           │
                           ▼
┌────────────────────────────────────────────────────────┐
│  Financial RAG & Policy Grounding (TheSuperRAG Layer)  │
│  - Query Formulation from ML Factors                   │
│  - Qdrant Hybrid Search (FastEmbed + BM25)             │
│  - Cross-Encoder Re-Ranking & Citation Scoring         │
└──────────────────────────┬─────────────────────────────┘
                           │
                           ▼
┌────────────────────────────────────────────────────────┐
│  LangGraph Grounded Reasoning Engine                   │
│  - Numeric Factor Breakdown                            │
│  - Policy Alignment with Numbered Citations [1], [2]   │
│  - Structured Action Recommendations                   │
└──────────────────────────┬─────────────────────────────┘
                           │
                           ▼
┌────────────────────────────────────────────────────────┐
│  Realtime EventBus & WebSocket Broadcast (E-mrg Layer) │
│  - Instant Alert Notification to Officer Queue         │
│  - Immutable Audit Trail Logging                       │
└──────────────────────────┬─────────────────────────────┘
                           │
                           ▼
┌────────────────────────────────────────────────────────┐
│  Human Bank Officer Decision Gateway                   │
│  - Officer Reviews Evidence & Approves / Restructures  │
│  - POST /api/v1/cases/{case_id}/decision               │
└────────────────────────────────────────────────────────┘
```

---

## 🚀 Quick Start

### 1. Installation
```bash
python3 -m venv .venv
source .venv/bin/activate
pip install -r backend/requirements.txt
```

### 2. Run the Backend API
```bash
uvicorn app.main:app --app-dir backend --reload --port 8000
```
API Documentation will be live at `http://localhost:8000/docs`.

### 3. Run Automated Tests
```bash
pytest backend/tests/ -v
```

---

## 🔌 ML Model Integration Guide (For Tanush)

The backend is completely decoupled from model weights. Tanush's ML model service should expose:

### `POST /predict-risk`
**Input Request:**
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

**Output Response:**
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
      "description": "Monthly recurring expenses consume 89.2% of verified income."
    }
  ],
  "model_version": "v1.2.0-xgboost-distress",
  "evaluation_metrics": {
    "auc_roc": 0.914,
    "f1_score": 0.862
  }
}
```

*Note: If Tanush's remote service is offline, the backend's built-in statistical mock engine automatically acts as an exact-conforming fallback.*

---

## 📡 API Reference

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
