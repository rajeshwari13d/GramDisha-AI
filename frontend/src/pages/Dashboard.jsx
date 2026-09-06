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
      <div className="app-container my-20 max-w-md p-10 gd-card text-center space-y-5">
        <span className="text-4xl block">🌾</span>
        <h3 className="text-lg font-bold text-gray-900">
          {isHi ? 'कोई सक्रिय विश्लेषण नहीं मिला' : 'No Active Assessment'}
        </h3>
        <Button onClick={() => navigate('/assess')} size="md" variant="primary">
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
    financial_health,
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
  let verdictBg = 'bg-[#EDF5F0] border-[#A5D6A7] text-[#1B5E20]';

  if (state === 'NOT_RECOMMENDED' || score < 50) {
    verdictTitle = isHi ? 'इस व्यापार में अधिक जोखिम है (अस्वीकृत)' : 'High Risk / Not Recommended';
    verdictBg = 'bg-[#FEE2E2] border-[#FCA5A5] text-[#B91C1C]';
  } else if (state === 'RECOMMENDED_WITH_CONDITIONS' || score < 75) {
    verdictTitle = isHi ? 'सावधानी के साथ काम शुरू कर सकते हैं' : 'Recommended with Conditions';
    verdictBg = 'bg-[#FEF3C7] border-[#FDE68A] text-[#B45309]';
  }

  const estMonthlyProfit =
    business_analysis?.revenue_estimates?.estimated_monthly_profit ||
    Math.round((financial?.total_project_cost || 1000000) * 0.035);

  const pdfDownloadUrl = getReport(analysis_id);

  return (
    <div className="app-container py-12 sm:py-20 space-y-10">
      {/* ── 1. Top Enterprise Banner (+20% padding: p-7 sm:p-8) ── */}
      <div className="gd-card p-7 sm:p-8 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-6 bg-white">
        <div className="flex items-center gap-5">
          <div className="w-16 h-16 sm:w-18 sm:h-18 rounded-2xl bg-[#F4EFEB] border border-[#DCD3C5] flex items-center justify-center text-3xl sm:text-4xl shrink-0 shadow-xs">
            {business_icon || '🌾'}
          </div>
          <div>
            <h1 className="text-2xl sm:text-3xl font-black text-gray-900 leading-tight">
              {displayName}
            </h1>
            <p className="text-xs sm:text-sm text-gray-600 font-bold flex items-center gap-1.5 mt-1.5">
              <MapPin className="w-4 h-4 text-emerald-800 shrink-0" />
              <span>
                {location?.village}, {location?.block}, {location?.district}, {location?.state}
              </span>
            </p>
          </div>
        </div>

        <div className="flex items-center gap-4 w-full sm:w-auto">
          <Button
            href={pdfDownloadUrl}
            target="_blank"
            rel="noopener noreferrer"
            size="md"
            variant="primary"
            icon={Download}
            iconPosition="left"
            className="flex-1 sm:flex-none shadow-xs"
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

      {/* ── 2. Four Unified Neutral KPI Cards (+20% padding: p-7) ── */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        {/* Card 1: Monthly Profit */}
        <div className="p-7 rounded-3xl bg-white border border-[#DCD3C5] shadow-xs space-y-2">
          <span className="text-xs font-bold uppercase tracking-wider text-gray-500 block">
            {isHi ? 'मासिक शुद्ध कमाई' : 'Monthly Net Profit'}
          </span>
          <div className="text-2xl sm:text-3xl font-black text-gray-900 tabular-nums">
            ₹{estMonthlyProfit.toLocaleString('en-IN')}
          </div>
          <p className="text-xs text-gray-500 font-medium">
            {isHi ? 'किस्त व सभी खर्चे काटकर' : 'Estimated net earnings after EMI & costs'}
          </p>
        </div>

        {/* Card 2: Eligible Govt Loan */}
        <div className="p-7 rounded-3xl bg-white border border-[#DCD3C5] shadow-xs space-y-2">
          <span className="text-xs font-bold uppercase tracking-wider text-gray-500 block">
            {isHi ? 'सरकारी बैंक लोन (90%)' : 'Eligible Bank Loan (90%)'}
          </span>
          <div className="text-2xl sm:text-3xl font-black text-gray-900 tabular-nums">
            ₹{(financial?.loan_amount / 100000).toFixed(1)} {isHi ? 'लाख' : 'Lakh'}
          </div>
          <p className="text-xs text-gray-500 font-medium truncate">
            {displayScheme}
          </p>
        </div>

        {/* Card 3: Monthly EMI */}
        <div className="p-7 rounded-3xl bg-white border border-[#DCD3C5] shadow-xs space-y-2">
          <span className="text-xs font-bold uppercase tracking-wider text-gray-500 block">
            {isHi ? 'मासिक बैंक किस्त (EMI)' : 'Monthly Bank EMI'}
          </span>
          <div className="text-2xl sm:text-3xl font-black text-gray-900 tabular-nums">
            ₹{financial?.monthly_emi?.toLocaleString('en-IN')}{' '}
            <span className="text-xs font-normal text-gray-500">/{isHi ? 'माह' : 'mo'}</span>
          </div>
          <p className="text-xs text-gray-500 font-medium">
            {isHi ? '7 वर्ष @ 8.5% वार्षिक दर' : '7 Years @ 8.5% reducing balance'}
          </p>
        </div>

        {/* Card 4: Margin Capital */}
        <div className="p-7 rounded-3xl bg-white border border-[#DCD3C5] shadow-xs space-y-2">
          <span className="text-xs font-bold uppercase tracking-wider text-gray-500 block">
            {isHi ? 'आपकी पूंजी (10%)' : 'Your Margin (10%)'}
          </span>
          <div className="text-2xl sm:text-3xl font-black text-gray-900 tabular-nums">
            ₹{(financial?.margin_money / 100000).toFixed(1)} {isHi ? 'लाख' : 'Lakh'}
          </div>
          <p className="text-xs text-gray-500 font-medium">
            {isHi ? `कुल लागत: ₹${(financial?.total_project_cost / 100000).toFixed(1)} लाख` : `Total Cost: ₹${(financial?.total_project_cost / 100000).toFixed(1)} Lakh`}
          </p>
        </div>
      </div>

      {/* ── 3. Middle Section: Semantic Verdict (Left) + Scheme Rule (Right) ── */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-stretch">
        {/* Semantic Verdict Box (+20% padding: p-8 sm:p-10) */}
        <div className={`lg:col-span-7 p-8 sm:p-10 rounded-3xl border-2 shadow-xs space-y-6 flex flex-col justify-between ${verdictBg}`}>
          <div className="space-y-3">
            <span className="text-xs sm:text-sm font-bold uppercase tracking-wider block opacity-85">
              {isHi ? 'आधिकारिक व्यवहार्यता निर्णय' : 'Official Viability Verdict'}
            </span>
            <h2 className="text-2xl sm:text-3xl font-black">
              {verdictTitle}
            </h2>
            <p className="text-base sm:text-lg font-medium leading-relaxed opacity-95">
              {isHi
                ? (recommendation?.summary_hi || recommendation?.summary || 'यह व्यवसाय आपके गांव के सेवा क्षेत्र और 10:90 वित्तीय मॉडल के अनुसार व्यावहारिक है।')
                : (recommendation?.summary || 'This enterprise demonstrates sound debt coverage and healthy operational viability.')}
            </p>
          </div>

          <div className="flex items-center gap-5 pt-3">
            <div className="px-6 py-4 rounded-2xl bg-white text-gray-900 font-black text-center shadow-xs border border-[#DCD3C5]">
              <span className="text-3xl sm:text-4xl font-black block tabular-nums text-emerald-950">
                {score}
              </span>
              <span className="text-[10px] uppercase font-bold text-gray-500 block mt-0.5">
                {isHi ? 'स्कोर / 100' : 'Score / 100'}
              </span>
            </div>
            <div className="text-xs sm:text-sm font-medium text-gray-700 leading-relaxed">
              {isHi
                ? 'यह स्कोर ऋण शोधन अनुपात (DSCR), स्थानीय बाजार मांग और प्रतियोगिता के आधार पर तैयार किया गया है।'
                : 'Score calculated via Debt Service Coverage Ratio (DSCR), market catchment radius, and competitor density.'}
            </div>
          </div>
        </div>

        {/* Scheme & Banking Rule Card (+20% padding: p-8 sm:p-9) */}
        <div className="lg:col-span-5 gd-card p-8 sm:p-9 space-y-5 flex flex-col justify-between bg-white">
          <div className="space-y-4">
            <div className="flex items-center gap-2.5 text-xs font-bold text-gray-500 uppercase">
              <Building2 className="w-4.5 h-4.5 text-emerald-800" />
              <span>{isHi ? 'लागू सरकारी योजना' : 'Applicable Govt Scheme'}</span>
            </div>
            <h3 className="text-2xl font-black text-gray-900 leading-snug">
              {displayScheme}
            </h3>
            <p className="text-sm text-gray-600 leading-relaxed font-medium">
              {isHi
                ? 'इस योजना के तहत उद्यमी को 10% स्वयं की पूंजी लगानी होती है और 90% राशि राष्ट्रीयकृत बैंक से रियायती ब्याज दर पर स्वीकृत होती है।'
                : 'Under official guidelines, the promoter contributes 10% equity, while 90% is financed via term loan at standard concessional rates.'}
            </p>
          </div>

          <div className="pt-4 border-t border-gray-100 flex items-center justify-between text-xs sm:text-sm font-bold text-gray-600">
            <span>{isHi ? 'ऋण अवधि: 7 वर्ष (28 तिमाही)' : 'Tenure: 7 Years (28 Quarters)'}</span>
            <span className="text-emerald-800 font-bold">{isHi ? 'आरबीआई नियमानुसार' : 'RBI Compliant'}</span>
          </div>
        </div>
      </div>

      {/* ── 4. Bottom Detail Navigation Links (+20% padding: p-6 sm:p-7) ── */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
        <Link
          to="/financial"
          className="p-6 sm:p-7 rounded-3xl bg-white border border-[#DCD3C5] hover:border-emerald-700 hover:shadow-xs transition-all flex items-center justify-between group"
        >
          <div className="space-y-1.5">
            <h4 className="text-base sm:text-lg font-black text-gray-900 group-hover:text-emerald-900">
              {isHi ? 'लोन व 28 तिमाही किस्त' : 'Loan & EMI Schedule'}
            </h4>
            <p className="text-xs sm:text-sm text-gray-500 font-medium">
              {isHi ? 'मूलधन, ब्याज और ऋण शोधन तालिका' : 'Quarterly amortization schedule'}
            </p>
          </div>
          <ChevronRight className="w-5 h-5 text-gray-400 group-hover:text-emerald-800 shrink-0" />
        </Link>

        <Link
          to="/market"
          className="p-6 sm:p-7 rounded-3xl bg-white border border-[#DCD3C5] hover:border-emerald-700 hover:shadow-xs transition-all flex items-center justify-between group"
        >
          <div className="space-y-1.5">
            <h4 className="text-base sm:text-lg font-black text-gray-900 group-hover:text-emerald-900">
              {isHi ? 'बाजार मांग व ग्राहक क्षेत्र' : 'Market & Competition'}
            </h4>
            <p className="text-xs sm:text-sm text-gray-500 font-medium">
              {isHi ? 'सेवा दायरा व स्थानीय ग्राहक सर्वेक्षण' : 'Footfall radius & market survey'}
            </p>
          </div>
          <ChevronRight className="w-5 h-5 text-gray-400 group-hover:text-emerald-800 shrink-0" />
        </Link>

        <Link
          to="/report"
          className="p-6 sm:p-7 rounded-3xl bg-white border border-[#DCD3C5] hover:border-emerald-700 hover:shadow-xs transition-all flex items-center justify-between group"
        >
          <div className="space-y-1.5">
            <h4 className="text-base sm:text-lg font-black text-gray-900 group-hover:text-emerald-900">
              {isHi ? 'बैंक DPR संपूर्ण फाइल' : 'Detailed Project Report'}
            </h4>
            <p className="text-xs sm:text-sm text-gray-500 font-medium">
              {isHi ? 'बैंक अधिकारी हेतु औपचारिक फाइल' : 'Official bank loan dossier'}
            </p>
          </div>
          <ChevronRight className="w-5 h-5 text-gray-400 group-hover:text-emerald-800 shrink-0" />
        </Link>
      </div>
    </div>
  );
}
