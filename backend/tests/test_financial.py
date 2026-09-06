"""
GramDisha AI — Financial Engine Unit Tests

CRITICAL TEST (must pass exactly):
  Input: Capital = ₹1,00,000
  Expected: Project Cost = ₹10,00,000 · Theoretical Loan = ₹9,00,000 · Actual Loan = ₹9,00,000
            Scheme = Term Loan · Interest = 8% · Tenure = 7 years · Moratorium = 6 months
            EMI ≈ ₹14,026/month

Tests cover: project cost, loan calculation, scheme routing (incl. clamp edge case),
EMI, viability — across capital values ₹0, negative, ₹10,000, ₹14,000, ₹20,000,
₹50,000, ₹1,00,000, ₹5,00,000, and OUTSIDE_SUPPORTED_RANGE.
"""

import sys
import os
import pytest

# Add backend to path
sys.path.insert(0, os.path.join(os.path.dirname(__file__), ".."))

from services.financial_engine import calculate_project_cost, calculate_theoretical_loan, calculate_financial_structure
from services.scheme_router import route_scheme
from services.emi_engine import calculate_emi, calculate_financial_health, aggregate_quarterly, generate_amortization_schedule
from services.viability_engine import calculate_viability_score, get_score_band
from services.recommendation_engine import determine_recommendation_state


# ─── CRITICAL FINANCIAL TEST ─────────────────────────────────────

class TestCriticalFinancial:
    """The critical test from Section 34 — must pass exactly."""

    def test_capital_100000(self):
        capital = 100000

        # Project cost
        project_cost = calculate_project_cost(capital)
        assert project_cost == 1000000, f"Expected 1000000, got {project_cost}"

        # Theoretical loan
        theoretical_loan = calculate_theoretical_loan(project_cost)
        assert theoretical_loan == 900000, f"Expected 900000, got {theoretical_loan}"

        # Scheme routing
        scheme = route_scheme(project_cost)
        assert scheme["scheme"] == "Term Loan Scheme"
        assert scheme["loan_amount"] == 900000
        assert scheme["interest_rate"] == 8
        assert scheme["tenure_years"] == 7
        assert scheme["moratorium_months"] == 6
        assert scheme["loan_limit_applied"] is False

        # EMI calculation
        emi = calculate_emi(900000, 8, 7)
        assert abs(emi - 14028) <= 2, f"Expected ~14,026-14,028, got {emi}"


# ─── PROJECT COST TESTS ─────────────────────────────────────────

class TestProjectCost:
    def test_basic(self):
        assert calculate_project_cost(100000) == 1000000

    def test_small_capital(self):
        assert calculate_project_cost(10000) == 100000

    def test_large_capital(self):
        assert calculate_project_cost(500000) == 5000000

    def test_zero_raises(self):
        with pytest.raises(ValueError):
            calculate_project_cost(0)

    def test_negative_raises(self):
        with pytest.raises(ValueError):
            calculate_project_cost(-100)


# ─── SCHEME ROUTER TESTS ────────────────────────────────────────

class TestSchemeRouter:
    def test_micro_finance_10000(self):
        """Capital ₹10,000 → Project ₹1,00,000 → Micro Finance"""
        scheme = route_scheme(100000)
        assert scheme["scheme"] == "Micro Finance Scheme"
        assert scheme["max_loan"] == 125000
        assert scheme["interest_rate"] == 8
        assert scheme["tenure_years"] == 5

    def test_micro_finance_loan_amount(self):
        """₹1,00,000 project → 90% = ₹90,000 ≤ ₹1,25,000, no clamp"""
        scheme = route_scheme(100000)
        assert scheme["loan_amount"] == 90000
        assert scheme["loan_limit_applied"] is False

    def test_micro_finance_boundary(self):
        """₹1,40,000 project → still Micro Finance"""
        scheme = route_scheme(140000)
        assert scheme["scheme"] == "Micro Finance Scheme"
        assert scheme["loan_amount"] == min(140000 * 0.90, 125000)
        # 140000 * 0.90 = 126000 > 125000 → CLAMP
        assert scheme["loan_amount"] == 125000
        assert scheme["loan_limit_applied"] is True

    def test_term_loan_just_above(self):
        """₹1,40,001 project → Term Loan"""
        scheme = route_scheme(140000.01)
        assert scheme["scheme"] == "Term Loan Scheme"

    def test_term_loan_max_boundary(self):
        """₹50,00,000 project → Term Loan, loan = ₹45,00,000"""
        scheme = route_scheme(5000000)
        assert scheme["scheme"] == "Term Loan Scheme"
        assert scheme["loan_amount"] == 4500000
        assert scheme["loan_limit_applied"] is False

    def test_clamp_edge_case(self):
        """
        Critical edge case from Section 8:
        Project cost inside scheme band but calculated 90% loan exceeds max.
        """
        # ₹1,40,000 project → 90% = ₹1,26,000 > max ₹1,25,000 → clamp
        scheme = route_scheme(140000)
        assert scheme["loan_limit_applied"] is True
        assert scheme["loan_amount"] == 125000

    def test_outside_supported_range(self):
        """Project cost > ₹50,00,000 → error"""
        with pytest.raises(ValueError, match="OUTSIDE_SUPPORTED_RANGE"):
            route_scheme(5000001)

    def test_capital_14000(self):
        """Capital ₹14,000 → Project ₹1,40,000 → Micro Finance"""
        project = calculate_project_cost(14000)
        assert project == 140000
        scheme = route_scheme(project)
        assert scheme["scheme"] == "Micro Finance Scheme"

    def test_capital_20000(self):
        """Capital ₹20,000 → Project ₹2,00,000 → Term Loan"""
        project = calculate_project_cost(20000)
        assert project == 200000
        scheme = route_scheme(project)
        assert scheme["scheme"] == "Term Loan Scheme"

    def test_capital_50000(self):
        """Capital ₹50,000 → Project ₹5,00,000 → Term Loan"""
        project = calculate_project_cost(50000)
        assert project == 500000
        scheme = route_scheme(project)
        assert scheme["scheme"] == "Term Loan Scheme"


# ─── EMI TESTS ───────────────────────────────────────────────────

class TestEMI:
    def test_critical_emi(self):
        """P=₹9,00,000, 8%, 7y → EMI ≈ ₹14,028"""
        emi = calculate_emi(900000, 8, 7)
        assert abs(emi - 14028) <= 2

    def test_micro_finance_emi(self):
        """P=₹90,000, 8%, 5y → calculate and check reasonable"""
        emi = calculate_emi(90000, 8, 5)
        assert 1500 < emi < 2500  # Reasonable range

    def test_zero_principal(self):
        assert calculate_emi(0, 8, 7) == 0

    def test_amortization_length(self):
        schedule = generate_amortization_schedule(900000, 8, 7)
        assert len(schedule) == 84  # 7 years × 12 months

    def test_amortization_closes_to_zero(self):
        schedule = generate_amortization_schedule(900000, 8, 7)
        assert schedule[-1]["closing_balance"] == 0

    def test_quarterly_aggregation(self):
        schedule = generate_amortization_schedule(900000, 8, 7)
        quarterly = aggregate_quarterly(schedule)
        assert len(quarterly) == 28  # 7 years × 4 quarters


# ─── FINANCIAL HEALTH TESTS ─────────────────────────────────────

class TestFinancialHealth:
    def test_comfortable(self):
        """Surplus ≥ 30% of revenue → comfortable"""
        health = calculate_financial_health(100000, 50000, 10000)
        assert health["status"] == "comfortable"
        assert health["monthly_surplus"] == 40000

    def test_tight(self):
        """0 ≤ surplus < 30% → tight"""
        health = calculate_financial_health(100000, 70000, 20000)
        assert health["status"] == "tight"

    def test_risky(self):
        """surplus < 0 → risky"""
        health = calculate_financial_health(100000, 80000, 30000)
        assert health["status"] == "risky"
        assert health["monthly_surplus"] < 0


# ─── VIABILITY TESTS ─────────────────────────────────────────────

class TestViability:
    def test_strong_opportunity(self):
        score = calculate_viability_score(90, 85, 80, 20, 85)
        assert score >= 80

    def test_not_recommended(self):
        score = calculate_viability_score(20, 20, 20, 90, 10)
        assert score < 50

    def test_band_mapping(self):
        assert get_score_band(85)["band"] == "Strong Opportunity"
        assert get_score_band(70)["band"] == "Viable With Conditions"
        assert get_score_band(55)["band"] == "High Caution"
        assert get_score_band(30)["band"] == "Not Recommended"


# ─── RECOMMENDATION TESTS ───────────────────────────────────────

class TestRecommendation:
    def test_not_recommended_negative_surplus(self):
        assert determine_recommendation_state(70, -5000) == "NOT_RECOMMENDED"

    def test_not_recommended_low_viability(self):
        assert determine_recommendation_state(40, 5000) == "NOT_RECOMMENDED"

    def test_recommended_with_conditions(self):
        assert determine_recommendation_state(65, 5000) == "RECOMMENDED_WITH_CONDITIONS"

    def test_recommended_with_conditions_75(self):
        assert determine_recommendation_state(75, 5000) == "RECOMMENDED_WITH_CONDITIONS"

    def test_recommended(self):
        assert determine_recommendation_state(85, 10000) == "RECOMMENDED"


# ─── FULL FINANCIAL STRUCTURE TEST ───────────────────────────────

class TestFullFinancialStructure:
    def test_end_to_end_100000(self):
        """Full pipeline: ₹1,00,000 capital → all correct outputs"""
        fin = calculate_financial_structure(100000)
        assert fin["margin_capital"] == 100000
        assert fin["project_cost"] == 1000000
        assert fin["theoretical_loan"] == 900000

        scheme = route_scheme(fin["project_cost"])
        assert scheme["scheme"] == "Term Loan Scheme"
        assert scheme["loan_amount"] == 900000
        assert scheme["loan_limit_applied"] is False

        emi = calculate_emi(scheme["loan_amount"], scheme["interest_rate"], scheme["tenure_years"])
        assert abs(emi - 14028) <= 2

    def test_end_to_end_outside_range(self):
        """Capital too high → outside range"""
        fin = calculate_financial_structure(500001)
        with pytest.raises(ValueError, match="OUTSIDE_SUPPORTED_RANGE"):
            route_scheme(fin["project_cost"])
