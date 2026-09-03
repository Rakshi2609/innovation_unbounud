# 🛡️ AI Financial Safety & Lending Copilot

> **An Agentic Decision-Support Platform combining Statistical ML Risk Scoring, Grounded Policy RAG, and Human-in-the-Loop Governance for Responsible Banking.**

[![FastAPI](https://img.shields.io/badge/FastAPI-0.115+-009688.svg?logo=fastapi&logoColor=white)](https://fastapi.tiangolo.com)
[![Next.js](https://img.shields.io/badge/Next.js-16.2+-black.svg?logo=next.js&logoColor=white)](https://nextjs.org)
[![Python](https://img.shields.io/badge/Python-3.12-blue.svg?logo=python&logoColor=white)](https://python.org)
[![Tests](https://img.shields.io/badge/Tests-9%20Passed-brightgreen.svg)]()
[![Currency](https://img.shields.io/badge/Currency-INR%20(%E2%82%B9)-gold.svg)]()
[![Safety](https://img.shields.io/badge/Governance-Human--in--the--Loop-red.svg)]()
[![Branch](https://img.shields.io/badge/Branch-main%20%7C%20rakshith-orange.svg)](https://github.com/Rakshi2609/innovation_unbounud)

---

## 📌 1. Executive Summary & Hackathon Mission

Modern digital banking systems face critical challenges: rigid credit underwriting excludes informal earners, automated collections push struggling borrowers into default spirals, and digitally inexperienced or elderly customers fall victim to social engineering fraud.

The **AI Financial Safety & Lending Copilot** solves these challenges through a collaborative architecture:
1. **Statistical ML Models** evaluate behavioral data and compute numerical risk probabilities.
2. **TheSuperRAG Vector Store** retrieves authoritative institutional banking SOPs and underwriting rules.
3. **LangGraph Agentic Orchestrator** synthesizes evidence-grounded, plain-language explanations with numbered citations (`[1]`, `[2]`).
4. **Responsible Human Governance** ensures that no critical financial action (loan approval, restructuring, or fraud hold) is ever executed autonomously without authorized human officer confirmation.

### 🏛️ Core Architectural Philosophy:
> *"The ML model calculates statistical probability. The RAG system finds institutional policies. The LangGraph AI explains the situation with citations. The Human Bank Officer makes the final financial decision."*

---

## 🎯 2. The 5 Banking Problem Statements & Solution Mapping

The platform provides comprehensive coverage for all 5 banking hackathon problem tracks:

| # | Problem Track | Core Innovation in Platform | Demo Case Fixture | Primary Policy Applied |
| :-: | :--- | :--- | :--- | :--- |
| **1** | **Protecting Vulnerable Customers from Digital Fraud** | Behavioral device telemetry trust scoring ($<0.30$), velocity anomaly detection, 2-hour cooldown windows, and senior citizen scam verification. | `CASE-2026-003`<br>*(Devendra Sen, 68)* | `fraud_prevention_and_account_takeover_sop.md` *(Clause 2.1 & 2.2)* |
| **2** | **Making Digital Banking Truly Accessible** | Plain-language AI summaries replacing jargon, automated regex PII masking, and a dedicated **Customer Transparency View**. | All Cases | `lending_underwriting_guidelines_2026.md` |
| **3** | **Preventing Financial Distress Before It Becomes a Crisis**<br>*(⭐ Primary Demo)* | Early pre-delinquency triage ($>85\%$ revolving credit utilization, $>70\%$ debt service burden) triggering proactive 36-month debt workouts & interest discounts before 60-day default. | `CASE-2026-001`<br>*(Aarav Patel)* | `hardship_relief_and_debt_restructuring_policy.md` *(Clause 2.1 & 3.2)* |
| **4** | **Financial Resilience for Gig & Informal Workers** | 180-day rolling digital cashflow underwriting replacing rigid payslips, seasonal volatility buffers, and income-contingent micro-lines in ₹. | `CASE-2026-002`<br>*(Fatima Noor)* | `gig_worker_cashflow_underwriting_framework.md` *(Clause 1.1 & 2.1)* |
| **5** | **Safe & Inclusive Digital Payments** | Real-time payment channel safety filtering, step-up biometric verification for unusual transfer amounts, and formal dispute appeal portals. | `CASE-2026-004`<br>*(Kavita Rao)* | `fraud_prevention_and_account_takeover_sop.md` *(Clause 1.2 & 1.3)* |

---

## 🔄 3. The 7-Step Golden Path Workflow

The platform strictly follows the complete end-to-end golden path for every customer interaction:

```
 ┌────────────────────────────────────────────────────────────────────────────────────────┐
 │ 1. FINANCIAL / CUSTOMER INPUT                                                          │
 │    Monthly Income, Expenses, Debt, Revolving Utilization, Missed Payments, Telemetry  │
 └──────────────────────────────────────────┬─────────────────────────────────────────────┘
                                            │
                                            ▼
 ┌────────────────────────────────────────────────────────────────────────────────────────┐
 │ 2. STATISTICAL ML RISK PREDICTION                                                      │
 │    POST /predict-risk (via MLResponseAdapter with automated fallback handling)        │
 │    Yields: risk_score (0.0 - 1.0), risk_class (CRITICAL/HIGH/MED/LOW), top_factors    │
 └──────────────────────────────────────────┬─────────────────────────────────────────────┘
                                            │
                                            ▼
 ┌────────────────────────────────────────────────────────────────────────────────────────┐
 │ 3. CONTEXTUAL FINANCIAL ANALYSIS                                                       │
 │    DTI Ratio, Cashflow Compression Index, Savings Runway Months, Employment Stability │
 └──────────────────────────────────────────┬─────────────────────────────────────────────┘
                                            │
                                            ▼
 ┌────────────────────────────────────────────────────────────────────────────────────────┐
 │ 4. THESUPERRAG POLICY & EVIDENCE RETRIEVAL                                             │
 │    Hybrid Search (Qdrant Dense FastEmbed + Sparse BM25) & Cross-Encoder Reranking      │
 │    Extracts: Clause 1.2 (Elevated Thresholds), Clause 2.1 (Restructuring Moratorium)  │
 └──────────────────────────────────────────┬─────────────────────────────────────────────┘
                                            │
                                            ▼
 ┌────────────────────────────────────────────────────────────────────────────────────────┐
 │ 5. 10-NODE LANGGRAPH AGENTIC ORCHESTRATION                                             │
 │    Input Validation → Context Loading → Risk Evaluation → Policy Queries → Retrieval  │
 │    → Evidence Validation → LLM Reasoning → Recommendations → Safety Checks → Routing   │
 └──────────────────────────────────────────┬─────────────────────────────────────────────┘
                                            │
                                            ▼
 ┌────────────────────────────────────────────────────────────────────────────────────────┐
 │ 6. GROUNDED LLM EXPLANATION & RESPONSIBLE RECOMMENDATIONS                              │
 │    Plain-Language Narrative with Numbered Policy Citations [1], [2]                   │
 │    Options: 36-Month Debt Workout, 3-Month Principal Moratorium, Rate Discount         │
 └──────────────────────────────────────────┬─────────────────────────────────────────────┘
                                            │
                                            ▼
 ┌────────────────────────────────────────────────────────────────────────────────────────┐
 │ 7. HUMAN OFFICER CONFIRMATION & IMMUTABLE AUDIT LOG                                    │
 │    Officer reviews evidence, enters compliance notes, confirms decision.               │
 │    Commits timestamped event to immutable audit log; WebSocket real-time broadcast.   │
 └────────────────────────────────────────────────────────────────────────────────────────┘
```

---

## 🧠 4. LangGraph 10-Node Orchestration Engine

The orchestration layer in [`backend/app/rag/graph.py`](backend/app/rag/graph.py) executes a sequential, deterministic 10-node state machine:

```
[1. validate_input] ──► [2. load_context] ──► [3. evaluate_risk] ──► [4. create_policy_queries]
                                                                                │
                                                                                ▼
[8. generate_recommendations] ◄── [7. llm_reasoning] ◄── [6. evidence_validation] ◄── [5. rag_retrieval]
           │
           ▼
[9. safety_guardrails] ──► [10. route_to_human_review] ──► [CopilotCaseAssessment Output]
```

1. **`validate_input`**: Checks data completeness, non-negative monetary amounts, and valid bounds ($0.0 \le \text{utilization} \le 1.0$).
2. **`load_context`**: Computes debt-to-income (DTI), cashflow burden ratio, and emergency savings runway in months.
3. **`evaluate_risk`**: Determines severity tiers and activates the corresponding risk branch.
4. **`create_policy_queries`**: Formulates tailored semantic search queries based on dominant risk factors.
5. **`rag_retrieval`**: Queries Qdrant vector index across institutional banking documents and performs Cross-Encoder re-ranking.
6. **`evidence_validation`**: Validates cross-encoder relevance scores and structures numbered citations `[1]`, `[2]`.
7. **`llm_reasoning`**: Synthesizes a factual, plain-language assessment referencing verified policy clauses.
8. **`generate_recommendations`**: Emits non-punitive assistance options (e.g. debt workouts, rate discounts, micro-lines).
9. **`safety_guardrails`**: Enforces strict Responsible AI constraints (`autonomous_action_allowed: False`).
10. **`route_to_human_review`**: Packages the assessment in `PENDING_REVIEW` state awaiting human authorization.

---

## 🖥️ 5. The 4 Core Dashboard Pillars

The frontend dashboard in [`frontend/src/app/triage/page.tsx`](frontend/src/app/triage/page.tsx) structures every financial evaluation into 4 clear visual pillars:

```
┌────────────────────────────────────────────────────────────────────────────────────────┐
│  AI Financial Safety & Lending Copilot                 [🟢 Backend: Port 8000]         │
│  [+ Evaluate New Case]                                                                 │
├────────────────────────────────────────────────────────────────────────────────────────┤
│  [Triage Queue] [Evaluate Case] [Policy Base] [RAG Copilot] [Grievance Portal] [Audit]│
├──────────────────────────┬─────────────────────────────────────────────────────────────┤
│  TRIAGE FEED (9 Cases)   │  CASE OVERVIEW: Aarav Patel (CASE-2026-001)                │
│  • Aarav Patel ⭐        │  Income: ₹65,000 · Expenses: ₹58,000 · Debt: ₹2,85,000      │
│    [HIGH RISK - 84%]     │  [Authorize Officer Action] ──────────────────────────────┐ │
│  • Fatima Noor           ├───────────────────────────────────────────────────────────┤ │
│    [HIGH RISK - 68%]     │  📊 PILLAR 1: STATISTICAL ML RISK INFERENCE               │ │
│  • Devendra Sen          │  • Overutilization (Weight: 0.35): Credit utilization 89% │ │
│    [CRITICAL - 82%]      │  • Cashflow Burden (Weight: 0.25): Expenses consume 89.2% │ │
│  • Kavita Rao            ├───────────────────────────────────────────────────────────┤ │
│    [LOW RISK - 12%]      │  📖 PILLAR 2: THESUPERRAG POLICY EVIDENCE & CITATIONS     │ │
│                          │  [1] Lending Guidelines (Clause 1.2: Elevated Risk Limit) │ │
│                          │  [2] Hardship Policy (Clause 2.1: Restructuring Moratorium│ │
│                          ├───────────────────────────────────────────────────────────┤ │
│                          │  ✨ PILLAR 3: LANGGRAPH GROUNDED REASONING & ACTIONS      │ │
│                          │  Suggested: [RESTRUCTURE_LOAN] 36-Month Debt Workout Plan │ │
│                          ├───────────────────────────────────────────────────────────┤ │
│                          │  🛡️ PILLAR 4: RESPONSIBLE AI SAFETY & GOVERNANCE          │ │
│                          │  AI cannot autonomously approve, decline, or freeze.      │ │
└──────────────────────────┴───────────────────────────────────────────────────────────┘
```

* **Pillar 1: Statistical ML Risk Breakdown**: Visual risk gauge ($84\%$ HIGH), model version, online vs fallback badge, and contributing factor importance weights.
* **Pillar 2: TheSuperRAG Evidence & Citations**: Interactive citation cards showing exact clause snippets and cross-encoder relevance scores.
* **Pillar 3: LangGraph Grounded Reasoning & Recommendations**: Plain-language explanation with non-punitive intervention plans.
* **Pillar 4: Safety Guardrails & Human Decision Gateway**: Officer decision modal with compliance notes, ML override toggle, and immediate audit log commitment.

---

## 📂 6. Repository & File Structure

```text
innovation_unbounud/
├── backend/                                # FastAPI Risk, RAG & Decision Orchestration Service
│   ├── app/
│   │   ├── core/                           # Configuration, Settings & Structured Logging
│   │   │   ├── config.py                   # Pydantic Settings (Vector store, ML bridge URLs)
│   │   │   └── logging.py                  # Standardized Logger Setup
│   │   ├── models/                         # Data Contracts & Database Schema
│   │   │   ├── schemas.py                  # Pydantic Models (Cases, ML contracts, Citations)
│   │   │   └── database.py                 # SQLite/SQLAlchemy Models (Audit logs, Policy files)
│   │   ├── ml/                             # Statistical ML Inference Layer
│   │   │   ├── client.py                   # Async HTTP Client for model inference (POST /predict-risk)
│   │   │   ├── mock_engine.py              # Statistical Fallback Engine (XGBoost logic)
│   │   │   └── adapter.py                  # MLResponseAdapter (Normalizes remote model formats)
│   │   ├── rag/                            # Retrieval-Augmented Generation Core
│   │   │   ├── loaders.py                  # Markdown/PDF Ingestion & Regex PII Sanitization
│   │   │   ├── chunker.py                  # Semantic Clause & Section Boundary Chunker
│   │   │   ├── store.py                    # Qdrant Hybrid Vector Store (FastEmbed + BM25)
│   │   │   ├── reranker.py                 # Cross-Encoder Re-Ranking & Confidence Scoring
│   │   │   └── graph.py                    # LangGraph 10-Node Grounded Reasoning Engine
│   │   ├── realtime/                       # Real-Time Event System
│   │   │   ├── bus.py                      # In-Memory EventBus Pub/Sub
│   │   │   └── websocket.py                # WebSocket Connection Manager
│   │   ├── routers/                        # REST API Endpoint Handlers
│   │   │   ├── health.py                   # Liveness & System Health Check
│   │   │   ├── cases.py                    # Case Triage, Retrieval & Live Evaluation
│   │   │   ├── decisions.py                # Human Officer Decision Recording & Audit Log
│   │   │   ├── documents.py                # Policy Upload & Document Search
│   │   │   └── realtime.py                 # WebSocket & Server-Sent Events (SSE) Feeds
│   │   ├── services/
│   │   │   └── copilot_orchestrator.py     # Master Orchestrator (ML -> RAG -> Graph -> Audit)
│   │   └── main.py                         # FastAPI App Factory with Permissive CORS & Lifespan
│   ├── data/
│   │   ├── policies/                       # Institutional Banking Policy Corpus (in ₹)
│   │   │   ├── lending_underwriting_guidelines_2026.md
│   │   │   ├── hardship_relief_and_debt_restructuring_policy.md
│   │   │   ├── fraud_prevention_and_account_takeover_sop.md
│   │   │   └── gig_worker_cashflow_underwriting_framework.md
│   │   └── sample_cases.json               # Seed Case Fixtures (Covering all 5 Banking Tracks)
│   ├── tests/                              # Automated Pytest Suite
│   │   ├── test_api_endpoints.py           # REST API Endpoint Tests
│   │   ├── test_ml_client.py               # ML Scoring & Anomaly Inference Tests
│   │   ├── test_rag_retrieval.py           # Hybrid Search, PII Masking & Reranker Tests
│   │   └── test_reasoning_graph.py         # LangGraph Reasoning Graph Integration Tests
│   └── requirements.txt                    # Python Dependencies
│
├── frontend/                               # Next.js 16 Web Dashboard (Bauhaus Aesthetic)
│   └── src/
│       ├── app/                            # App Router Dedicated Routes
│       │   ├── layout.tsx                  # Root Layout with Navbar & Metadata
│       │   ├── page.tsx                    # Root Route Rendering Triage Dashboard Directly
│       │   ├── triage/page.tsx             # Real-time Case Triage, ML Breakdown & Decision Modal
│       │   ├── evaluate/page.tsx           # Interactive Customer Evaluation Form (in ₹)
│       │   ├── policies/page.tsx           # Policy Knowledge Base & Upload Console
│       │   ├── copilot/page.tsx            # Interactive RAG Policy & Case Chatbot
│       │   ├── grievance/page.tsx          # Customer Dispute & Grievance Redressal Portal
│       │   ├── audit/page.tsx              # Compliance & Responsible AI Audit Log
│       │   ├── not-found.tsx               # Custom Bauhaus 404 Error Page
│       │   └── globals.css                 # Fluid Typography & Bauhaus Theme Variables
│       └── components/
│           └── layout/
│               ├── Navbar.tsx              # Live System Status & Route Navigation Bar
│               ├── ErrorBoundary.tsx       # React Error Boundary
│               └── PageContainer.tsx       # Responsive Container Wrapper
│
├── README.md                               # Master Documentation & Quickstart
└── .gitignore                              # Git Exclusion Rules
```

---

## ⚡ 7. Quick Start (Running Server & Client)

### Prerequisites:
* **Python 3.12+**
* **Node.js v20+ & npm**

### Step 1: Start the Backend Server
```bash
# 1. Activate virtual environment & install requirements
python3 -m venv .venv
source .venv/bin/activate
pip install -r backend/requirements.txt

# 2. Launch FastAPI backend
uvicorn app.main:app --app-dir backend --host 0.0.0.0 --port 8000 --reload
```
* **API Server**: `http://localhost:8000`
* **Interactive Swagger Documentation**: `http://localhost:8000/docs`
* **Health & Vector Store Status**: `http://localhost:8000/health/status`

### Step 2: Start the Next.js Frontend Client
```bash
# In a separate terminal:
cd frontend
npm install
npm run dev -- -p 3001
```
* **Web Dashboard**: `http://localhost:3001`
* **Dedicated Module Routes**:
  * `http://localhost:3001/triage` — Case Triage & Human Decision Gateway
  * `http://localhost:3001/evaluate` — New Customer Evaluation Form (in ₹)
  * `http://localhost:3001/policies` — Policy Knowledge Base
  * `http://localhost:3001/copilot` — RAG AI Copilot Assistant
  * `http://localhost:3001/grievance` — Customer Grievance & Dispute Portal
  * `http://localhost:3001/audit` — Compliance Audit Trail

---

## 🎬 8. Live Demo Walkthrough Scenarios

### Scenario A: Financial Distress Detection & Responsible Restructuring (⭐ Primary Demo)
1. Navigate to [`http://localhost:3001/triage`](http://localhost:3001/triage).
2. The primary case **Aarav Patel (`CASE-2026-001`)** is pre-selected.
3. Review his financial snapshot: Monthly Income **₹65,000**, Expenses **₹58,000** ($89.2\%$ cashflow burden), Total Debt **₹2,85,000**, and Credit Utilization **$89.0\%$**.
4. Observe **Pillar 1**: ML risk engine flags **HIGH Risk (84.0%)**.
5. Observe **Pillar 2**: TheSuperRAG retrieves `Clause 1.2 (Elevated Risk Threshold)` and `Clause 2.1 (Restructuring Moratorium)`.
6. Observe **Pillar 3**: LangGraph recommends **36-Month Term Debt Consolidation with 2.5% Rate Discount**.
7. Click **"Authorize Officer Action"**:
   * Select `Approve Debt Restructuring / Moratorium`.
   * Submit the decision. Notice the case status immediately updates to `RESTRUCTURED`.
8. Switch to **"Customer Transparency View"** to inspect the plain-language borrower view.
9. Open [`http://localhost:3001/audit`](http://localhost:3001/audit) to see the immutable timestamped audit trail.

### Scenario B: Real-Time Customer Evaluation on the Fly
1. Navigate to [`http://localhost:3001/evaluate`](http://localhost:3001/evaluate).
2. Input any customer profile (e.g. *Sunita Verma*, Income: ₹85,000, Debt: ₹3,80,000, Utilization: 0.88).
3. Click **"Run ML & Grounded RAG Assessment"**.
4. The system triggers the full LangGraph pipeline, computes risk probability, cites exact policies, and loads the case directly into the live triage queue.

### Scenario C: Customer Dispute & Ombudsperson Appeal
1. Navigate to [`http://localhost:3001/grievance`](http://localhost:3001/grievance).
2. Submit a formal appeal against an automated risk flag.
3. The platform places automated actions on operational hold and routes the ticket to senior compliance ombudspersons.

---

## 🔌 9. External ML Model Integration Contract

The backend is fully decoupled from model weights and exposes a standardized adapter interface at `http://localhost:8001`:

### `POST /predict-risk`
#### Input Schema Sent by Backend:
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

#### Output Schema Expected by Backend:
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
  "model_version": "v1.0.0-remote-xgboost",
  "evaluation_metrics": {
    "auc_roc": 0.914,
    "f1_score": 0.862
  }
}
```

*Note: The built-in `MLResponseAdapter` automatically normalizes alternative formats (e.g. `probability_of_default` or raw SHAP dictionaries). When the remote service is offline, the backend uses the mathematical fallback engine while transparently marking `is_fallback: True` and `model_source: "LOCAL_FALLBACK_MOCK"`.*

---

## 📡 10. Complete REST API Reference

| Method | Endpoint | Description | Request Body / Params | Response |
| :--- | :--- | :--- | :--- | :--- |
| `GET` | `/health/live` | Service liveness probe | None | `{"status": "alive"}` |
| `GET` | `/health/status` | Vector store & ML bridge status | None | `{"status": "healthy", "policy_documents_indexed": 4, ...}` |
| `GET` | `/api/v1/cases` | List all triaged financial cases | `track_type`, `status` (optional) | `{"cases": [...]}` |
| `GET` | `/api/v1/cases/{id}` | Get full case risk assessment, citations & explanation | Case ID path param | `CopilotCaseAssessment` |
| `POST` | `/api/v1/cases/evaluate` | Evaluate customer profile through ML + RAG reasoning | `CustomerProfile` JSON | `CopilotCaseAssessment` |
| `POST` | `/api/v1/cases/{id}/decision` | Record authorized human officer decision | `OfficerDecisionRequest` | `OfficerDecisionResponse` |
| `GET` | `/api/v1/cases/{id}/audit` | Immutable compliance audit trail | Case ID path param | `{"audit_trail": [...]}` |
| `GET` | `/api/v1/documents` | List indexed policy guideline files | None | `{"documents": [...]}` |
| `POST` | `/api/v1/documents/upload` | Ingest and index new banking policy documents | Multipart file upload | `{"indexed_chunks": 14, ...}` |
| `WS` | `/api/v1/ws/cases` | WebSocket real-time event feed | WebSocket connection | Live `EventEnvelope` streams |
| `GET` | `/api/v1/events/stream` | Server-Sent Events (SSE) stream | SSE connection | Streamed event payloads |

---

## 🧪 11. Automated Verification & Testing

The backend includes a comprehensive test suite testing ML predictions, RAG retrieval, PII redaction, LangGraph reasoning, and human-in-the-loop decision recording.

Run all tests:
```bash
.venv/bin/pytest backend/tests/ -v
```

```
backend/tests/test_api_endpoints.py::test_health_endpoints PASSED        [ 11%]
backend/tests/test_api_endpoints.py::test_list_and_get_cases PASSED      [ 22%]
backend/tests/test_api_endpoints.py::test_evaluate_and_human_decision_workflow PASSED [ 33%]
backend/tests/test_ml_client.py::test_ml_client_distress_prediction PASSED [ 44%]
backend/tests/test_ml_client.py::test_ml_client_fraud_anomaly_prediction PASSED [ 55%]
backend/tests/test_rag_retrieval.py::test_pii_redaction PASSED           [ 66%]
backend/tests/test_rag_retrieval.py::test_policy_store_indexing_and_search PASSED [ 77%]
backend/tests/test_rag_retrieval.py::test_reranker_scoring PASSED        [ 88%]
backend/tests/test_reasoning_graph.py::test_financial_reasoning_graph_end_to_end PASSED [100%]

======================== 9 passed in 0.97s =========================
```

---

## 🔒 12. Privacy, Security & Responsible AI Governance

1. **Synthetic Test Data Guarantee**: All sample profiles, account balances, and identifiers used in tests and demonstrations are synthetic test fixtures.
2. **Local PII Redaction**: Document loaders automatically scrub SSNs, Aadhaar numbers, email addresses, phone numbers, and payment cards prior to vectorization or LLM prompting.
3. **Strict Non-Autonomous Operation**: `autonomous_action_allowed: False` is hardcoded. The system is strictly a decision-support tool.
4. **Immutable Audit Logging**: Every AI assessment, factor evaluation, and authorized human officer decision is recorded in the timestamped SQLite/SQLAlchemy audit trail.
