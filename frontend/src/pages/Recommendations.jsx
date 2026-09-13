import React, { useContext, useState } from 'react';
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
  FileCheck2,
  Clock,
  CheckSquare,
  Square,
} from 'lucide-react';
import { AnalysisContext } from '../App';
import ProvenanceBadge from '../components/ProvenanceBadge';

export default function Recommendations() {
  const { analysis } = useContext(AnalysisContext);
  const { t, i18n } = useTranslation();
  const navigate = useNavigate();
  const isHi = i18n.language === 'hi';
  const [completedTasks, setCompletedTasks] = useState({});

  const toggleTask = (key) => {
    setCompletedTasks((prev) => ({ ...prev, [key]: !prev[key] }));
  };

  if (!analysis) {
    return (
      <div className="app-container my-16 max-w-md p-8 bg-white border border-slate-200 rounded-2xl text-center space-y-4 shadow-sm">
        <div className="w-12 h-12 rounded-xl bg-emerald-50 border border-emerald-200 text-emerald-700 mx-auto flex items-center justify-center text-lg font-bold">
          GD
        </div>
        <h3 className="text-lg font-bold text-slate-900">
          {isHi ? 'कोई सक्रिय विश्लेषण नहीं मिला' : 'No Active Analysis Record'}
        </h3>
        <p className="text-xs text-slate-500">
          {isHi ? 'कृपया पहले ऋण व्यवहार्यता मूल्यांकन पूर्ण करें।' : 'Please complete an enterprise assessment first.'}
        </p>
        <button
          onClick={() => navigate('/assess')}
          className="gd-btn-primary mx-auto font-bold"
        >
          {isHi ? 'नया मूल्यांकन शुरू करें' : 'Start Assessment'}
        </button>
      </div>
    );
  }

  const {
    analysis_id,
    business_name,
    business_name_hi,
    location,
    viability,
    recommendation,
  } = analysis;

  const displayName = isHi ? business_name_hi || business_name : business_name;
  const shortId = analysis_id
    ? `GD-APP-${analysis_id.replace(/-/g, '').slice(0, 4).toUpperCase()}`
    : 'GD-APP-DEMO';

  const actions = isHi
    ? recommendation.actions_hi || recommendation.actions || []
    : recommendation.actions || [];
  const alternatives = isHi
    ? recommendation.alternatives_hi || recommendation.alternative_businesses || []
    : recommendation.alternative_businesses || [];

  const verdictState = recommendation.state || 'RECOMMENDED_WITH_CONDITIONS';

  let verdictStyle = {
    bg: '#ECFDF5',
    color: '#047857',
    border: '#A7F3D0',
    icon: CheckCircle2,
    label: isHi ? 'ऋण स्वीकृति हेतु अनुशंसित' : 'RECOMMENDED FOR SANCTION',
  };
  if (verdictState === 'NOT_RECOMMENDED') {
    verdictStyle = {
      bg: '#FEF2F2',
      color: '#DC2626',
      border: '#FECACA',
      icon: AlertOctagon,
      label: isHi ? 'वर्तमान में अनुशंसित नहीं' : 'NOT RECOMMENDED',
    };
  } else if (verdictState === 'RECOMMENDED_WITH_CONDITIONS') {
    verdictStyle = {
      bg: '#FFFBEB',
      color: '#D97706',
      border: '#FDE68A',
      icon: AlertTriangle,
      label: isHi ? 'शर्तों के साथ अनुशंसित' : 'CONDITIONALLY RECOMMENDED',
    };
  }
  const VerdictIcon = verdictStyle.icon;

  const phases = [
    {
      num: '01',
      title: isHi ? 'चरण 1: दिवस 1 - 30' : 'Phase 1: Days 1 - 30',
      subtitle: isHi ? 'दस्तावेजीकरण व लाइसेंस' : 'Documentation & Licensing',
      items: actions.slice(0, 2),
    },
    {
      num: '02',
      title: isHi ? 'चरण 2: दिवस 31 - 60' : 'Phase 2: Days 31 - 60',
      subtitle: isHi ? 'संसाधन व उपकरण खरीद' : 'Procurement & Site Setup',
      items: actions.slice(2, 4),
    },
    {
      num: '03',
      title: isHi ? 'चरण 3: दिवस 61 - 90' : 'Phase 3: Days 61 - 90',
      subtitle: isHi ? 'परिचालन व ग्राहक जुड़ाव' : 'Commercial Launch & Revenue',
      items: actions.slice(4),
    },
  ];

  return (
    <div className="app-container py-8 sm:py-10 space-y-7">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-200 pb-4">
        <div>
          <div className="flex items-center gap-1.5 text-xs font-bold text-emerald-700 uppercase tracking-wider">
            <FileCheck2 className="w-3.5 h-3.5" />
            <span>{isHi ? 'रणनीतिक सिफारिशें व ऋण परामर्श' : 'Credit Appraisal & Advisory Verdict'}</span>
            <span className="text-slate-300">•</span>
            <span className="font-mono text-slate-500">{shortId}</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight mt-0.5">
            {t('recommendations.title')}
          </h1>
          <p className="text-xs sm:text-sm text-slate-500 mt-0.5">
            {displayName} • {location?.village || 'Gram'}, {location?.district || 'District'}, {location?.state || 'State'}
          </p>
        </div>
        <ProvenanceBadge type="ai_advisory" />
      </div>

      {/* Hero Recommendation Appraisal Banner */}
      <div className="bg-white border border-slate-200 rounded-2xl p-6 sm:p-7 space-y-5 border-t-4 border-t-emerald-600 shadow-sm">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-5 border-b border-slate-100 pb-5">
          <div className="space-y-2 max-w-2xl">
            <div className="flex items-center gap-2">
              <span
                className="px-2.5 py-1 rounded-full text-xs font-bold uppercase tracking-wider border inline-flex items-center gap-1.5"
                style={{
                  backgroundColor: verdictStyle.bg,
                  color: verdictStyle.color,
                  borderColor: verdictStyle.border,
                }}
              >
                <VerdictIcon className="w-3.5 h-3.5" />
                <span>{verdictStyle.label}</span>
              </span>
              <ProvenanceBadge type="ai_advisory" />
            </div>
            <h2 className="text-xl sm:text-2xl font-bold text-slate-900 leading-snug">
              {isHi ? recommendation.recommendation_hi : recommendation.recommendation_en}
            </h2>
          </div>

          <div className="text-left sm:text-right shrink-0 bg-slate-50 p-4 rounded-xl border border-slate-200">
            <span className="text-[11px] uppercase font-bold text-slate-500 block tracking-wider">
              {isHi ? 'व्यवहार्यता स्कोर' : 'Appraisal Score'}
            </span>
            <div className="text-3xl sm:text-4xl font-bold text-amber-600 tabular-nums mt-0.5">
              {viability.viability_score}
              <span className="text-sm font-normal text-slate-500">/100</span>
            </div>
          </div>
        </div>

        {/* Narrative */}
        {recommendation.ai_explanation && (
          <div className="p-4 sm:p-5 rounded-xl bg-slate-50 border border-slate-200/80 space-y-1.5">
            <div className="flex items-center gap-1.5 text-xs font-bold text-slate-500 uppercase tracking-wider">
              <Sparkles className="w-3.5 h-3.5 text-emerald-700" />
              <span>{isHi ? 'एआई रणनीतिक ऋण विश्लेषण' : 'Credit Analyst Synthesis Commentary'}</span>
            </div>
            <p className="text-xs sm:text-sm text-slate-800 leading-relaxed font-medium">
              {recommendation.ai_explanation}
            </p>
          </div>
        )}
      </div>

      {/* 90-Day Tactical Action Roadmap with Checkboxes */}
      <div className="bg-white border border-slate-200 rounded-2xl p-6 sm:p-7 space-y-5 shadow-sm">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-slate-100 pb-3">
          <div>
            <div className="flex items-center gap-2 font-bold text-slate-900 text-base sm:text-lg">
              <Calendar className="w-4 h-4 text-emerald-700 shrink-0" />
              <span>{isHi ? '90-दिवसीय चरणबद्ध कार्यान्वयन रोडमैप' : '90-Day Sequenced Execution Roadmap'}</span>
            </div>
            <p className="text-xs text-slate-500 mt-0.5">
              {isHi
                ? 'व्यवसाय शुरू करने के लिए समयबद्ध मील के पत्थर (क्लिक कर चेकलिस्ट अपडेट करें):'
                : 'Actionable operational milestones (click tasks to check off progress):'}
            </p>
          </div>
          <ProvenanceBadge type="ai_advisory" />
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-5 items-stretch">
          {phases.map((phase, pIdx) => (
            <div
              key={pIdx}
              className="p-5 rounded-xl bg-slate-50 border border-slate-200 flex flex-col justify-between space-y-4"
            >
              <div className="space-y-3">
                <div className="flex items-center justify-between border-b border-slate-200/80 pb-2.5">
                  <div>
                    <span className="font-bold text-sm text-slate-900 block">
                      {phase.title}
                    </span>
                    <span className="text-[11px] text-slate-500 font-medium">
                      {phase.subtitle}
                    </span>
                  </div>
                  <span className="text-xs font-mono font-bold text-emerald-700 bg-white px-2 py-0.5 rounded border border-slate-200">
                    {phase.num}
                  </span>
                </div>

                <div className="space-y-2">
                  {phase.items && phase.items.length > 0 ? (
                    phase.items.map((act, idx) => {
                      const taskId = `p${pIdx}-t${idx}`;
                      const isDone = !!completedTasks[taskId];
                      return (
                        <button
                          key={idx}
                          type="button"
                          onClick={() => toggleTask(taskId)}
                          className={`w-full flex items-start gap-2.5 text-xs text-left p-2.5 rounded-lg transition-all cursor-pointer border ${
                            isDone
                              ? 'bg-emerald-50 text-emerald-800 border-emerald-200 line-through'
                              : 'bg-white text-slate-800 border-slate-200 hover:bg-slate-50'
                          }`}
                        >
                          {isDone ? (
                            <CheckSquare className="w-4 h-4 text-emerald-700 shrink-0 mt-0.5" />
                          ) : (
                            <Square className="w-4 h-4 text-slate-400 shrink-0 mt-0.5" />
                          )}
                          <span className="font-medium">{act}</span>
                        </button>
                      );
                    })
                  ) : (
                    <div className="flex items-center gap-2 text-xs text-slate-400">
                      <Clock className="w-3.5 h-3.5" />
                      <span>{isHi ? 'कार्यान्वयन मील के पत्थर' : 'Operational milestones'}</span>
                    </div>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Alternative Enterprises */}
      {alternatives && alternatives.length > 0 && (
        <div className="bg-white border border-slate-200 rounded-2xl p-6 sm:p-7 space-y-4 shadow-sm">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-slate-100 pb-3">
            <div>
              <div className="flex items-center gap-2 font-bold text-slate-900 text-base sm:text-lg">
                <Building2 className="w-4 h-4 text-emerald-700 shrink-0" />
                <span>{isHi ? 'समान पूंजी में अनुशंसित वैकल्पिक व्यवसाय' : 'Viable Alternative Rural Enterprises'}</span>
              </div>
              <p className="text-xs text-slate-500 mt-0.5">
                {isHi
                  ? 'आपकी उपलब्ध पूंजी में यह अन्य व्यवसाय भी अत्यधिक व्यवहार्य हैं:'
                  : 'High-viability enterprise models suitable for identical capital and demographic catchment:'}
              </p>
            </div>
            <ProvenanceBadge type="ai_advisory" />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {alternatives.map((alt, idx) => (
              <div
                key={idx}
                className="p-4 rounded-xl bg-slate-50 border border-slate-200 flex items-center justify-between gap-3"
              >
                <div>
                  <h4 className="font-bold text-slate-900 text-sm">{alt}</h4>
                  <span className="text-[11px] text-slate-500 font-medium block mt-0.5">
                    {isHi ? 'समान पूंजी हेतु उच्च व्यवहार्यता' : 'Matching Capital Model'}
                  </span>
                </div>
                <Link
                  to="/comparison"
                  className="gd-btn-secondary text-xs px-3 py-1.5 min-h-[34px] shrink-0 font-semibold"
                >
                  <Scale className="w-3.5 h-3.5" />
                  <span>{isHi ? 'तुलना' : 'Compare'}</span>
                </Link>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Bottom CTA for Formal Loan PDF */}
      <div className="bg-white border border-slate-200 rounded-2xl p-6 sm:p-7 border-l-4 border-l-emerald-700 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-5 shadow-sm">
        <div className="space-y-1">
          <h3 className="text-base sm:text-lg font-bold text-slate-900">
            {isHi ? 'बैंक ऋण आवेदन हेतु विस्तृत परियोजना रिपोर्ट (DPR)' : 'Formal Bank Project Appraisal Document (DPR)'}
          </h3>
          <p className="text-xs sm:text-sm text-slate-500 max-w-xl">
            {isHi
              ? 'इस रिपोर्ट में सभी 28-तिमाही वित्तीय गणनाएं, ईएमआई तालिका और आधिकारिक डेटा साक्ष्य शामिल हैं।'
              : 'Includes complete 28-quarter amortization schedules, 10:90 capital ledger, and statutory credit appraisal disclosures.'}
          </p>
        </div>
        <Link
          to="/report"
          className="gd-btn-primary whitespace-nowrap px-6 py-3 shrink-0 font-bold"
        >
          <FileText className="w-4 h-4" />
          <span>{isHi ? 'औपचारिक रिपोर्ट देखें' : 'View Bank Proposal'}</span>
          <ArrowRight className="w-3.5 h-3.5" />
        </Link>
      </div>
    </div>
  );
}
