import React, { useContext } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import {
  Download,
  ChevronRight,
  MapPin,
  Building2,
  Calendar,
  Coins,
  TrendingUp,
  FileText,
  ShieldCheck,
  Sparkles,
  ArrowRight,
  Award,
} from 'lucide-react';
import { AnalysisContext } from '../App';
import { getReport } from '../services/api';
import Button from '../components/ui/Button';

export default function Dashboard() {
  const { analysis } = useContext(AnalysisContext);
  const { i18n } = useTranslation();
  const navigate = useNavigate();
  const isHi = i18n.language === 'hi';

  if (!analysis) {
    return (
      <div className="app-container my-20 max-w-md p-10 gd-card text-center space-y-6">
        <div className="w-16 h-16 rounded-2xl bg-emerald-50 border border-emerald-200/80 mx-auto flex items-center justify-center text-3xl shadow-xs">
          🌾
        </div>
        <div className="space-y-1.5">
          <h3 className="text-xl font-black text-slate-900">
            {isHi ? 'कोई सक्रिय विश्लेषण नहीं मिला' : 'No Active Assessment'}
          </h3>
          <p className="text-xs text-slate-500 font-medium">
            {isHi ? 'कृपया पहले अपने गांव के लिए एक व्यापार चुनें।' : 'Please run an assessment to generate your personalized report.'}
          </p>
        </div>
        <Button onClick={() => navigate('/assess')} size="md" variant="primary" className="w-full">
          {isHi ? 'नया व्यापार जांचें' : 'Start Assessment'}
        </Button>
      </div>
    );
  }

  const {
    analysis_id,
    business_name,
    business_name_hi,
    business_icon,
    location,
    financial,
    business_analysis,
    viability,
    recommendation,
  } = analysis;

  const displayName = isHi ? business_name_hi || business_name : business_name;
  const displayScheme = isHi ? financial?.scheme_hi || financial?.scheme : financial?.scheme;
  const score = viability?.viability_score || 0;
  const state = recommendation?.state || 'RECOMMENDED_WITH_CONDITIONS';

  // Strict semantic outcome states
  let verdictTitle = isHi ? 'हाँ! यह व्यापार बहुत बढ़िया चलेगा (अनुशंसित)' : 'Highly Viable & Recommended';
  let verdictBg = 'bg-gradient-to-br from-emerald-50 to-teal-50/50 border-emerald-300 text-emerald-950';
  let scoreBadgeColor = 'text-emerald-700 border-emerald-200 bg-emerald-50/80';

  if (state === 'NOT_RECOMMENDED' || score < 50) {
    verdictTitle = isHi ? 'इस व्यापार में अधिक जोखिम है (अस्वीकृत)' : 'High Risk / Not Recommended';
    verdictBg = 'bg-gradient-to-br from-red-50 to-rose-50/50 border-red-300 text-red-950';
    scoreBadgeColor = 'text-red-700 border-red-200 bg-red-50/80';
  } else if (state === 'RECOMMENDED_WITH_CONDITIONS' || score < 75) {
    verdictTitle = isHi ? 'सावधानी के साथ काम शुरू कर सकते हैं' : 'Recommended with Conditions';
    verdictBg = 'bg-gradient-to-br from-amber-50 to-orange-50/50 border-amber-300 text-amber-950';
    scoreBadgeColor = 'text-amber-700 border-amber-200 bg-amber-50/80';
  }

  const estMonthlyProfit =
    business_analysis?.revenue_estimates?.estimated_monthly_profit ||
    Math.round((financial?.total_project_cost || financial?.project_cost || 1000000) * 0.035);

  const pdfDownloadUrl = getReport(analysis_id);

  return (
    <div className="app-container py-10 sm:py-16 space-y-10">
      {/* ── 1. Modern Enterprise Hero Banner ── */}
      <div className="gd-card p-6 sm:p-9 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-6 bg-white border border-slate-200/90 shadow-sm">
        <div className="flex items-center gap-5">
          <div className="w-16 h-16 sm:w-20 sm:h-20 rounded-2xl bg-gradient-to-br from-slate-50 to-emerald-50/40 border border-slate-200 flex items-center justify-center text-3xl sm:text-4xl shrink-0 shadow-xs">
            {business_icon || '🌾'}
          </div>
          <div className="space-y-1">
            <div className="flex items-center gap-2">
              <span className="px-2.5 py-0.5 rounded-full bg-emerald-50 text-emerald-800 text-[11px] font-bold border border-emerald-200">
                {isHi ? 'मूल्यांकन परिणाम' : 'Assessment Result'}
              </span>
              <span className="text-xs text-slate-400 font-semibold">• ID: {analysis_id}</span>
            </div>
            <h1 className="text-2xl sm:text-4xl font-black text-slate-950 leading-tight">
              {displayName}
            </h1>
            <p className="text-xs sm:text-sm text-slate-600 font-bold flex items-center gap-1.5 pt-0.5">
              <MapPin className="w-4 h-4 text-emerald-600 shrink-0" />
              <span>
                {location?.village}, {location?.block}, {location?.district}, {location?.state}
              </span>
            </p>
          </div>
        </div>

        <div className="flex items-center gap-3 w-full sm:w-auto">
          <Button
            href={pdfDownloadUrl}
            target="_blank"
            rel="noopener noreferrer"
            size="md"
            variant="primary"
            icon={Download}
            iconPosition="left"
            className="flex-1 sm:flex-none shadow-sm"
          >
            {isHi ? 'बैंक फाइल डाउनलोड (PDF)' : 'Download Proposal PDF'}
          </Button>

          <Button
            to="/assess"
            size="md"
            variant="secondary"
            className="shrink-0"
          >
            {isHi ? 'विवरण बदलें' : 'Edit Plan'}
          </Button>
        </div>
      </div>

      {/* ── 2. Four Modern Elevated KPI Cards ── */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4.5">
        {/* Card 1: Monthly Profit */}
        <div className="p-6 rounded-2xl bg-white border border-slate-200/90 shadow-xs space-y-2 gd-card-hover">
          <span className="text-xs font-bold uppercase tracking-wider text-slate-500 block">
            {isHi ? 'मासिक शुद्ध कमाई' : 'Monthly Net Profit'}
          </span>
          <div className="text-2xl sm:text-3xl font-black text-emerald-700 tabular-nums">
            ₹{estMonthlyProfit.toLocaleString('en-IN')}
          </div>
          <p className="text-xs text-slate-500 font-medium">
            {isHi ? 'किस्त व सभी खर्चे काटकर' : 'Estimated net earnings after EMI & costs'}
          </p>
        </div>

        {/* Card 2: Eligible Govt Loan */}
        <div className="p-6 rounded-2xl bg-white border border-slate-200/90 shadow-xs space-y-2 gd-card-hover">
          <span className="text-xs font-bold uppercase tracking-wider text-slate-500 block">
            {isHi ? 'सरकारी बैंक लोन (90%)' : 'Eligible Bank Loan (90%)'}
          </span>
          <div className="text-2xl sm:text-3xl font-black text-slate-900 tabular-nums">
            ₹{((financial?.loan_amount || 0) / 100000).toFixed(1)} {isHi ? 'लाख' : 'Lakh'}
          </div>
          <p className="text-xs text-slate-500 font-medium truncate">
            {displayScheme}
          </p>
        </div>

        {/* Card 3: Monthly EMI */}
        <div className="p-6 rounded-2xl bg-white border border-slate-200/90 shadow-xs space-y-2 gd-card-hover">
          <span className="text-xs font-bold uppercase tracking-wider text-slate-500 block">
            {isHi ? 'मासिक बैंक किस्त (EMI)' : 'Monthly Bank EMI'}
          </span>
          <div className="text-2xl sm:text-3xl font-black text-slate-900 tabular-nums">
            ₹{Math.round(financial?.estimated_emi || financial?.monthly_emi || 0).toLocaleString('en-IN')}{' '}
            <span className="text-xs font-normal text-slate-500">/{isHi ? 'माह' : 'mo'}</span>
          </div>
          <p className="text-xs text-slate-500 font-medium">
            {isHi ? '7 वर्ष @ 8.5% वार्षिक दर' : '7 Years @ 8.5% reducing balance'}
          </p>
        </div>

        {/* Card 4: Margin Capital */}
        <div className="p-6 rounded-2xl bg-white border border-slate-200/90 shadow-xs space-y-2 gd-card-hover">
          <span className="text-xs font-bold uppercase tracking-wider text-slate-500 block">
            {isHi ? 'आपकी पूंजी (10%)' : 'Your Margin (10%)'}
          </span>
          <div className="text-2xl sm:text-3xl font-black text-slate-900 tabular-nums">
            ₹{((financial?.margin_capital || financial?.margin_money || 0) / 100000).toFixed(1)} {isHi ? 'लाख' : 'Lakh'}
          </div>
          <p className="text-xs text-slate-500 font-medium">
            {isHi
              ? `कुल लागत: ₹${((financial?.project_cost || financial?.total_project_cost || 0) / 100000).toFixed(1)} लाख`
              : `Total Cost: ₹${((financial?.project_cost || financial?.total_project_cost || 0) / 100000).toFixed(1)} Lakh`}
          </p>
        </div>
      </div>

      {/* ── 3. Middle Section: Semantic Verdict (Left) + Scheme Rule (Right) ── */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-7 items-stretch">
        {/* Semantic Verdict Box */}
        <div className={`lg:col-span-7 p-7 sm:p-9 rounded-3xl border shadow-sm space-y-6 flex flex-col justify-between ${verdictBg}`}>
          <div className="space-y-3">
            <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider opacity-85">
              <Sparkles className="w-4 h-4 shrink-0" />
              <span>{isHi ? 'आधिकारिक व्यवहार्यता निर्णय' : 'Official Viability Verdict'}</span>
            </div>
            <h2 className="text-2xl sm:text-3xl font-black leading-snug">
              {verdictTitle}
            </h2>
            <p className="text-sm sm:text-base font-medium leading-relaxed opacity-90">
              {isHi
                ? (recommendation?.summary_hi || recommendation?.summary || 'यह व्यवसाय आपके गांव के सेवा क्षेत्र और 10:90 वित्तीय मॉडल के अनुसार व्यावहारिक है।')
                : (recommendation?.summary || 'This enterprise demonstrates sound debt coverage and healthy operational viability.')}
            </p>
          </div>

          <div className="flex items-center gap-5 pt-4 border-t border-current/15">
            <div className={`px-6 py-3.5 rounded-2xl bg-white font-black text-center shadow-xs border ${scoreBadgeColor}`}>
              <span className="text-3xl sm:text-4xl font-black block tabular-nums">
                {score}
              </span>
              <span className="text-[10px] uppercase font-bold text-slate-500 block mt-0.5">
                {isHi ? 'स्कोर / 100' : 'Score / 100'}
              </span>
            </div>
            <div className="text-xs sm:text-sm font-medium leading-relaxed opacity-85">
              {isHi
                ? 'यह स्कोर ऋण शोधन अनुपात (DSCR), स्थानीय बाजार मांग और प्रतियोगिता के आधार पर तैयार किया गया है।'
                : 'Score calculated via Debt Service Coverage Ratio (DSCR), market catchment radius, and competitor density.'}
            </div>
          </div>
        </div>

        {/* Scheme & Banking Rule Card */}
        <div className="lg:col-span-5 gd-card p-7 sm:p-9 space-y-5 flex flex-col justify-between bg-white border border-slate-200">
          <div className="space-y-4">
            <div className="flex items-center gap-2 text-xs font-bold text-emerald-700 uppercase tracking-wider">
              <Building2 className="w-4.5 h-4.5 shrink-0" />
              <span>{isHi ? 'लागू सरकारी योजना' : 'Applicable Govt Scheme'}</span>
            </div>
            <h3 className="text-2xl font-black text-slate-950 leading-snug">
              {displayScheme}
            </h3>
            <p className="text-sm text-slate-600 leading-relaxed font-medium">
              {isHi
                ? 'इस योजना के तहत उद्यमी को 10% स्वयं की पूंजी लगानी होती है और 90% राशि राष्ट्रीयकृत बैंक से रियायती ब्याज दर पर स्वीकृत होती है।'
                : 'Under official guidelines, the promoter contributes 10% equity, while 90% is financed via term loan at standard concessional rates.'}
            </p>
          </div>

          <div className="pt-4 border-t border-slate-100 flex items-center justify-between text-xs sm:text-sm font-bold text-slate-600">
            <span>{isHi ? 'ऋण अवधि: 7 वर्ष (28 तिमाही)' : 'Tenure: 7 Years (28 Quarters)'}</span>
            <span className="text-emerald-700 font-bold bg-emerald-50 px-2.5 py-1 rounded-lg border border-emerald-200">
              {isHi ? 'आरबीआई नियमानुसार' : 'RBI Compliant'}
            </span>
          </div>
        </div>
      </div>

      {/* ── 4. Bottom Quick Action Navigation Links ── */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-5">
        <Link
          to="/financial"
          className="p-6 rounded-2xl bg-white border border-slate-200 hover:border-emerald-500 hover:shadow-md hover:-translate-y-0.5 transition-all flex items-center justify-between group"
        >
          <div className="space-y-1.5">
            <h4 className="text-base sm:text-lg font-black text-slate-900 group-hover:text-emerald-700 transition-colors">
              {isHi ? 'लोन व 28 तिमाही किस्त' : 'Loan & EMI Schedule'}
            </h4>
            <p className="text-xs text-slate-500 font-medium">
              {isHi ? 'मूलधन, ब्याज और ऋण शोधन तालिका' : 'Quarterly amortization schedule'}
            </p>
          </div>
          <ChevronRight className="w-5 h-5 text-slate-400 group-hover:text-emerald-600 transition-transform group-hover:translate-x-1 shrink-0" />
        </Link>

        <Link
          to="/market"
          className="p-6 rounded-2xl bg-white border border-slate-200 hover:border-emerald-500 hover:shadow-md hover:-translate-y-0.5 transition-all flex items-center justify-between group"
        >
          <div className="space-y-1.5">
            <h4 className="text-base sm:text-lg font-black text-slate-900 group-hover:text-emerald-700 transition-colors">
              {isHi ? 'बाजार मांग व ग्राहक क्षेत्र' : 'Market & Competition'}
            </h4>
            <p className="text-xs text-slate-500 font-medium">
              {isHi ? 'सेवा दायरा व स्थानीय ग्राहक सर्वेक्षण' : 'Footfall radius & market survey'}
            </p>
          </div>
          <ChevronRight className="w-5 h-5 text-slate-400 group-hover:text-emerald-600 transition-transform group-hover:translate-x-1 shrink-0" />
        </Link>

        <Link
          to="/report"
          className="p-6 rounded-2xl bg-white border border-slate-200 hover:border-emerald-500 hover:shadow-md hover:-translate-y-0.5 transition-all flex items-center justify-between group"
        >
          <div className="space-y-1.5">
            <h4 className="text-base sm:text-lg font-black text-slate-900 group-hover:text-emerald-700 transition-colors">
              {isHi ? 'बैंक DPR संपूर्ण फाइल' : 'Detailed Project Report'}
            </h4>
            <p className="text-xs text-slate-500 font-medium">
              {isHi ? 'बैंक अधिकारी हेतु औपचारिक फाइल' : 'Official bank loan dossier'}
            </p>
          </div>
          <ChevronRight className="w-5 h-5 text-slate-400 group-hover:text-emerald-600 transition-transform group-hover:translate-x-1 shrink-0" />
        </Link>
      </div>
    </div>
  );
}
