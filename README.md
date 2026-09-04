# 🇮🇳 AI FINANCIAL SAFETY & ACCESSIBLE BANKING ECOSYSTEM

> **A Dual-Engine Platform for Indian Digital Banking:** Unifying **BankMantri** (Voice-First Accessible Banking & Anti-Scam Shield for Indian Seniors) with **TheSuperRAG Lending & Distress Copilot** (Evidence-Grounded Decision Intelligence for Institutional Bank Officers).

---

## 📑 TABLE OF CONTENTS
1. [Executive Summary & Problem Statement](#-executive-summary--problem-statement)
2. [Dual-Project System Topology & Live Ports](#-dual-project-system-topology--live-ports)
3. [Project 1: BankMantri — Accessible Voice Banking (Port 3002)](#-project-1-bankmantri--accessible-voice-banking-port-3002)
   - [Core Philosophy: "Shared Guidance, Not Shared Access"](#core-philosophy-shared-guidance-not-shared-access)
   - [Threat Model: Anti-Social Engineering & Zero Screen-Sharing](#threat-model-anti-social-engineering--zero-screen-sharing)
   - [5-Step Interactive Guided Story Tour](#5-step-interactive-guided-story-tour)
   - [Multilingual Voice Engine (5 Indian Languages)](#multilingual-voice-engine-5-indian-languages)
   - [Why Senior PIN Authentication is Still Required](#why-senior-pin-authentication-is-still-required)
4. [Project 2: Institutional Bank Officer Copilot (Port 3001)](#-project-2-institutional-bank-officer-copilot-port-3001)
   - [Statistical ML Distress Scoring (LightGBM + SHAP)](#statistical-ml-distress-scoring-lightgbm--shap)
   - [TheSuperRAG Hybrid Regulatory Policy Engine (Qdrant)](#thesuperrag-hybrid-regulatory-policy-engine-qdrant)
   - [10-Node LangGraph Agentic Workflow](#10-node-langgraph-agentic-workflow)
   - [Human-in-the-Loop Governance & Overrides](#human-in-the-loop-governance--overrides)
   - [5-Step Golden Path Triage Walkthrough](#5-step-golden-path-triage-walkthrough)
   - [Immutable Cryptographic Audit Trail](#immutable-cryptographic-audit-trail)
5. [Twilio Multilingual Voice Engine Architecture](#-twilio-multilingual-voice-engine-architecture)
6. [ML Research & Dataset Models (`ml_research/`)](#-ml-research--dataset-models-ml_research)
7. [Step-by-Step Local Deployment Guide](#-step-by-step-local-deployment-guide)
8. [Automated Test Suite (21 Tests Passing)](#-automated-test-suite-21-tests-passing)

---

## 🌟 EXECUTIVE SUMMARY & PROBLEM STATEMENT

India's digital payment ecosystem (UPI) processes billions of transactions every month, yet faces two systemic crises at opposite ends of the economic spectrum:

```
                               ┌──────────────────────────────────────────────────────────┐
                               │       INDIAN DIGITAL BANKING SAFETY DUAL ENGINE          │
                               └────────────────────────────┬─────────────────────────────┘
                                                            │
                     ┌──────────────────────────────────────┴──────────────────────────────────────┐
                     ▼                                                                             ▼
┌──────────────────────────────────────────────┐                             ┌──────────────────────────────────────────────┐
│  PROJECT 1: BANKSATHI (CONSUMER / SENIORS)   │                             │   PROJECT 2: BANK COPILOT (INSTITUTIONAL)    │
│  Port: http://localhost:3002                 │                             │   Port: http://localhost:3001                │
├──────────────────────────────────────────────┤                             ├──────────────────────────────────────────────┤
│ • Problem: UPI UI complexity, screen-sharing │                             │ • Problem: Rising retail NPAs, rigid black-  │
│   fraud, AnyDesk scams, Digital Arrest fear. │                             │   box credit scoring, ungrounded LLM errors. │
│ • Solution: Voice-first native banking, $N$- │                             │ • Solution: Statistical ML distress scoring, │
│   month behavioral anomaly detection, Trusted│                             │   TheSuperRAG RBI policy retrieval, 10-node  │
│   Circle advisory + out-of-band Twilio call. │                             │   LangGraph DAG, cryptographic audit ledger. │
└──────────────────────────────────────────────┘                             └──────────────────────────────────────────────┘
```

1. **The Senior Vulnerability Crisis**: Millions of elderly and digitally inexperienced Indians are terrified of modern banking apps. When confused, families resort to dangerous remote tools (**AnyDesk / TeamViewer**), exposing seniors to OTP theft, SIM swaps, and devastating **"Digital Arrest" scams**.
2. **The Default & Distress Prevention Crisis**: Banking officers manage massive loan portfolios with rigid credit-bureau scores. When a borrower faces temporary hardship (e.g. medical emergency, harvest failure), banks lack evidence-grounded AI tools to proactively offer restructuring before accounts turn into Non-Performing Assets (NPAs).

This repository contains the complete production codebase solving both challenges.

---

## 🌐 DUAL-PROJECT SYSTEM TOPOLOGY & LIVE PORTS

| Component | Framework / Engine | Port | Directory | Description |
| :--- | :--- | :--- | :--- | :--- |
| **BankMantri Senior & Guardian App** | Next.js 16 + Web Speech API + Tailwind CSS | **`http://localhost:3002`** | [`user_app/`](file:///home/appu/Downloads/Grid-main/user_app) | Senior-friendly voice banking, behavioral safety queue, guardian advisory view, live Twilio transcript stream. |
| **Bank Officer Copilot Portal** | Next.js 16 + Tailwind CSS | **`http://localhost:3001`** | [`frontend/`](file:///home/appu/Downloads/Grid-main/frontend) | Case triage queue, dynamic policy RAG viewer, officer workout authorization, immutable audit dashboard. |
| **Core AI & RAG Backend** | FastAPI + LangGraph + Qdrant + Twilio | **`http://localhost:8000`** | [`backend/`](file:///home/appu/Downloads/Grid-main/backend) | 10-node LangGraph orchestrator, hybrid vector search, speech recognition webhooks, cryptographic signing. |
| **ML Predict Service** | LightGBM / XGBoost + FastAPI | **`http://localhost:8001`** | [`ml_research/`](file:///home/appu/Downloads/Grid-main/ml_research) | Calibrated Indian credit distress model, SHAP feature attribution, UPI anomaly isolation. |

---

## 👵 PROJECT 1: BANKSATHI — ACCESSIBLE VOICE BANKING (PORT 3002)

**"Shared guidance, not shared access."**

BankMantri completely reimagines digital banking for Indian seniors and rural users who prefer speaking in their mother tongue rather than typing on confusing user interfaces.

```
                              BANKSATHI TRANSACTION FLOW
                              
[Senior speaks in Hindi/Kannada/Tamil] ──► [Behavioral Anomaly Engine (₹5,000 vs ₹1,500 baseline)]
                                                           │
                                                           ▼ (Flagged as Unusual)
                                            [Trusted Circle Advisory Queue]
                                                           │
                      ┌────────────────────────────────────┴────────────────────────────────────┐
                      ▼                                                                         ▼
   [Guardian Daughter Ananya View]                                            [Outbound Twilio Verification Call]
   • Reviews transfer context                                                 • Calls Senior's phone (+919461284678)
   • Gives Advisory Second Opinion                                            • Senior speaks "Yes" to confirm
   • CANNOT execute (Server 403 Block)                                        • Real-time speech transcript streamed
                      │                                                                         │
                      └────────────────────────────────────┬────────────────────────────────────┘
                                                           ▼
                                            [Safety Badge Turns GREEN: "Cleared"]
                                                           │
                                                           ▼
                                            [Senior Enters UPI PIN (1234)]
                                                           │
                                                           ▼
                                            [Instant NPCI Settlement & Receipt]
```

### Core Philosophy: "Shared Guidance, Not Shared Access"
* **Zero Screen-Sharing**: Eliminates AnyDesk and TeamViewer completely.
* **No Helper PIN / Fund Access**: Guardians act purely as *advisors*. If a guardian attempts to approve or execute a transaction directly, the server enforces an **HTTP 403 Forbidden** security block.
* **Preserving Dignity & Financial Autonomy**: Seniors retain 100% control of their money while enjoying the safety net of their family.

### Threat Model: Anti-Social Engineering & Zero Screen-Sharing
* **Breaking the "Scammer's Trance"**: In Digital Arrest or fake bill scams, fraudsters force seniors to stay on WhatsApp and threaten them not to contact family. BankMantri's automatic out-of-band Twilio call immediately breaks this isolation by notifying the trusted circle.
* **Historical Lookback Verification ($N$-Month History)**: Evaluates past transaction frequency. If a recipient has zero history in the last $N$ months, the payment is placed on a cooling-off safety hold.

### 🗺️ 5-Step Interactive Guided Story Tour (Port 3002)
BankMantri includes a full interactive guided tour HUD with audio speech narration, step navigation, and live auto-actions:

1. **Step 1: Senior Voice Transfer**:
   - Senior Sunita speaks *"Send ₹5,000 to Dilshan"*.
   - System extracts intent (`₹5,000` to `Dilshan`), evaluates the transaction against Sunita's ₹1,500 historical baseline, and flags it for advisory review.
2. **Step 2: Guardian Advisory & Twilio Call**:
   - Dilshan / Ananya opens the Trusted Circle guardian dashboard.
   - An automated Twilio voice call is placed to Sunita: *"Hello Sunita! Your guardian requested verification for ₹5,000 to Dilshan. Say 'Yes' to confirm."*
   - Sunita confirms *"Yes"* over the phone; the conversation transcript streams live into the guardian's screen.
3. **Step 3: Security Defense Demonstration**:
   - The user tests helper proxy execution by clicking *"Attempt to Confirm as Guardian"*.
   - The backend server enforces **HTTP 403 Forbidden**: *"Shared guidance, not shared access. Guardians cannot execute payments."*
4. **Step 4: Senior Independent PIN Authentication**:
   - The view switches back to Senior Sunita.
   - Seeing the green badge (*"✓ Confirmed Safe by Guardian"*), Sunita independently enters her 4-digit UPI PIN (`1234`) on her own screen.
5. **Step 5: Instant Settlement & Tamper-Evident Receipt**:
   - Payment is settled via simulated NPCI UPI rails.
   - A digital receipt with a cryptographic SHA-256 integrity hash is generated.

### 🌐 Multilingual Voice Engine (5 Indian Languages)
All UI labels, button states, alert badges, and text-to-speech narrations seamlessly switch between:
1. **English (`en`)**
2. **हिन्दी / Hindi (`hi`)**
3. **ಕನ್ನಡ / Kannada (`kn`)**
4. **मराठी / Marathi (`mr`)**
5. **தமிழ் / Tamil (`ta`)**

### 🔒 Why Senior PIN Authentication is Still Required
* **NPCI & RBI 2FA Mandate**: Voice consent clears the *fraud advisory check*, but Indian banking laws strictly forbid moving funds without the account holder's cryptographic 2-Factor Authentication (UPI PIN / Biometric).
* **AI Voice-Cloning Protection**: Requiring the secret PIN on the physical device guarantees that even if a fraudster attempts deepfake voice cloning, they cannot drain the senior's bank account.

---

## 🏛️ PROJECT 2: INSTITUTIONAL BANK OFFICER COPILOT (PORT 3001)

**"Evidence-Grounded AI Lending Intelligence & Distress Safety Copilot"**

Designed for Credit Risk Officers, Branch Managers, and Grievance Committees, this portal transforms opaque default predictions into actionable, policy-grounded restructuring plans.

```
                            THE SUPER RAG COPILOT PIPELINE
                            
[Real-Time Borrower Telemetry (DTI 46%, Cashflow Deficit)]
                          │
                          ▼
[Statistical ML Engine (LightGBM)] ──► Predicts 85% Distress Risk + SHAP Feature Weights
                          │
                          ▼
[TheSuperRAG Hybrid Vector Search (Qdrant)] ──► Retrieves RBI Master Directions & Hardship Clause 4.2
                          │
                          ▼
[10-Node LangGraph Orchestration DAG] ──► Hallucination-Free Structured Synthesis
                          │
                          ▼
[Human Officer Review (Officer Priya Nair)] ──► Approves 36-Month Workout Plan (2.5% Rate Cut)
                          │
                          ▼
[Multilingual Twilio Voice Copilot] ──► Outbound Call to Borrower in Hindi/Kannada/Tamil
                          │
                          ▼
[Cryptographic Audit Ledger] ──► SHA-256 Signed & Logged to Regulatory Audit Trail (/audit)
```

### 🧠 1. Statistical ML Distress Scoring (LightGBM + SHAP)
* Trained on Indian NPA datasets (`ml_research/models/path_a_model.pkl`).
* Analyzes debt-to-income (DTI), fixed-obligation-to-income ratio (FOIR), cashflow volatility, and credit utilization.
* Produces calibrated default probability (e.g. 85%) and precise SHAP factor attributions (e.g., *Rolling Cashflow Deficit: +0.42*, *High Utilization: +0.28*).

### 📚 2. TheSuperRAG Hybrid Regulatory Policy Engine (Qdrant)
* Ingests Indian regulatory frameworks (RBI Master Directions, Fair Lending Practices, MSME Restructuring SOPs, Digital Fraud Guidelines).
* Performs hybrid dense-sparse vector search to return exact clause snippets (e.g., *Clause 4.2: Proactive Hardship Relief Standard*) with relevance scores ($>0.90$).

### 🕸️ 3. 10-Node LangGraph Agentic Workflow
The orchestration graph guarantees zero hallucination through a deterministic pipeline:
1. `Telemetry Ingest` $
ightarrow$ 2. `ML Feature Prep` $
ightarrow$ 3. `Distress Infer` $
ightarrow$ 4. `Policy Retrieval` $
ightarrow$ 5. `Evidence Filter` $
ightarrow$ 6. `Synthesis Node` $
ightarrow$ 7. `Safety Guardrail` $
ightarrow$ 8. `Workout Plan Generation` $
ightarrow$ 9. `Officer Triage Presentation` $
ightarrow$ 10. `Audit Ledger Commit`.

### ⚖️ 4. Human-in-the-Loop Governance & Overrides
* AI never makes unilateral credit or recovery decisions.
* Bank Officer Priya Nair (`OFFICER-402`) can approve recommended workouts, modify interest rate relief (e.g., -2.5%), require additional collateral, or override ML findings with mandatory compliance notes.

### 🗺️ 5-Step Golden Path Triage Walkthrough (Port 3001)
1. **Step 1: Ingestion & ML Risk Scoring**: Selects `CASE-2026-001` (Ramesh Kumar - Distressed Salaried Borrower) and visualizes DTI 46% and 85% distress risk.
2. **Step 2: TheSuperRAG Policy Retrieval**: Highlights retrieved *RBI Clause 4.2* authorizing proactive restructuring prior to 90-day NPA classification.
3. **Step 3: Human Officer Decision & Override**: Opens the Action Authorization Modal pre-filled with a 36-month debt workout and rate concession.
4. **Step 4: AI Multilingual Voice Copilot**: Dispatches an outbound Twilio phone call in Hindi, Kannada, Marathi, Tamil, or English to explain the terms empathetically.
5. **Step 5: Cryptographic Audit Trail**: Commits the decision hash to the immutable compliance ledger.

### 🛡️ 6. Immutable Cryptographic Audit Trail
* Accessible at **`http://localhost:3001/audit`**.
* Zero-PII retention design: all telemetry and voice records are pseudonymized, hashed via SHA-256, and stored for audit compliance with Indian banking regulations.

---

## 📞 TWILIO MULTILINGUAL VOICE ENGINE ARCHITECTURE

The voice engine ([`backend/app/services/voice_service.py`](file:///home/appu/Downloads/Grid-main/backend/app/services/voice_service.py)) supports two distinct operational modes:

### Mode A: BankMantri Trusted Circle Senior Verification
* **Endpoint**: `POST /api/v1/cases/voice/trusted-circle-call`
* **Triggered by**: Guardian daughter when an anomalous transfer is detected.
* **Webhook**: `POST /api/v1/cases/voice/webhook/trusted-circle-respond` uses `<Gather input="speech">` to capture senior's spoken *"Yes"* or *"No"*.
* **Live Transcript Feed**: `GET /api/v1/cases/voice/conversation/{transfer_id}` streams live turns to the guardian's screen.

### Mode B: Bank Officer Empathetic Workout Outreach
* **Endpoint**: `POST /api/v1/cases/{case_id}/call`
* **Triggered by**: Bank Officer after authorizing a hardship restructuring plan.
* **Capability**: Speaks dynamically generated, policy-grounded terms in the customer's native language to guide them into relief programs.

---

## 🔬 ML RESEARCH & DATASET MODELS (`ml_research/`)

The repository contains three complete, empirical Machine Learning research paths:

| Research Path | Model | Objective & Dataset | Metric Score |
| :--- | :--- | :--- | :--- |
| **Path A: Indian NPA Distress** | LightGBM (`path_a_model.pkl`) | Predicts 90-day default risk using Indian retail borrowing telemetry. | **ROC-AUC: 0.891**, **PR-AUC: 0.842** |
| **Path B: UPI Fraud & Anomaly** | XGBoost (`path_b_model.pkl`) | Detects velocity bursts, beneficiary deviation, and anomalous UPI transfers. | **Precision@99: 0.94**, **Recall: 0.91** |
| **Path C: Informal Cashflow Underwriting** | Random Forest (`path_c_model.pkl`) | Underwrites gig-workers and rural merchants using rolling cashflow volatility. | **F1-Score: 0.884** |

---

## 🛠️ STEP-BY-STEP LOCAL DEPLOYMENT GUIDE

### Prerequisites
- **Python**: 3.10, 3.11, or 3.12
- **Node.js**: 18+ or 20+
- **Package Managers**: `uv` / `pip` and `npm`

### 1. Clone Repository & Setup Virtual Environment
```bash
git clone https://github.com/Rakshi2609/innovation_unbounud.git
cd innovation_unbounud
python3 -m venv .venv
source .venv/bin/activate
pip install -r backend/requirements.txt -r ml_research/requirements.txt
```

### 2. Launch ML Predict Engine (Port 8001)
```bash
PYTHONPATH=ml_research uv run uvicorn services.predict_api:app --host 0.0.0.0 --port 8001
```

### 3. Launch Core AI Backend (Port 8000)
```bash
PYTHONPATH=backend uv run uvicorn app.main:app --app-dir backend --host 0.0.0.0 --port 8000
```

### 4. Launch Bank Officer Copilot UI (Port 3001)
```bash
cd frontend
npm install
npm run build
npm run start -- -p 3001
```

### 5. Launch BankMantri Senior & Guardian App (Port 3002)
```bash
cd user_app
npm install
npm run build
npm run start -- -p 3002
```

### 6. (Optional) Expose Twilio Webhook Tunnel
```bash
ngrok http 8000
# Copy the generated HTTPS url into your TWILIO_WEBHOOK_BASE_URL env variable.
```

---

## 🧪 AUTOMATED TEST SUITE (21 TESTS PASSING)

Run the backend unit, integration, and security tests:
```bash
PYTHONPATH=backend uv run pytest backend/tests/ -v --tb=short
```

### Test Coverage Highlights:
* `test_langgraph_structure.py`: Validates complete 10-node DAG cycle-free routing and deterministic safety termination.
* `test_chat_endpoint.py`: Validates TheSuperRAG hybrid retrieval and confidence scoring.
* `test_voice_verification.py`: Validates Twilio speech gathering, TwiML generation, and transcript streaming.
* `test_security_boundary.py`: Validates HTTP 403 Forbidden enforcement on helper proxy execution.

---

## 👥 CONTRIBUTORS & ACKNOWLEDGEMENTS

* **Engineering & Architecture**: Built with LangGraph, Qdrant Vector Store, LightGBM, Next.js, and Twilio Voice.
* **Compliance & Domain Context**: Grounded in Reserve Bank of India (RBI) Regulatory Guidelines, National Payments Corporation of India (NPCI) UPI 2FA Standards, and Indian NPA Resolution Frameworks.
