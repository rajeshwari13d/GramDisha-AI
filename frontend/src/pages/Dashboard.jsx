import React, { useContext, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import {
  Download,
  ChevronRight,
  MapPin,
  Building2,
  FileSpreadsheet,
  Coins,
  Store,
  FileCheck,
  Landmark,
  Scale,
  ShieldAlert,
  Printer,
  Sparkles,
  Sliders,
  CheckCircle2,
  TrendingUp,
  ClipboardCheck,
} from 'lucide-react';
import { AnalysisContext } from '../App';
import { getReport } from '../services/api';
import Button from '../components/ui/Button';
import RadialGauge from '../components/RadialGauge';
import ProvenanceBadge from '../components/ProvenanceBadge';

export default function Dashboard() {
  const { analysis, setIsSurveyOpen } = useContext(AnalysisContext);
  const { i18n } = useTranslation();
  const navigate = useNavigate();
  const isHi = i18n.language === 'hi';
  const [activeTab, setActiveTab] = useState('overview');

  const initialCap = analysis?.financial?.margin_capital || analysis?.financial?.margin_money || 100000;

  const [simCapital, setSimCapital] = useState(initialCap);

  if (!analysis) {
    return (
      <div className="app-container my-16 max-w-md p-8 bg-white border border-slate-200 rounded-2xl text-center space-y-4 shadow-sm">
        <div className="w-12 h-12 rounded-xl bg-emerald-50 border border-emerald-200 text-emerald-700 mx-auto flex items-center justify-center text-lg font-bold">
          GD
        </div>
        <div className="space-y-1">
          <h3 className="text-lg font-bold text-slate-900">
            {isHi ? 'कोई सक्रिय मूल्यांकन नहीं मिला' : 'No Active Credit Appraisal Found'}
          </h3>
          <p className="text-xs text-slate-500">
            {isHi ? 'कृपया पहले अपने प्रस्तावित व्यवसाय व स्थान का विवरण दर्ज करें।' : 'Please complete the assessment form to generate your credit proposal.'}
          </p>
        </div>
        <Button onClick={() => navigate('/assess')} size="md" variant="primary" className="w-full font-bold">
          {isHi ? 'नया मूल्यांकन शुरू करें' : 'Start New Appraisal'}
        </Button>
      </div>
    );
  }

  const {
    analysis_id,
    business_name,
    business_name_hi,
    location,
    financial,
    business_analysis,
    viability,
    recommendation,
  } = analysis;

  const displayName = isHi ? business_name_hi || business_name : business_name;
  const displayScheme = isHi ? financial?.scheme_hi || financial?.scheme : financial?.scheme;
  const score = Math.round(viability?.viability_score || 0);
  const state = recommendation?.state || 'RECOMMENDED_WITH_CONDITIONS';

  const cleanRefId = `GD-APP-${(analysis_id || '0000').slice(0, 8).toUpperCase()}`;

  const estMonthlyProfit =
    business_analysis?.revenue_estimates?.estimated_monthly_profit ||
    Math.round((financial?.total_project_cost || financial?.project_cost || 1000000) * 0.035);

  const pdfDownloadUrl = getReport(analysis_id);

  // Simulated calculations
  const simLoan = simCapital * 9;
  const simProjectCost = simCapital * 10;
  const simAnnualRate = 0.09;
  const simMonthlyRate = simAnnualRate / 12;
  const simEmi = Math.round(
    (simLoan * simMonthlyRate * Math.pow(1 + simMonthlyRate, 60)) /
      (Math.pow(1 + simMonthlyRate, 60) - 1)
  );

  return (
    <div className="app-container py-8 sm:py-10 space-y-7">
      {/* ── 1. OFFICIAL APPRAISAL HEADER BANNER ── */}
      <div className="bg-white border border-slate-200 rounded-2xl p-6 flex flex-col md:flex-row md:items-center justify-between gap-5 shadow-sm">
        <div className="space-y-1">
          <div className="flex flex-wrap items-center gap-2">
            <span className="px-2.5 py-0.5 rounded-full bg-emerald-50 text-emerald-800 text-[11px] font-bold border border-emerald-200">
              {isHi ? 'आधिकारिक मूल्यांकन' : 'Credit Appraisal Dossier'}
            </span>
            <span className="text-xs text-slate-500 font-mono">Ref: {cleanRefId}</span>
            <ProvenanceBadge type="calculated" />
          </div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight">
            {displayName}
          </h1>
          <p className="text-xs sm:text-sm text-slate-500 flex items-center gap-1.5 font-medium">
            <MapPin className="w-3.5 h-3.5 text-emerald-700 shrink-0" />
            <span>
              {location?.village}, {location?.block}, {location?.district}, {location?.state}
            </span>
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-2.5">
          <Button
            href={pdfDownloadUrl}
            target="_blank"
            rel="noopener noreferrer"
            size="md"
            variant="primary"
            icon={Download}
            iconPosition="left"
            className="shadow-xs font-bold"
          >
            {isHi ? 'बैंक DPR फाइल (PDF)' : 'Download DPR (PDF)'}
          </Button>

          <Button
            to="/assess"
            size="md"
            variant="secondary"
            className="font-semibold"
          >
            {isHi ? 'संशोधन करें' : 'Edit Inputs'}
          </Button>
        </div>
      </div>

      {/* ── 2. TAB SWITCHER ── */}
      <div className="flex items-center gap-1.5 p-1 bg-slate-100 rounded-xl border border-slate-200 w-fit">
        <button
          type="button"
          onClick={() => setActiveTab('overview')}
          className={`tab-pill ${activeTab === 'overview' ? 'tab-pill-active' : ''}`}
        >
          <Landmark className="w-4 h-4" />
          <span>{isHi ? 'मूल्यांकन व परिणाम' : 'Viability Verdict'}</span>
        </button>
        <button
          type="button"
          onClick={() => setActiveTab('simulator')}
          className={`tab-pill ${activeTab === 'simulator' ? 'tab-pill-active' : ''}`}
        >
          <Sliders className="w-4 h-4" />
          <span>{isHi ? '"What-If" पूंजी सिमुलेटर' : 'Scenario Simulator'}</span>
        </button>
      </div>

      {/* ── 3. TAB 1: EXECUTIVE OVERVIEW ── */}
      {activeTab === 'overview' && (
        <div className="space-y-7">
          {/* Radial Gauge + Sanction Verdict Card */}
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-stretch">
            {/* Left 5 Cols: Gauge */}
            <div className="lg:col-span-5 bg-white border border-slate-200 rounded-2xl p-6 flex flex-col justify-center items-center text-center shadow-sm">
              <RadialGauge score={score} state={state} size={250} />
              <p className="text-xs text-slate-500 max-w-xs mt-2 leading-relaxed">
                {isHi
                  ? 'ऋण सेवा व्याप्ति अनुपात (DSCR), क्षेत्रीय ग्राहक घनत्व व 10:90 पूंजी मॉडल पर आधारित समग्र व्यवहार्यता सूचकांक।'
                  : 'Composite viability index derived from statutory DSCR coverage, catchment footfall, and 10:90 capital structuring.'}
              </p>
            </div>

            {/* Right 7 Cols: Verdict */}
            <div className="lg:col-span-7 bg-white border border-slate-200 rounded-2xl p-6 sm:p-7 flex flex-col justify-between space-y-5 shadow-sm">
              <div className="space-y-2.5">
                <div className="flex items-center justify-between border-b border-slate-100 pb-3">
                  <span className="text-xs font-bold uppercase tracking-wider text-slate-500">
                    {isHi ? 'शाखा प्रबंधक हेतु मूल्यांकन टिप्पणी' : 'Credit Manager Appraisal Summary'}
                  </span>
                  <ProvenanceBadge type="official_rule" />
                </div>

                <h3 className="text-xl sm:text-2xl font-bold text-slate-900 leading-snug">
                  {isHi
                    ? 'ऋण अनुमोदन हेतु अनुशंसित प्रस्ताव'
                    : 'Formally Appraised for Scheme Credit Sanction'}
                </h3>

                <p className="text-xs sm:text-sm text-slate-600 leading-relaxed">
                  {isHi
                    ? (recommendation?.summary_hi || recommendation?.summary || 'यह व्यवसाय आपके गांव के सेवा क्षेत्र और 10:90 वित्तीय मॉडल के अनुसार व्यावहारिक है तथा बैंक ऋण के लिए सभी प्राथमिक मानदंडों को पूरा करता है।')
                    : (recommendation?.summary || 'This rural enterprise satisfies mandatory DSCR debt-service benchmarks, exhibits balanced regional market demand, and qualifies under statutory credit guarantee programs.')}
                </p>
              </div>

              {/* Scheme Directive Details Strip */}
              <div className="p-4 rounded-xl bg-slate-50 border border-slate-200/80 space-y-2 text-xs">
                <div className="flex items-center justify-between font-semibold">
                  <span className="text-slate-500">{isHi ? 'लागू वैधानिक योजना:' : 'Mandated Scheme:'}</span>
                  <span className="font-bold text-emerald-700">{displayScheme}</span>
                </div>
                <div className="flex items-center justify-between font-semibold">
                  <span className="text-slate-500">{isHi ? 'ऋण शोधन अवधि:' : 'Repayment Schedule:'}</span>
                  <span className="text-slate-900">{isHi ? '7 वर्ष (28 तिमाही किस्तें)' : '7 Years (28 Quarters)'}</span>
                </div>
                <div className="flex items-center justify-between font-semibold">
                  <span className="text-slate-500">{isHi ? 'ब्याज दर व छूट:' : 'Interest Rate & Grace:'}</span>
                  <span className="text-slate-900">8.5% p.a. • 6 {isHi ? 'माह मोरेटोरियम' : 'Months Grace'}</span>
                </div>
              </div>
            </div>
          </div>

          {/* 4 Stat Cards */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            <div className="bg-white border border-slate-200 rounded-2xl p-5 space-y-1 shadow-sm">
              <span className="text-[11px] font-bold uppercase tracking-wider text-slate-500 block">
                {isHi ? 'मासिक शुद्ध बचत' : 'Est. Monthly Net Surplus'}
              </span>
              <div className="text-2xl font-bold text-emerald-700 tabular-nums">
                ₹{estMonthlyProfit.toLocaleString('en-IN')}
              </div>
              <p className="text-[11px] text-slate-500">
                {isHi ? 'किस्त व परिचालन खर्चे काटकर' : 'Net disposable cash flow post-EMI'}
              </p>
            </div>

            <div className="bg-white border border-slate-200 rounded-2xl p-5 space-y-1 shadow-sm">
              <span className="text-[11px] font-bold uppercase tracking-wider text-slate-500 block">
                {isHi ? 'स्वीकृत बैंक ऋण (90%)' : 'Sanctioned Term Loan (90%)'}
              </span>
              <div className="text-2xl font-bold text-slate-900 tabular-nums">
                ₹{((financial?.loan_amount || 0) / 100000).toFixed(1)} {isHi ? 'लाख' : 'Lakh'}
              </div>
              <p className="text-[11px] text-slate-500 truncate">
                {displayScheme}
              </p>
            </div>

            <div className="bg-white border border-slate-200 rounded-2xl p-5 space-y-1 shadow-sm">
              <span className="text-[11px] font-bold uppercase tracking-wider text-slate-500 block">
                {isHi ? 'मासिक बैंक किस्त (EMI)' : 'Monthly Debt Obligation'}
              </span>
              <div className="text-2xl font-bold text-amber-700 tabular-nums">
                ₹{Math.round(financial?.estimated_emi || financial?.monthly_emi || 0).toLocaleString('en-IN')}{' '}
                <span className="text-xs font-normal text-amber-600">/{isHi ? 'माह' : 'mo'}</span>
              </div>
              <p className="text-[11px] text-slate-500">
                {isHi ? '7 वर्ष @ 8.5% घटती शेष दर' : '7-Year amortized reducing balance'}
              </p>
            </div>

            <div className="bg-white border border-slate-200 rounded-2xl p-5 space-y-1 shadow-sm">
              <span className="text-[11px] font-bold uppercase tracking-wider text-slate-500 block">
                {isHi ? 'प्रवर्तक पूंजी (10%)' : 'Promoter Margin (10%)'}
              </span>
              <div className="text-2xl font-bold text-slate-900 tabular-nums">
                ₹{((financial?.margin_capital || financial?.margin_money || 0) / 100000).toFixed(1)} {isHi ? 'लाख' : 'Lakh'}
              </div>
              <p className="text-[11px] text-slate-500">
                {isHi
                  ? `कुल लागत: ₹${((financial?.project_cost || financial?.total_project_cost || 0) / 100000).toFixed(1)} लाख`
                  : `Total Outlay: ₹${((financial?.project_cost || financial?.total_project_cost || 0) / 100000).toFixed(1)} Lakh`}
              </p>
            </div>
          </div>
        </div>
      )}

      {/* ── 4. TAB 2: SCENARIO SIMULATOR ── */}
      {activeTab === 'simulator' && (
        <div className="bg-white border border-slate-200 rounded-2xl p-6 sm:p-7 space-y-6 shadow-sm">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-slate-100 pb-4">
            <div>
              <div className="flex items-center gap-1.5 text-xs font-bold text-emerald-700 uppercase tracking-wider mb-0.5">
                <Sparkles className="w-3.5 h-3.5 text-amber-500" />
                <span>{isHi ? 'गतिशील पूंजी परिदृश्य सिमुलेटर' : 'Dynamic Capital Scenario Simulator'}</span>
              </div>
              <h3 className="text-xl sm:text-2xl font-bold text-slate-900">
                {isHi ? 'पूंजी बदलने पर ऋण व ईएमआई प्रभाव देखें' : 'Test Alternative Margin Allocations'}
              </h3>
            </div>
            <span className="text-xs px-3 py-1 rounded-full bg-emerald-50 text-emerald-700 font-bold border border-emerald-200">
              {isHi ? 'लाइव 10:90 मॉडलिंग' : 'Live 10:90 Engine'}
            </span>
          </div>

          <div className="space-y-3.5 p-5 rounded-xl bg-slate-50 border border-slate-200/80">
            <div className="flex items-baseline justify-between">
              <label className="text-xs font-bold text-slate-600 uppercase tracking-wider">
                {isHi ? 'प्रस्तावित स्वयं की पूंजी (10% Margin):' : 'Adjusted Margin Capital (10%):'}
              </label>
              <span className="font-mono text-2xl sm:text-3xl font-bold text-emerald-700">
                ₹{simCapital.toLocaleString('en-IN')}
              </span>
            </div>

            <input
              type="range"
              min={20000}
              max={500000}
              step={5000}
              value={simCapital}
              onChange={(e) => setSimCapital(Number(e.target.value))}
              className="interactive-slider"
              aria-label="Simulated capital slider"
            />

            <div className="flex justify-between text-[11px] text-slate-400 font-medium">
              <span>Min: ₹20,000</span>
              <span>Max: ₹5,00,000</span>
            </div>
          </div>

          {/* Side-by-Side Comparison */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-5 pt-1">
            <div className="p-5 rounded-xl bg-slate-50 border border-slate-200 space-y-3">
              <span className="text-xs font-bold text-slate-500 uppercase tracking-wider block">
                {isHi ? 'वर्तमान मूल्यांकित आधार (Current)' : 'Current Appraisal Baseline'}
              </span>
              <div className="space-y-2 text-xs sm:text-sm">
                <div className="flex justify-between py-1 border-b border-slate-200">
                  <span className="text-slate-600">{isHi ? 'प्रवर्तक पूंजी (10%):' : 'Promoter Equity (10%):'}</span>
                  <span className="font-mono font-bold text-slate-900">₹{initialCap.toLocaleString('en-IN')}</span>
                </div>
                <div className="flex justify-between py-1 border-b border-slate-200">
                  <span className="text-slate-600">{isHi ? 'बैंक ऋण (90%):' : 'Bank Term Loan (90%):'}</span>
                  <span className="font-mono font-bold text-emerald-700">₹{((financial?.loan_amount || 0)).toLocaleString('en-IN')}</span>
                </div>
                <div className="flex justify-between py-1 border-b border-slate-200">
                  <span className="text-slate-600">{isHi ? 'मासिक ईएमआई:' : 'Monthly EMI:'}</span>
                  <span className="font-mono font-bold text-amber-700">₹{Math.round(financial?.estimated_emi || 0).toLocaleString('en-IN')}</span>
                </div>
              </div>
            </div>

            <div className="p-5 rounded-xl bg-emerald-50 border border-emerald-200 space-y-3">
              <span className="text-xs font-bold text-emerald-800 uppercase tracking-wider block">
                {isHi ? 'सिम्युलेटेड नया परिदृश्य (Simulated)' : 'Simulated Scenario Output'}
              </span>
              <div className="space-y-2 text-xs sm:text-sm">
                <div className="flex justify-between py-1 border-b border-emerald-200">
                  <span className="text-emerald-800 font-medium">{isHi ? 'प्रवर्तक पूंजी (10%):' : 'Promoter Equity (10%):'}</span>
                  <span className="font-mono font-bold text-emerald-900">₹{simCapital.toLocaleString('en-IN')}</span>
                </div>
                <div className="flex justify-between py-1 border-b border-emerald-200">
                  <span className="text-emerald-800 font-medium">{isHi ? 'बैंक ऋण (90%):' : 'Bank Term Loan (90%):'}</span>
                  <span className="font-mono font-bold text-emerald-700">₹{simLoan.toLocaleString('en-IN')}</span>
                </div>
                <div className="flex justify-between py-1 border-b border-emerald-200">
                  <span className="text-emerald-800 font-medium">{isHi ? 'मासिक ईएमआई:' : 'Monthly EMI:'}</span>
                  <span className="font-mono font-bold text-amber-700">₹{simEmi.toLocaleString('en-IN')}</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* ── 5. ANNEXURE GATEWAYS ── */}
      <div className="space-y-3 pt-1">
        <span className="text-xs font-bold uppercase tracking-wider text-slate-500 block">
          {isHi ? 'विस्तृत वित्तीय व परिचालन अनुभाग' : 'Detailed Credit & Operational Annexures'}
        </span>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          <Link
            to="/financial"
            className="bg-white border border-slate-200 hover:border-slate-300 rounded-2xl p-5 flex flex-col justify-between space-y-3 shadow-sm hover:shadow-md transition-all group"
          >
            <div className="space-y-1.5">
              <div className="w-8 h-8 rounded-lg bg-emerald-50 text-emerald-700 flex items-center justify-center">
                <Coins className="w-4 h-4" />
              </div>
              <h4 className="text-base font-bold text-slate-900 group-hover:text-emerald-700 transition-colors">
                {isHi ? 'ऋण शोधन सारणी' : 'Amortization Ledger'}
              </h4>
              <p className="text-xs text-slate-500">
                {isHi ? '28-तिमाही मूलधन, ब्याज व ईएमआई विभाजन' : '28-quarter principal & interest breakdown'}
              </p>
            </div>
            <div className="flex items-center gap-1 text-xs font-bold text-emerald-700 pt-2 border-t border-slate-100">
              <span>{isHi ? 'सारणी देखें' : 'View Ledger'}</span>
              <ChevronRight className="w-3.5 h-3.5" />
            </div>
          </Link>

          <Link
            to="/market"
            className="bg-white border border-slate-200 hover:border-slate-300 rounded-2xl p-5 flex flex-col justify-between space-y-3 shadow-sm hover:shadow-md transition-all group"
          >
            <div className="space-y-1.5">
              <div className="w-8 h-8 rounded-lg bg-emerald-50 text-emerald-700 flex items-center justify-center">
                <Store className="w-4 h-4" />
              </div>
              <h4 className="text-base font-bold text-slate-900 group-hover:text-emerald-700 transition-colors">
                {isHi ? 'बाजार व ग्राहक दायरा' : 'Catchment & Demand'}
              </h4>
              <p className="text-xs text-slate-500">
                {isHi ? '5-15 किमी सेवा परिधि व प्रतिस्पर्धा विश्लेषण' : '5–15 km village demand & competitor study'}
              </p>
            </div>
            <div className="flex items-center gap-1 text-xs font-bold text-emerald-700 pt-2 border-t border-slate-100">
              <span>{isHi ? 'सर्वेक्षण देखें' : 'View Catchment'}</span>
              <ChevronRight className="w-3.5 h-3.5" />
            </div>
          </Link>

          <Link
            to="/swot"
            className="bg-white border border-slate-200 hover:border-slate-300 rounded-2xl p-5 flex flex-col justify-between space-y-3 shadow-sm hover:shadow-md transition-all group"
          >
            <div className="space-y-1.5">
              <div className="w-8 h-8 rounded-lg bg-emerald-50 text-emerald-700 flex items-center justify-center">
                <FileSpreadsheet className="w-4 h-4" />
              </div>
              <h4 className="text-base font-bold text-slate-900 group-hover:text-emerald-700 transition-colors">
                {isHi ? 'रणनीतिक SWOT व जोखिम' : 'SWOT & Risk Matrix'}
              </h4>
              <p className="text-xs text-slate-500">
                {isHi ? 'ताकत, कमजोरी, अवसर व संभावित चुनौतियां' : 'Internal strengths & external risk mitigations'}
              </p>
            </div>
            <div className="flex items-center gap-1 text-xs font-bold text-emerald-700 pt-2 border-t border-slate-100">
              <span>{isHi ? 'जोखिम विश्लेषण' : 'View Matrix'}</span>
              <ChevronRight className="w-3.5 h-3.5" />
            </div>
          </Link>

          <Link
            to="/report"
            className="bg-white border border-slate-200 hover:border-slate-300 rounded-2xl p-5 flex flex-col justify-between space-y-3 shadow-sm hover:shadow-md transition-all group"
          >
            <div className="space-y-1.5">
              <div className="w-8 h-8 rounded-lg bg-emerald-50 text-emerald-700 flex items-center justify-center">
                <FileCheck className="w-4 h-4" />
              </div>
              <h4 className="text-base font-bold text-slate-900 group-hover:text-emerald-700 transition-colors">
                {isHi ? 'बैंक प्रोजेक्ट रिपोर्ट (DPR)' : 'Formal Project Dossier'}
              </h4>
              <p className="text-xs text-slate-500">
                {isHi ? 'बैंक अधिकारी हेतु औपचारिक प्रस्ताव फाइल' : 'Printable credit dossier with loan covenants'}
              </p>
            </div>
            <div className="flex items-center gap-1 text-xs font-bold text-emerald-700 pt-2 border-t border-slate-100">
              <span>{isHi ? 'प्रस्ताव खोलें' : 'Open Dossier'}</span>
              <ChevronRight className="w-3.5 h-3.5" />
            </div>
          </Link>
        </div>
      </div>

      {/* ── 6. GROUND VENDOR DATA CALIBRATION CALLOUT (FIREBASE) ── */}
      <div className="bg-linear-to-r from-emerald-50 via-teal-50 to-slate-50 border border-emerald-200/80 rounded-2xl p-5 sm:p-6 flex flex-col md:flex-row items-start md:items-center justify-between gap-4 shadow-xs">
        <div className="flex items-start gap-3.5">
          <div className="w-10 h-10 rounded-xl bg-emerald-700 text-white flex items-center justify-center shrink-0 shadow-xs">
            <ClipboardCheck className="w-5 h-5" />
          </div>
          <div className="space-y-0.5">
            <div className="flex items-center gap-2">
              <h4 className="text-sm font-bold text-slate-900">
                {isHi ? 'स्थानीय व्यापारिक आंकड़े साझा करें' : 'Are you a local business owner or surveyor?'}
              </h4>
              <span className="text-[10px] font-bold px-1.5 py-0.2 rounded bg-emerald-100 text-emerald-800 border border-emerald-200">
                Firebase Cloud
              </span>
            </div>
            <p className="text-xs text-slate-600 max-w-2xl leading-relaxed">
              {isHi
                ? 'अपने क्षेत्र के वास्तविक मासिक बिक्री व खर्च के आंकड़े दर्ज करें ताकि AI ग्रामीण ऋण मॉडल्स को और अधिक सटीक बना सके।'
                : 'Contribute real monthly revenue and operating figures from your village to train more accurate credit benchmarks.'}
            </p>
          </div>
        </div>

        <button
          type="button"
          onClick={() => setIsSurveyOpen(true)}
          className="inline-flex items-center gap-2 px-4 py-2.5 bg-emerald-700 hover:bg-emerald-800 text-white text-xs font-bold rounded-xl shadow-xs transition-all cursor-pointer shrink-0 self-stretch md:self-auto justify-center"
        >
          <ClipboardCheck className="w-4 h-4" />
          <span>{isHi ? 'ज़मीनी डेटा दर्ज करें' : 'Contribute Ground Data'}</span>
        </button>
      </div>
    </div>
  );
}

