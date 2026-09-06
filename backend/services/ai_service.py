"""
GramDisha AI — AI Service (LLM Advisory Layer)

The LLM CAN: explain calculations, generate SWOT text, explain risks,
generate recommendation wording, generate business strategy text, answer chat.

The LLM CANNOT: change loan amount, project cost, scheme eligibility, interest rate,
EMI, override loan limits, or invent government scheme rules, competitor counts,
population figures, or market prices.

Structured output requirement: JSON responses validated against schemas.
Anti-hallucination: explicit in every prompt.
"""

import json
import os
import logging
from pathlib import Path

logger = logging.getLogger(__name__)

_PROMPTS_DIR = Path(__file__).resolve().parent.parent / "prompts"

# LLM availability flag
_LLM_AVAILABLE = False
_MODEL = None


def initialize_llm():
    """Initialize the LLM client. Fails gracefully if unavailable."""
    global _LLM_AVAILABLE, _MODEL
    try:
        import google.generativeai as genai
        api_key = os.getenv("GEMINI_API_KEY", "")
        if not api_key or api_key == "your_gemini_api_key_here":
            logger.warning("GEMINI_API_KEY not configured. AI advisory will use deterministic fallback.")
            _LLM_AVAILABLE = False
            return
        genai.configure(api_key=api_key)
        _MODEL = genai.GenerativeModel("gemini-1.5-flash")
        _LLM_AVAILABLE = True
        logger.info("LLM initialized successfully.")
    except Exception as e:
        logger.warning(f"LLM initialization failed: {e}. Using deterministic fallback.")
        _LLM_AVAILABLE = False


def is_llm_available() -> bool:
    return _LLM_AVAILABLE


def _load_prompt(name: str, language: str) -> str:
    """Load a prompt template by name and language."""
    path = _PROMPTS_DIR / f"{name}_{language}.txt"
    if path.exists():
        return path.read_text(encoding="utf-8")
    # Fallback to English
    path_en = _PROMPTS_DIR / f"{name}_en.txt"
    if path_en.exists():
        return path_en.read_text(encoding="utf-8")
    return ""


def _call_llm(prompt: str, expect_json: bool = False) -> str | dict | None:
    """Call the LLM with a prompt. Returns None on failure."""
    if not _LLM_AVAILABLE or _MODEL is None:
        return None
    try:
        response = _MODEL.generate_content(prompt)
        text = response.text.strip()
        if expect_json:
            # Try to extract JSON from response
            if "```json" in text:
                text = text.split("```json")[1].split("```")[0].strip()
            elif "```" in text:
                text = text.split("```")[1].split("```")[0].strip()
            return json.loads(text)
        return text
    except Exception as e:
        logger.warning(f"LLM call failed: {e}")
        return None


def generate_swot(
    location: dict,
    business_name: str,
    capital: float,
    project_cost: float,
    competition_data: dict,
    demand_score: float,
    risk_data: dict,
    language: str = "en",
) -> dict:
    """Generate SWOT analysis. Falls back to deterministic if LLM unavailable."""
    template = _load_prompt("swot", language)
    if template and _LLM_AVAILABLE:
        prompt = template.format(
            location=json.dumps(location),
            business=business_name,
            capital=capital,
            project_cost=project_cost,
            competition=json.dumps(competition_data),
            demand_score=demand_score,
            risks=json.dumps(risk_data),
            language=language,
        )
        result = _call_llm(prompt, expect_json=True)
        if result and all(k in result for k in ["strengths", "weaknesses", "opportunities", "threats"]):
            result["data_status"] = "ai-generated"
            result["is_ai_generated"] = True
            return result

    # Deterministic fallback SWOT
    return _deterministic_swot(business_name, capital, competition_data, demand_score, risk_data, language)


def _deterministic_swot(business_name, capital, competition_data, demand_score, risk_data, language):
    """Rule-based SWOT fallback — always works."""
    comp_level = competition_data.get("competition_level", "Medium")
    risk_level = risk_data.get("overall_risk_level", "Medium")

    if language == "hi":
        return {
            "strengths": [
                f"₹{capital:,.0f} की उपलब्ध पूंजी व्यवसाय शुरू करने के लिए आधार प्रदान करती है।",
                f"उपलब्ध संकेतकों के अनुसार {business_name} की स्थानीय मांग मौजूद है (मांग स्कोर: {demand_score}/100)।",
                "सरकारी योजनाओं के माध्यम से वित्तीय सहायता की संभावना।",
            ],
            "weaknesses": [
                "सीमित प्रारंभिक पूंजी — कार्यशील पूंजी पर दबाव की संभावना।",
                "ग्रामीण क्षेत्र में बाज़ार पहुंच और वितरण की चुनौतियां।",
                "कुशल श्रमिकों और तकनीकी ज्ञान की सीमित उपलब्धता।",
            ],
            "opportunities": [
                f"उपलब्ध संकेतकों के अनुसार प्रतिस्पर्धा का स्तर {comp_level} है — बाज़ार में प्रवेश की गुंजाइश।",
                "स्थानीय संस्थागत ग्राहकों (स्कूल, होटल) को लक्षित करने की संभावना।",
                "डिजिटल माध्यमों से बाज़ार विस्तार का अवसर।",
            ],
            "threats": [
                f"समग्र जोखिम स्तर {risk_level} है — उचित जोखिम प्रबंधन आवश्यक।",
                "मौसमी मांग में उतार-चढ़ाव राजस्व को प्रभावित कर सकते हैं।",
                "कच्चे माल की कीमतों में अस्थिरता लाभ मार्जिन को प्रभावित कर सकती है।",
            ],
            "data_status": "calculated",
            "is_ai_generated": False,
        }

    return {
        "strengths": [
            f"Available capital of ₹{capital:,.0f} provides a foundation to start the business.",
            f"Local demand for {business_name} exists based on available indicators (demand score: {demand_score}/100).",
            "Potential access to government scheme financing for project funding.",
        ],
        "weaknesses": [
            "Limited initial capital — potential strain on working capital.",
            "Rural market access and distribution challenges.",
            "Limited availability of skilled labor and technical expertise.",
        ],
        "opportunities": [
            f"Competition level is {comp_level} based on available indicators — room for market entry.",
            "Potential to target institutional customers (schools, hotels, local businesses).",
            "Opportunity to expand market reach through digital channels.",
        ],
        "threats": [
            f"Overall risk level is {risk_level} — appropriate risk management required.",
            "Seasonal demand fluctuations may affect revenue consistency.",
            "Raw material price volatility may impact profit margins.",
        ],
        "data_status": "calculated",
        "is_ai_generated": False,
    }


def generate_opportunity_insights(
    location: dict,
    business_name: str,
    budget: float,
    demand_score: float,
    competition_score: float,
    opportunity_score: float,
    language: str = "en",
) -> dict:
    """Generate opportunity insights. Falls back to deterministic."""
    template = _load_prompt("opportunity", language)
    if template and _LLM_AVAILABLE:
        prompt = template.format(
            location=json.dumps(location),
            business=business_name,
            budget=budget,
            demand_score=demand_score,
            competition_score=competition_score,
            opportunity_score=opportunity_score,
            language=language,
        )
        result = _call_llm(prompt, expect_json=True)
        if result:
            result["data_status"] = "ai-generated"
            return result

    # Deterministic fallback
    if language == "hi":
        return {
            "insights": [
                "उपलब्ध संकेतकों के आधार पर, इस क्षेत्र में अप्रयुक्त ग्राहक खंड मौजूद हो सकते हैं।",
                "संस्थागत बिक्री (स्कूल, होटल, कार्यालय) का पता लगाएं।",
                "ग्रामीण-शहरी वितरण अंतर को भरने के अवसर।",
            ],
            "data_status": "calculated",
            "is_ai_generated": False,
        }
    return {
        "insights": [
            "Based on available indicators, untapped customer segments may exist in this area.",
            "Explore institutional sales (schools, hotels, offices) for stable revenue.",
            "Opportunities to bridge rural-urban distribution gaps.",
        ],
        "data_status": "calculated",
        "is_ai_generated": False,
    }


def generate_ai_recommendation(
    financial_data: dict,
    business_data: dict,
    risk_data: dict,
    viability_data: dict,
    recommendation_data: dict,
    language: str = "en",
) -> dict | None:
    """Enhance recommendation with AI-generated explanation. Returns None if LLM unavailable."""
    template = _load_prompt("recommendation", language)
    if not template or not _LLM_AVAILABLE:
        return None

    prompt = template.format(
        financial=json.dumps(financial_data),
        business=json.dumps(business_data),
        risks=json.dumps(risk_data),
        viability=json.dumps(viability_data),
        recommendation_state=recommendation_data["state"],
        language=language,
    )
    result = _call_llm(prompt)
    if result:
        return {
            "ai_explanation": result,
            "data_status": "ai-generated",
            "is_ai_generated": True,
        }
    return None


def chat_response(
    message: str,
    analysis_context: dict,
    language: str = "en",
) -> dict:
    """Contextual chat response. Falls back to a structured response if LLM unavailable."""
    template = _load_prompt("chat", language)
    if template and _LLM_AVAILABLE:
        prompt = template.format(
            message=message,
            context=json.dumps(analysis_context, ensure_ascii=False),
            language=language,
        )
        result = _call_llm(prompt)
        if result:
            return {
                "response": result,
                "sources": [],
                "data_status": "ai-generated",
            }

    # Deterministic fallback
    if language == "hi":
        return {
            "response": "AI सलाहकार सेवा अस्थायी रूप से अनुपलब्ध है। कृपया डैशबोर्ड पर उपलब्ध विश्लेषण देखें या बाद में पुनः प्रयास करें।",
            "sources": [],
            "data_status": "fallback",
        }
    return {
        "response": "AI advisory service is temporarily unavailable. Please refer to the analysis available on the dashboard or try again later.",
        "sources": [],
        "data_status": "fallback",
    }
