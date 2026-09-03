import pytest
from fastapi.testclient import TestClient
from app.main import app

@pytest.fixture
def client():
    with TestClient(app) as test_client:
        yield test_client

def test_health_endpoints(client):
    res = client.get("/health/live")
    assert res.status_code == 200
    assert res.json()["status"] == "alive"

    res = client.get("/health/status")
    assert res.status_code == 200
    assert res.json()["status"] == "healthy"
    assert res.json()["policy_documents_indexed"] >= 4

def test_list_and_get_cases(client):
    res = client.get("/api/v1/cases")
    assert res.status_code == 200
    data = res.json()
    assert "cases" in data
    assert len(data["cases"]) > 0

    first_case_id = data["cases"][0]["case_id"]
    res_single = client.get(f"/api/v1/cases/{first_case_id}")
    assert res_single.status_code == 200
    case_detail = res_single.json()
    assert case_detail["case_id"] == first_case_id
    assert "ml_prediction" in case_detail
    assert "explanation" in case_detail
    assert "rag_citations" in case_detail

def test_evaluate_and_human_decision_workflow(client):
    # 1. Evaluate new profile
    new_case_payload = {
        "track_type": "distress",
        "customer": {
            "customer_id": "CUST-E2E-TEST",
            "name": "Rohan Sharma",
            "occupation": "Graphic Designer",
            "employment_type": "Freelance",
            "financial_metrics": {
                "monthly_income": 40000.0,
                "monthly_expenses": 36000.0,
                "existing_debt": 180000.0,
                "credit_utilization": 0.88,
                "recent_delinquencies": 1,
                "savings_balance": 4000.0
            }
        }
    }

    res_eval = client.post("/api/v1/cases/evaluate", json=new_case_payload)
    assert res_eval.status_code == 200
    eval_data = res_eval.json()
    case_id = eval_data["case_id"]
    assert eval_data["status"] == "PENDING_REVIEW"
    assert len(eval_data["rag_citations"]) > 0

    # 2. Officer makes human-in-the-loop decision
    decision_payload = {
        "officer_id": "OFFICER-701",
        "officer_name": "Meera Iyer",
        "decision": "RESTRUCTURE",
        "action_taken": "Approved 36-Month Term Restructuring with 2% rate discount",
        "notes": "Customer engaged proactively before 60-day default window.",
        "override_ml": False
    }

    res_dec = client.post(f"/api/v1/cases/{case_id}/decision", json=decision_payload)
    assert res_dec.status_code == 200
    dec_data = res_dec.json()
    assert dec_data["status"] == "RESTRUCTURED"
    assert dec_data["officer_id"] == "OFFICER-701"

    # 3. Check audit trail
    res_audit = client.get(f"/api/v1/cases/{case_id}/audit")
    assert res_audit.status_code == 200
    audit_data = res_audit.json()
    assert len(audit_data["audit_trail"]) >= 2 # ML evaluation + human decision
