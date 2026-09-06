"""
GramDisha AI — Competition Engine (Deterministic, Zero LLM)

Maps competition scores to levels and provides structured competition analysis.
Score bands: 0-39 → Low, 40-69 → Medium, 70-100 → High.
"""


def get_competition_level(score: int) -> str:
    """Map competition score to level."""
    if score <= 39:
        return "Low"
    elif score <= 69:
        return "Medium"
    else:
        return "High"


def analyze_competition(competition_score: int, business_name: str) -> dict:
    """
    Analyze competition for a given business category.
    All values are prototype estimates — never claimed as exact real-world counts.
    """
    level = get_competition_level(competition_score)

    # Estimated competitor density based on score (prototype, not real data)
    if competition_score <= 30:
        estimated_competitors = "5-10"
    elif competition_score <= 50:
        estimated_competitors = "10-20"
    elif competition_score <= 70:
        estimated_competitors = "20-35"
    else:
        estimated_competitors = "35-50"

    return {
        "competition_level": level,
        "competition_score": competition_score,
        "estimated_competitor_range": estimated_competitors,
        "business": business_name,
        "data_status": "prototype",
        "source_type": "structured demonstration dataset",
    }
