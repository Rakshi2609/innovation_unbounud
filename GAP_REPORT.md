# Friend's Codebase — Implementation Gap Report

**Repo:** https://github.com/Rakshi2609/innovation_unbounud
**Branch audited:** `main` (commit 22782d7)
**Spec reference:** Master Project Spec (72 sections, paste_4_004811.txt)

---

## TL;DR

The friend's codebase has a **strong skeleton** — full backend wiring, RAG store, LangGraph orchestrator, REST + WebSocket APIs, and a polished Next.js UI with 9 pages. But **3 critical pieces are placeholders** that need real integration before the hackathon demo:

1. **ML model** — currently a hand-coded `MockFinancialMLEngine`; my branch (`feat/ml-research-india`) replaces this.
2. **LLM reasoning** — `graph.py` uses Python string templates; **no actual LLM is called anywhere** in the codebase.
3. **RAG chat** — the `/chat` page (`chat/page.tsx`, 1456 lines) calls `/api/voice/transcribe` and `/api/voice/synthesize`; those endpoints do not exist on the backend.

Everything else (FastAPI routers, SQLite persistence, WebSocket event bus, Qdrant store, cross-encoder reranker, frontend UI) is implemented and works.

---

## What IS implemented

### Backend (1,717 lines Python, all working)

| Module | LOC | Status |
|--------|----:|:-------|
| `app/main.py` + `core/config.py` | 14 + ~50 | ✅ FastAPI app, env-driven settings, CORS, Qdrant collection name, ML service URL |
| `app/ml/client.py` | 112 | ✅ Async HTTP client, fallback to mock engine |
| `app/ml/mock_engine.py` | 120 | ⚠️ Hand-coded scoring (deterministic formula, not ML) — **to be replaced by my real model** |
| `app/rag/store.py` | 101 | ✅ Qdrant + FastEmbed (sentence-transformers/all-MiniLM-L6-v2) with in-memory fallback |
| `app/rag/loaders.py` | 81 | ✅ Markdown + PDF loaders, **PII regex redaction** (SSN/email/phone/card) |
| `app/rag/chunker.py` | 48 | ✅ Recursive text splitter |
| `app/rag/reranker.py` | 64 | ✅ FastEmbed TextCrossEncoder with term-matching fallback |
| `app/rag/graph.py` | 355 | ⚠️ **10-node LangGraph-shaped orchestrator but ZERO LLM calls** — uses Python f-strings |
| `app/realtime/bus.py` | 52 | ✅ In-process pub/sub `EventBus` |
| `app/realtime/websocket.py` | 31 | ✅ `WebSocketManager.broadcast_event` |
| `app/services/copilot_orchestrator.py` | 219 | ✅ Wires ML → LangGraph → DB audit → WebSocket broadcast |
| `app/routers/{cases,decisions,documents,health,realtime}.py` | 67+43+34+24+39 | ✅ All REST endpoints |
| `app/models/{schemas,database}.py` | 147+65 | ✅ Pydantic v2 contracts, SQLite via SQLAlchemy |
| `tests/test_*.py` | 4 files | ✅ 9 tests passing |

### RAG data (44 lines of policy docs)
- `lending_underwriting_guidelines_2026.md` (15 lines)
- `hardship_relief_and_debt_restructuring_policy.md` (10 lines)
- `fraud_prevention_and_account_takeover_sop.md` (10 lines)
- `gig_worker_cashflow_underwriting_framework.md` (9 lines)
- 5 sample cases in `data/sample_cases.json` covering all 5 problem tracks

### Frontend (3,502 lines Next.js / TSX)

| Page | LOC | Purpose | Status |
|------|----:|---------|:-------|
| `app/triage/page.tsx` | 824 | Real-time case queue, ML breakdown, decision modal | ✅ Polished, Bauhaus aesthetic |
| `app/chat/page.tsx` | **1456** | TheSuperRAG-style chat with ForceGraph, voice, document mgmt | ⚠️ **Calls endpoints that don't exist on backend** |
| `app/evaluate/page.tsx` | 288 | New customer evaluation form (₹) | ✅ |
| `app/copilot/page.tsx` | 191 | RAG Copilot chat (per-case) | ⚠️ **All responses are hardcoded templates** (no backend chat endpoint) |
| `app/docs/page.tsx` | 180 | Document browser | ✅ |
| `app/grievance/page.tsx` | 167 | Customer grievance / dispute redressal | ✅ (extra feature) |
| `app/audit/page.tsx` | 141 | Audit log view | ✅ |
| `app/policies/page.tsx` | 99 | Policy KB | ✅ |
| `app/page.tsx` | 47 | Root redirect | ✅ |
| `components/layout/` | 156 | Navbar, ErrorBoundary, PageContainer | ✅ |

### My branch adds (already pushed)
- `ml_research/` — 3 trained models (LightGBM, Path A/B/C), FastAPI service exposing `POST /predict-risk` matching the friend's exact contract, comparison report, all plots & metrics.

---

## What's MISSING (priority order)

### P0 — Hackathon blockers

1. **Real ML model wired into `app/ml/client.py`**
   - Status: I built it (`feat/ml-research-india`), but it's a separate FastAPI service on port 8001.
   - The friend's `MLRiskClient` already calls `http://localhost:8001/predict-risk` and falls back to mock engine — **just need to start my service**. Test it end-to-end.

2. **Real LLM integration in `_node_llm_reasoning` (graph.py:213)**
   - The `default_llm_model: llama-3.1-8b-instant` and `groq_api_key` are already in `config.py`, and `langchain-groq>=0.1.5` is in requirements.txt — but **nothing instantiates a ChatGroq client**.
   - Fix: replace the string-template `summary`/`policy_alignment` blocks (lines 226–255) with a `ChatGroq` call. Build a prompt from ML output + retrieved citations, get natural-language explanation.

3. **Backend chat endpoint** that the `/chat` page is calling
   - Frontend calls `/api/voice/transcribe` and `/api/voice/synthesize` — **no router exists for these**.
   - Either: (a) add a `POST /api/v1/cases/{id}/chat` endpoint that hits Groq with case context + retrieved policy docs, or (b) trim the `/chat` page to only call existing endpoints.

### P1 — Polish for the demo

4. **More sample cases + policy docs**
   - Only 5 cases (1 per track). For the demo to look alive, 15–20 cases per problem track.
   - Policy docs are 9–15 lines each. Real RBI/CBI policies are 5–50 pages. Ingest at least 2–3 substantial docs.

5. **Real dataset integration into UI**
   - Connect the India UPI 2024 stream into `/triage` for live transaction monitoring (it has `fraud_flag` + ₹ amounts — perfect for the demo).

6. **Confidence-calibrated thresholds**
   - My models ship with calibrated `best_threshold`. The frontend should display "Above/Below model threshold" alongside risk_score.

7. **End-to-end happy-path demo run**
   - Add `make demo` or a `scripts/run_demo.sh` that starts: ML service → backend → frontend → seeds cases → opens browser.

### P2 — Future work

8. **Real cross-encoder model** (currently falls back to term matching — fine for demo, not for prod).
9. **Auth / RBAC** — no officer login, no role-based UI gating.
10. **DB migration tooling** — Alembic not configured.
11. **Accessibility formatter node** (Node 10 in spec) — graph doesn't implement the Simple / Step-by-step / Voice variants.
12. **LangGraph conditional edges** — current graph is purely sequential (`state = self._node_…`), not a real `StateGraph` with branches.
13. **Multi-language (Hindi)** — the spec calls this out, the UI only does English.

---

## Recommended next actions (concrete)

```bash
# 1. Pull my branch into the friend's repo (or merge on GitHub)
cd friends_repo
git checkout main
git merge feat/ml-research-india

# 2. Start my ML service alongside backend
python -m uvicorn ml_research.services.predict_api:app --port 8001 &

# 3. Add Groq key
echo "GROQ_API_KEY=gsk_..." > backend/.env

# 4. Add a real LLM call to graph.py:213 (replace f-string templates)
# 5. Either add /api/v1/cases/{id}/chat router or trim the /chat page
# 6. Re-seed with more sample cases
```

Want me to wire the **real Groq LLM into `_node_llm_reasoning`** (Step 4) next? That's the highest-leverage remaining change — converts the demo from "templates that look AI-generated" into actual grounded reasoning.