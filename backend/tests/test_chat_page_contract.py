"""Contract test for the trimmed /chat page.

The /chat page (frontend/src/app/chat/page.tsx) calls only these endpoints.
This test asserts the backend supports every call the page makes, so a future
breakage of any of them surfaces as a failing test rather than a 404 at runtime.
"""
import pytest
from fastapi.testclient import TestClient
from app.main import app


@pytest.fixture
def client():
    with TestClient(app) as c:
        yield c


def _first_case_id(client: TestClient) -> str:
    res = client.get("/api/v1/cases")
    assert res.status_code == 200
    cases = res.json()["cases"]
    assert len(cases) > 0, "Backend must seed at least one triaged case for /chat to work."
    return cases[0]["case_id"]


def test_chat_page_contract(client):
    """Verify every endpoint the /chat page fetches against."""

    # 1. GET /health/status — backend status indicator in sidebar
    r = client.get("/health/status")
    assert r.status_code == 200
    body = r.json()
    assert body["status"] == "healthy"
    assert body["policy_documents_indexed"] >= 1

    # 2. GET /api/v1/cases — populates the case selector in sidebar
    r = client.get("/api/v1/cases")
    assert r.status_code == 200
    cases = r.json()["cases"]
    assert isinstance(cases, list) and len(cases) > 0
    first = cases[0]
    # Fields the page reads from each row:
    for field in ("case_id", "customer_name", "risk_class", "risk_score", "risk_type"):
        assert field in first, f"Case row missing required field: {field}"

    # 3. GET /api/v1/documents — populates the "Indexed Policies" list
    r = client.get("/api/v1/documents")
    assert r.status_code == 200
    docs = r.json()
    assert "documents" in docs
    assert isinstance(docs["documents"], list)
    assert len(docs["documents"]) >= 1, "Backend must seed at least one indexed policy."

    # 4. POST /api/v1/cases/{case_id}/chat — the actual chat call
    case_id = first["case_id"]
    r = client.post(
        f"/api/v1/cases/{case_id}/chat",
        json={"message": "Why was this customer flagged?", "history": []},
    )
    assert r.status_code == 200
    chat = r.json()
    # Fields the page reads:
    assert "answer" in chat and isinstance(chat["answer"], str) and len(chat["answer"]) > 0
    assert "citations" in chat and isinstance(chat["citations"], list)
    assert chat["case_id"] == case_id
    # Each citation has the fields the page renders:
    for c in chat["citations"]:
        assert "policy_name" in c
        assert "snippet" in c

    # 5. POST /api/v1/documents/upload — used by the "Index Policy" modal
    #    (we just verify the route exists with an unsupported payload and get a 400
    #     for bad extensions or 200 for good ones — both prove the route is live.)
    import io
    files = {"file": ("contract_test.md", io.BytesIO(b"# contract test"), "text/markdown")}
    r = client.post("/api/v1/documents/upload", files=files)
    assert r.status_code in (200, 400), (
        f"Expected upload route to exist (got {r.status_code}). "
        "The /chat page relies on POST /api/v1/documents/upload."
    )


def test_chat_page_chat_with_history(client):
    """The /chat page sends a history array — confirm it's accepted."""
    case_id = _first_case_id(client)
    r = client.post(
        f"/api/v1/cases/{case_id}/chat",
        json={
            "message": "What restructuring terms apply?",
            "history": [
                {"role": "user", "content": "What's the risk?"},
                {"role": "assistant", "content": "The customer shows elevated credit distress."},
            ],
        },
    )
    assert r.status_code == 200
    assert "answer" in r.json()


def test_chat_page_handles_unknown_case_id_gracefully(client):
    """The page shouldn't crash if a stale case id is in state."""
    r = client.post(
        "/api/v1/cases/CASE-DOES-NOT-EXIST/chat",
        json={"message": "hello", "history": []},
    )
    assert r.status_code == 404