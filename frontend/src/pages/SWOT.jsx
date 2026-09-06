import React, { useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import {
  CheckCircle2,
  AlertTriangle,
  Lightbulb,
  ShieldAlert,
  ArrowRight,
} from 'lucide-react';
import { AnalysisContext } from '../App';
import ProvenanceBadge from '../components/ProvenanceBadge';

export default function SWOT() {
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

  const { business_name, business_name_hi, swot } = analysis;
  const displayName = isHi ? business_name_hi || business_name : business_name;

  const strengths = swot?.strengths || [];
  const weaknesses = swot?.weaknesses || [];
  const opportunities = swot?.opportunities || [];
  const threats = swot?.threats || [];

  return (
    <div className="max-w-6xl mx-auto px-4 sm:px-6 py-6 sm:py-10 space-y-6 sm:space-y-8">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-[var(--color-text)] tracking-tight">
            {t('swot.title')}
          </h1>
          <p className="text-xs sm:text-sm text-[var(--color-text-muted)] mt-1">
            {t('swot.subtitle')} • <span className="font-bold text-[var(--color-text)]">{displayName}</span>
          </p>
        </div>
        <ProvenanceBadge type="ai_advisory" />
      </div>

      {/* 4 Quadrants 2x2 Grid (CSS Grid with equal height per row) */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 items-stretch">
        {/* 1. Strengths (Green) */}
        <div className="gd-card p-5 sm:p-6 flex flex-col justify-between space-y-4 border-[var(--color-positive-border)]">
          <div className="space-y-4">
            <div className="flex items-center justify-between border-b border-[var(--color-border)] pb-3">
              <div className="flex items-center gap-2.5">
                <div className="w-8 h-8 rounded-lg bg-[var(--color-positive-bg)] text-[var(--color-positive)] border border-[var(--color-positive-border)] flex items-center justify-center shrink-0">
                  <CheckCircle2 className="w-4 h-4" />
                </div>
                <div>
                  <h3 className="font-bold text-sm sm:text-base text-[var(--color-text)]">
                    {t('swot.strengths')}
                  </h3>
                  <span className="text-[11px] font-semibold text-[var(--color-positive)] block uppercase tracking-wider">
                    {isHi ? 'आंतरिक अनुकूल कारक' : 'Internal Strengths'}
                  </span>
                </div>
              </div>
              <span className="text-xs font-bold px-2 py-0.5 rounded-full bg-[var(--color-positive-bg)] text-[var(--color-positive)] border border-[var(--color-positive-border)]">
                {strengths.length}
              </span>
            </div>

            <ul className="space-y-2.5 text-xs sm:text-sm text-[var(--color-text)]">
              {strengths.map((item, idx) => (
                <li key={idx} className="flex items-start gap-2.5">
                  <span className="w-1.5 h-1.5 rounded-full bg-[var(--color-positive)] mt-2 shrink-0" />
                  <span className="leading-relaxed">{item}</span>
                </li>
              ))}
            </ul>
          </div>
        </div>

        {/* 2. Weaknesses (Amber) */}
        <div className="gd-card p-5 sm:p-6 flex flex-col justify-between space-y-4 border-[var(--color-caution-border)]">
          <div className="space-y-4">
            <div className="flex items-center justify-between border-b border-[var(--color-border)] pb-3">
              <div className="flex items-center gap-2.5">
                <div className="w-8 h-8 rounded-lg bg-[var(--color-caution-bg)] text-[var(--color-caution)] border border-[var(--color-caution-border)] flex items-center justify-center shrink-0">
                  <AlertTriangle className="w-4 h-4" />
                </div>
                <div>
                  <h3 className="font-bold text-sm sm:text-base text-[var(--color-text)]">
                    {t('swot.weaknesses')}
                  </h3>
                  <span className="text-[11px] font-semibold text-[var(--color-caution)] block uppercase tracking-wider">
                    {isHi ? 'आंतरिक सीमाएं' : 'Internal Constraints'}
                  </span>
                </div>
              </div>
              <span className="text-xs font-bold px-2 py-0.5 rounded-full bg-[var(--color-caution-bg)] text-[var(--color-caution)] border border-[var(--color-caution-border)]">
                {weaknesses.length}
              </span>
            </div>

            <ul className="space-y-2.5 text-xs sm:text-sm text-[var(--color-text)]">
              {weaknesses.map((item, idx) => (
                <li key={idx} className="flex items-start gap-2.5">
                  <span className="w-1.5 h-1.5 rounded-full bg-[var(--color-caution)] mt-2 shrink-0" />
                  <span className="leading-relaxed">{item}</span>
                </li>
              ))}
            </ul>
          </div>
        </div>

        {/* 3. Opportunities (Rule Blue) */}
        <div className="gd-card p-5 sm:p-6 flex flex-col justify-between space-y-4 border-[var(--color-rule-border)]">
          <div className="space-y-4">
            <div className="flex items-center justify-between border-b border-[var(--color-border)] pb-3">
              <div className="flex items-center gap-2.5">
                <div className="w-8 h-8 rounded-lg bg-[var(--color-rule-bg)] text-[var(--color-rule)] border border-[var(--color-rule-border)] flex items-center justify-center shrink-0">
                  <Lightbulb className="w-4 h-4" />
                </div>
                <div>
                  <h3 className="font-bold text-sm sm:text-base text-[var(--color-text)]">
                    {t('swot.opportunities')}
                  </h3>
                  <span className="text-[11px] font-semibold text-[var(--color-rule)] block uppercase tracking-wider">
                    {isHi ? 'बाहरी विकास संभावनाएं' : 'External Growth Drivers'}
                  </span>
                </div>
              </div>
              <span className="text-xs font-bold px-2 py-0.5 rounded-full bg-[var(--color-rule-bg)] text-[var(--color-rule)] border border-[var(--color-rule-border)]">
                {opportunities.length}
              </span>
            </div>

            <ul className="space-y-2.5 text-xs sm:text-sm text-[var(--color-text)]">
              {opportunities.map((item, idx) => (
                <li key={idx} className="flex items-start gap-2.5">
                  <span className="w-1.5 h-1.5 rounded-full bg-[var(--color-rule)] mt-2 shrink-0" />
                  <span className="leading-relaxed">{item}</span>
                </li>
              ))}
            </ul>
          </div>
        </div>

        {/* 4. Threats (Negative Red) */}
        <div className="gd-card p-5 sm:p-6 flex flex-col justify-between space-y-4 border-[var(--color-negative-border)]">
          <div className="space-y-4">
            <div className="flex items-center justify-between border-b border-[var(--color-border)] pb-3">
              <div className="flex items-center gap-2.5">
                <div className="w-8 h-8 rounded-lg bg-[var(--color-negative-bg)] text-[var(--color-negative)] border border-[var(--color-negative-border)] flex items-center justify-center shrink-0">
                  <ShieldAlert className="w-4 h-4" />
                </div>
                <div>
                  <h3 className="font-bold text-sm sm:text-base text-[var(--color-text)]">
                    {t('swot.threats')}
                  </h3>
                  <span className="text-[11px] font-semibold text-[var(--color-negative)] block uppercase tracking-wider">
                    {isHi ? 'बाहरी जोखिम व चुनौतियां' : 'External Risks & Shocks'}
                  </span>
                </div>
              </div>
              <span className="text-xs font-bold px-2 py-0.5 rounded-full bg-[var(--color-negative-bg)] text-[var(--color-negative)] border border-[var(--color-negative-border)]">
                {threats.length}
              </span>
            </div>

            <ul className="space-y-2.5 text-xs sm:text-sm text-[var(--color-text)]">
              {threats.map((item, idx) => (
                <li key={idx} className="flex items-start gap-2.5">
                  <span className="w-1.5 h-1.5 rounded-full bg-[var(--color-negative)] mt-2 shrink-0" />
                  <span className="leading-relaxed">{item}</span>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </div>

      {/* Strategic Roadmap CTA */}
      <div className="gd-card-subtle p-5 sm:p-6 border-[var(--color-border-strong)] flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div className="space-y-1">
          <h4 className="font-bold text-sm sm:text-base text-[var(--color-text)]">
            {isHi ? 'अगला चरण: 90 दिवसीय कार्य योजना' : 'Next Step: 90-Day Tactical Roadmap'}
          </h4>
          <p className="text-xs text-[var(--color-text-muted)] max-w-xl leading-relaxed">
            {isHi
              ? 'इस SWOT मैट्रिक्स के आधार पर तैयार की गई चरणबद्ध कार्य योजना और वैकल्पिक व्यवसायों की सूची देखें।'
              : 'Review operational milestones designed to overcome constraints and capture external opportunities.'}
          </p>
        </div>
        <button
          onClick={() => navigate('/recommendations')}
          className="gd-btn-primary whitespace-nowrap text-xs px-5 py-2.5 shrink-0"
        >
          <span>{isHi ? 'सिफारिशें देखें' : 'View Action Plan'}</span>
          <ArrowRight className="w-3.5 h-3.5" />
        </button>
      </div>
    </div>
  );
}
