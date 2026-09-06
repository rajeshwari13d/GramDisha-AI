"""
GramDisha AI — Business Data Engine (Prototype Dataset, Zero LLM)

Loads and serves structured business category data from the prototype dataset.
Every record is tagged with data_type: "prototype" and source_type metadata.
"""

import json
from pathlib import Path

_DATA_DIR = Path(__file__).resolve().parent.parent.parent / "data"
_BUSINESSES: dict | None = None


def _load_businesses() -> dict:
    path = _DATA_DIR / "businesses.json"
    with open(path, "r", encoding="utf-8") as f:
        data = json.load(f)
    # Index by id for O(1) lookup
    return {cat["id"]: cat for cat in data["categories"]}


def get_businesses() -> dict:
    global _BUSINESSES
    if _BUSINESSES is None:
        _BUSINESSES = _load_businesses()
    return _BUSINESSES


def get_business_data(business_id: str) -> dict:
    """Get full data for a specific business category."""
    businesses = get_businesses()
    business_id = business_id.lower().replace(" ", "_")

    # Also try matching by name
    if business_id not in businesses:
        for key, val in businesses.items():
            if val["name"].lower() == business_id.replace("_", " "):
                business_id = key
                break

    if business_id not in businesses:
        raise ValueError(f"UNSUPPORTED_BUSINESS: '{business_id}' is not a supported business category.")

    return businesses[business_id]


def get_all_categories() -> list[dict]:
    """Return a list of all supported business categories (id, name, name_hi, icon)."""
    businesses = get_businesses()
    return [
        {
            "id": b["id"],
            "name": b["name"],
            "name_hi": b["name_hi"],
            "icon": b["icon"],
        }
        for b in businesses.values()
    ]


def get_market_reach(business_id: str) -> dict:
    """Get market reach data for a business category."""
    data = get_business_data(business_id)
    radius = data["typical_market_radius_km"]
    return {
        "primary_radius_km": radius["primary"],
        "secondary_radius_km": radius["secondary"],
        "customer_segments": data["customer_segments"],
        "customer_segments_hi": data["customer_segments_hi"],
        "data_status": "prototype",
    }


def get_revenue_cost_estimates(business_id: str) -> dict:
    """Get estimated revenue and cost data for a business category."""
    data = get_business_data(business_id)
    return {
        "estimated_monthly_revenue": data["estimated_monthly_revenue"],
        "estimated_operating_cost": data["estimated_operating_cost"],
        "data_status": "prototype",
    }
