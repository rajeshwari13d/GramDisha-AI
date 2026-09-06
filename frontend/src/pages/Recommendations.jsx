import React, { useContext } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import {
  Sparkles,
  CheckCircle2,
  Calendar,
  ArrowRight,
  Building2,
  Scale,
  FileText,
  AlertTriangle,
  AlertOctagon,
} from 'lucide-react';
import { AnalysisContext } from '../App';
import ProvenanceBadge from '../components/ProvenanceBadge';

export default function Recommendations() {
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
    viability,
    recommendation,
  } = analysis;

  const displayName = isHi ? business_name_hi || business_name : business_name;
  const actions = isHi
    ? recommendation.actions_hi || recommendation.actions || []
    : recommendation.actions || [];
  const alternatives = isHi
    ? recommendation.alternatives_hi || recommendation.alternative_businesses || []
    : recommendation.alternative_businesses || [];

  const verdictState = recommendation.state || 'RECOMMENDED_WITH_CONDITIONS';

  let verdictStyle = {
    bg: 'var(--color-positive-bg)',
    color: 'var(--color-positive)',
    border: 'var(--color-positive-border)',
    icon: CheckCircle2,
  };
  if (verdictState === 'NOT_RECOMMENDED') {
    verdictStyle = {
      bg: 'var(--color-negative-bg)',
      color: 'var(--color-negative)',
      border: 'var(--color-negative-border)',
      icon: AlertOctagon,
    };
  } else if (verdictState === 'RECOMMENDED_WITH_CONDITIONS') {
    verdictStyle = {
      bg: 'var(--color-caution-bg)',
      color: 'var(--color-caution)',
      border: 'var(--color-caution-border)',
      icon: AlertTriangle,
    };
  }
  const VerdictIcon = verdictStyle.icon;

  // 3-Phase grouping of 90-day action plan
  const phases = [
    {
      title: isHi ? 'चरण 1: दिवस 1 - 30 (तैयारी व लाइसेंस)' : 'Phase 1: Days 1 - 30 (Setup & Documentation)',
      items: actions.slice(0, 2),
    },
    {
      title: isHi ? 'चरण 2: दिवस 31 - 60 (संसाधन व उपकरण खरीद)' : 'Phase 2: Days 31 - 60 (Procurement & Setup)',
      items: actions.slice(2, 4),
    },
    {
      title: isHi ? 'चरण 3: दिवस 61 - 90 (परिचालन व ग्राहक जुड़ाव)' : 'Phase 3: Days 61 - 90 (Launch & Traction)',
      items: actions.slice(4),
    },
  ];

  return (
    <div className="max-w-6xl mx-auto px-4 sm:px-6 py-6 sm:py-10 space-y-6 sm:space-y-8">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-[var(--color-text)] tracking-tight">
            {t('recommendations.title')}
          </h1>
          <p className="text-xs sm:text-sm text-[var(--color-text-muted)] mt-1">
            {isHi ? 'रणनीतिक सिफारिशें व 90-दिवसीय कार्यान्वयन रोडमैप' : 'Actionable strategic recommendations & 90-day execution roadmap'}
          </p>
        </div>
        <ProvenanceBadge type="ai_advisory" />
      </div>

      {/* Hero Recommendation State Banner */}
      <div className="gd-card p-5 sm:p-7 space-y-5">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-[var(--color-border)] pb-4">
          <div className="space-y-1.5">
            <div className="flex items-center gap-2">
              <span
                className="px-2.5 py-0.5 rounded-full text-[11px] font-black uppercase tracking-wider border inline-flex items-center gap-1.5"
                style={{
                  backgroundColor: verdictStyle.bg,
                  color: verdictStyle.color,
                  borderColor: verdictStyle.border,
                }}
              >
                <VerdictIcon className="w-3.5 h-3.5" />
                <span>{verdictState.replace(/_/g, ' ')}</span>
              </span>
              <ProvenanceBadge type="ai_advisory" />
            </div>
            <h2 className="text-xl sm:text-2xl font-extrabold text-[var(--color-text)] leading-snug">
              {isHi ? recommendation.recommendation_hi : recommendation.recommendation_en}
            </h2>
          </div>

          <div className="text-left sm:text-right shrink-0">
            <span className="text-[11px] uppercase font-bold text-[var(--color-text-subtle)] block">
              {isHi ? 'व्यवहार्यता स्कोर' : 'Viability Score'}
            </span>
            <div className="text-2xl sm:text-3xl font-extrabold text-[var(--color-positive)] tabular-nums">
              {viability.viability_score}
              <span className="text-xs font-normal text-[var(--color-text-subtle)]">/100</span>
            </div>
          </div>
        </div>

        {/* Narrative */}
        {recommendation.ai_explanation && (
          <div className="p-4 rounded-xl bg-[var(--color-surface-subtle)] border border-[var(--color-border)] space-y-1.5">
            <div className="flex items-center gap-1.5 text-xs font-bold text-[var(--color-text-muted)] uppercase tracking-wider">
              <Sparkles className="w-3.5 h-3.5 text-[var(--color-advisory)]" />
              <span>{isHi ? 'एआई रणनीतिक परामर्श' : 'AI Strategic Advisory Commentary'}</span>
            </div>
            <p className="text-xs sm:text-sm text-[var(--color-text)] leading-relaxed">
              {recommendation.ai_explanation}
            </p>
          </div>
        )}
      </div>

      {/* 90-Day Action Roadmap (1-col mobile, 3-col tablet/desktop) */}
      <div className="gd-card p-5 sm:p-7 space-y-5">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-[var(--color-border)] pb-3">
          <div>
            <div className="flex items-center gap-2 font-bold text-[var(--color-text)] text-sm sm:text-base">
              <Calendar className="w-4 h-4 text-[var(--color-positive)] shrink-0" />
              <span>{isHi ? '90-दिवसीय चरणबद्ध कार्य योजना' : '90-Day Actionable Roadmap'}</span>
            </div>
            <p className="text-xs text-[var(--color-text-muted)] mt-0.5">
              {isHi
                ? 'व्यवसाय शुरू करने के लिए समयबद्ध एवं सुव्यवस्थित मील के पत्थर।'
                : 'Concrete, sequenced execution milestones to launch your enterprise methodically.'}
            </p>
          </div>
          <ProvenanceBadge type="ai_advisory" />
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-5 items-stretch">
          {phases.map((phase, pIdx) => (
            <div
              key={pIdx}
              className="p-4 sm:p-5 rounded-xl bg-[var(--color-surface-subtle)] border border-[var(--color-border)] flex flex-col justify-between space-y-4"
            >
              <div className="space-y-3">
                <h4 className="font-bold text-xs sm:text-sm text-[var(--color-text)] border-b border-[var(--color-border)] pb-2">
                  {phase.title}
                </h4>
                <div className="space-y-2.5">
                  {phase.items && phase.items.length > 0 ? (
                    phase.items.map((act, idx) => (
                      <div key={idx} className="flex items-start gap-2 text-xs text-[var(--color-text)] leading-relaxed font-medium">
                        <CheckCircle2 className="w-3.5 h-3.5 text-[var(--color-positive)] shrink-0 mt-0.5" />
                        <span>{act}</span>
                      </div>
                    ))
                  ) : (
                    <p className="text-xs text-[var(--color-text-subtle)]">Operational execution phase.</p>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Alternative Businesses */}
      {alternatives && alternatives.length > 0 && (
        <div className="gd-card p-5 sm:p-7 space-y-5">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-[var(--color-border)] pb-3">
            <div>
              <div className="flex items-center gap-2 font-bold text-[var(--color-text)] text-sm sm:text-base">
                <Building2 className="w-4 h-4 text-[var(--color-rule)] shrink-0" />
                <span>{isHi ? 'समान पूंजी में अनुशंसित वैकल्पिक व्यवसाय' : 'Recommended Alternative Enterprises'}</span>
              </div>
              <p className="text-xs text-[var(--color-text-muted)] mt-0.5">
                {isHi
                  ? 'आपकी उपलब्ध पूंजी में यह अन्य व्यवसाय भी अत्यधिक व्यवहार्य हैं:'
                  : 'Alternative rural business models suitable for identical capital in this geography:'}
              </p>
            </div>
            <ProvenanceBadge type="ai_advisory" />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {alternatives.map((alt, idx) => (
              <div
                key={idx}
                className="p-4 rounded-xl bg-[var(--color-surface-subtle)] border border-[var(--color-border)] flex items-center justify-between gap-3"
              >
                <div>
                  <h4 className="font-bold text-[var(--color-text)] text-sm">{alt}</h4>
                  <span className="text-[11px] text-[var(--color-text-muted)] block">
                    {isHi ? 'उच्च व्यवहार्यता संभावना' : 'High Viability Candidate'}
                  </span>
                </div>
                <Link
                  to="/comparison"
                  className="gd-btn-secondary text-xs px-3 py-1.5 min-h-[36px] shrink-0"
                >
                  <Scale className="w-3.5 h-3.5" />
                  <span>{isHi ? 'तुलना करें' : 'Compare'}</span>
                </Link>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Bottom CTA for Formal Loan PDF */}
      <div className="gd-card-subtle p-6 sm:p-8 border-[var(--color-border-strong)] flex flex-col sm:flex-row items-start sm:items-center justify-between gap-6">
        <div className="space-y-1">
          <h3 className="text-lg sm:text-xl font-bold text-[var(--color-text)]">
            {isHi ? 'बैंक ऋण आवेदन हेतु पूरी रिपोर्ट डाउनलोड करें' : 'Formal Bank Loan Proposal PDF'}
          </h3>
          <p className="text-xs sm:text-sm text-[var(--color-text-muted)]">
            {isHi
              ? 'इस रिपोर्ट में सभी वित्तीय गणनाएं, ईएमआई चार्ट और डेटा साक्ष्य शामिल हैं।'
              : 'Includes complete amortization schedules, data provenance disclosures, and institutional summary.'}
          </p>
        </div>
        <Link
          to="/report"
          className="gd-btn-primary whitespace-nowrap px-6 py-3 shrink-0"
        >
          <FileText className="w-4 h-4" />
          <span>{isHi ? 'औपचारिक रिपोर्ट देखें' : 'View Bank Proposal'}</span>
        </Link>
      </div>
    </div>
  );
}
