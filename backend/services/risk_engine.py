"""
GramDisha AI — Risk Engine (Deterministic, Zero LLM)

Four risk categories: Supply, Market, Seasonal, Financial.
risk_score is inverted: 0 = very high risk, 100 = very low risk (used in viability formula).
risk_level is the display label: Low / Medium / High.
"""


def get_risk_level(risk_label: str) -> int:
    """Convert text risk label to numeric value for scoring."""
    mapping = {"Low": 80, "Medium": 50, "High": 20}
    return mapping.get(risk_label, 50)


def calculate_overall_risk_score(
    supply_risk: str,
    market_risk: str,
    seasonal_risk: str,
    financial_risk: str,
) -> float:
    """
    Calculate overall risk_score (0-100, where 100 = very low risk).
    Higher actual risk must LOWER risk_score, which LOWERS viability.
    """
    weights = {"supply": 0.25, "market": 0.30, "seasonal": 0.20, "financial": 0.25}

    score = (
        weights["supply"] * get_risk_level(supply_risk)
        + weights["market"] * get_risk_level(market_risk)
        + weights["seasonal"] * get_risk_level(seasonal_risk)
        + weights["financial"] * get_risk_level(financial_risk)
    )

    return round(max(0, min(100, score)), 2)


def get_overall_risk_level(risk_score: float) -> str:
    """Map risk_score to display risk level."""
    if risk_score >= 70:
        return "Low"
    elif risk_score >= 40:
        return "Medium"
    else:
        return "High"


def analyze_risk(
    supply_risk: str,
    market_risk: str,
    seasonal_risk: str,
    financial_risk: str,
    business_name: str,
    financial_health_status: str = "comfortable",
) -> dict:
    """
    Full risk analysis with individual categories and overall score.
    Financial risk may be adjusted based on actual financial health.
    """
    # Adjust financial risk based on computed financial health
    if financial_health_status == "risky":
        financial_risk = "High"
    elif financial_health_status == "tight" and financial_risk == "Low":
        financial_risk = "Medium"

    risk_score = calculate_overall_risk_score(
        supply_risk, market_risk, seasonal_risk, financial_risk
    )
    overall_level = get_overall_risk_level(risk_score)

    return {
        "supply_risk": supply_risk,
        "market_risk": market_risk,
        "seasonal_risk": seasonal_risk,
        "financial_risk": financial_risk,
        "overall_risk_level": overall_level,
        "risk_score": risk_score,
        "business": business_name,
        "risk_categories": {
            "supply": {
                "level": supply_risk,
                "score": get_risk_level(supply_risk),
            },
            "market": {
                "level": market_risk,
                "score": get_risk_level(market_risk),
            },
            "seasonal": {
                "level": seasonal_risk,
                "score": get_risk_level(seasonal_risk),
            },
            "financial": {
                "level": financial_risk,
                "score": get_risk_level(financial_risk),
            },
        },
        "data_status": "calculated",
    }
