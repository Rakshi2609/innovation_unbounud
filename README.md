# FINANCIAL SAFETY AND RESILIENCE PLATFORM

An intelligent, enterprise-grade safety layer designed to sit atop existing digital banking systems. The platform proactively protects users, explains underlying financial risks, and recommends preventive actions based on Indian macroeconomic indicators and RBI regulatory frameworks.

## EXECUTIVE SUMMARY

Instead of treating fraud detection, financial distress, payment safety, and financial guidance as isolated problems, this platform unifies them through a single, grounded intelligence pipeline.

When a customer performs a transaction or their financial data indicates a potentially risky situation, the system acts as a protective Financial Copilot.

Our core philosophy dictates that AI must not make irreversible financial decisions independently. Instead, the platform enforces a strict, auditable pipeline:

> Detect -> Understand -> Retrieve Evidence -> Explain -> Recommend -> Prevent

## ARCHITECTURAL BLUEPRINT

The system is designed as a distributed, modular architecture, splitting raw statistical machine learning from high-level LLM reasoning.

### 1. Statistical ML Detection
A dedicated machine-learning microservice analyzes structured data to produce a baseline risk score, risk category, confidence level, and top contributing factors.

### 2. Context Engine
Evaluates the behavioral context of the action. It determines if a transaction deviates significantly from historical patterns, assesses income irregularity, and analyzes the recipient network.

### 3. TheSuperRAG Policy Layer
The ML prediction is passed to a Retrieval-Augmented Generation system. Utilizing hybrid retrieval (semantic and keyword search) paired with cross-encoder reranking, the system fetches the most relevant financial safety procedures, fraud-prevention guidelines, or intervention policies from a controlled, immutable knowledge base.

### 4. LangGraph Orchestration
Wires the ML model, context engine, RAG retrieval, evidence validation, and LLM reasoning into a structured, agentic workflow. This ensures deterministic execution and prevents hallucinated actions.

### 5. LLM Reasoning and Explanation
The LLM receives the model prediction, context, and retrieved evidence, synthesizing them into a clear explanation and actionable recommendation. The output is deterministic, compliant, and deeply grounded in institutional policy.

## CORE PLATFORM MODULES

* **Safe Digital Payments and Fraud Detection:** Contextual warnings and explicit verifications reduce unauthorized transfers, account takeovers, and scam-related disbursements.
* **Financial Distress Prevention:** Identifies patterns such as increasing credit utilization or depleting financial buffers. The system provides early, personalized guidance before distress escalates into a systemic default.
* **Gig and Informal Worker Resilience:** Analyzes extreme income volatility to construct resilience-oriented savings plans and cashflow stabilization guidance tailored to informal labor patterns.
* **Accessibility and Inclusion Layer:** Democratizes complex ML outputs and banking policies. The platform translates dense financial jargon into accessible language, step-by-step instructions, and screen-reader-compatible content for elderly or first-time digital banking users.
* **Immutable Audit Trail:** Every system action maintains a rigorous audit log. The log captures the exact risk assessment, ML weights, model version, retrieved policy snippets, and final human officer decisions, ensuring absolute transparency and compliance traceability.

## REPOSITORY STRUCTURE

```text
innovation_unbounud/
  * /ml_research/         (ML model training, feature engineering, Inference API)
  * /backend/             (Core AI Server, LangGraph state machine, TheSuperRAG)
  * /frontend/            (Next.js App Router UI, Triage Dashboard, Audit Trail)
  * /backend/data/        (Local Markdown knowledge base for RAG ingestion)
```

## DEPLOYMENT AND EXECUTION

We provide a streamlined execution environment to boot the ML service, the Core Backend, and the Next.js Frontend simultaneously.

### Prerequisites
* Python 3.10+
* Node.js 18+

### Quick Start (Windows)
1. Navigate to the project root directory.
2. Run the startup script:
```cmd
start_servers.bat
```
3. The script will automatically install all required Python and NPM dependencies, booting three parallel services:
* **ML Inference API:** http://localhost:8001
* **Core AI Backend (FastAPI):** http://localhost:8000
* **Next.js Officer UI:** http://localhost:3000

## DATASET ATTRIBUTION AND COMPLIANCE

The baseline Machine Learning models utilized in the ml_research directory for predicting financial distress and default risks are trained on customized Indian Financial Context (NPA Prediction) Datasets. This data serves as a robust foundation for modeling financial attributes, credit utilization, and distress probabilities calibrated specifically for Indian macroeconomic indicators and Reserve Bank of India (RBI) frameworks.
