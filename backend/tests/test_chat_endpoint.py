"""Tests for the /cases/{case_id}/chat endpoint."""
import pytest
from fastapi.testclient import TestClient
from app.main import app


@pytest.fixture
def client():
    with TestClient(app) as test_client:
        yield test_client


def test_chat_endpoint_returns_answer_with_citations(client):
    """A chat about an existing case returns an answer + policy citations."""
    # Pick any seeded case
    res = client.get("/api/v1/cases")
    assert res.status_code == 200
    cases = res.json()["cases"]
    assert len(cases) > 0
    case_id = cases[0]["case_id"]

    res = client.post(
        f"/api/v1/cases/{case_id}/chat",
        json={
            "message": "What policy supports the recommended intervention?",
            "history": [],
        },
    )
    assert res.status_code == 200
    data = res.json()
    assert "answer" in data and len(data["answer"]) > 0
    assert "citations" in data
    assert isinstance(data["citations"], list)
    assert data["case_id"] == case_id
    assert "used_llm" in data


def test_chat_endpoint_with_history(client):
    """History is accepted without error."""
    res = client.get("/api/v1/cases")
    case_id = res.json()["cases"][0]["case_id"]

    res = client.post(
        f"/api/v1/cases/{case_id}/chat",
        json={
            "message": "Could we restructure instead?",
            "history": [
                {"role": "user", "content": "What's the risk?"},
                {"role": "assistant", "content": "This is the prior answer."},
            ],
        },
    )
    assert res.status_code == 200
    assert "answer" in res.json()


def test_chat_endpoint_404_for_unknown_case(client):
    res = client.post(
        "/api/v1/cases/CASE-DOES-NOT-EXIST/chat",
        json={"message": "hi"},
    )
    assert res.status_code == 404


def test_chat_endpoint_validates_message(client):
    res = client.get("/api/v1/cases")
    case_id = res.json()["cases"][0]["case_id"]
    # Empty message should fail pydantic validation
    res = client.post(
        f"/api/v1/cases/{case_id}/chat",
        json={"message": ""},
    )
    assert res.status_code == 422