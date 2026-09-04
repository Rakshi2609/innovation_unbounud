# AI FINANCIAL SAFETY & LENDING COPILOT (INDIAN BANKING ECOSYSTEM)

An enterprise-grade financial safety and decision intelligence platform designed for the Indian digital banking ecosystem. The platform unifies **Consumer-Facing Voice Transfer Safety & Behavioral Verification** with **Institutional Bank Officer Decision Support (Grounded RAG + Statistical ML + Human-in-the-Loop Governance)**.

---

## 🚀 SYSTEM ARCHITECTURE & RUNNING SERVICES

| Component | Technology | Local Port | Key Capabilities |
| :--- | :--- | :--- | :--- |
| **User-Side Banking App** | Next.js 16 + Web Speech API | **`http://localhost:3002`** | Narrative voice transfers, behavioral $N$-month history checks, protective hold queue, digital receipts |
| **Bank Officer Copilot UI** | Next.js 16 + Tailwind CSS | **`http://localhost:3001`** | Live triage queue, case evaluation, interactive policy base, immutable audit log |
| **Core AI Backend** | FastAPI + LangGraph + TheSuperRAG | **`http://localhost:8000`** | 10-node LangGraph DAG, hybrid vector search, dynamic policy RAG, 2-way Twilio speech webhooks |
| **ML Inference Service** | LightGBM / XGBoost + FastAPI | **`http://localhost:8001`** | Calibrated Indian credit distress scoring (DTI, FOIR, anomaly scores) |

---

## 📱 1. USER-SIDE: SAFE-PAY AI VOICE TRANSFER SIMULATOR (PORT 3002)

The consumer side (`user_app/`) provides an interactive digital banking simulator demonstrating **Narrative Voice Transfers** and **Behavioral $N$-Month Beneficiary Verification**:

### 🗣️ Narrative Voice & Text Transfers
- **Voice Mic Input**: Speak commands naturally (e.g., *"Send 5000 to Dilshan"* or *"Pay ₹8,000 to Priya"*).
- **Step-by-Step Spoken Narration**: The system audibly narrates intent extraction, lookback verification, and final decision in real time.

### 🔍 $N$-Month Historical Lookback Verification Logic
Before any fund leaves the account, the engine analyzes past transaction logs over a configurable lookback window ($N$ months, default: 6 months):
1. **Verified Beneficiary (e.g., Dilshan Kumar / Priya Sharma)**:
   - Recipient has $\ge 1$ successful transfers in the last $N$ months.
   - **Outcome**: `INSTANT TRANSFER SUCCESS` $\rightarrow$ Balance debited, verified receipt generated, voice confirmation spoken.
2. **Unverified / First-Time / Dormant Recipient (e.g., Ramesh Patel >12M inactive, or Raj Cyber / 0 history)**:
   - Recipient has **zero** qualifying transactions within the $N$-month lookback window.
   - **Outcome**: `PROTECTIVE SAFETY HOLD QUEUE (4-Hour Cooling-Off)` $\rightarrow$ Funds stay protected in user account, fraud alert spoken.
   - **Override Actions**: User can authorize immediately via 4-digit PIN (`1234`), cancel transfer, or trigger an automated Twilio AI safety verification call to their phone (`+919461284678`).

---

## 🏛️ 2. INSTITUTIONAL BANK COPILOT & TRIAGE PORTAL (PORT 3001)

The bank officer portal (`frontend/`) enables human-in-the-loop oversight across high-risk lending, fraud anomalies, and distress workouts:

- **Triage Queue (`/triage`)**: Real-time evaluation feed of synthetic Indian borrowers and payment anomalies with instant risk categorization (*Critical Risk*, *Moderate Risk*, *Low Risk*).
- **Evaluate Case (`/evaluate`)**: Interactive form to run real-time ML risk inference + 10-node LangGraph DAG + policy citations.
- **Policy Knowledge Base (`/policies`)**:
  - **Create Policy**: Direct markdown policy editor with quick templates (*Kisan Agricultural Moratorium*, *MSME Working Capital SOP*, *Digital Fraud Defense*).
  - **Upload Doc**: Drag & drop `.md`, `.pdf`, `.txt`, `.csv`, `.docx` for instant chunking and vector indexing into Qdrant.
  - **Live Voice Policy Explanation**: One-click button to have Twilio call your phone and explain any policy in Hindi, Kannada, or English.
- **Immutable Audit Trail (`/audit`)**: Tamper-evident ledger logging all risk calculations, policy chunks, human decisions, and voice interaction turns.

---

## 📞 3. TWILIO MULTILINGUAL 2-WAY CONVERSATIONAL VOICE COPILOT

Integrated with Twilio Voice APIs and public tunneling:
- **Languages Supported**: **Hindi (हिंदी)**, **Kannada (ಕನ್ನಡ)**, and **English (Indian)**.
- **2-Way Continuous Conversation**: Uses continuous `<Gather>` speech recognition webhooks to converse with the customer, answer questions about relief schemes or loan moratoriums, and explain specific policy clauses dynamically retrieved via RAG.
- **Target Recipient Number**: Configured for `+919461284678`.

---

## 🛠️ HOW TO RUN LOCALLY

### Prerequisites
- Python 3.10+
- Node.js 18+

### Step 1: Start ML Inference Service (Port 8001)
```bash
PYTHONPATH=ml_research uv run uvicorn services.predict_api:app --host 0.0.0.0 --port 8001
```

### Step 2: Start Core AI Backend (Port 8000)
```bash
PYTHONPATH=backend uv run uvicorn app.main:app --app-dir backend --host 0.0.0.0 --port 8000
```

### Step 3: Start Bank Officer Copilot UI (Port 3001)
```bash
cd frontend
npm run start -- -p 3001
```

### Step 4: Start User-Side Banking Simulator (Port 3002)
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
*100% passing across API endpoints, LangGraph 10-node DAG, RAG policy store, and ML client.*
