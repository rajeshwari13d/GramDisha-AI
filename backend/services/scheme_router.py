"""
GramDisha AI — Scheme Router (Configurable Rules, Deterministic, Zero LLM)

Routes a project cost to the appropriate government scheme and applies loan limits.
Scheme data is loaded from data/schemes.json — not hardcoded inline.
"""

import json
import os
from pathlib import Path

# Load scheme rules from data file
_DATA_DIR = Path(__file__).resolve().parent.parent.parent / "data"


def _load_schemes() -> list[dict]:
    schemes_path = _DATA_DIR / "schemes.json"
    with open(schemes_path, "r", encoding="utf-8") as f:
        return json.load(f)


# Cache loaded schemes
_SCHEMES: list[dict] | None = None


def get_schemes() -> list[dict]:
    global _SCHEMES
    if _SCHEMES is None:
        _SCHEMES = _load_schemes()
    return _SCHEMES


def reload_schemes():
    """Force reload schemes from disk (for testing)."""
    global _SCHEMES
    _SCHEMES = None


def route_scheme(project_cost: float) -> dict:
    """
    Determine the applicable scheme for a given project cost.

    Returns scheme details with the actual (clamped) loan amount.
    Raises ValueError for costs outside the supported range.
    """
    if project_cost <= 0:
        raise ValueError("Project cost must be greater than zero.")

    schemes = get_schemes()

    for scheme in schemes:
        if scheme["min_project_cost"] <= project_cost <= scheme["max_project_cost"]:
            theoretical_loan = round(project_cost * (scheme["loan_percentage"] / 100), 2)
            max_loan = scheme["max_loan"]

            # Critical: apply loan clamp
            actual_loan = min(theoretical_loan, max_loan)
            loan_limit_applied = actual_loan < theoretical_loan

            return {
                "scheme": scheme["scheme"],
                "scheme_hi": scheme.get("scheme_hi", scheme["scheme"]),
                "loan_amount": round(actual_loan, 2),
                "theoretical_loan": theoretical_loan,
                "loan_limit_applied": loan_limit_applied,
                "max_loan": max_loan,
                "interest_rate": scheme["interest_rate"],
                "tenure_years": scheme["tenure_years"],
                "moratorium_months": scheme["moratorium_months"],
                "loan_percentage": scheme["loan_percentage"],
                "source": scheme["source"],
                "source_status": scheme["source_status"],
                "data_status": "calculated",
            }

    # Outside supported range
    raise ValueError(
        f"OUTSIDE_SUPPORTED_RANGE: Project cost ₹{project_cost:,.2f} exceeds "
        f"the maximum supported project cost of ₹50,00,000."
    )
