"""
GramDisha AI — FastAPI Integration Tests

Validates all HTTP endpoints, request/response validation,
critical financial contract (Capital=₹1,00,000 => Loan=₹9,00,000, EMI≈₹14,028),
bilingual responses, report PDF generation, comparison, and chat.
"""

import pytest
from fastapi.testclient import TestClient
from main import app

client = TestClient(app)


def test_health():
    response = client.get("/api/health")
    assert response.status_code == 200
    data = response.json()
    assert data["status"] == "healthy"
    assert data["version"] == "1.0.0"


def test_categories():
    response = client.get("/api/categories")
    assert response.status_code == 200
    data = response.json()
    assert data["success"] is True
    assert len(data["categories"]) >= 10


def test_locations():
    response = client.get("/api/locations")
    assert response.status_code == 200
    data = response.json()
    assert "states" in data
    assert len(data["states"]) > 0


def test_financial_calculate():
    response = client.post("/api/financial/calculate", json={"capital": 100000})
    assert response.status_code == 200
    data = response.json()
    assert data["success"] is True
    assert data["project_cost"] == 1000000
    assert data["theoretical_loan"] == 900000
    assert data["loan_amount"] == 900000
    assert "Term Loan" in data["scheme"]
    assert abs(data["estimated_emi"] - 14028) <= 2


def test_full_analysis_critical():
    """
    CRITICAL MASTER TEST:
    Input: Capital = ₹1,00,000, Business = 'dairy', Location = Maharashtra/Dhule/Shirpur/Demo Village
    Expected:
      - Project Cost = ₹10,00,000
      - Theoretical Loan = ₹9,00,000
      - Sanctioned Loan = ₹9,00,000
      - Scheme = Term Loan (7 years / 8%)
      - EMI ≈ ₹14,028 (within ±2)
      - Viability computed
      - SWOT generated
      - 90-day action plan populated
      - Analysis ID generated
    """
    payload = {
        "state": "Maharashtra",
        "district": "Dhule",
        "block": "Shirpur",
        "village": "Demo Village",
        "capital": 100000,
        "business": "dairy",
        "language": "en",
    }
    response = client.post("/api/analyze", json=payload)
    assert response.status_code == 200
    data = response.json()
    assert data["success"] is True
    assert "analysis_id" in data

    # Critical financial values
    fin = data["financial"]
    assert fin["margin_capital"] == 100000
    assert fin["project_cost"] == 1000000
    assert fin["theoretical_loan"] == 900000
    assert fin["loan_amount"] == 900000
    assert "Term Loan" in fin["scheme"]
    assert abs(fin["estimated_emi"] - 14028) <= 2

    # Viability & SWOT
    assert "viability" in data
    assert "swot" in data
    assert len(data["swot"]["strengths"]) > 0
    assert len(data["swot"]["weaknesses"]) > 0

    # Recommendation
    assert "recommendation" in data
    assert len(data["recommendation"]["actions"]) > 0

    # Quarterly repayments
    assert len(data["quarterly_repayment"]) == 28

    # Test PDF report generation for this analysis
    analysis_id = data["analysis_id"]
    pdf_resp = client.get(f"/api/report/{analysis_id}")
    assert pdf_resp.status_code == 200
    assert pdf_resp.headers["content-type"] == "application/pdf"
    assert len(pdf_resp.content) > 1000  # valid non-empty PDF


def test_full_analysis_hindi():
    payload = {
        "state": "Maharashtra",
        "district": "Dhule",
        "block": "Shirpur",
        "village": "Demo Village",
        "capital": 100000,
        "business": "retail",
        "language": "hi",
    }
    response = client.post("/api/analyze", json=payload)
    assert response.status_code == 200
    data = response.json()
    assert data["success"] is True
    assert data["language"] == "hi"
    assert "business_name_hi" in data
    assert "recommendation_hi" in data["recommendation"]


def test_comparison():
    payload = {
        "state": "Maharashtra",
        "district": "Dhule",
        "block": "Shirpur",
        "village": "Demo Village",
        "capital": 100000,
        "language": "en",
        "businesses": ["dairy", "retail", "poultry"],
    }
    response = client.post("/api/comparison", json=payload)
    assert response.status_code == 200
    data = response.json()
    assert data["success"] is True
    assert len(data["comparison"]) == 3
    # Check best option is tagged
    recommended_count = sum(1 for c in data["comparison"] if c.get("is_recommended"))
    assert recommended_count == 1


def test_chat():
    payload = {
        "message": "What is my EMI?",
        "language": "en",
        "context": {
            "business_name": "Dairy",
            "capital": 100000,
            "project_cost": 1000000,
            "loan_amount": 900000,
            "scheme": "Term Loan",
            "emi": 14028,
        },
    }
    response = client.post("/api/chat", json=payload)
    assert response.status_code == 200
    data = response.json()
    assert data["success"] is True
    assert "reply" in data
    assert len(data["reply"]) > 10
