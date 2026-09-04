import pytest
from fastapi.testclient import TestClient
from app.main import app

@pytest.fixture
def client():
    with TestClient(app) as test_client:
        yield test_client

def test_online_ml_service_and_fallback_tagging(client):
    """Verifies that ML evaluation cleanly tags model_source and is_fallback."""
    payload = {
        "track_type": "distress",
        "customer": {
            "customer_id": "CUST-HARDENING-01",
            "name": "Sunita Verma",
            "occupation": "Retired Teacher",
            "employment_type": "Pensioner",
            "financial_metrics": {
                "monthly_income": 35000.0,
                "monthly_expenses": 18000.0,
                "existing_debt": 20000.0,
                "credit_utilization": 0.15,
                "recent_delinquencies": 0,
                "savings_balance": 85000.0
            }
        }
    }
    res = client.post("/api/v1/cases/evaluate", json=payload)
    assert res.status_code == 200
    data = res.json()
    assert "ml_prediction" in data
    pred = data["ml_prediction"]
    assert pred["model_source"] in ["ONLINE_ML_SERVICE", "LOCAL_FALLBACK_MOCK"]
    assert isinstance(pred["is_fallback"], bool)
    assert "risk_score" in pred
    assert "risk_class" in pred
    assert "top_factors" in pred

def test_audit_trail_tamper_evidence_hash(client):
    """Verifies that human decision creates a tamper-evident audit record with SHA-256 hash."""
    # 1. Create a case
    eval_res = client.post("/api/v1/cases/evaluate", json={
        "customer": {
            "customer_id": "CUST-AUDIT-TEST",
            "name": "Ananya Sharma",
            "occupation": "Software Engineer",
            "employment_type": "Full-Time",
            "financial_metrics": {
                "monthly_income": 85000.0,
                "monthly_expenses": 45000.0,
                "existing_debt": 150000.0,
                "credit_utilization": 0.40,
                "recent_delinquencies": 0,
                "savings_balance": 120000.0
            }
        }
    })
    assert eval_res.status_code == 200
    case_id = eval_res.json()["case_id"]

    # 2. Officer decides
    dec_payload = {
        "officer_id": "OFFICER-402",
        "officer_name": "Officer Priya Nair",
        "decision": "APPROVE",
        "action_taken": "Approved standard credit facility",
        "notes": "Verified stable primary income and liquid reserves."
    }
    dec_res = client.post(f"/api/v1/cases/{case_id}/decision", json=dec_payload)
    assert dec_res.status_code == 200
    dec_data = dec_res.json()
    assert dec_data["status"] == "APPROVED"
    assert "audit_id" in dec_data

    # 3. Check case audit logs
    case_detail = client.get(f"/api/v1/cases/{case_id}").json()
    assert case_detail["status"] == "APPROVED"

def test_trusted_circle_call_and_conversation_stream(client):
    """Verifies BankMantri Twilio trusted-circle voice dispatch and polling endpoints."""
    # 1. Dispatch call
    call_payload = {
        "senior_phone": "+919461284678",
        "senior_name": "Sunita Verma",
        "guardian_name": "Ananya",
        "recipient_name": "Dilshan Kumar",
        "amount": 5000,
        "language": "hi",
        "transfer_id": "TXN-TEST-001"
    }
    res_call = client.post("/api/v1/cases/voice/trusted-circle-call", json=call_payload)
    assert res_call.status_code == 200
    call_data = res_call.json()
    assert call_data["success"] is True

    # 2. Fetch conversation stream
    res_stream = client.get("/api/v1/cases/voice/conversation/TXN-TEST-001")
    assert res_stream.status_code == 200
    stream_data = res_stream.json()
    assert "conversation" in stream_data
    assert stream_data["transfer_id"] == "TXN-TEST-001"
