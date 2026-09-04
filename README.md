# 🇮🇳 AI FINANCIAL SAFETY & ACCESSIBLE BANKING ECOSYSTEM

### *One safety layer. Two perspectives.*

> **"AI detects risk. Evidence explains it. Humans retain control."**
>
> • **For Customers (Port 3002)**: **BankMantri** — Accessible, voice-first, family-protected digital banking tailored for Indian seniors ("Shared guidance, not shared access").  
> • **For Banks (Port 3001)**: **TheSuperRAG Bank Copilot** — Evidence-grounded financial risk detection, regulatory policy retrieval, and human-in-the-loop workout intelligence.

---

## 📑 TABLE OF CONTENTS
1. [System Vision: One Safety Layer, Two Perspectives](#-system-vision-one-safety-layer-two-perspectives)
2. [Unified System Topology & Running Ports](#-unified-system-topology--running-ports)
3. [Customer Perspective: BankMantri (Port 3002)](#-customer-perspective-bankmantri-port-3002)
   - [Core Principle: "Shared Guidance, Not Shared Access"](#core-principle-shared-guidance-not-shared-access)
   - [Threat Model: Anti-Social Engineering & Zero Screen-Sharing](#threat-model-anti-social-engineering--zero-screen-sharing)
   - [Simulated UPI Lite Zero-PIN Flow for Baseline Payments](#simulated-upi-lite-zero-pin-flow-for-baseline-payments)
   - [Behavioral Anomaly & Trusted Circle Protocol](#behavioral-anomaly--trusted-circle-protocol)
   - [Twilio Out-of-Band Verification Calling](#twilio-out-of-band-verification-calling)
   - [Server-Enforced HTTP 403 Security Boundary](#server-enforced-http-403-security-boundary)
   - [Independent Senior PIN Authentication](#independent-senior-pin-authentication)
   - [Multilingual Voice Engine (5 Indian Languages)](#multilingual-voice-engine-5-indian-languages)
   - [Interactive 5-Step Customer Story Walkthrough](#interactive-5-step-customer-story-walkthrough)
4. [Institutional Perspective: TheSuperRAG Bank Copilot (Port 3001)](#-institutional-perspective-thesuperrag-bank-copilot-port-3001)
   - [Statistical ML Distress Scoring (LightGBM Hero Model)](#statistical-ml-distress-scoring-lightgbm-hero-model)
   - [TheSuperRAG Hybrid Regulatory Policy Engine (Qdrant)](#thesuperrag-hybrid-regulatory-policy-engine-qdrant)
   - [10-Node LangGraph Constrained Orchestration DAG](#10-node-langgraph-constrained-orchestration-dag)
   - [Human-in-the-Loop Governance & Overrides](#human-in-the-loop-governance--overrides)
   - [Multilingual Twilio Voice Copilot for Workout Outreach](#multilingual-twilio-voice-copilot-for-workout-outreach)
   - [Interactive 5-Step Golden Path Triage Walkthrough](#interactive-5-step-golden-path-triage-walkthrough)
   - [Tamper-Evident Cryptographic Audit Trail (`/audit`)](#tamper-evident-cryptographic-audit-trail-audit)
5. [Twilio Multilingual Voice Engine Architecture](#-twilio-multilingual-voice-engine-architecture)
6. [Machine Learning Models & Empirical Research (`ml_research/`)](#-machine-learning-models--empirical-research-ml_research)
7. [API Endpoints Reference](#-api-endpoints-reference)
8. [Step-by-Step Local Deployment Guide](#-step-by-step-local-deployment-guide)
9. [Automated CI/CD & Test Suite (21 Tests Passing)](#-automated-cicd--test-suite-21-tests-passing)

---

## 🌟 SYSTEM VISION: ONE SAFETY LAYER, TWO PERSPECTIVES

India's digital banking ecosystem processes billions of UPI transactions monthly, but faces two major vulnerabilities:

```
┌───────────────────────────────────────────────────────────────────────────────────────────┐
│                        INDIAN FINANCIAL SAFETY DUAL PLATFORM                              │
│                    "AI detects risk. Evidence explains it. Humans retain control."         │
└─────────────────────────────────────────────┬─────────────────────────────────────────────┘
                                              │
                    ┌─────────────────────────┴─────────────────────────┐
                    ▼                                                   ▼
┌───────────────────────────────────────┐           ┌───────────────────────────────────────┐
│  CUSTOMER VIEW: BANKMANTRI (PORT 3002)│           │  BANK COPILOT VIEW (PORT 3001)        │
├───────────────────────────────────────┤           ├───────────────────────────────────────┤
│ • Senior Voice-First Accessibility    │           │ • Evidence-Grounded Default Copilot   │
│ • "Shared guidance, not shared access"│           │ • LightGBM Indian NPA Risk Scoring    │
│ • Behavioral Anomaly & Hold Queue     │           │ • TheSuperRAG Qdrant Policy Retrieval │
│ • Out-of-band Twilio Verification Call│           │ • 10-Node LangGraph Constrained DAG   │
│ • Simulated UPI Lite Zero-PIN Baseline│           │ • Human-in-the-Loop Officer Workouts  │
│ • Server-Enforced HTTP 403 Boundary   │           │ • Tamper-Evident Audit Trail (/audit) │
└───────────────────────────────────────┘           └───────────────────────────────────────┘
```

1. **For Indian Seniors & Families**: Replaces dangerous remote screen-sharing tools (**AnyDesk / TeamViewer**) and protects against **"Digital Arrest"** scams with an out-of-band family advisory shield.
2. **For Lending Officers & Institutions**: Replaces rigid, black-box credit scores with an evidence-grounded copilot that combines **Statistical ML risk scoring** with **retrieved RBI policy clauses** to design proactive restructuring workouts before default.

---

## 🌐 UNIFIED SYSTEM TOPOLOGY & RUNNING PORTS

```
[Senior User (Sunita)]                     [Guardian (Ananya)]               [Bank Officer (Priya Nair)]
        │                                          │                                      │
        ▼ (Port 3002)                              ▼ (Port 3002)                          ▼ (Port 3001)
┌─────────────────────────────────────────────────────────────────┐   ┌───────────────────────────────────┐
│           BANKMANTRI ACCESSIBLE SENIOR APP                      │   │  BANK OFFICER COPILOT & TRIAGE    │
│  • Web Speech Audio Synthesis (5 Indian Languages)              │   │  • Golden Path Walkthrough HUD    │
│  • Simulated UPI Lite Zero-PIN for Routine Baseline Payments    │   │  • SHAP Risk Factor Visualizer    │
│  • Trusted Circle Advisory Second Opinion                       │   │  • Qdrant RAG Citation Viewer     │
│  • Live Twilio Call Transcript Feed                             │   │  • Restructuring Plan Signer      │
└───────────────────────────────┬─────────────────────────────────┘   └─────────────────┬─────────────────┘
                                │                                                       │
                                └───────────────────────────┬───────────────────────────┘
                                                            ▼
                                ┌───────────────────────────────────────────────────────┐
                                │           CORE FASTAPI AI BACKEND (PORT 8000)         │
                                │  • 10-Node LangGraph Constrained DAG                  │
                                │  • TheSuperRAG Policy Retrieval Engine                │
                                │  • Twilio 2-Way Voice Webhook & Speech Dispatcher     │
                                │  • Tamper-Evident SHA-256 Audit Trail                 │
                                └──────────────┬─────────────────────────┬──────────────┘
                                               │                         │
                                               ▼                         ▼
                                ┌───────────────────────────┐ ┌─────────────────────────┐
                                │ ML PREDICT API (PORT 8001)│ │ TWILIO TELEPHONY CLOUD  │
                                │ • LightGBM Hero Distress  │ │ • Outbound Voice Calls  │
                                │ • SHAP Factor Attribution │ │ • <Gather> Speech Recog │
                                └───────────────────────────┘ └─────────────────────────┘
```

| Service Name | Port | Directory | Technology Stack | Key Responsibilities |
| :--- | :--- | :--- | :--- | :--- |
| **BankMantri User App** | **`3002`** | [`user_app/`](file:///home/appu/Downloads/Grid-main/user_app) | Next.js 16 (Turbopack), Tailwind CSS, Web Speech API | Voice-driven banking, simulated UPI Lite zero-PIN payments, Trusted Circle advisory review, live call transcription. |
| **Bank Officer Copilot** | **`3001`** | [`frontend/`](file:///home/appu/Downloads/Grid-main/frontend) | Next.js 16, Lucide, Tailwind CSS | Triage queue, policy knowledge base, loan restructuring decision modal, tamper-evident audit dashboard. |
| **Core AI & RAG Backend** | **`8000`** | [`backend/`](file:///home/appu/Downloads/Grid-main/backend) | FastAPI, LangGraph, Qdrant, Twilio SDK, SQLAlchemy | 10-node agentic workflow, hybrid vector search, speech recognition webhooks, cryptographic signing. |
| **ML Inference Service** | **`8001`** | [`ml_research/`](file:///home/appu/Downloads/Grid-main/ml_research) | LightGBM, XGBoost, Scikit-learn, FastAPI | Indian NPA distress probability, SHAP feature weights, DTI/FOIR risk analytics. |

---

## 👵 CUSTOMER PERSPECTIVE: BANKMANTRI (PORT 3002)

### Core Principle: "Shared Guidance, Not Shared Access"
BankMantri is founded on the doctrine that **family members should provide real-time guidance without ever touching the senior's PIN or bank account**. 

```
                                  BANKMANTRI SECURITY PIPELINE
                                  
  [Senior speaks: "Send ₹5,000 to Dilshan"]
                     │
                     ▼
  [Behavioral Anomaly Engine Checks Baseline]
                     │
         ┌───────────┴───────────┐
         ▼                       ▼
  [Within Baseline]       [Exceeds Baseline / Unverified]
  (e.g., ₹850 to Grocery) (e.g., ₹5,000 vs ₹1,500 baseline)
         │                       │
         ▼                       ▼
  [Simulated Zero-PIN]    [Paused in Trusted Circle Safety Queue]
  (UPI Lite Style Flow)          │
                                 ▼
                          [Daughter Ananya Receives Advisory Alert]
                                 │
                                 ▼
                          [Triggers Out-of-Band Twilio Voice Call]
                                 │
                                 ▼
                          [Senior Speaks "Yes" on Phone Call]
                                 │
                                 ▼
                          [Live Transcript Streamed to Screen]
                                 │
                                 ▼
                          [Advisory Badge Turns GREEN: "✓ Confirmed Safe"]
                                 │
                                 ▼
                          [Senior Enters Independent UPI PIN (1234)]
                                 │
                                 ▼
                          [Simulated Settlement & Tamper-Evident Receipt]
```

---

### Threat Model: Anti-Social Engineering & Zero Screen-Sharing
1. **Elimination of Remote Screen-Sharing Tools (No AnyDesk / TeamViewer)**:
   - Fraudsters frequently exploit seniors by telling them to install AnyDesk so a "technician" or "family member" can assist.
   - BankMantri gives the family an **Advisory-Only Web View** that displays transfer context without needing remote screen mirroring or credentials.
2. **Neutralizing "Digital Arrest" & WhatsApp Coercion**:
   - In Digital Arrest scams, fraudsters keep victims on continuous WhatsApp video calls and command them: *"Do not speak to anyone or you will be arrested."*
   - BankMantri's behavioral engine detects the anomalous payment and triggers an **out-of-band Twilio cellular phone call**, breaking the scammer's isolation.

---

### ⚡ Simulated UPI Lite Zero-PIN Flow for Baseline Payments
* For routine, verified payments within the senior's established baseline (e.g. ₹850 to *City Grocery & Kirana*):
  - **Simulated UPI Lite Mode**: Eligible low-risk transactions execute without prompting for a PIN.
  - Voice engine announces: *"Transfer of ₹850 to City Grocery & Kirana is within your normal baseline. Paid instantly with UPI Lite style flow without requiring PIN!"*

---

### 🛡️ Server-Enforced HTTP 403 Security Boundary
If a guardian tries to authorize, confirm, or execute a transfer on the senior's behalf:
- The backend immediately returns **`HTTP 403 Forbidden`**:
  ```json
  {
    "error": "HTTP 403 Forbidden: Shared guidance, not shared access.",
    "detail": "Trusted Circle guardians cannot execute or confirm payments. Only the senior account holder holds authorization authority."
  }
  ```

---

### 🔒 Independent Senior PIN Authentication
* **2FA Design**: Voice consent serves as an **Anti-Scam Second Opinion**, while actual funds movement requires the account holder's **2-Factor Authentication (UPI PIN / Biometrics)**.
* **Defense Against AI Voice Deepfakes**: Even if a criminal creates an AI cloned voice of the senior, they cannot execute the transfer because the physical UPI PIN must be entered on the senior's trusted device.

---

### 🌐 Multilingual Voice Engine (5 Indian Languages)
All UI labels, button states, alert badges, and text-to-speech narrations dynamically adapt across:
1. **English (`en`)**
2. **हिन्दी / Hindi (`hi`)** — *"बैंकमंत्री: साझा मार्गदर्शन, साझा पहुंच नहीं"*
3. **ಕನ್ನಡ / Kannada (`kn`)** — *"ಬ್ಯಾಂಕ್ಮಂತ್ರಿ: ಹಂಚಿಕೆಯ ಮಾರ್ಗದರ್ಶನ, ಹಂಚಿಕೆಯ ಪ್ರವೇಶವಲ್ಲ"*
4. **मराठी / Marathi (`mr`)** — *"बँकमंत्री: सामायिक मार्गदर्शन, सामायिक प्रवेश नाही"*
5. **தமிழ் / Tamil (`ta`)** — *"பேங்க்மந்திரி: பகிரப்பட்ட வழிகாட்டுதல், பகிரப்பட்ட அணுகல் இல்லை"*

---

### 🗺️ Interactive 5-Step Customer Story Walkthrough (Port 3002)
BankMantri features an interactive story walkthrough HUD at the top of `http://localhost:3002`:
* **Step 1: Senior Voice Transfer**: Sunita initiates ₹5,000 to Dilshan; behavioral engine detects $3.3	imes$ baseline deviation.
* **Step 2: Guardian Advisory & Twilio Call**: Daughter Ananya reviews alert, triggers an automated Twilio call; Sunita confirms *"Yes"*; transcript streams live to screen.
* **Step 3: Security Defense Block**: User tests helper execution $ightarrow$ backend enforces **HTTP 403 Forbidden**.
* **Step 4: Senior Independent PIN**: Sunita sees green clearance badge and enters demo PIN `1234`.
* **Step 5: Settlement & Receipt**: Payment settles with a tamper-evident cryptographic receipt.

---

## 🏛️ INSTITUTIONAL PERSPECTIVE: THESUPERRAG BANK COPILOT (PORT 3001)

### 🧠 1. Statistical ML Distress Scoring (LightGBM Hero Model)
* Evaluates borrower telemetry against our hero model trained on Indian retail NPA data (`ml_research/models/path_a_model.pkl`).
* Calculates debt-to-income (DTI), credit utilization, and cashflow deficits.
* Outputs calibrated distress probabilities and exact SHAP feature weights (e.g. *DTI > 45%: +0.38*, *Rolling Cashflow Deficit: +0.29*).

---

### 📚 2. TheSuperRAG Hybrid Regulatory Policy Engine (Qdrant)
* Ingests Reserve Bank of India (RBI) circulars, Master Directions, Fair Lending SOPs, and MSME Restructuring frameworks.
* Vector search in Qdrant retrieves exact regulatory clauses (e.g., **RBI Hardship Relief Clause 4.2**) with $>90\%$ relevance scores.

---

### 🕸️ 3. 10-Node LangGraph Constrained Orchestration DAG
```
[1. Telemetry Ingest] ──► [2. ML Feature Prep] ──► [3. Distress Inference]
                                                            │
                                                            ▼
[6. Synthesis Node] ◄── [5. Evidence Filter] ◄── [4. Policy Retrieval]
        │
        ▼
[7. Safety Guardrail] ──► [8. Workout Generation] ──► [9. Officer Triage] ──► [10. Audit Commit]
```
The graph strictly constrains LLM recommendations to retrieved policy evidence, significantly reducing unsupported or ungrounded recommendations.

---

### ⚖️ 4. Human-in-the-Loop Governance & Overrides
* Bank Officer Priya Nair (`OFFICER-402`) reviews the AI synthesis.
* The officer can approve restructuring terms (e.g., 36-month term extension with 2.5% rate discount) or submit a documented compliance override.

---

### 📞 5. Multilingual Twilio Voice Copilot for Workout Outreach
* After approving a workout plan, the officer can dispatch an outbound Twilio call in the customer's native language (Hindi, Kannada, Marathi, Tamil, or English).
* Speaks empathetic, regulatory-aligned workout terms directly to the borrower.

---

### 🗺️ 6. Interactive 5-Step Golden Path Triage Walkthrough (Port 3001)
1. **Step 1: Telemetry & ML Risk Scoring**: Loads `CASE-2026-001` (Ramesh Kumar - Distressed Borrower) with 85% distress risk.
2. **Step 2: TheSuperRAG Policy Retrieval**: Highlights retrieved *RBI Clause 4.2* authorizing proactive restructuring.
3. **Step 3: Human Officer Decision**: Opens Action Authorization Modal with pre-filled workout terms.
4. **Step 4: AI Voice Copilot Dispatch**: Places live Twilio outreach call.
5. **Step 5: Tamper-Evident Audit Trail**: Displays SHA-256 ledger entry.

---

### 🛡️ 7. Tamper-Evident Cryptographic Audit Trail (`/audit`)
* Located at **`http://localhost:3001/audit`**.
* Zero-PII design: hashes all risk inputs, RAG citations, officer actions, and phone interactions using SHA-256 integrity verification.

---

## 📞 TWILIO MULTILINGUAL VOICE ENGINE ARCHITECTURE

[`backend/app/services/voice_service.py`](file:///home/appu/Downloads/Grid-main/backend/app/services/voice_service.py) provides two primary communication pipelines:

### 1. BankMantri Senior Verification Webhooks
* `POST /api/v1/cases/voice/trusted-circle-call`: Initiates outbound call to senior (`+919461284678`).
* `POST /api/v1/cases/voice/webhook/trusted-circle-respond`: TwiML `<Gather input="speech">` webhook capturing *"Yes"* or *"No"*.
* `GET /api/v1/cases/voice/conversation/{transfer_id}`: Polling endpoint for real-time speech transcription.

### 2. Bank Officer Empathetic Workout Outreach
* `POST /api/v1/cases/{case_id}/call`: Outbound call speaking structured restructuring terms in the borrower's chosen native language.

---

## 🔬 MACHINE LEARNING MODELS & EMPIRICAL RESEARCH (`ml_research/`)

| Research Path | Model Architecture | Training Dataset | Benchmark Metrics | Status in Demo |
| :--- | :--- | :--- | :--- | :--- |
| **Path A: Indian Retail NPA Distress** | LightGBM (`path_a_model.pkl`) | Indian Banking NPA & Retail Loan Telemetry | **ROC-AUC: 0.891**, **PR-AUC: 0.842** | **Hero Production Model (Connected on Port 8001)** |
| **Path B: UPI Anomaly & Fraud Isolation** | XGBoost (`path_b_model.pkl`) | High-Velocity Indian UPI Datasets | **Precision@99: 0.94**, **Recall: 0.91** | Empirical Research Model |
| **Path C: Informal Cashflow Underwriting** | Random Forest (`path_c_model.pkl`) | Gig-Worker & Rural Cashflow Logs | **F1-Score: 0.884** | Empirical Research Model |

---

## 🔌 API ENDPOINTS REFERENCE

### Cases & Triage
- `GET /api/v1/cases`: Returns all active borrower distress cases.
- `GET /api/v1/cases/{case_id}`: Returns single case details, ML factors, and RAG citations.
- `POST /api/v1/cases/evaluate`: Evaluates raw borrower profile through ML + LangGraph DAG.
- `POST /api/v1/cases/{case_id}/decision`: Submits human officer approval or override.

### Voice & Twilio
- `POST /api/v1/cases/{case_id}/call`: Dispatches loan workout voice call to borrower.
- `POST /api/v1/cases/voice/trusted-circle-call`: Dispatches BankMantri senior verification call.
- `POST /api/v1/cases/voice/webhook/trusted-circle-respond`: Twilio speech recognition webhook.
- `GET /api/v1/cases/voice/conversation/{transfer_id}`: Live conversation transcript stream.

### Policies & SuperRAG
- `GET /api/v1/cases/policies/list`: Lists all indexed RBI and institutional policies.
- `POST /api/v1/cases/policies/upload`: Chunks and indexes uploaded `.md`/`.pdf`/`.txt` policies into Qdrant.
- `POST /api/v1/cases/policies/voice-explain`: Places voice call explaining a policy in native language.

### Audit & Governance
- `GET /api/v1/cases/audit/logs`: Fetches tamper-evident cryptographic ledger entries.

---

## 🛠️ STEP-BY-STEP LOCAL DEPLOYMENT GUIDE

### Prerequisites
* Python 3.10+
* Node.js 18+ or 20+

### Step 1: Clone Repository & Setup Virtual Environment
```bash
git clone https://github.com/Rakshi2609/innovation_unbounud.git
cd innovation_unbounud
python3 -m venv .venv
source .venv/bin/activate
pip install -r backend/requirements.txt -r ml_research/requirements.txt
```

### Step 2: Start ML Inference Engine (Port 8001)
```bash
PYTHONPATH=ml_research uv run uvicorn services.predict_api:app --host 0.0.0.0 --port 8001
```

### Step 3: Start Core AI & RAG Backend (Port 8000)
```bash
PYTHONPATH=backend uv run uvicorn app.main:app --app-dir backend --host 0.0.0.0 --port 8000
```

### Step 4: Start Bank Officer Copilot UI (Port 3001)
```bash
cd frontend
npm install
npm run build
npm run start -- -p 3001
```

### Step 5: Start BankMantri Senior & Guardian App (Port 3002)
```bash
cd user_app
npm install
npm run build
npm run start -- -p 3002
```

---

## 🧪 AUTOMATED CI/CD & TEST SUITE (21 TESTS PASSING)

Run the backend unit, integration, and security tests:
```bash
source .venv/bin/activate
PYTHONPATH=backend pytest backend/tests/ -v --tb=short
```

```
============================== 21 passed in 1.99s ==============================
backend/tests/test_api_endpoints.py::test_health_endpoints PASSED
backend/tests/test_api_endpoints.py::test_list_and_get_cases PASSED
backend/tests/test_api_endpoints.py::test_evaluate_and_human_decision_workflow PASSED
backend/tests/test_chat_endpoint.py::test_chat_endpoint_returns_answer_with_citations PASSED
backend/tests/test_chat_page_contract.py::test_chat_page_contract PASSED
backend/tests/test_langgraph_structure.py::test_graph_has_all_ten_nodes PASSED
backend/tests/test_ml_client.py::test_ml_client_distress_prediction PASSED
backend/tests/test_rag_retrieval.py::test_policy_store_indexing_and_search PASSED
backend/tests/test_reasoning_graph.py::test_financial_reasoning_graph_end_to_end PASSED
```

---

## 👥 REGULATORY ALIGNMENT & DESIGN PRINCIPLES

* **Architecture**: Built using FastAPI, LangGraph, Qdrant Vector Store, LightGBM, Next.js 16, and Twilio Voice.
* **Regulatory Alignment**: Designed in alignment with Reserve Bank of India (RBI) Regulatory Frameworks, National Payments Corporation of India (NPCI) 2FA Security Principles, and Fair Lending Restructuring Guidelines.
