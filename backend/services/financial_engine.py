"""
GramDisha AI — Financial Engine (Deterministic, Pure Code, Zero LLM)

Computes project cost, theoretical loan, and margin from entrepreneur's available capital.
These calculations are the financial foundation — never modified by AI/LLM.
"""


def calculate_project_cost(margin_capital: float) -> float:
    """
    Project Cost = Margin Capital / 0.10  (i.e. margin_capital × 10)
    The entrepreneur's own contribution is 10% of the project cost.
    """
    if margin_capital <= 0:
        raise ValueError("Capital must be greater than zero.")
    return round(margin_capital / 0.10, 2)


def calculate_theoretical_loan(project_cost: float) -> float:
    """
    Theoretical Loan = 90% of Project Cost (before scheme limits).
    """
    return round(project_cost * 0.90, 2)


def calculate_financial_structure(margin_capital: float) -> dict:
    """
    Full financial structure from margin capital.
    Returns project cost, theoretical loan, and margin amount.
    """
    if margin_capital <= 0:
        raise ValueError("Capital must be greater than zero.")

    project_cost = calculate_project_cost(margin_capital)
    theoretical_loan = calculate_theoretical_loan(project_cost)

    return {
        "margin_capital": round(margin_capital, 2),
        "project_cost": project_cost,
        "theoretical_loan": theoretical_loan,
        "margin_percentage": 10.0,
        "loan_percentage": 90.0,
        "data_status": "calculated",
    }
