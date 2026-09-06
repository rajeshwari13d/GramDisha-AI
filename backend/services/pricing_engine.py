"""
GramDisha AI — Pricing Engine (Prototype, Zero LLM)

suggested_price = base_price + transport_cost + operating_cost + target_margin
All prices are prototype estimates — never presented as official local market pricing.
"""

import csv
from pathlib import Path

_DATA_DIR = Path(__file__).resolve().parent.parent.parent / "data"
_PRICING: dict | None = None


def _load_pricing() -> dict:
    path = _DATA_DIR / "pricing.csv"
    data = {}
    with open(path, "r", encoding="utf-8") as f:
        reader = csv.DictReader(f)
        for row in reader:
            biz = row["business"].strip()
            if biz not in data:
                data[biz] = []
            data[biz].append({
                "product": row["product"].strip(),
                "product_hi": row["product_hi"].strip(),
                "base_price": float(row["base_price"]),
                "transport_cost": float(row["transport_cost"]),
                "operating_cost": float(row["operating_cost"]),
                "target_margin": float(row["target_margin"]),
                "unit": row["unit"].strip(),
                "unit_hi": row["unit_hi"].strip(),
                "suggested_price": (
                    float(row["base_price"])
                    + float(row["transport_cost"])
                    + float(row["operating_cost"])
                    + float(row["target_margin"])
                ),
            })
    return data


def get_pricing() -> dict:
    global _PRICING
    if _PRICING is None:
        _PRICING = _load_pricing()
    return _PRICING


def get_pricing_for_business(business_name: str) -> dict:
    """Get prototype pricing data for a business category."""
    pricing = get_pricing()

    # Try exact match, then case-insensitive
    if business_name in pricing:
        products = pricing[business_name]
    else:
        for key in pricing:
            if key.lower() == business_name.lower():
                products = pricing[key]
                break
        else:
            products = []

    return {
        "business": business_name,
        "products": products,
        "data_status": "prototype",
        "disclaimer": "Prototype suggested prices — not official local market pricing.",
        "disclaimer_hi": "प्रोटोटाइप सुझाई गई कीमतें — आधिकारिक स्थानीय बाज़ार मूल्य नहीं।",
    }
