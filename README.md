# 🏦 AI FINANCIAL SAFETY & LENDING COPILOT (INDIAN BANKING ECOSYSTEM)

An enterprise-grade financial safety and decision intelligence platform designed for the Indian digital banking ecosystem. The platform unifies **BankSathi: Family-Protected Accessible Senior Banking ("Shared guidance, not shared access")** with **Institutional Bank Officer Decision Support (Grounded TheSuperRAG + Statistical ML + Human-in-the-Loop Governance)**.

---

## 🚀 SYSTEM ARCHITECTURE & RUNNING SERVICES

| Component | Technology | Port | Key Capabilities |
| :--- | :--- | :--- | :--- |
| **BankSathi Senior & Guardian App** | Next.js 16 + Web Speech API + Tailwind CSS | **`http://localhost:3002`** | Voice-first banking, behavioral anomaly engine, Trusted Circle advisory review, Twilio out-of-band verification calling, 5-step guided story walkthrough |
| **Bank Officer Copilot & Triage Portal** | Next.js 16 + Tailwind CSS | **`http://localhost:3001`** | Golden Path 5-step guided triage, ML distress scoring (SHAP factors), TheSuperRAG regulatory retrieval, multilingual voice call dispatcher, immutable audit ledger |
| **Core AI & RAG Backend** | FastAPI + LangGraph + Qdrant + Twilio | **`http://localhost:8000`** | 10-node LangGraph DAG, hybrid vector search, dynamic policy RAG, 2-way Twilio conversational webhooks |
| **ML Inference Service** | LightGBM / XGBoost + FastAPI | **`http://localhost:8001`** | Calibrated Indian credit distress scoring (DTI, FOIR, anomaly scores, SHAP explanations) |

---

## 👵 1. USER-SIDE: BANKSATHI ACCESSIBLE VOICE BANKING (PORT 3002)

Tailored for Indian seniors and digitally inexperienced citizens, BankSathi redesigns digital payments around **dignity, clarity, and safety**.

### 🌟 Key Architectural Principles: "Shared guidance, not shared access"
* **Conversational Voice Banking**: Speak naturally in native languages (*"Send ₹5,000 to Dilshan"*).
* **Behavioral Risk Engine**: Automatically detects unusual transfers that deviate from established baselines (e.g. ₹5,000 vs. ₹1,500 baseline).
* **Trusted Circle Protocol**: Sends a privacy-safe alert to a trusted family member (e.g., Daughter Ananya) for a second-opinion check with **zero screen-sharing** (no AnyDesk/TeamViewer).
* **Server-Enforced 403 Security Boundary**: Trusted Circle guardians can only advise ("Looks Expected" / "Unrecognized"); they **cannot** execute payments or enter PINs on the senior's behalf.
* **Why the Senior's PIN is Still Required**: Under NPCI/RBI 2FA Zero-Trust regulations, the phone call clears the *fraud advisory check*, while the senior's secret UPI PIN on their own device ensures *cryptographic debit authorization* with zero proxy execution.

### 🗺️ Interactive 5-Step Guided Story Tour (Port 3002):
1. **Step 1: Senior Voice Transfer**: Senior Sunita speaks *"Send ₹5,000 to Dilshan"*. Engine flags the transfer against her ₹1,500 baseline.
2. **Step 2: Guardian Advisory & Twilio Call**: Daughter Ananya triggers an automated out-of-band Twilio call to Sunita to verify legitimacy, streaming the live transcript to the daughter's screen.
3. **Step 3: Security Defense Block**: Demonstrates the security model by attempting helper proxy payment $ightarrow$ **Server returns HTTP 403 Forbidden**.
4. **Step 4: Senior Independent PIN**: Once cleared by advisory feedback, Sunita enters her 4-digit UPI PIN on her device.
5. **Step 5: Settlement & Receipt**: Completes instant settlement with a tamper-evident cryptographic receipt.

### 🌐 5 Supported Native Languages
Full UI localization and voice prompt support across:
* **English (`en`)**
* **हिन्दी / Hindi (`hi`)**
* **ಕನ್ನಡ / Kannada (`kn`)**
* **मराठी / Marathi (`mr`)**
* **தமிழ் / Tamil (`ta`)**

---

## 🏛️ 2. INSTITUTIONAL BANK OFFICER COPILOT (PORT 3001)

The Bank Officer portal (`frontend/`) provides evidence-grounded decision support to prevent default and resolve distressed borrower cases proactively:

### 🗺️ Interactive 5-Step Golden Path Walkthrough (Port 3001):
1. **Step 1: Continuous Ingestion & ML Risk Scoring**: Evaluates real-time banking telemetry (DTI 46%, rolling cashflows) to flag 85% distress probability for `CASE-2026-001` (Ramesh Kumar).
2. **Step 2: TheSuperRAG Policy Retrieval**: Qdrant hybrid vector store retrieves exact regulatory clauses (e.g., *RBI Hardship Relief Clause 4.2*) with 92% semantic similarity.
3. **Step 3: Human-in-the-Loop Decision**: Officer Priya Nair (`OFFICER-402`) authorizes a 36-month restructuring plan with a 2.5% interest rate discount.
4. **Step 4: AI Multilingual Voice Copilot**: Dispatches an empathetic outbound phone call via Twilio in the borrower's preferred native language.
5. **Step 5: Cryptographic Audit Trail**: Seals the complete transaction context with SHA-256 and commits it to the immutable regulatory audit ledger (`/audit`).

---

## 📞 3. TWILIO MULTILINGUAL VOICE ENGINE (`voice_service.py`)

Integrated with Twilio Voice APIs and webhooks for live conversational outreach:
* **Languages**: Hindi, Kannada, Marathi, Tamil, and Indian English.
* **Continuous Conversation**: Employs `<Gather>` speech recognition webhooks to transcribe spoken responses in real time and store conversational audit turns.
* **Target Recipient**: Configurable live outbound calling (default verified: `+919461284678`).

---

## 🛠️ HOW TO RUN LOCALLY

### Prerequisites
* Python 3.10+
* Node.js 18+

### Step 1: Start ML Inference Service (Port 8001)
```bash
PYTHONPATH=ml_research uv run uvicorn services.predict_api:app --host 0.0.0.0 --port 8001
```

### Step 2: Start Core AI & RAG Backend (Port 8000)
```bash
PYTHONPATH=backend uv run uvicorn app.main:app --app-dir backend --host 0.0.0.0 --port 8000
```

### Step 3: Start Bank Officer Copilot UI (Port 3001)
```bash
cd frontend
npm run start -- -p 3001
```

### Step 4: Start BankSathi Senior & Guardian App (Port 3002)
```bash
cd user_app
npm run start -- -p 3002
```

---

## 🧪 RUNNING TESTS

To run all 21 backend unit and integration test suites:
```bash
PYTHONPATH=backend uv run pytest backend/tests/ -v --tb=short
```
*100% passing across API endpoints, LangGraph 10-node DAG, RAG policy store, voice service, and ML client.*
