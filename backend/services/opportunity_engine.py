"""
GramDisha AI — Opportunity Engine (Deterministic, Zero LLM)

Opportunity = 0.35*demand + 0.25*(100 - competition) + 0.15*accessibility + 0.25*profit_potential
Normalized to 0-100.
"""


# Configurable weights
OPPORTUNITY_WEIGHTS = {
    "demand": 0.35,
    "inverse_competition": 0.25,
    "accessibility": 0.15,
    "profit_potential": 0.25,
}


def calculate_opportunity_score(
    demand_score: float,
    competition_score: float,
    accessibility_score: float,
    profit_potential_score: float,
) -> float:
    """
    Calculate opportunity score using weighted formula.
    Competition is inverted (100 - score) so higher competition lowers opportunity.
    """
    w = OPPORTUNITY_WEIGHTS
    inverse_competition = 100 - competition_score

    raw = (
        w["demand"] * demand_score
        + w["inverse_competition"] * inverse_competition
        + w["accessibility"] * accessibility_score
        + w["profit_potential"] * profit_potential_score
    )

    # Clamp to 0-100
    return round(max(0, min(100, raw)), 2)


def analyze_opportunity(
    demand_score: float,
    competition_score: float,
    accessibility_score: float,
    profit_potential_score: float,
    business_name: str,
) -> dict:
    """Full opportunity analysis with score and component breakdown."""
    score = calculate_opportunity_score(
        demand_score, competition_score, accessibility_score, profit_potential_score
    )

    # Opportunity level
    if score >= 75:
        level = "High"
    elif score >= 50:
        level = "Medium"
    else:
        level = "Low"

    return {
        "opportunity_score": score,
        "opportunity_level": level,
        "components": {
            "demand_contribution": round(OPPORTUNITY_WEIGHTS["demand"] * demand_score, 2),
            "competition_contribution": round(
                OPPORTUNITY_WEIGHTS["inverse_competition"] * (100 - competition_score), 2
            ),
            "accessibility_contribution": round(
                OPPORTUNITY_WEIGHTS["accessibility"] * accessibility_score, 2
            ),
            "profit_potential_contribution": round(
                OPPORTUNITY_WEIGHTS["profit_potential"] * profit_potential_score, 2
            ),
        },
        "business": business_name,
        "data_status": "calculated",
    }
