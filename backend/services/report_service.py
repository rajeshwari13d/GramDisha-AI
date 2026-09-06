"""
GramDisha AI — Report Service (ReportLab PDF Generator)

Generates bilingual PDF reports with data provenance badges and required disclaimers.
Every figure/label carries its data-provenance status.
"""

import os
import uuid
from pathlib import Path
from datetime import datetime

from reportlab.lib.pagesizes import A4
from reportlab.lib.styles import getSampleStyleSheet, ParagraphStyle
from reportlab.lib.units import inch, mm
from reportlab.lib.colors import HexColor
from reportlab.platypus import (
    SimpleDocTemplate, Paragraph, Spacer, Table, TableStyle,
    HRFlowable, PageBreak
)
from reportlab.lib.enums import TA_CENTER, TA_LEFT, TA_RIGHT
from reportlab.pdfbase import pdfmetrics
from reportlab.pdfbase.ttfonts import TTFont

_REPORTS_DIR = Path(__file__).resolve().parent.parent.parent / "reports"


# Colors
PRIMARY = HexColor("#1a5f2a")
ACCENT = HexColor("#f59e0b")
LIGHT_BG = HexColor("#f0fdf4")
TEXT_DARK = HexColor("#1e293b")
TEXT_GRAY = HexColor("#64748b")
BADGE_CALC = HexColor("#3b82f6")
BADGE_PROTO = HexColor("#f59e0b")
BADGE_AI = HexColor("#8b5cf6")


def _get_labels(language: str) -> dict:
    """Get all report labels in the specified language."""
    if language == "hi":
        return {
            "title": "GramDisha AI — व्यवसाय विश्लेषण रिपोर्ट",
            "generated": "रिपोर्ट निर्मित",
            "entrepreneur_profile": "उद्यमी प्रोफ़ाइल",
            "location": "स्थान",
            "capital": "उपलब्ध पूंजी",
            "business": "व्यवसाय श्रेणी",
            "financial_structure": "वित्तीय संरचना",
            "project_cost": "परियोजना लागत",
            "loan_amount": "लोन राशि",
            "scheme": "योजना",
            "interest_rate": "ब्याज दर",
            "tenure": "अवधि",
            "moratorium": "मोरेटोरियम",
            "emi": "अनुमानित EMI",
            "financial_health": "वित्तीय स्वास्थ्य",
            "monthly_surplus": "मासिक बचत",
            "market_analysis": "बाज़ार विश्लेषण",
            "demand_score": "मांग स्कोर",
            "competition": "प्रतिस्पर्धा",
            "opportunity": "अवसर स्कोर",
            "risk_analysis": "जोखिम विश्लेषण",
            "overall_risk": "समग्र जोखिम",
            "swot": "SWOT विश्लेषण",
            "strengths": "शक्तियां",
            "weaknesses": "कमज़ोरियां",
            "opportunities": "अवसर",
            "threats": "खतरे",
            "viability": "व्यवहार्यता स्कोर",
            "recommendation": "सिफारिश",
            "do": "करें",
            "avoid": "बचें",
            "conditions": "शर्तें",
            "disclaimer_title": "अस्वीकरण और धारणाएं",
            "disclaimer_text": (
                "यह रिपोर्ट प्रारंभिक व्यावसायिक निर्णय सहायता के लिए है। "
                "गणना किए गए वित्तीय आंकड़े एप्लिकेशन की कॉन्फ़िगर की गई धारणाओं पर आधारित हैं। "
                "अनुमानित/प्रोटोटाइप स्थानीय बाज़ार मूल्य वास्तविक लाइव बाज़ार डेटा की गारंटी नहीं हैं। "
                "सरकारी योजना पात्रता और चुकौती शर्तें वर्तमान आधिकारिक दिशानिर्देशों और ऋण एजेंसी के निर्णयों के अधीन हैं।"
            ),
            "years": "वर्ष",
            "months": "महीने",
            "per_month": "प्रति माह",
            "calculated": "गणना किया गया",
            "prototype": "प्रोटोटाइप",
            "ai_recommendation": "AI सिफारिश",
        }
    return {
        "title": "GramDisha AI — Business Analysis Report",
        "generated": "Report Generated",
        "entrepreneur_profile": "Entrepreneur Profile",
        "location": "Location",
        "capital": "Available Capital",
        "business": "Business Category",
        "financial_structure": "Financial Structure",
        "project_cost": "Project Cost",
        "loan_amount": "Loan Amount",
        "scheme": "Scheme",
        "interest_rate": "Interest Rate",
        "tenure": "Tenure",
        "moratorium": "Moratorium",
        "emi": "Estimated EMI",
        "financial_health": "Financial Health",
        "monthly_surplus": "Monthly Surplus",
        "market_analysis": "Market Analysis",
        "demand_score": "Demand Score",
        "competition": "Competition",
        "opportunity": "Opportunity Score",
        "risk_analysis": "Risk Analysis",
        "overall_risk": "Overall Risk",
        "swot": "SWOT Analysis",
        "strengths": "Strengths",
        "weaknesses": "Weaknesses",
        "opportunities": "Opportunities",
        "threats": "Threats",
        "viability": "Viability Score",
        "recommendation": "Recommendation",
        "do": "Do",
        "avoid": "Avoid",
        "conditions": "Conditions",
        "disclaimer_title": "Disclaimer & Assumptions",
        "disclaimer_text": (
            "This report is intended for preliminary business decision support. "
            "Financial figures marked as calculated are generated using the application's configured assumptions. "
            "Local market values marked as estimated/prototype are not guaranteed live market data. "
            "Government scheme eligibility and repayment terms are subject to current official guidelines "
            "and lending-agency decisions."
        ),
        "years": "years",
        "months": "months",
        "per_month": "/month",
        "calculated": "CALCULATED",
        "prototype": "PROTOTYPE",
        "ai_recommendation": "AI RECOMMENDATION",
    }


def generate_report(analysis_data: dict, language: str = "en") -> str:
    """
    Generate a PDF report from analysis data.
    Returns the file path of the generated PDF.
    """
    _REPORTS_DIR.mkdir(parents=True, exist_ok=True)

    report_id = str(uuid.uuid4())[:8]
    filename = f"gramdisha_report_{report_id}.pdf"
    filepath = _REPORTS_DIR / filename

    labels = _get_labels(language)
    styles = getSampleStyleSheet()

    # Custom styles
    title_style = ParagraphStyle(
        "CustomTitle", parent=styles["Title"],
        fontSize=18, textColor=PRIMARY, spaceAfter=6
    )
    heading_style = ParagraphStyle(
        "CustomHeading", parent=styles["Heading2"],
        fontSize=14, textColor=PRIMARY, spaceBefore=12, spaceAfter=6
    )
    normal_style = ParagraphStyle(
        "CustomNormal", parent=styles["Normal"],
        fontSize=10, textColor=TEXT_DARK, spaceAfter=4
    )
    badge_style = ParagraphStyle(
        "Badge", parent=styles["Normal"],
        fontSize=8, textColor=TEXT_GRAY
    )
    disclaimer_style = ParagraphStyle(
        "Disclaimer", parent=styles["Normal"],
        fontSize=8, textColor=TEXT_GRAY, spaceAfter=4
    )

    doc = SimpleDocTemplate(
        str(filepath), pagesize=A4,
        rightMargin=20*mm, leftMargin=20*mm,
        topMargin=20*mm, bottomMargin=20*mm,
    )
    story = []

    # ─── Title ───
    story.append(Paragraph(labels["title"], title_style))
    story.append(Paragraph(
        f"{labels['generated']}: {datetime.now().strftime('%Y-%m-%d %H:%M')}",
        badge_style
    ))
    story.append(Spacer(1, 12))
    story.append(HRFlowable(width="100%", color=PRIMARY, thickness=2))
    story.append(Spacer(1, 12))

    # ─── Entrepreneur Profile ───
    story.append(Paragraph(labels["entrepreneur_profile"], heading_style))
    loc = analysis_data.get("location", {})
    profile_data = [
        [labels["location"], f"{loc.get('village', '')}, {loc.get('block', '')}, {loc.get('district', '')}, {loc.get('state', '')}"],
        [labels["capital"], f"₹{analysis_data.get('financial', {}).get('margin_capital', 0):,.0f}"],
        [labels["business"], analysis_data.get("business_name", "")],
    ]
    t = Table(profile_data, colWidths=[150, 350])
    t.setStyle(TableStyle([
        ('FONTSIZE', (0, 0), (-1, -1), 10),
        ('TEXTCOLOR', (0, 0), (0, -1), PRIMARY),
        ('FONTNAME', (0, 0), (0, -1), 'Helvetica-Bold'),
        ('BOTTOMPADDING', (0, 0), (-1, -1), 6),
    ]))
    story.append(t)
    story.append(Spacer(1, 12))

    # ─── Financial Structure ───
    fin = analysis_data.get("financial", {})
    story.append(Paragraph(f"{labels['financial_structure']} [{labels['calculated']}]", heading_style))
    fin_data = [
        [labels["project_cost"], f"₹{fin.get('project_cost', 0):,.0f}"],
        [labels["loan_amount"], f"₹{fin.get('loan_amount', 0):,.0f}"],
        [labels["scheme"], fin.get("scheme", "")],
        [labels["interest_rate"], f"{fin.get('interest_rate', 0)}%"],
        [labels["tenure"], f"{fin.get('tenure_years', 0)} {labels['years']}"],
        [labels["moratorium"], f"{fin.get('moratorium_months', 0)} {labels['months']}"],
        [labels["emi"], f"₹{fin.get('estimated_emi', 0):,.0f} {labels['per_month']}"],
    ]
    t = Table(fin_data, colWidths=[150, 350])
    t.setStyle(TableStyle([
        ('FONTSIZE', (0, 0), (-1, -1), 10),
        ('TEXTCOLOR', (0, 0), (0, -1), PRIMARY),
        ('FONTNAME', (0, 0), (0, -1), 'Helvetica-Bold'),
        ('BOTTOMPADDING', (0, 0), (-1, -1), 6),
    ]))
    story.append(t)

    # Financial health
    health = analysis_data.get("financial_health", {})
    if health:
        story.append(Spacer(1, 6))
        story.append(Paragraph(
            f"{labels['financial_health']}: {health.get('emoji', '')} {health.get('status', '').title()} "
            f"| {labels['monthly_surplus']}: ₹{health.get('monthly_surplus', 0):,.0f}",
            normal_style
        ))
    story.append(Spacer(1, 12))

    # ─── Market Analysis ───
    biz = analysis_data.get("business_analysis", {})
    story.append(Paragraph(f"{labels['market_analysis']} [{labels['prototype']}]", heading_style))
    market_data = [
        [labels["demand_score"], f"{biz.get('demand_score', 0)}/100"],
        [labels["competition"], f"{biz.get('competition_level', '')} ({biz.get('competition_score', 0)}/100)"],
        [labels["opportunity"], f"{biz.get('opportunity_score', 0)}/100"],
    ]
    t = Table(market_data, colWidths=[150, 350])
    t.setStyle(TableStyle([
        ('FONTSIZE', (0, 0), (-1, -1), 10),
        ('TEXTCOLOR', (0, 0), (0, -1), PRIMARY),
        ('FONTNAME', (0, 0), (0, -1), 'Helvetica-Bold'),
        ('BOTTOMPADDING', (0, 0), (-1, -1), 6),
    ]))
    story.append(t)
    story.append(Spacer(1, 12))

    # ─── Risk Analysis ───
    risk = analysis_data.get("risk_analysis", {})
    story.append(Paragraph(f"{labels['risk_analysis']} [{labels['calculated']}]", heading_style))
    story.append(Paragraph(
        f"{labels['overall_risk']}: {risk.get('overall_risk_level', '')} "
        f"(Score: {risk.get('risk_score', 0)}/100)",
        normal_style
    ))
    story.append(Spacer(1, 12))

    # ─── SWOT ───
    swot = analysis_data.get("swot", {})
    badge = labels['ai_recommendation'] if swot.get('is_ai_generated') else labels['calculated']
    story.append(Paragraph(f"{labels['swot']} [{badge}]", heading_style))
    for section_key, section_label in [
        ("strengths", labels["strengths"]),
        ("weaknesses", labels["weaknesses"]),
        ("opportunities", labels["opportunities"]),
        ("threats", labels["threats"]),
    ]:
        items = swot.get(section_key, [])
        if items:
            story.append(Paragraph(f"<b>{section_label}:</b>", normal_style))
            for item in items:
                story.append(Paragraph(f"  • {item}", normal_style))
    story.append(Spacer(1, 12))

    # ─── Viability Score ───
    viability = analysis_data.get("viability", {})
    story.append(Paragraph(f"{labels['viability']} [{labels['calculated']}]", heading_style))
    story.append(Paragraph(
        f"<b>{viability.get('emoji', '')} {viability.get('viability_score', 0)}/100 — "
        f"{viability.get('band', '')}</b>",
        ParagraphStyle("ViabilityScore", parent=styles["Normal"], fontSize=14, textColor=PRIMARY)
    ))
    story.append(Spacer(1, 12))

    # ─── Recommendation ───
    rec = analysis_data.get("recommendation", {})
    badge = labels['ai_recommendation'] if rec.get('is_ai_enhanced') else labels['calculated']
    story.append(Paragraph(f"{labels['recommendation']} [{badge}]", heading_style))
    story.append(Paragraph(
        f"<b>{rec.get('emoji', '')} {rec.get('label', '')}</b>",
        ParagraphStyle("RecState", parent=styles["Normal"], fontSize=12)
    ))

    advice = rec.get("advice", {})
    if advice.get("conditions"):
        story.append(Paragraph(f"<b>{labels['conditions']}:</b>", normal_style))
        for c in advice["conditions"]:
            story.append(Paragraph(f"  • {c}", normal_style))
    if advice.get("do"):
        story.append(Paragraph(f"<b>✅ {labels['do']}:</b>", normal_style))
        for d in advice["do"]:
            story.append(Paragraph(f"  • {d}", normal_style))
    if advice.get("avoid"):
        story.append(Paragraph(f"<b>❌ {labels['avoid']}:</b>", normal_style))
        for a in advice["avoid"]:
            story.append(Paragraph(f"  • {a}", normal_style))
    story.append(Spacer(1, 20))

    # ─── Disclaimer ───
    story.append(HRFlowable(width="100%", color=TEXT_GRAY, thickness=1))
    story.append(Spacer(1, 6))
    story.append(Paragraph(f"<b>{labels['disclaimer_title']}</b>", disclaimer_style))
    story.append(Paragraph(labels["disclaimer_text"], disclaimer_style))

    doc.build(story)
    return str(filepath)
