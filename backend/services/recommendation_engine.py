"""
GramDisha AI — Recommendation Engine (Deterministic Fallback + AI Enhancement)

MANDATORY deterministic fallback that works with LLM fully disabled:
  IF financial_surplus < 0:            → NOT_RECOMMENDED
  ELSE IF viability_score < 50:        → NOT_RECOMMENDED
  ELSE IF viability_score < 80:        → RECOMMENDED_WITH_CONDITIONS
  ELSE:                                → RECOMMENDED

The LLM enriches the explanation, but the base recommendation state NEVER depends on it.
"""


RECOMMENDATION_STATES = {
    "RECOMMENDED": {
        "state": "RECOMMENDED",
        "emoji": "✅",
        "label": "Recommended",
        "label_hi": "अनुशंसित",
    },
    "RECOMMENDED_WITH_CONDITIONS": {
        "state": "RECOMMENDED_WITH_CONDITIONS",
        "emoji": "⚠️",
        "label": "Recommended with Conditions",
        "label_hi": "शर्तों के साथ अनुशंसित",
    },
    "NOT_RECOMMENDED": {
        "state": "NOT_RECOMMENDED",
        "emoji": "❌",
        "label": "Not Recommended",
        "label_hi": "अनुशंसित नहीं",
    },
}


def determine_recommendation_state(
    viability_score: float,
    financial_surplus: float,
) -> str:
    """
    Deterministic recommendation logic — MUST work without LLM.
    """
    if financial_surplus < 0:
        return "NOT_RECOMMENDED"
    elif viability_score < 50:
        return "NOT_RECOMMENDED"
    elif viability_score < 80:
        return "RECOMMENDED_WITH_CONDITIONS"
    else:
        return "RECOMMENDED"


def generate_deterministic_advice(
    state: str,
    business_name: str,
    viability_score: float,
    financial_health: dict,
    risk_data: dict,
    competition_data: dict,
    opportunity_data: dict,
    language: str = "en",
) -> dict:
    """
    Generate structured, actionable advice without LLM.
    Grounded in the actual computed data, not generic text.
    """
    advice = {"do": [], "avoid": [], "conditions": [], "alternatives": []}

    if language == "hi":
        return _generate_hindi_advice(
            state, business_name, viability_score, financial_health,
            risk_data, competition_data, opportunity_data, advice
        )

    # --- English advice ---
    if state == "RECOMMENDED":
        advice["do"] = [
            f"Start {business_name} business with confidence — viability score is strong ({viability_score}/100).",
            "Maintain 3 months' working capital reserve before starting operations.",
            "Build relationships with multiple suppliers to reduce supply dependency.",
        ]
        if competition_data.get("competition_level") == "Low":
            advice["do"].append("Leverage low competition to establish market presence early.")
        if opportunity_data.get("opportunity_level") == "High":
            advice["do"].append("Capitalize on strong opportunity indicators — consider scaling within 6-12 months.")

    elif state == "RECOMMENDED_WITH_CONDITIONS":
        surplus = financial_health.get("monthly_surplus", 0)
        advice["conditions"] = [
            f"Viability score is {viability_score}/100 — proceed with careful planning.",
        ]
        if surplus < financial_health.get("estimated_monthly_revenue", 0) * 0.30:
            advice["conditions"].append(
                "Monthly surplus is tight — maintain strict cost control and build an emergency fund."
            )
        if risk_data.get("overall_risk_level") in ["Medium", "High"]:
            advice["conditions"].append(
                f"Overall risk is {risk_data.get('overall_risk_level')} — implement risk mitigation measures before scaling."
            )
        if competition_data.get("competition_level") == "High":
            advice["conditions"].append(
                "High competition detected — differentiate through quality, pricing, or niche customer segments."
            )

        advice["do"] = [
            f"Start {business_name} with a lean setup to validate demand before investing fully.",
            "Diversify customer base — avoid dependence on a single buyer.",
            "Review loan size if projected surplus is insufficient.",
        ]

    else:  # NOT_RECOMMENDED
        surplus = financial_health.get("monthly_surplus", 0)
        advice["do"] = [
            "Consider alternative business categories with stronger viability in this location.",
            "Review your capital allocation — you may need additional margin or a smaller project scope.",
        ]
        if surplus < 0:
            advice["avoid"].append(
                f"Starting {business_name} under current financial projections — estimated monthly surplus is ₹{surplus:,.0f} (negative). "
                "The business may struggle to service the proposed loan."
            )
        else:
            advice["avoid"].append(
                f"Proceeding with {business_name} without addressing the key risks — viability score is only {viability_score}/100."
            )

    advice["avoid"] = advice["avoid"] or [
        "Dependency on a single raw material supplier.",
        "Over-investment in fixed assets before confirming market demand.",
        "Ignoring seasonal demand fluctuations in revenue planning.",
    ]

    return advice


def _generate_hindi_advice(
    state, business_name, viability_score, financial_health,
    risk_data, competition_data, opportunity_data, advice
):
    """Hindi advice generation — mirrors English logic."""
    if state == "RECOMMENDED":
        advice["do"] = [
            f"{business_name} व्यवसाय शुरू करें — व्यवहार्यता स्कोर मजबूत है ({viability_score}/100)।",
            "परिचालन शुरू करने से पहले 3 महीने की कार्यशील पूंजी रिज़र्व रखें।",
            "आपूर्ति निर्भरता कम करने के लिए कई आपूर्तिकर्ताओं से संबंध बनाएं।",
        ]
        if competition_data.get("competition_level") == "Low":
            advice["do"].append("कम प्रतिस्पर्धा का लाभ उठाकर जल्दी बाज़ार में पैर जमाएं।")

    elif state == "RECOMMENDED_WITH_CONDITIONS":
        surplus = financial_health.get("monthly_surplus", 0)
        advice["conditions"] = [
            f"व्यवहार्यता स्कोर {viability_score}/100 है — सावधानीपूर्वक योजना बनाकर आगे बढ़ें।",
        ]
        if surplus < financial_health.get("estimated_monthly_revenue", 0) * 0.30:
            advice["conditions"].append("मासिक बचत कम है — लागत नियंत्रण बनाए रखें और आपातकालीन कोष बनाएं।")
        if risk_data.get("overall_risk_level") in ["Medium", "High"]:
            advice["conditions"].append(f"समग्र जोखिम {risk_data.get('overall_risk_level')} है — विस्तार से पहले जोखिम कम करने के उपाय अपनाएं।")

        advice["do"] = [
            f"{business_name} को छोटे पैमाने पर शुरू करें और मांग की पुष्टि करें।",
            "ग्राहक आधार विविध रखें — एक ही खरीदार पर निर्भर न रहें।",
            "यदि अनुमानित बचत अपर्याप्त हो तो लोन की राशि की समीक्षा करें।",
        ]

    else:  # NOT_RECOMMENDED
        surplus = financial_health.get("monthly_surplus", 0)
        advice["do"] = [
            "इस स्थान पर बेहतर व्यवहार्यता वाले वैकल्पिक व्यवसायों पर विचार करें।",
            "अपनी पूंजी आवंटन की समीक्षा करें — आपको अधिक मार्जिन या छोटी परियोजना की आवश्यकता हो सकती है।",
        ]
        if surplus < 0:
            advice["avoid"] = [
                f"वर्तमान वित्तीय अनुमानों में {business_name} शुरू करना — अनुमानित मासिक बचत ₹{surplus:,.0f} (नकारात्मक)। व्यवसाय प्रस्तावित लोन चुकाने में कठिनाई का सामना कर सकता है।"
            ]
        else:
            advice["avoid"] = [
                f"मुख्य जोखिमों को संबोधित किए बिना {business_name} शुरू करना — व्यवहार्यता स्कोर केवल {viability_score}/100 है।"
            ]

    advice["avoid"] = advice["avoid"] or [
        "एकल कच्चे माल आपूर्तिकर्ता पर निर्भरता।",
        "बाज़ार की मांग सुनिश्चित करने से पहले अचल संपत्तियों में अधिक निवेश।",
        "राजस्व योजना में मौसमी मांग के उतार-चढ़ाव की अनदेखी।",
    ]

    return advice


def generate_recommendation(
    viability_score: float,
    financial_health: dict,
    risk_data: dict,
    competition_data: dict,
    opportunity_data: dict,
    business_name: str,
    language: str = "en",
) -> dict:
    """
    Full recommendation output — deterministic state + actionable advice.
    Works without LLM.
    """
    surplus = financial_health.get("monthly_surplus", 0)
    state = determine_recommendation_state(viability_score, surplus)
    state_info = RECOMMENDATION_STATES[state]

    advice = generate_deterministic_advice(
        state, business_name, viability_score, financial_health,
        risk_data, competition_data, opportunity_data, language
    )

    return {
        "state": state,
        "emoji": state_info["emoji"],
        "label": state_info["label"],
        "label_hi": state_info["label_hi"],
        "viability_score": viability_score,
        "advice": advice,
        "business": business_name,
        "is_ai_enhanced": False,
        "data_status": "calculated",
    }
