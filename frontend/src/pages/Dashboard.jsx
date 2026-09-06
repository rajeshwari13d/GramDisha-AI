import React, { useContext } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import {
  TrendingUp,
  Coins,
  ArrowRight,
  FileText,
  Scale,
  Compass,
  Building2,
  Calendar,
  Sparkles,
  MapPin,
  CheckCircle2,
  AlertTriangle,
  AlertOctagon,
} from 'lucide-react';
import { AnalysisContext } from '../App';
import ScoreGauge from '../components/ScoreGauge';
import ProvenanceBadge from '../components/ProvenanceBadge';

export default function Dashboard() {
  const { analysis } = useContext(AnalysisContext);
  const { t, i18n } = useTranslation();
  const navigate = useNavigate();
  const isHi = i18n.language === 'hi';

  if (!analysis) {
    return (
      <div className="max-w-md mx-auto my-16 p-8 gd-card text-center space-y-4">
        <h3 className="text-lg font-bold text-[var(--color-text)]">
          {isHi ? 'कोई सक्रिय विश्लेषण नहीं मिला' : 'No Active Analysis'}
        </h3>
        <p className="text-xs sm:text-sm text-[var(--color-text-muted)]">
          {isHi
            ? 'कृपया पहले अपने व्यवसाय और पूंजी का विवरण दर्ज करें।'
            : 'Please complete the business assessment first to view this dashboard.'}
        </p>
        <button
          onClick={() => navigate('/assess')}
          className="gd-btn-primary mx-auto"
        >
          {isHi ? 'नया विश्लेषण शुरू करें' : 'Start Assessment'}
        </button>
      </div>
    );
  }

  const {
    business_name,
    business_name_hi,
    business_icon,
    location,
    financial,
    financial_health,
    business_analysis,
    viability,
    recommendation,
    risk_analysis,
  } = analysis;

  const displayName = isHi ? business_name_hi || business_name : business_name;
  const displayScheme = isHi ? financial.scheme_hi || financial.scheme : financial.scheme;
  const displayTier = isHi ? viability.viability_tier_hi || viability.viability_tier : viability.viability_tier;

  // Semantic styling for the verdict
  const state = recommendation?.state || 'RECOMMENDED_WITH_CONDITIONS';
  let verdictStyle = {
    bg: 'var(--color-positive-bg)',
    color: 'var(--color-positive)',
    border: 'var(--color-positive-border)',
    icon: CheckCircle2,
  };
  if (state === 'NOT_RECOMMENDED') {
    verdictStyle = {
      bg: 'var(--color-negative-bg)',
      color: 'var(--color-negative)',
      border: 'var(--color-negative-border)',
      icon: AlertOctagon,
    };
  } else if (state === 'RECOMMENDED_WITH_CONDITIONS') {
    verdictStyle = {
      bg: 'var(--color-caution-bg)',
      color: 'var(--color-caution)',
      border: 'var(--color-caution-border)',
      icon: AlertTriangle,
    };
  }
  const VerdictIcon = verdictStyle.icon;

  return (
    <div className="max-w-6xl mx-auto px-4 sm:px-6 py-6 sm:py-10 space-y-6 sm:space-y-8">
      {/* Top Banner: Enterprise Identity & Quick Actions */}
      <div className="gd-card p-5 sm:p-6 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div className="flex items-center gap-3.5 min-w-0">
          <div className="w-12 h-12 sm:w-14 sm:h-14 rounded-xl bg-[var(--color-surface-subtle)] border border-[var(--color-border)] flex items-center justify-center text-2xl sm:text-3xl shrink-0">
            {business_icon || '🌾'}
          </div>
          <div className="min-w-0">
            <div className="flex items-center gap-2 flex-wrap">
              <h1 className="text-xl sm:text-2xl font-black text-[var(--color-text)] tracking-tight truncate">
                {displayName}
              </h1>
              <span className="text-[11px] font-bold px-2 py-0.5 rounded-full bg-[var(--color-positive-bg)] text-[var(--color-positive)] border border-[var(--color-positive-border)] shrink-0">
                {isHi ? 'प्रमाणित योजना' : 'Verified Plan'}
              </span>
            </div>
            <p className="text-xs text-[var(--color-text-muted)] flex items-center gap-1 mt-0.5 truncate">
              <MapPin className="w-3.5 h-3.5 text-[var(--color-positive)] shrink-0" />
              <span>
                {location.village}, {location.block}, {location.district}, {location.state}
              </span>
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2 self-stretch sm:self-auto justify-end shrink-0">
          <Link
            to="/report"
            className="gd-btn-secondary text-xs px-3.5 py-2 min-h-[38px]"
          >
            <FileText className="w-3.5 h-3.5" />
            <span>{isHi ? 'बैंक रिपोर्ट' : 'Bank Proposal'}</span>
          </Link>
          <Link
            to="/assess"
            className="gd-btn-secondary text-xs px-3.5 py-2 min-h-[38px]"
          >
            <span>{isHi ? 'पुनः गणना' : 'Re-calculate'}</span>
          </Link>
        </div>
      </div>

      {/* Visual Hero: Dominant Viability & Strategic Verdict */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-stretch">
        {/* Primary Hero: Viability Score Gauge (5 cols desktop) */}
        <div className="lg:col-span-5 gd-card p-6 flex flex-col items-center justify-between space-y-4 text-center border-[var(--color-border-strong)]">
          <div className="w-full flex items-center justify-between border-b border-[var(--color-border)] pb-2.5">
            <span className="text-xs font-bold uppercase tracking-wider text-[var(--color-text-muted)]">
              {t('dashboard.viability')}
            </span>
            <ProvenanceBadge type="calculated" />
          </div>

          <div className="py-2">
            <ScoreGauge
              score={viability.viability_score}
              size={190}
              strokeWidth={14}
              label={isHi ? 'समग्र वित्तीय व्यवहार्यता स्कोर' : 'Overall Viability Score'}
              tier={displayTier}
            />
          </div>

          <p className="text-xs text-[var(--color-text-muted)] leading-relaxed max-w-xs">
            {isHi ? viability.description_hi : viability.description_en}
          </p>
        </div>

        {/* Secondary Hero: Strategic Verdict & AI Commentary (7 cols desktop) */}
        <div className="lg:col-span-7 gd-card p-6 sm:p-7 flex flex-col justify-between space-y-4">
          <div className="space-y-3">
            <div className="flex items-center justify-between border-b border-[var(--color-border)] pb-2.5">
              <div className="flex items-center gap-1.5 text-xs font-bold uppercase tracking-wider text-[var(--color-text-muted)]">
                <Sparkles className="w-4 h-4 text-[var(--color-advisory)] shrink-0" />
                <span>{t('dashboard.ai_recommendation')}</span>
              </div>
              <ProvenanceBadge type="ai_advisory" />
            </div>

            <div
              className="p-3.5 rounded-xl border flex items-start gap-3"
              style={{
                backgroundColor: verdictStyle.bg,
                borderColor: verdictStyle.border,
                color: verdictStyle.color,
              }}
            >
              <VerdictIcon className="w-5 h-5 shrink-0 mt-0.5" />
              <div>
                <span className="text-[11px] font-black uppercase tracking-wider block">
                  {state.replace(/_/g, ' ')}
                </span>
                <h3 className="text-base sm:text-lg font-bold leading-snug text-[var(--color-text)] mt-0.5">
                  {isHi ? recommendation.recommendation_hi : recommendation.recommendation_en}
                </h3>
              </div>
            </div>

            {recommendation.ai_explanation && (
              <p className="text-xs sm:text-sm text-[var(--color-text)] leading-relaxed p-3.5 rounded-lg bg-[var(--color-surface-subtle)] border border-[var(--color-border)]">
                {recommendation.ai_explanation}
              </p>
            )}
          </div>

          <div className="pt-3 border-t border-[var(--color-border)] flex items-center justify-between">
            <span className="text-xs text-[var(--color-text-muted)]">
              {isHi ? 'विस्तृत 90 दिवसीय कार्य योजना तैयार है' : 'Step-by-step 90-day action plan available'}
            </span>
            <Link
              to="/recommendations"
              className="inline-flex items-center gap-1 text-xs font-bold text-[var(--color-positive)] hover:underline"
            >
              <span>{isHi ? 'योजना देखें' : 'View Action Plan'}</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </Link>
          </div>
        </div>
      </div>

      {/* 4 KPI Summary Cards (1 col mobile / 2 col tablet / 4 col desktop) */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 items-stretch">
        {/* Card 1: Project Cost */}
        <div className="gd-card p-4 sm:p-5 flex flex-col justify-between space-y-2">
          <div className="space-y-1">
            <span className="text-xs font-bold uppercase text-[var(--color-text-muted)]">
              {t('dashboard.project_cost')}
            </span>
            <div className="text-2xl font-extrabold text-[var(--color-text)] tabular-nums pt-1">
              ₹{(financial.project_cost || 0).toLocaleString('en-IN')}
            </div>
            <p className="text-[11px] text-[var(--color-text-subtle)]">
              {isHi ? '10x पूंजी अनुपात' : '10:90 capital split'}
            </p>
          </div>
          <div className="pt-2 border-t border-[var(--color-border)] text-xs font-semibold text-[var(--color-text-muted)] tabular-nums">
            {isHi ? `मार्जिन: ₹${(financial.margin_capital || 0).toLocaleString('en-IN')}` : `Margin: ₹${(financial.margin_capital || 0).toLocaleString('en-IN')}`}
          </div>
        </div>

        {/* Card 2: Loan Amount & Scheme */}
        <div className="gd-card p-4 sm:p-5 flex flex-col justify-between space-y-2">
          <div className="space-y-1">
            <span className="text-xs font-bold uppercase text-[var(--color-text-muted)]">
              {t('dashboard.loan_amount')}
            </span>
            <div className="text-2xl font-extrabold text-[var(--color-positive)] tabular-nums pt-1">
              ₹{(financial.loan_amount || 0).toLocaleString('en-IN')}
            </div>
            <p className="text-[11px] text-[var(--color-text)] font-semibold truncate" title={displayScheme}>
              {displayScheme}
            </p>
          </div>
          <div className="pt-2 border-t border-[var(--color-border)] text-xs text-[var(--color-text-muted)] tabular-nums">
            {financial.interest_rate}% p.a. • {financial.tenure_years} {isHi ? 'वर्ष' : 'yrs'}
          </div>
        </div>

        {/* Card 3: Monthly EMI & Surplus */}
        <div className="gd-card p-4 sm:p-5 flex flex-col justify-between space-y-2">
          <div className="space-y-1">
            <span className="text-xs font-bold uppercase text-[var(--color-text-muted)]">
              {isHi ? 'मासिक ईएमआई' : 'Estimated EMI'}
            </span>
            <div className="text-2xl font-extrabold text-[var(--color-text)] tabular-nums pt-1">
              ₹{(financial.estimated_emi || 0).toLocaleString('en-IN')}
              <span className="text-xs font-normal text-[var(--color-text-subtle)]">/mo</span>
            </div>
            <div>
              <span
                className="inline-block px-2 py-0.5 rounded text-[10px] font-bold uppercase tracking-wider border"
                style={{
                  backgroundColor: financial_health.status === 'comfortable' ? 'var(--color-positive-bg)' : financial_health.status === 'risky' ? 'var(--color-negative-bg)' : 'var(--color-caution-bg)',
                  color: financial_health.status === 'comfortable' ? 'var(--color-positive)' : financial_health.status === 'risky' ? 'var(--color-negative)' : 'var(--color-caution)',
                  borderColor: financial_health.status === 'comfortable' ? 'var(--color-positive-border)' : financial_health.status === 'risky' ? 'var(--color-negative-border)' : 'var(--color-caution-border)',
                }}
              >
                {isHi ? financial_health.label_hi : financial_health.label_en}
              </span>
            </div>
          </div>
          <div className="pt-2 border-t border-[var(--color-border)] text-xs text-[var(--color-text-muted)] tabular-nums">
            {isHi ? `बचत: ₹${(financial_health.monthly_surplus || 0).toLocaleString('en-IN')}/माह` : `Surplus: ₹${(financial_health.monthly_surplus || 0).toLocaleString('en-IN')}/mo`}
          </div>
        </div>

        {/* Card 4: Demand & Competition */}
        <div className="gd-card p-4 sm:p-5 flex flex-col justify-between space-y-2">
          <div className="space-y-1">
            <span className="text-xs font-bold uppercase text-[var(--color-text-muted)]">
              {t('dashboard.demand')} / {t('dashboard.competition')}
            </span>
            <div className="text-2xl font-extrabold text-[var(--color-text)] tabular-nums pt-1">
              {business_analysis.demand_score}
              <span className="text-xs font-normal text-[var(--color-text-subtle)]">/100</span>
            </div>
            <p className="text-[11px] text-[var(--color-text-muted)]">
              {isHi ? 'प्रतिस्पर्धा: ' : 'Competition: '}
              <span className="font-bold text-[var(--color-text)] capitalize">{business_analysis.competition_level}</span>
            </p>
          </div>
          <div className="pt-2 border-t border-[var(--color-border)] text-xs text-[var(--color-text-muted)] tabular-nums">
            {isHi ? `जोखिम: ${risk_analysis.risk_score}/100` : `Risk: ${risk_analysis.risk_score}/100`}
          </div>
        </div>
      </div>

      {/* 90-Day Execution Plan (Directly integrated on overview) */}
      <div className="gd-card p-5 sm:p-6 space-y-4">
        <div className="flex items-center justify-between border-b border-[var(--color-border)] pb-2.5">
          <div className="flex items-center gap-2 font-bold text-[var(--color-text)] text-sm sm:text-base">
            <Calendar className="w-4 h-4 text-[var(--color-positive)] shrink-0" />
            <span>{isHi ? 'व्यवसाय स्थापना कार्य योजना (90 दिन)' : '90-Day Enterprise Execution Roadmap'}</span>
          </div>
          <Link
            to="/market"
            className="text-xs font-semibold text-[var(--color-positive)] hover:underline flex items-center gap-1"
          >
            <span>{isHi ? 'बाजार व SWOT देखें' : 'Market & SWOT'}</span>
            <ArrowRight className="w-3 h-3" />
          </Link>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 pt-1">
          {[
            {
              phase: isHi ? 'चरण 1 (दिन 1-30)' : 'Phase 1 (Days 1–30)',
              title: isHi ? 'पंजीकरण व ऋण आवेदन' : 'Statutory & Loan Application',
              desc: isHi ? 'उद्यम आधार, बैंक ऋण दस्तावेज, स्थान सत्यापन और प्रारंभिक औपचारिकताएं पूर्ण करें।' : 'Complete Udyam registration, bank DPR dossier, and site validation.',
            },
            {
              phase: isHi ? 'चरण 2 (दिन 31-60)' : 'Phase 2 (Days 31–60)',
              title: isHi ? 'उपकरण व आपूर्ति श्रृंखला' : 'Equipment & Procurement',
              desc: isHi ? 'मशीनरी आपूर्ति अनुबंध, विक्रेता समझौता और कार्यशील पूंजी आवंटन सुनिश्चित करें।' : 'Procure core machinery, secure raw material supplier terms, and set up facility.',
            },
            {
              phase: isHi ? 'चरण 3 (दिन 61-90)' : 'Phase 3 (Days 61–90)',
              title: isHi ? 'संचालन व बिक्री प्रारंभ' : 'Commercial Operations',
              desc: isHi ? 'प्रारंभिक उत्पादन, स्थानीय ग्राहकों तक पहुंच, और प्रथम महीने का नकदी प्रवाह संतुलन।' : 'Launch commercial sales, establish retail/bulk distribution, and achieve break-even.',
            },
          ].map((step, idx) => (
            <div key={idx} className="p-4 rounded-xl bg-[var(--color-surface-subtle)] border border-[var(--color-border)] space-y-2">
              <span className="text-[11px] font-bold text-[var(--color-positive)] uppercase tracking-wider block">
                {step.phase}
              </span>
              <h4 className="font-bold text-sm text-[var(--color-text)]">
                {step.title}
              </h4>
              <p className="text-xs text-[var(--color-text-muted)] leading-relaxed">
                {step.desc}
              </p>
            </div>
          ))}
        </div>
      </div>

      {/* Clean Quick Access Navigation (3 high-value sections) */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <Link
          to="/financial"
          className="gd-card p-4 sm:p-5 flex items-center justify-between hover:border-[var(--color-positive)] transition-colors group"
        >
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-lg bg-[var(--color-surface-subtle)] border border-[var(--color-border)] flex items-center justify-center text-[var(--color-positive)] shrink-0">
              <Coins className="w-5 h-5" />
            </div>
            <div>
              <h4 className="font-bold text-sm text-[var(--color-text)] group-hover:text-[var(--color-positive)] transition-colors">
                {isHi ? 'विस्तृत वित्तीय व ईएमआई' : 'Financials & EMI'}
              </h4>
              <p className="text-xs text-[var(--color-text-muted)]">
                {isHi ? 'त्रैमासिक भुगतान अनुसूची' : 'Full repayment schedule'}
              </p>
            </div>
          </div>
          <ArrowRight className="w-4 h-4 text-[var(--color-text-subtle)] group-hover:text-[var(--color-positive)] transition-colors" />
        </Link>

        <Link
          to="/market"
          className="gd-card p-4 sm:p-5 flex items-center justify-between hover:border-[var(--color-positive)] transition-colors group"
        >
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-lg bg-[var(--color-surface-subtle)] border border-[var(--color-border)] flex items-center justify-center text-[var(--color-positive)] shrink-0">
              <TrendingUp className="w-5 h-5" />
            </div>
            <div>
              <h4 className="font-bold text-sm text-[var(--color-text)] group-hover:text-[var(--color-positive)] transition-colors">
                {isHi ? 'बाजार व SWOT रणनीति' : 'Market & SWOT'}
              </h4>
              <p className="text-xs text-[var(--color-text-muted)]">
                {isHi ? 'पहुंच, मूल्य व 4-आयामी मैट्रिक्स' : 'Reach, pricing & strategy'}
              </p>
            </div>
          </div>
          <ArrowRight className="w-4 h-4 text-[var(--color-text-subtle)] group-hover:text-[var(--color-positive)] transition-colors" />
        </Link>

        <Link
          to="/report"
          className="gd-card p-4 sm:p-5 flex items-center justify-between hover:border-[var(--color-positive)] transition-colors group"
        >
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-lg bg-[var(--color-surface-subtle)] border border-[var(--color-border)] flex items-center justify-center text-[var(--color-positive)] shrink-0">
              <FileText className="w-5 h-5" />
            </div>
            <div>
              <h4 className="font-bold text-sm text-[var(--color-text)] group-hover:text-[var(--color-positive)] transition-colors">
                {isHi ? 'बैंक ऋण प्रस्ताव (PDF)' : 'Bank Proposal (PDF)'}
              </h4>
              <p className="text-xs text-[var(--color-text-muted)]">
                {isHi ? 'प्रिंट योग्य औपचारिक प्रस्ताव' : 'Downloadable formal loan DPR'}
              </p>
            </div>
          </div>
          <ArrowRight className="w-4 h-4 text-[var(--color-text-subtle)] group-hover:text-[var(--color-positive)] transition-colors" />
        </Link>
      </div>
    </div>
  );
}
