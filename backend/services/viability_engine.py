"""
GramDisha AI — Viability Engine (Deterministic, Zero LLM)

Viability = 0.30(Demand) + 0.20(Financial) + 0.20(Opportunity) + 0.15(Competition) + 0.15(Risk)

Competition component = 100 − raw_competition_score (higher competition reduces score)
Risk component = risk_score (where 100 = very low risk)

Score bands:
  80-100 → Strong Opportunity 🟢
  65-79  → Viable With Conditions 🟡
  50-64  → High Caution 🟠
  0-49   → Not Recommended 🔴
"""

# Configurable weights
VIABILITY_WEIGHTS = {
    "demand": 0.30,
    "financial": 0.20,
    "opportunity": 0.20,
    "competition": 0.15,
    "risk": 0.15,
}

SCORE_BANDS = [
    {"min": 80, "max": 100, "band": "Strong Opportunity", "band_hi": "मजबूत अवसर", "color": "green", "emoji": "🟢"},
    {"min": 65, "max": 79, "band": "Viable With Conditions", "band_hi": "शर्तों के साथ व्यवहार्य", "color": "yellow", "emoji": "🟡"},
    {"min": 50, "max": 64, "band": "High Caution", "band_hi": "उच्च सावधानी", "color": "orange", "emoji": "🟠"},
    {"min": 0, "max": 49, "band": "Not Recommended", "band_hi": "अनुशंसित नहीं", "color": "red", "emoji": "🔴"},
]


def calculate_viability_score(
    demand_score: float,
    financial_score: float,
    opportunity_score: float,
    competition_score: float,
    risk_score: float,
) -> float:
    """
    Calculate viability score using configurable weights.
    competition_component = 100 - raw_competition_score
    risk_component = risk_score (already inverted: 100 = very low risk)
    """
    w = VIABILITY_WEIGHTS

    competition_component = 100 - competition_score

    raw = (
        w["demand"] * demand_score
        + w["financial"] * financial_score
        + w["opportunity"] * opportunity_score
        + w["competition"] * competition_component
        + w["risk"] * risk_score
    )

    return round(max(0, min(100, raw)), 2)


def get_score_band(score: float) -> dict:
    """Map viability score to its band."""
    for band in SCORE_BANDS:
        if band["min"] <= score <= band["max"]:
            return {
                "band": band["band"],
                "band_hi": band["band_hi"],
                "color": band["color"],
                "emoji": band["emoji"],
            }
    return SCORE_BANDS[-1]  # Default to Not Recommended


def analyze_viability(
    demand_score: float,
    financial_score: float,
    opportunity_score: float,
    competition_score: float,
    risk_score: float,
    business_name: str,
) -> dict:
    """Full viability analysis with score, band, and component breakdown."""
    w = VIABILITY_WEIGHTS
    score = calculate_viability_score(
        demand_score, financial_score, opportunity_score, competition_score, risk_score
    )
    band_info = get_score_band(score)

    return {
        "viability_score": score,
        "band": band_info["band"],
        "band_hi": band_info["band_hi"],
        "color": band_info["color"],
        "emoji": band_info["emoji"],
        "business": business_name,
        "weights": VIABILITY_WEIGHTS,
        "components": {
            "demand": {"score": demand_score, "weight": w["demand"], "contribution": round(w["demand"] * demand_score, 2)},
            "financial": {"score": financial_score, "weight": w["financial"], "contribution": round(w["financial"] * financial_score, 2)},
            "opportunity": {"score": opportunity_score, "weight": w["opportunity"], "contribution": round(w["opportunity"] * opportunity_score, 2)},
            "competition": {"raw_score": competition_score, "inverted": round(100 - competition_score, 2), "weight": w["competition"], "contribution": round(w["competition"] * (100 - competition_score), 2)},
            "risk": {"score": risk_score, "weight": w["risk"], "contribution": round(w["risk"] * risk_score, 2)},
        },
        "data_status": "calculated",
    }
