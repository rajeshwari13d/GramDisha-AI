import React, { useContext, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import {
  ShieldCheck,
  AlertTriangle,
  TrendingUp,
  ShieldAlert,
  ArrowRight,
  Sparkles,
  FileCheck2,
  CheckCircle2,
  ChevronDown,
  ChevronUp,
} from 'lucide-react';
import { AnalysisContext } from '../App';
import ProvenanceBadge from '../components/ProvenanceBadge';

export default function SWOT() {
  const { analysis } = useContext(AnalysisContext);
  const { t, i18n } = useTranslation();
  const navigate = useNavigate();
  const isHi = i18n.language === 'hi';
  const [activeFilter, setActiveFilter] = useState('all');
  const [expandedMitigation, setExpandedMitigation] = useState(true);

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
          {isHi
            ? 'कृपया ऋण व्यवहार्यता मूल्यांकन आरंभ करें।'
            : 'Please initiate a business viability appraisal first.'}
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
    swot,
  } = analysis;

  const displayName = isHi ? business_name_hi || business_name : business_name;
  const shortId = analysis_id
    ? `GD-APP-${analysis_id.replace(/-/g, '').slice(0, 4).toUpperCase()}`
    : 'GD-APP-DEMO';

  const strengths = swot?.strengths || [];
  const weaknesses = swot?.weaknesses || [];
  const opportunities = swot?.opportunities || [];
  const threats = swot?.threats || [];

  return (
    <div className="app-container py-8 sm:py-10 space-y-7">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-200 pb-4">
        <div>
          <div className="flex items-center gap-1.5 text-xs font-bold text-emerald-700 uppercase tracking-wider">
            <FileCheck2 className="w-3.5 h-3.5" />
            <span>{isHi ? 'रणनीतिक जोखिम व अवसर विश्लेषण' : 'Strategic Appraisal & Risk Matrix'}</span>
            <span className="text-slate-300">•</span>
            <span className="font-mono text-slate-500">{shortId}</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight mt-0.5">
            {t('swot.title')}
          </h1>
          <p className="text-xs sm:text-sm text-slate-500 mt-0.5">
            {displayName} • {location?.village || 'Gram'}, {location?.district || 'District'}, {location?.state || 'State'}
          </p>
        </div>

        {/* Filter Pills */}
        <div className="flex flex-wrap items-center gap-1 p-1 bg-slate-100 rounded-xl border border-slate-200">
          {[
            { id: 'all', label: isHi ? 'सभी 4 चतुर्थांश' : 'All 4 Quadrants' },
            { id: 'strengths', label: isHi ? 'ताकत' : 'Strengths' },
            { id: 'weaknesses', label: isHi ? 'कमजोरी' : 'Weaknesses' },
            { id: 'opportunities', label: isHi ? 'अवसर' : 'Opportunities' },
            { id: 'threats', label: isHi ? 'जोखिम' : 'Threats' },
          ].map((tab) => (
            <button
              key={tab.id}
              type="button"
              onClick={() => setActiveFilter(tab.id)}
              className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-all cursor-pointer ${
                activeFilter === tab.id
                  ? 'bg-emerald-700 text-white shadow-xs font-bold'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>
      </div>

      {/* 2x2 Quadrant Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 items-stretch">
        {/* Strengths */}
        {(activeFilter === 'all' || activeFilter === 'strengths') && (
          <div className="bg-white border border-slate-200 rounded-2xl p-6 flex flex-col justify-between space-y-4 border-t-4 border-t-emerald-600 shadow-sm">
            <div className="space-y-4">
              <div className="flex items-center justify-between border-b border-slate-100 pb-3">
                <div className="flex items-center gap-2.5">
                  <div className="w-8 h-8 rounded-lg bg-emerald-50 text-emerald-700 border border-emerald-200 flex items-center justify-center shrink-0">
                    <ShieldCheck className="w-4 h-4" />
                  </div>
                  <div>
                    <h3 className="font-bold text-base text-slate-900">
                      {t('swot.strengths')}
                    </h3>
                    <span className="text-[11px] font-medium text-slate-500 block">
                      {isHi ? 'आंतरिक अनुकूल क्षमताएं' : 'Internal Competitive Advantages'}
                    </span>
                  </div>
                </div>
                <span className="text-xs font-mono font-bold px-2 py-0.5 rounded-md bg-slate-100 text-slate-800 border border-slate-200">
                  {strengths.length}
                </span>
              </div>

              <ul className="space-y-2.5 text-xs sm:text-sm text-slate-800">
                {strengths.map((item, idx) => (
                  <li key={idx} className="flex items-start gap-2.5 leading-relaxed p-2.5 rounded-xl bg-slate-50 border border-slate-200/80">
                    <span className="w-2 h-2 rounded-full bg-emerald-600 mt-1.5 shrink-0" />
                    <span className="font-medium">{item}</span>
                  </li>
                ))}
              </ul>
            </div>
            <div className="pt-2 border-t border-slate-100 text-[11px] text-slate-400 flex items-center justify-between">
              <span>{isHi ? 'वर्गीकरण: आंतरिक क्षमता' : 'Category: Internal Capability'}</span>
              <ProvenanceBadge type="ai_advisory" />
            </div>
          </div>
        )}

        {/* Weaknesses */}
        {(activeFilter === 'all' || activeFilter === 'weaknesses') && (
          <div className="bg-white border border-slate-200 rounded-2xl p-6 flex flex-col justify-between space-y-4 border-t-4 border-t-amber-500 shadow-sm">
            <div className="space-y-4">
              <div className="flex items-center justify-between border-b border-slate-100 pb-3">
                <div className="flex items-center gap-2.5">
                  <div className="w-8 h-8 rounded-lg bg-amber-50 text-amber-700 border border-amber-200 flex items-center justify-center shrink-0">
                    <AlertTriangle className="w-4 h-4" />
                  </div>
                  <div>
                    <h3 className="font-bold text-base text-slate-900">
                      {t('swot.weaknesses')}
                    </h3>
                    <span className="text-[11px] font-medium text-slate-500 block">
                      {isHi ? 'आंतरिक परिचालन सीमाएं' : 'Internal Operational Constraints'}
                    </span>
                  </div>
                </div>
                <span className="text-xs font-mono font-bold px-2 py-0.5 rounded-md bg-slate-100 text-slate-800 border border-slate-200">
                  {weaknesses.length}
                </span>
              </div>

              <ul className="space-y-2.5 text-xs sm:text-sm text-slate-800">
                {weaknesses.map((item, idx) => (
                  <li key={idx} className="flex items-start gap-2.5 leading-relaxed p-2.5 rounded-xl bg-slate-50 border border-slate-200/80">
                    <span className="w-2 h-2 rounded-full bg-amber-500 mt-1.5 shrink-0" />
                    <span className="font-medium">{item}</span>
                  </li>
                ))}
              </ul>
            </div>
            <div className="pt-2 border-t border-slate-100 text-[11px] text-slate-400 flex items-center justify-between">
              <span>{isHi ? 'वर्गीकरण: आंतरिक सीमा' : 'Category: Internal Limitation'}</span>
              <ProvenanceBadge type="ai_advisory" />
            </div>
          </div>
        )}

        {/* Opportunities */}
        {(activeFilter === 'all' || activeFilter === 'opportunities') && (
          <div className="bg-white border border-slate-200 rounded-2xl p-6 flex flex-col justify-between space-y-4 border-t-4 border-t-sky-600 shadow-sm">
            <div className="space-y-4">
              <div className="flex items-center justify-between border-b border-slate-100 pb-3">
                <div className="flex items-center gap-2.5">
                  <div className="w-8 h-8 rounded-lg bg-sky-50 text-sky-700 border border-sky-200 flex items-center justify-center shrink-0">
                    <TrendingUp className="w-4 h-4" />
                  </div>
                  <div>
                    <h3 className="font-bold text-base text-slate-900">
                      {t('swot.opportunities')}
                    </h3>
                    <span className="text-[11px] font-medium text-slate-500 block">
                      {isHi ? 'बाहरी विकास अवसर' : 'External Market Growth Drivers'}
                    </span>
                  </div>
                </div>
                <span className="text-xs font-mono font-bold px-2 py-0.5 rounded-md bg-slate-100 text-slate-800 border border-slate-200">
                  {opportunities.length}
                </span>
              </div>

              <ul className="space-y-2.5 text-xs sm:text-sm text-slate-800">
                {opportunities.map((item, idx) => (
                  <li key={idx} className="flex items-start gap-2.5 leading-relaxed p-2.5 rounded-xl bg-slate-50 border border-slate-200/80">
                    <span className="w-2 h-2 rounded-full bg-sky-600 mt-1.5 shrink-0" />
                    <span className="font-medium">{item}</span>
                  </li>
                ))}
              </ul>
            </div>
            <div className="pt-2 border-t border-slate-100 text-[11px] text-slate-400 flex items-center justify-between">
              <span>{isHi ? 'वर्गीकरण: बाजार अवसर' : 'Category: Market Driver'}</span>
              <ProvenanceBadge type="ai_advisory" />
            </div>
          </div>
        )}

        {/* Threats */}
        {(activeFilter === 'all' || activeFilter === 'threats') && (
          <div className="bg-white border border-slate-200 rounded-2xl p-6 flex flex-col justify-between space-y-4 border-t-4 border-t-red-600 shadow-sm">
            <div className="space-y-4">
              <div className="flex items-center justify-between border-b border-slate-100 pb-3">
                <div className="flex items-center gap-2.5">
                  <div className="w-8 h-8 rounded-lg bg-red-50 text-red-700 border border-red-200 flex items-center justify-center shrink-0">
                    <ShieldAlert className="w-4 h-4" />
                  </div>
                  <div>
                    <h3 className="font-bold text-base text-slate-900">
                      {t('swot.threats')}
                    </h3>
                    <span className="text-[11px] font-medium text-slate-500 block">
                      {isHi ? 'बाहरी जोखिम व चुनौतियां' : 'External Risks & Market Shocks'}
                    </span>
                  </div>
                </div>
                <span className="text-xs font-mono font-bold px-2 py-0.5 rounded-md bg-slate-100 text-slate-800 border border-slate-200">
                  {threats.length}
                </span>
              </div>

              <ul className="space-y-2.5 text-xs sm:text-sm text-slate-800">
                {threats.map((item, idx) => (
                  <li key={idx} className="flex items-start gap-2.5 leading-relaxed p-2.5 rounded-xl bg-slate-50 border border-slate-200/80">
                    <span className="w-2 h-2 rounded-full bg-red-600 mt-1.5 shrink-0" />
                    <span className="font-medium">{item}</span>
                  </li>
                ))}
              </ul>
            </div>
            <div className="pt-2 border-t border-slate-100 text-[11px] text-slate-400 flex items-center justify-between">
              <span>{isHi ? 'वर्गीकरण: बाह्य जोखिम' : 'Category: External Risk'}</span>
              <ProvenanceBadge type="ai_advisory" />
            </div>
          </div>
        )}
      </div>

      {/* Expandable Risk Mitigation Accordion */}
      <div className="bg-white border border-slate-200 rounded-2xl p-6 space-y-4 shadow-sm">
        <button
          type="button"
          onClick={() => setExpandedMitigation(!expandedMitigation)}
          className="flex items-center justify-between w-full text-left cursor-pointer"
        >
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-lg bg-emerald-50 text-emerald-700 flex items-center justify-center">
              <CheckCircle2 className="w-4 h-4" />
            </div>
            <div>
              <h4 className="font-bold text-base text-slate-900">
                {isHi ? 'बैंक अनुशंसित जोखिम न्यूनीकरण उपाय (Risk Mitigations)' : 'Bank-Recommended Risk Mitigations'}
              </h4>
              <p className="text-xs text-slate-500">
                {isHi ? 'संभावित जोखिमों से बचाव हेतु प्राथमिक सुरक्षात्मक कदम' : 'Standard covenants to safeguard repayment capacity'}
              </p>
            </div>
          </div>
          {expandedMitigation ? <ChevronUp className="w-5 h-5 text-slate-400" /> : <ChevronDown className="w-5 h-5 text-slate-400" />}
        </button>

        {expandedMitigation && (
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5 pt-2 border-t border-slate-100">
            <div className="p-3.5 rounded-xl bg-slate-50 border border-slate-200 space-y-1">
              <span className="text-xs font-bold text-emerald-800 block">1. कार्यशील पूंजी सुरक्षा (Working Capital Buffer)</span>
              <p className="text-xs text-slate-600 leading-relaxed">
                {isHi ? 'कम से कम 45 दिन का आपातकालीन कैश रिजर्व चालू खाते में संचित रखें।' : 'Maintain minimum 45 days emergency operational liquidity in current account.'}
              </p>
            </div>

            <div className="p-3.5 rounded-xl bg-slate-50 border border-slate-200 space-y-1">
              <span className="text-xs font-bold text-emerald-800 block">2. आपूर्ति विविधता (Supplier Diversification)</span>
              <p className="text-xs text-slate-600 leading-relaxed">
                {isHi ? 'कच्चा माल खरीदने हेतु 2 से अधिक क्षेत्रीय सप्लायरों से संपर्क बनाए रखें।' : 'Engage with multiple regional wholesalers to prevent supply disruption.'}
              </p>
            </div>
          </div>
        )}
      </div>

      {/* Strategic Roadmap CTA */}
      <div className="bg-white border border-slate-200 rounded-2xl p-6 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 shadow-sm">
        <div className="space-y-1">
          <div className="flex items-center gap-2">
            <Sparkles className="w-4 h-4 text-emerald-700 shrink-0" />
            <h4 className="font-bold text-base text-slate-900">
              {isHi ? 'अगला चरण: 90-दिवसीय कार्यान्वयन रोडमैप' : 'Next Step: 90-Day Tactical Execution Roadmap'}
            </h4>
          </div>
          <p className="text-xs text-slate-500 max-w-xl leading-relaxed">
            {isHi
              ? 'इस SWOT मैट्रिक्स के आधार पर तैयार की गई चरणबद्ध कार्य योजना और वैकल्पिक व्यवसायों की सूची देखें।'
              : 'Review operational milestones designed to overcome constraints and capture external opportunities.'}
          </p>
        </div>
        <button
          onClick={() => navigate('/recommendations')}
          className="gd-btn-primary whitespace-nowrap text-xs px-5 py-2.5 shrink-0 font-bold"
        >
          <span>{isHi ? 'सिफारिशें देखें' : 'View Action Plan'}</span>
          <ArrowRight className="w-3.5 h-3.5" />
        </button>
      </div>
    </div>
  );
}
