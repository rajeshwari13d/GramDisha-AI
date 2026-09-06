"""
GramDisha AI — EMI Engine (Deterministic, Pure Code, Zero LLM)

Standard EMI formula, monthly amortization schedule, quarterly aggregation,
and financial health indicator.
"""

import math


def calculate_emi(principal: float, annual_interest_rate: float, tenure_years: int) -> float:
    """
    EMI = P × r × (1+r)^n / ((1+r)^n − 1)
    Where P = principal, r = monthly rate, n = total months.
    """
    if principal <= 0:
        return 0.0
    if annual_interest_rate <= 0:
        # Zero-interest: simple division
        n = tenure_years * 12
        return round(principal / n, 2) if n > 0 else 0.0

    r = annual_interest_rate / 12 / 100  # monthly interest rate
    n = tenure_years * 12  # total months

    if n <= 0:
        return 0.0

    numerator = principal * r * math.pow(1 + r, n)
    denominator = math.pow(1 + r, n) - 1

    if denominator == 0:
        return 0.0

    emi = numerator / denominator
    return round(emi, 2)


def generate_amortization_schedule(
    principal: float, annual_interest_rate: float, tenure_years: int
) -> list[dict]:
    """
    Generate a monthly amortization schedule.
    Returns list of monthly records with opening/closing principal, interest, principal repayment.
    """
    emi = calculate_emi(principal, annual_interest_rate, tenure_years)
    if emi <= 0:
        return []

    r = annual_interest_rate / 12 / 100
    n = tenure_years * 12
    schedule = []
    balance = principal

    for month in range(1, n + 1):
        interest_payment = round(balance * r, 2)
        principal_payment = round(emi - interest_payment, 2)

        # Adjust last month for rounding
        if month == n:
            principal_payment = round(balance, 2)
            emi_adjusted = principal_payment + interest_payment
        else:
            emi_adjusted = emi

        closing_balance = round(balance - principal_payment, 2)
        if closing_balance < 0:
            closing_balance = 0.0

        schedule.append({
            "month": month,
            "opening_balance": round(balance, 2),
            "emi": round(emi_adjusted, 2),
            "interest": interest_payment,
            "principal_repayment": principal_payment,
            "closing_balance": closing_balance,
        })

        balance = closing_balance

    return schedule


def aggregate_quarterly(schedule: list[dict]) -> list[dict]:
    """
    Aggregate monthly amortization to quarterly summaries.
    """
    quarters = []
    for i in range(0, len(schedule), 3):
        quarter_months = schedule[i : i + 3]
        q_num = (i // 3) + 1
        year = ((q_num - 1) // 4) + 1
        q_in_year = ((q_num - 1) % 4) + 1

        closing_balance = quarter_months[-1]["closing_balance"] if quarter_months else 0.0

        quarters.append({
            "quarter": f"Y{year}-Q{q_in_year}",
            "quarter_number": q_num,
            "principal": round(sum(m["principal_repayment"] for m in quarter_months), 2),
            "interest": round(sum(m["interest"] for m in quarter_months), 2),
            "total_payment": round(sum(m["emi"] for m in quarter_months), 2),
            "remaining_balance": closing_balance,
        })

    return quarters


def calculate_financial_health(
    estimated_monthly_revenue: float,
    operating_cost: float,
    emi: float,
) -> dict:
    """
    Financial Health Indicator:
    - 🟢 Comfortable: surplus ≥ 30% of revenue
    - 🟡 Tight: 0 ≤ surplus < 30% of revenue
    - 🔴 Risky: surplus < 0
    """
    monthly_surplus = estimated_monthly_revenue - operating_cost - emi

    if estimated_monthly_revenue > 0:
        surplus_ratio = monthly_surplus / estimated_monthly_revenue
    else:
        surplus_ratio = -1.0  # No revenue = risky

    if monthly_surplus < 0:
        status = "risky"
        color = "red"
        emoji = "🔴"
    elif surplus_ratio >= 0.30:
        status = "comfortable"
        color = "green"
        emoji = "🟢"
    else:
        status = "tight"
        color = "yellow"
        emoji = "🟡"

    return {
        "monthly_surplus": round(monthly_surplus, 2),
        "surplus_ratio": round(surplus_ratio, 4),
        "status": status,
        "color": color,
        "emoji": emoji,
        "estimated_monthly_revenue": round(estimated_monthly_revenue, 2),
        "operating_cost": round(operating_cost, 2),
        "emi": round(emi, 2),
        "data_status": "calculated",
    }


def calculate_financial_score(
    monthly_surplus: float,
    estimated_monthly_revenue: float,
    loan_amount: float,
    project_cost: float,
    margin_capital: float,
    operating_cost: float,
) -> float:
    """
    Financial component score (0-100) for viability calculation.
    Incorporates: financial health, EMI burden, loan-to-project ratio, capital adequacy.
    """
    score = 50.0  # baseline

    # Surplus component (up to +25)
    if estimated_monthly_revenue > 0:
        surplus_ratio = monthly_surplus / estimated_monthly_revenue
        if surplus_ratio >= 0.30:
            score += 25
        elif surplus_ratio >= 0.15:
            score += 15
        elif surplus_ratio >= 0:
            score += 5
        else:
            score -= 20

    # Loan-to-project ratio component (up to +15)
    if project_cost > 0:
        ltp = loan_amount / project_cost
        if ltp <= 0.70:
            score += 15
        elif ltp <= 0.85:
            score += 10
        elif ltp <= 0.90:
            score += 5
        else:
            score -= 5

    # Capital adequacy: working capital remaining after contribution (up to +10)
    working_capital_months = 0
    if operating_cost > 0:
        # Assume entrepreneur keeps some capital for working expenses
        remaining = max(0, margin_capital * 0.2)  # 20% of margin as reserve
        working_capital_months = remaining / operating_cost

    if working_capital_months >= 3:
        score += 10
    elif working_capital_months >= 1:
        score += 5
    else:
        score -= 10

    return max(0, min(100, round(score, 2)))
