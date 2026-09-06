"""
GramDisha AI — FastAPI Backend

Architecture:
  USER INPUT → REACT → BACKEND → DETERMINISTIC ENGINES → AI ADVISORY → RESPONSE

The LLM CANNOT change any financial value. This is enforced architecturally.
"""

import json
import os
import uuid
import logging
from pathlib import Path
from datetime import datetime

from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from fastapi.responses import FileResponse, JSONResponse
from dotenv import load_dotenv

load_dotenv()

from schemas.schemas import (
    AnalysisRequest, FinancialRequest, BusinessRequest,
    ComparisonRequest, ChatRequest, ErrorResponse, HealthResponse,
)
from services.financial_engine import calculate_financial_structure
from services.scheme_router import route_scheme
from services.emi_engine import (
    calculate_emi, aggregate_quarterly, calculate_financial_health,
    calculate_financial_score, generate_amortization_schedule,
)
from services.business_engine import get_business_data, get_all_categories, get_market_reach, get_revenue_cost_estimates
from services.competition_engine import analyze_competition
from services.opportunity_engine import analyze_opportunity
from services.risk_engine import analyze_risk
from services.viability_engine import analyze_viability
from services.recommendation_engine import generate_recommendation
from services.pricing_engine import get_pricing_for_business
from services.ai_service import (
    initialize_llm, is_llm_available, generate_swot,
    generate_opportunity_insights, generate_ai_recommendation, chat_response,
)
from services.report_service import generate_report

# ─── Setup ───────────────────────────────────────────────────────
logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)

app = FastAPI(
    title="GramDisha AI",
    description="AI-Driven Hyper-Local Business Advisory and Financial Structuring Assistant",
    version="1.0.0",
)

app.add_middleware(
    CORSMiddleware,
    allow_origins=[os.getenv("FRONTEND_URL", "http://localhost:5173"), "http://localhost:5173", "http://localhost:3000"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# In-memory analysis store (MVP — Firestore in production)
_analysis_store: dict[str, dict] = {}

# Initialize LLM on startup
@app.on_event("startup")
async def startup():
    initialize_llm()
    logger.info("GramDisha AI backend started.")


# ─── Error Helpers ───────────────────────────────────────────────

def error_response(error_code: str, message: str, status_code: int = 400):
    return JSONResponse(
        status_code=status_code,
        content={"success": False, "error_code": error_code, "message": message},
    )


# ─── SUPPORTED BUSINESSES ───────────────────────────────────────

SUPPORTED_BUSINESSES = [
    "dairy", "retail", "poultry", "textile", "food_processing",
    "tailoring", "agriculture", "small_manufacturing",
    "service_business", "handicraft",
]

def normalize_business(name: str) -> str:
    """Normalize business name to internal ID."""
    n = name.lower().strip().replace(" ", "_")
    # Handle common display names
    aliases = {
        "food processing": "food_processing",
        "small manufacturing": "small_manufacturing",
        "service business": "service_business",
    }
    if n in aliases:
        return aliases[n]
    # Try partial matching
    for b in SUPPORTED_BUSINESSES:
        if b == n or b.replace("_", "") == n.replace("_", ""):
            return b
    return n


# ─── Health Check ────────────────────────────────────────────────

@app.get("/api/health")
async def health_check():
    return {
        "status": "healthy",
        "version": "1.0.0",
        "llm_available": is_llm_available(),
        "timestamp": datetime.now().isoformat(),
    }


# ─── GET categories ─────────────────────────────────────────────

@app.get("/api/categories")
async def get_categories():
    return {"success": True, "categories": get_all_categories()}


# ─── GET locations ──────────────────────────────────────────────

@app.get("/api/locations")
async def get_locations():
    loc_file = Path(__file__).resolve().parent.parent / "data" / "locations.json"
    if loc_file.exists():
        with open(loc_file, "r", encoding="utf-8") as f:
            loc_data = json.load(f)
    else:
        loc_data = {"states": []}
    return {
        "success": True,
        "locations": loc_data,
        "states": loc_data.get("states", []),
    }


# ─── POST /api/financial/calculate ────────────────────────────────

@app.post("/api/financial/calculate")
async def financial_calculate(req: FinancialRequest):
    try:
        # Core financial structure (deterministic)
        fin = calculate_financial_structure(req.capital)

        # Route to scheme
        scheme = route_scheme(fin["project_cost"])

        # Calculate EMI
        emi = calculate_emi(
            scheme["loan_amount"],
            scheme["interest_rate"],
            scheme["tenure_years"],
        )

        return {
            "success": True,
            "project_cost": fin["project_cost"],
            "theoretical_loan": fin["theoretical_loan"],
            "loan_amount": scheme["loan_amount"],
            "scheme": scheme["scheme"],
            "scheme_hi": scheme["scheme_hi"],
            "estimated_emi": emi,
            "data": {
                "margin": fin["margin_capital"],
                "project_cost": fin["project_cost"],
                "theoretical_loan": fin["theoretical_loan"],
                "loan_amount": scheme["loan_amount"],
                "scheme": scheme["scheme"],
                "scheme_hi": scheme["scheme_hi"],
                "interest_rate": scheme["interest_rate"],
                "tenure_years": scheme["tenure_years"],
                "moratorium_months": scheme["moratorium_months"],
                "estimated_emi": emi,
                "loan_limit_applied": scheme["loan_limit_applied"],
                "data_status": "calculated",
            },
        }
    except ValueError as e:
        msg = str(e)
        if "OUTSIDE_SUPPORTED_RANGE" in msg:
            return error_response("OUTSIDE_SUPPORTED_RANGE", msg)
        return error_response("FINANCIAL_CALCULATION_ERROR", msg)


# ─── POST /api/business/analyze ───────────────────────────────────

@app.post("/api/business/analyze")
async def business_analyze(req: BusinessRequest):
    biz_id = normalize_business(req.business)
    if biz_id not in SUPPORTED_BUSINESSES:
        return error_response("UNSUPPORTED_BUSINESS", f"'{req.business}' is not supported.")

    try:
        data = get_business_data(biz_id)
        competition = analyze_competition(data["competition_score"], data["name"])
        market = get_market_reach(biz_id)
        opportunity = analyze_opportunity(
            data["demand_score"], data["competition_score"],
            data["accessibility_score"], data["profit_potential_score"],
            data["name"],
        )

        return {
            "success": True,
            "data": {
                "demand_score": data["demand_score"],
                "competition_score": data["competition_score"],
                "competition_level": competition["competition_level"],
                "opportunity_score": opportunity["opportunity_score"],
                "risk_score": data["risk_score"],
                "market_reach": f"{market['primary_radius_km']}-{market['secondary_radius_km']} km",
                "customer_segments": data["customer_segments"],
                "customer_segments_hi": data["customer_segments_hi"],
                "data_status": "prototype",
            },
        }
    except ValueError as e:
        return error_response("UNSUPPORTED_BUSINESS", str(e))


# ─── POST /api/analyze (FULL ANALYSIS) ───────────────────────────

@app.post("/api/analyze")
async def full_analysis(req: AnalysisRequest):
    # Validate language
    if req.language not in ("en", "hi"):
        return error_response("UNSUPPORTED_LANGUAGE", "Only 'en' and 'hi' are supported.")

    biz_id = normalize_business(req.business)
    if biz_id not in SUPPORTED_BUSINESSES:
        return error_response("UNSUPPORTED_BUSINESS", f"'{req.business}' is not supported.")

    try:
        # ── 1. Financial Engine (deterministic) ──
        fin = calculate_financial_structure(req.capital)
        scheme = route_scheme(fin["project_cost"])
        emi = calculate_emi(scheme["loan_amount"], scheme["interest_rate"], scheme["tenure_years"])
        quarterly = aggregate_quarterly(
            generate_amortization_schedule(scheme["loan_amount"], scheme["interest_rate"], scheme["tenure_years"])
        )

        # ── 2. Business Data Engine ──
        biz_data = get_business_data(biz_id)
        revenue_cost = get_revenue_cost_estimates(biz_id)
        market = get_market_reach(biz_id)
        pricing = get_pricing_for_business(biz_data["name"])

        # ── 3. Competition Engine ──
        competition = analyze_competition(biz_data["competition_score"], biz_data["name"])

        # ── 4. Opportunity Engine ──
        opportunity = analyze_opportunity(
            biz_data["demand_score"], biz_data["competition_score"],
            biz_data["accessibility_score"], biz_data["profit_potential_score"],
            biz_data["name"],
        )

        # ── 5. Financial Health ──
        health = calculate_financial_health(
            revenue_cost["estimated_monthly_revenue"],
            revenue_cost["estimated_operating_cost"],
            emi,
        )

        # ── 6. Risk Engine ──
        risk = analyze_risk(
            biz_data["supply_risk"], biz_data["market_risk"],
            biz_data["seasonal_risk"], biz_data["financial_risk"],
            biz_data["name"], health["status"],
        )

        # ── 7. Financial Score ──
        financial_score = calculate_financial_score(
            health["monthly_surplus"], revenue_cost["estimated_monthly_revenue"],
            scheme["loan_amount"], fin["project_cost"],
            fin["margin_capital"], revenue_cost["estimated_operating_cost"],
        )

        # ── 8. Viability Engine ──
        viability = analyze_viability(
            biz_data["demand_score"], financial_score,
            opportunity["opportunity_score"], biz_data["competition_score"],
            risk["risk_score"], biz_data["name"],
        )

        # ── 9. Recommendation Engine (deterministic fallback) ──
        recommendation = generate_recommendation(
            viability["viability_score"], health, risk, competition,
            opportunity, biz_data["name"], req.language,
        )

        # ── 10. AI Advisory Layer (optional enhancement) ──
        location = {"state": req.state, "district": req.district, "block": req.block, "village": req.village}

        swot = generate_swot(
            location, biz_data["name"], req.capital, fin["project_cost"],
            competition, biz_data["demand_score"], risk, req.language,
        )

        opportunity_insights = generate_opportunity_insights(
            location, biz_data["name"], req.capital,
            biz_data["demand_score"], biz_data["competition_score"],
            opportunity["opportunity_score"], req.language,
        )

        # AI-enhanced recommendation text
        ai_rec = generate_ai_recommendation(
            {"margin": fin["margin_capital"], "project_cost": fin["project_cost"],
             "loan_amount": scheme["loan_amount"], "emi": emi, "scheme": scheme["scheme"]},
            {"name": biz_data["name"], "demand_score": biz_data["demand_score"],
             "competition_score": biz_data["competition_score"]},
            risk, viability, recommendation, req.language,
        )
        if ai_rec:
            recommendation["ai_explanation"] = ai_rec.get("ai_explanation", "")
            recommendation["is_ai_enhanced"] = True

        # Standardize convenience fields on recommendation
        adv = recommendation.get("advice", {})
        acts = adv.get("do", []) + adv.get("conditions", [])
        if not acts:
            acts = [
                f"Establish operational facility for {biz_data['name']}",
                "Procure required equipment and inventory",
                "Initiate client outreach and market operations",
            ]
        recommendation["actions"] = acts
        recommendation["actions_hi"] = adv.get("do", []) or [
            f"{biz_data.get('name_hi', biz_data['name'])} के लिए कार्यस्थल तैयार करें",
            "उपकरण और प्रारंभिक इन्वेंट्री खरीदें",
            "स्थानीय बाजार में परिचालन शुरू करें",
        ]
        recommendation["recommendation_en"] = f"{recommendation.get('label', 'Recommended')} — Viability score {viability['viability_score']}/100"
        recommendation["recommendation_hi"] = f"{recommendation.get('label_hi', 'अनुशंसित')} — व्यवहार्यता स्कोर {viability['viability_score']}/100"
        recommendation["alternative_businesses"] = adv.get("alternatives") or ["Retail", "Tailoring", "Food Processing"]
        recommendation["alternatives_hi"] = ["किराना दुकान", "सिलाई व वस्त्र", "खाद्य प्रसंस्करण"]

        # ── Build full result ──
        analysis_id = str(uuid.uuid4())[:12]
        result = {
            "success": True,
            "analysis_id": analysis_id,
            "language": req.language,
            "business_name": biz_data["name"],
            "business_name_hi": biz_data["name_hi"],
            "business_icon": biz_data["icon"],
            "location": location,
            "financial": {
                "margin_capital": fin["margin_capital"],
                "project_cost": fin["project_cost"],
                "theoretical_loan": fin["theoretical_loan"],
                "loan_amount": scheme["loan_amount"],
                "scheme": scheme["scheme"],
                "scheme_hi": scheme["scheme_hi"],
                "interest_rate": scheme["interest_rate"],
                "tenure_years": scheme["tenure_years"],
                "moratorium_months": scheme["moratorium_months"],
                "estimated_emi": emi,
                "loan_limit_applied": scheme["loan_limit_applied"],
                "data_status": "calculated",
            },
            "financial_health": health,
            "quarterly_repayment": quarterly,
            "business_analysis": {
                "demand_score": biz_data["demand_score"],
                "competition_score": biz_data["competition_score"],
                "competition_level": competition["competition_level"],
                "opportunity_score": opportunity["opportunity_score"],
                "opportunity_level": opportunity["opportunity_level"],
                "risk_score": risk["risk_score"],
                "accessibility_score": biz_data["accessibility_score"],
                "profit_potential_score": biz_data["profit_potential_score"],
                "market_reach": market,
                "customer_segments": biz_data["customer_segments"],
                "customer_segments_hi": biz_data["customer_segments_hi"],
                "estimated_monthly_revenue": revenue_cost["estimated_monthly_revenue"],
                "estimated_operating_cost": revenue_cost["estimated_operating_cost"],
                "data_status": "prototype",
            },
            "competition": competition,
            "opportunity": opportunity,
            "opportunity_insights": opportunity_insights,
            "risk_analysis": risk,
            "pricing": pricing,
            "swot": swot,
            "viability": viability,
            "recommendation": recommendation,
            "llm_available": is_llm_available(),
            "created_at": datetime.now().isoformat(),
        }

        # Store for chat context and report generation
        _analysis_store[analysis_id] = result

        return result

    except ValueError as e:
        msg = str(e)
        if "OUTSIDE_SUPPORTED_RANGE" in msg:
            return error_response("OUTSIDE_SUPPORTED_RANGE", msg)
        if "UNSUPPORTED_BUSINESS" in msg:
            return error_response("UNSUPPORTED_BUSINESS", msg)
        return error_response("FINANCIAL_CALCULATION_ERROR", msg)
    except Exception as e:
        logger.error(f"Analysis error: {e}", exc_info=True)
        return error_response("FINANCIAL_CALCULATION_ERROR", f"Analysis failed: {str(e)}", 500)


# ─── POST /api/comparison ────────────────────────────────────────

@app.post("/api/comparison")
async def compare_businesses(req: ComparisonRequest):
    results = []
    for biz_name in req.businesses:
        biz_id = normalize_business(biz_name)
        if biz_id not in SUPPORTED_BUSINESSES:
            continue
        try:
            biz_data = get_business_data(biz_id)
            fin = calculate_financial_structure(req.capital)
            scheme = route_scheme(fin["project_cost"])
            emi_val = calculate_emi(scheme["loan_amount"], scheme["interest_rate"], scheme["tenure_years"])
            revenue_cost = get_revenue_cost_estimates(biz_id)
            health = calculate_financial_health(
                revenue_cost["estimated_monthly_revenue"],
                revenue_cost["estimated_operating_cost"], emi_val,
            )
            competition = analyze_competition(biz_data["competition_score"], biz_data["name"])
            opp = analyze_opportunity(
                biz_data["demand_score"], biz_data["competition_score"],
                biz_data["accessibility_score"], biz_data["profit_potential_score"],
                biz_data["name"],
            )
            risk = analyze_risk(
                biz_data["supply_risk"], biz_data["market_risk"],
                biz_data["seasonal_risk"], biz_data["financial_risk"],
                biz_data["name"], health["status"],
            )
            financial_score = calculate_financial_score(
                health["monthly_surplus"], revenue_cost["estimated_monthly_revenue"],
                scheme["loan_amount"], fin["project_cost"],
                fin["margin_capital"], revenue_cost["estimated_operating_cost"],
            )
            viability = analyze_viability(
                biz_data["demand_score"], financial_score,
                opp["opportunity_score"], biz_data["competition_score"],
                risk["risk_score"], biz_data["name"],
            )

            results.append({
                "business": biz_data["name"],
                "business_hi": biz_data["name_hi"],
                "icon": biz_data["icon"],
                "demand_score": biz_data["demand_score"],
                "competition_score": biz_data["competition_score"],
                "competition_level": competition["competition_level"],
                "opportunity_score": opp["opportunity_score"],
                "risk_score": risk["risk_score"],
                "risk_level": risk["overall_risk_level"],
                "financial_health": health["status"],
                "viability_score": viability["viability_score"],
                "viability_band": viability["band"],
                "viability_band_hi": viability["band_hi"],
                "viability_emoji": viability["emoji"],
            })
        except Exception as e:
            logger.warning(f"Comparison skipped for {biz_name}: {e}")

    # Sort by viability score descending
    results.sort(key=lambda x: x["viability_score"], reverse=True)

    # Mark the best option
    if results:
        results[0]["is_recommended"] = True
        for r in results[1:]:
            r["is_recommended"] = False

    return {"success": True, "comparison": results, "capital": req.capital}


# ─── POST /api/chat ──────────────────────────────────────────────

@app.post("/api/chat")
async def chat(req: ChatRequest):
    if req.language not in ("en", "hi"):
        return error_response("UNSUPPORTED_LANGUAGE", "Only 'en' and 'hi' are supported.")

    context = req.context or {}
    if req.analysis_id and req.analysis_id in _analysis_store:
        context = _analysis_store[req.analysis_id]

    response = chat_response(req.message, context, req.language)
    reply_text = response.get("response", "")
    return {"success": True, "reply": reply_text, **response}


# ─── GET /api/report/{id} ────────────────────────────────────────

@app.get("/api/report/{analysis_id}")
async def get_report(analysis_id: str):
    if analysis_id not in _analysis_store:
        return error_response("MISSING_DATA", "Analysis not found. Please run an analysis first.", 404)

    analysis = _analysis_store[analysis_id]
    language = analysis.get("language", "en")

    try:
        filepath = generate_report(analysis, language)
        return FileResponse(
            filepath,
            media_type="application/pdf",
            filename=f"GramDisha_Report_{analysis_id}.pdf",
        )
    except Exception as e:
        logger.error(f"Report generation failed: {e}", exc_info=True)
        return error_response("REPORT_GENERATION_ERROR", f"PDF generation failed: {str(e)}", 500)


# ─── GET locations ───────────────────────────────────────────────

@app.get("/api/locations")
async def get_locations():
    data_path = Path(__file__).resolve().parent.parent / "data" / "locations.json"
    with open(data_path, "r", encoding="utf-8") as f:
        return {"success": True, "locations": json.load(f)}
