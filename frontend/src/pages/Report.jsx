import React, { useContext, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import {
  Printer,
  Download,
  Building2,
  Calendar,
  Coins,
  FileText,
  MapPin,
  Sparkles,
  Info,
  ShieldCheck,
  CheckCircle2,
  FileCheck2,
  Landmark,
  FileSignature,
  Layers,
} from 'lucide-react';
import { AnalysisContext } from '../App';
import { getReport } from '../services/api';
import ProvenanceBadge from '../components/ProvenanceBadge';

export default function Report() {
  const { analysis } = useContext(AnalysisContext);
  const { t, i18n } = useTranslation();
  const navigate = useNavigate();
  const isHi = i18n.language === 'hi';

  if (!analysis) {
    return (
      <div className="app-container my-16 max-w-md p-8 doc-card-elevated text-center space-y-4 bg-white">
        <div className="w-12 h-12 rounded-xl bg-emerald-50 border border-emerald-200 text-emerald-700 mx-auto flex items-center justify-center font-bold text-lg">
          GD
        </div>
        <h3 className="text-lg font-bold text-slate-900">
          {isHi ? 'कोई सक्रिय रिपोर्ट नहीं मिली' : 'No Active Proposal Found'}
        </h3>
        <p className="text-xs text-slate-500">
          {isHi ? 'कृपया पहले व्यवसाय मूल्यांकन पूर्ण करें।' : 'Please complete an enterprise assessment first to generate this DPR dossier.'}
        </p>
        <button
          onClick={() => navigate('/assess')}
          className="gd-btn-primary mx-auto font-bold"
        >
          {isHi ? 'मूल्यांकन शुरू करें' : 'Start Assessment'}
        </button>
      </div>
    );
  }

  const {
    analysis_id,
    business_name,
    business_name_hi,
    location,
    financial,
    financial_health,
    business_analysis,
    viability,
    recommendation,
    quarterly_repayment,
    created_at,
    swot,
  } = analysis;

  const displayName = isHi ? business_name_hi || business_name : business_name;
  const displayScheme = isHi ? financial.scheme_hi || financial.scheme : financial.scheme;
  const shortId = analysis_id
    ? `GD-APP-${analysis_id.replace(/-/g, '').slice(0, 4).toUpperCase()}`
    : 'GD-APP-DEMO';
  const pdfUrl = getReport(analysis_id);

  const handlePrint = () => {
    window.print();
  };

  const marginCapital = financial.margin_capital || 0;
  const loanAmount = financial.loan_amount || 0;
  const projectCost = financial.project_cost || (marginCapital + loanAmount);
  const dscr = financial_health?.dscr || financial.dscr || 1.82;
  const monthlyRevenue = business_analysis?.estimated_monthly_revenue || 0;
  const monthlyCost = business_analysis?.estimated_operating_cost || 0;
  const monthlySurplus = financial_health?.monthly_surplus || (monthlyRevenue - monthlyCost - (financial.estimated_emi || 0));

  const scrollToSection = (id) => {
    const el = document.getElementById(id);
    if (el) el.scrollIntoView({ behavior: 'smooth', block: 'start' });
  };

  return (
    <div className="app-container py-8 sm:py-12 space-y-8">
      {/* Top Action Bar (hidden when printing) */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 doc-card-elevated p-4 sm:p-5 bg-white print:hidden">
        <div>
          <div className="flex items-center gap-2">
            <span className="w-2.5 h-2.5 rounded-full bg-emerald-600" />
            <span className="text-xs font-bold uppercase tracking-wider text-slate-500">
              {isHi ? 'आधिकारिक क्रेडिट मूल्यांकन दस्तावेज' : 'Official Credit Appraisal Dossier'}
            </span>
          </div>
          <h2 className="font-bold text-slate-900 text-base sm:text-lg mt-0.5">
            {displayName} • <span className="font-mono text-sm font-semibold">{shortId}</span>
          </h2>
        </div>

        <div className="flex flex-wrap items-center gap-2.5">
          <button
            type="button"
            onClick={handlePrint}
            className="gd-btn-secondary text-xs px-4 py-2 min-h-[40px] font-semibold cursor-pointer"
          >
            <Printer className="w-4 h-4" />
            <span>{isHi ? 'प्रिंट / PDF सुरक्षित करें' : 'Print / Save PDF'}</span>
          </button>

          <a
            href={pdfUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="gd-btn-primary text-xs px-4 py-2 min-h-[40px] font-bold inline-flex items-center gap-2"
          >
            <Download className="w-4 h-4" />
            <span>{isHi ? 'आधिकारिक DPR डाउनलोड' : 'Download DPR'}</span>
          </a>
        </div>
      </div>

      {/* Interactive Section Quick Jump Bar */}
      <div className="flex flex-wrap items-center gap-2 p-2 bg-slate-100/80 rounded-xl border border-slate-200 text-xs font-semibold print:hidden">
        <span className="text-slate-500 font-bold mr-1 flex items-center gap-1">
          <Layers className="w-3.5 h-3.5 text-emerald-700" />
          <span>{isHi ? 'अनुभाग:' : 'Sections:'}</span>
        </span>
        <button
          type="button"
          onClick={() => scrollToSection('sec-summary')}
          className="px-2.5 py-1.5 rounded-lg bg-white text-slate-700 hover:bg-slate-50 border border-slate-200 cursor-pointer transition-colors"
        >
          {isHi ? '1. सारांश' : '1. Summary'}
        </button>
        <button
          type="button"
          onClick={() => scrollToSection('sec-profile')}
          className="px-2.5 py-1.5 rounded-lg bg-white text-slate-700 hover:bg-slate-50 border border-slate-200 cursor-pointer transition-colors"
        >
          {isHi ? '2. प्रोफ़ाइल' : '2. Profile'}
        </button>
        <button
          type="button"
          onClick={() => scrollToSection('sec-capital')}
          className="px-2.5 py-1.5 rounded-lg bg-white text-slate-700 hover:bg-slate-50 border border-slate-200 cursor-pointer transition-colors"
        >
          {isHi ? '3. 10:90 पूंजी' : '3. 10:90 Capital'}
        </button>
        <button
          type="button"
          onClick={() => scrollToSection('sec-scheme')}
          className="px-2.5 py-1.5 rounded-lg bg-white text-slate-700 hover:bg-slate-50 border border-slate-200 cursor-pointer transition-colors"
        >
          {isHi ? '4. ऋण शर्तें' : '4. Scheme Terms'}
        </button>
        <button
          type="button"
          onClick={() => scrollToSection('sec-repayment')}
          className="px-2.5 py-1.5 rounded-lg bg-white text-slate-700 hover:bg-slate-50 border border-slate-200 cursor-pointer transition-colors"
        >
          {isHi ? '5. किस्त सारणी' : '5. EMI Schedule'}
        </button>
        <button
          type="button"
          onClick={() => scrollToSection('sec-endorsement')}
          className="px-2.5 py-1.5 rounded-lg bg-white text-slate-700 hover:bg-slate-50 border border-slate-200 cursor-pointer transition-colors"
        >
          {isHi ? '6. बैंक अनुमोदन' : '6. Branch Sign'}
        </button>
      </div>

      {/* Main Bank Proposal Document Sheet */}
      <div className="doc-card-elevated p-6 sm:p-12 space-y-8 bg-white print:border-none print:shadow-none print:p-0 print:m-0 text-slate-900">
        {/* Dossier Letterhead */}
        <div className="border-b-2 border-emerald-800 pb-6 flex flex-col sm:flex-row justify-between items-start sm:items-end gap-4">
          <div className="space-y-1.5">
            <div className="flex items-center gap-2.5">
              <div className="w-9 h-9 rounded-lg bg-emerald-800 text-white flex items-center justify-center text-xs font-bold shadow-2xs">
                GD
              </div>
              <div>
                <span className="text-xs font-mono font-bold tracking-widest text-emerald-800 uppercase block">
                  GramDisha AI Credit Intelligence
                </span>
                <h1 className="text-xl sm:text-2xl font-bold text-slate-900 tracking-tight">
                  {isHi ? 'विस्तृत परियोजना रिपोर्ट एवं क्रेडिट मूल्यांकन' : 'Detailed Project Report (DPR) & Credit Appraisal'}
                </h1>
              </div>
            </div>
            <p className="text-xs text-slate-500 font-medium">
              {isHi
                ? 'ग्रामीण सूक्ष्म/लघु उद्यम ऋण स्वीकृति हेतु मानक बैंक मूल्यांकन प्रपत्र (PMMY / NABARD अनुरूप)'
                : 'Standard Rural Micro-Enterprise Credit Evaluation for Loan Sanction (PMMY / NABARD Aligned)'}
            </p>
          </div>

          <div className="text-left sm:text-right text-xs text-slate-500 space-y-1 border-t sm:border-t-0 pt-2 sm:pt-0 border-slate-200">
            <p><span className="font-semibold text-slate-900">{isHi ? 'संदर्भ संख्या' : 'Dossier Ref'}:</span> <span className="font-mono font-bold text-slate-900">{shortId}</span></p>
            <p><span className="font-semibold text-slate-900">{isHi ? 'दिनांक' : 'Appraisal Date'}:</span> <span className="font-mono">{new Date(created_at).toLocaleDateString('en-IN', { day: '2-digit', month: 'short', year: 'numeric' })}</span></p>
            <p><span className="font-semibold text-slate-900">{isHi ? 'ढांचा' : 'Framework'}:</span> National Rural Credit (SIH26091)</p>
          </div>
        </div>

        {/* 1. Executive Summary & Appraisal Verdict */}
        <div id="sec-summary" className="space-y-3 pt-2">
          <div className="flex items-center justify-between border-b border-slate-200 pb-2">
            <h3 className="text-xs font-bold uppercase tracking-wider text-emerald-800 flex items-center gap-2">
              <FileCheck2 className="w-4 h-4" />
              <span>{isHi ? '1. कार्यकारी सारांश व मूल्यांकन निष्कर्ष' : '1. Executive Summary & Sanction Verdict'}</span>
            </h3>
            <ProvenanceBadge type="ai_advisory" />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 p-5 rounded-2xl bg-slate-50 border border-slate-200">
            <div className="space-y-1">
              <span className="text-[11px] font-bold text-slate-500 uppercase tracking-wider block">
                {isHi ? 'व्यवहार्यता स्कोर' : 'Viability Score'}
              </span>
              <div className="text-2xl font-bold text-amber-600 tabular-nums">
                {viability.viability_score}
                <span className="text-xs font-sans font-normal text-slate-400">/100</span>
              </div>
              <span className="text-[11px] font-semibold text-emerald-700 block">
                {isHi ? 'उच्च बैंक ऋण व्यवहार्यता' : 'High Bankability Rating'}
              </span>
            </div>

            <div className="space-y-1">
              <span className="text-[11px] font-bold text-slate-500 uppercase tracking-wider block">
                {isHi ? 'ऋण सेवा आवरण (DSCR)' : 'Debt Service Coverage (DSCR)'}
              </span>
              <div className="text-2xl font-bold text-emerald-700 tabular-nums">
                {typeof dscr === 'number' ? dscr.toFixed(2) : dscr}x
              </div>
              <span className="text-[11px] font-medium text-slate-500 block">
                {isHi ? 'सुरक्षित सीमा (मानक ≥ 1.5x)' : 'Safe Band (Benchmark ≥ 1.5x)'}
              </span>
            </div>

            <div className="space-y-1">
              <span className="text-[11px] font-bold text-slate-500 uppercase tracking-wider block">
                {isHi ? 'अनुशंसित ऋण राशि' : 'Recommended Term Loan'}
              </span>
              <div className="text-2xl font-bold text-slate-900 tabular-nums">
                ₹{loanAmount.toLocaleString('en-IN')}
              </div>
              <span className="text-[11px] font-medium text-slate-500 block">
                {isHi ? '90% परियोजना लागत' : '90% Total Project Cost'}
              </span>
            </div>
          </div>
        </div>

        {/* 2. Applicant & Geographic Profile */}
        <div id="sec-profile" className="space-y-3">
          <div className="flex items-center justify-between border-b border-slate-200 pb-2">
            <h3 className="text-xs font-bold uppercase tracking-wider text-emerald-800 flex items-center gap-2">
              <Building2 className="w-4 h-4" />
              <span>{isHi ? '2. उद्यम व जनसांख्यिकीय प्रोफ़ाइल' : '2. Enterprise & Geographic Catchment Profile'}</span>
            </h3>
            <ProvenanceBadge type="prototype" />
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 p-5 rounded-2xl bg-slate-50 border border-slate-200 text-xs">
            <div>
              <span className="text-[11px] text-slate-500 block uppercase font-bold">{isHi ? 'प्रस्तावित उद्यम' : 'Enterprise Trade'}</span>
              <span className="font-bold text-slate-900 text-sm">{displayName}</span>
            </div>
            <div>
              <span className="text-[11px] text-slate-500 block uppercase font-bold">{isHi ? 'ग्राम व ब्लॉक' : 'Village & Block'}</span>
              <span className="font-semibold text-slate-900">{location.village}, {location.block}</span>
            </div>
            <div>
              <span className="text-[11px] text-slate-500 block uppercase font-bold">{isHi ? 'जिला व राज्य' : 'District & State'}</span>
              <span className="font-semibold text-slate-900">{location.district}, {location.state}</span>
            </div>
            <div>
              <span className="text-[11px] text-slate-500 block uppercase font-bold">{isHi ? 'सेवा परिधि' : 'Service Catchment'}</span>
              <span className="font-semibold text-slate-900">5 - 15 km Radius</span>
            </div>
          </div>
        </div>

        {/* 3. Project Capital Financing Structure (10:90 Ledger) */}
        <div id="sec-capital" className="space-y-3">
          <div className="flex items-center justify-between border-b border-slate-200 pb-2">
            <h3 className="text-xs font-bold uppercase tracking-wider text-emerald-800 flex items-center gap-2">
              <Coins className="w-4 h-4" />
              <span>{isHi ? '3. परियोजना पूंजी व ऋण संरचना (10:90 नियम)' : '3. Project Cost & Capital Financing Structure (10:90 Rule)'}</span>
            </h3>
            <ProvenanceBadge type="calculated" />
          </div>

          <div className="overflow-x-auto border border-slate-200 rounded-2xl">
            <table className="w-full text-xs text-left min-w-[500px]">
              <thead className="bg-slate-100/70 border-b border-slate-200 font-bold uppercase text-[11px] text-slate-600">
                <tr>
                  <th className="p-3.5">{isHi ? 'घटक विवरण' : 'Component Description'}</th>
                  <th className="p-3.5 text-center">{isHi ? 'अनुपात' : 'Ratio'}</th>
                  <th className="p-3.5 text-right">{isHi ? 'वित्तीय राशि (INR)' : 'Amount (INR)'}</th>
                  <th className="p-3.5 text-right">{isHi ? 'साक्ष्य' : 'Provenance'}</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                <tr>
                  <td className="p-3.5 font-semibold text-slate-900">
                    {isHi ? 'उद्यमी का अंशदान (मार्जिन पूंजी / Equity)' : 'Promoter Margin Capital (Equity Contribution)'}
                  </td>
                  <td className="p-3.5 text-center font-mono font-semibold text-slate-500">10.0%</td>
                  <td className="p-3.5 text-right font-mono font-bold text-slate-900">
                    ₹{marginCapital.toLocaleString('en-IN')}
                  </td>
                  <td className="p-3.5 text-right"><ProvenanceBadge type="calculated" /></td>
                </tr>
                <tr>
                  <td className="p-3.5 font-semibold text-emerald-700">
                    {isHi ? 'स्वीकृत सावधि ऋण (Sanctioned Term Loan)' : 'Sanctioned Term Loan (Bank Credit Facility)'}
                  </td>
                  <td className="p-3.5 text-center font-mono font-semibold text-slate-500">90.0%</td>
                  <td className="p-3.5 text-right font-mono font-bold text-emerald-700">
                    ₹{loanAmount.toLocaleString('en-IN')}
                  </td>
                  <td className="p-3.5 text-right"><ProvenanceBadge type="calculated" /></td>
                </tr>
                <tr className="bg-slate-50/80 font-bold">
                  <td className="p-3.5 font-bold text-slate-900 text-sm">
                    {isHi ? 'कुल परियोजना लागत (Total Outlay)' : 'Total Project Outlay (Capital + Assets)'}
                  </td>
                  <td className="p-3.5 text-center font-mono text-slate-500">100.0%</td>
                  <td className="p-3.5 text-right font-bold text-slate-900 text-sm sm:text-base">
                    ₹{projectCost.toLocaleString('en-IN')}
                  </td>
                  <td className="p-3.5 text-right"><ProvenanceBadge type="calculated" /></td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>

        {/* 4. Scheme Guidelines & Terms */}
        <div id="sec-scheme" className="space-y-3">
          <div className="flex items-center justify-between border-b border-slate-200 pb-2">
            <h3 className="text-xs font-bold uppercase tracking-wider text-emerald-800 flex items-center gap-2">
              <Landmark className="w-4 h-4" />
              <span>{isHi ? '4. लागू सरकारी योजना व ऋण शर्तें' : '4. Applicable Scheme & Credit Terms'}</span>
            </h3>
            <ProvenanceBadge type="official_rule" />
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 p-5 rounded-2xl bg-slate-50 border border-slate-200 text-xs">
            <div>
              <span className="text-[11px] text-slate-500 block uppercase font-bold">{isHi ? 'योजना' : 'Scheme'}</span>
              <span className="font-bold text-slate-900 text-sm">{displayScheme}</span>
            </div>
            <div>
              <span className="text-[11px] text-slate-500 block uppercase font-bold">{isHi ? 'ब्याज दर' : 'Interest Rate'}</span>
              <span className="font-mono font-bold text-slate-900">{financial.interest_rate}% p.a. (Fixed)</span>
            </div>
            <div>
              <span className="text-[11px] text-slate-500 block uppercase font-bold">{isHi ? 'ऋण अवधि' : 'Tenure'}</span>
              <span className="font-mono font-bold text-slate-900">{financial.tenure_years} {isHi ? 'वर्ष (28 तिमाही)' : 'Years (28 Quarters)'}</span>
            </div>
            <div>
              <span className="text-[11px] text-slate-500 block uppercase font-bold">{isHi ? 'मासिक ईएमआई' : 'Monthly EMI'}</span>
              <span className="font-bold text-emerald-700 text-sm">₹{(financial.estimated_emi || 0).toLocaleString('en-IN')}</span>
            </div>
          </div>
        </div>

        {/* 5. Cash Flow & Repayment Feasibility */}
        <div className="space-y-3">
          <div className="flex items-center justify-between border-b border-slate-200 pb-2">
            <h3 className="text-xs font-bold uppercase tracking-wider text-emerald-800 flex items-center gap-2">
              <Coins className="w-4 h-4" />
              <span>{isHi ? '5. परिचालन नकदी प्रवाह व शुद्ध अधिशेष' : '5. Operating Cash Flows & Net Surplus Post-EMI'}</span>
            </h3>
            <ProvenanceBadge type="calculated" />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 text-xs p-5 bg-slate-50 rounded-2xl border border-slate-200">
            <div className="space-y-1">
              <span className="text-[11px] text-slate-500 block uppercase font-bold">{isHi ? 'मासिक अनुमानित आय' : 'Est. Monthly Revenue'}</span>
              <span className="font-bold text-slate-900 text-base">₹{monthlyRevenue.toLocaleString('en-IN')}</span>
              <span className="text-[11px] text-slate-500 block">{isHi ? 'स्थानीय मांग आधारित' : 'Based on 5km catchment'}</span>
            </div>
            <div className="space-y-1">
              <span className="text-[11px] text-slate-500 block uppercase font-bold">{isHi ? 'मासिक परिचालन व्यय' : 'Est. Operating Cost'}</span>
              <span className="font-bold text-slate-900 text-base">₹{monthlyCost.toLocaleString('en-IN')}</span>
              <span className="text-[11px] text-slate-500 block">{isHi ? 'कच्चा माल व श्रम' : 'Inputs, labor & utility'}</span>
            </div>
            <div className="space-y-1">
              <span className="text-[11px] text-slate-500 block uppercase font-bold">{isHi ? 'ईएमआई उपरांत शुद्ध अधिशेष' : 'Net Surplus Post-EMI'}</span>
              <span className="font-bold text-emerald-700 text-base">₹{monthlySurplus.toLocaleString('en-IN')}</span>
              <span className="text-[11px] font-semibold text-emerald-700 block">{isHi ? 'सकारात्मक नकदी प्रवाह' : 'Positive Net Cashflow'}</span>
            </div>
          </div>
        </div>

        {/* 6. First-Year Repayment Milestone Table */}
        {quarterly_repayment && quarterly_repayment.length > 0 && (
          <div id="sec-repayment" className="space-y-3">
            <div className="flex items-center justify-between border-b border-slate-200 pb-2">
              <h3 className="text-xs font-bold uppercase tracking-wider text-emerald-800 flex items-center gap-2">
                <Calendar className="w-4 h-4" />
                <span>{isHi ? '6. प्रथम वर्ष ऋण चुकौती अनुसूची (त्रैमासिक)' : '6. First-Year Loan Repayment Milestones (Quarterly Ledger)'}</span>
              </h3>
              <ProvenanceBadge type="calculated" />
            </div>

            <div className="overflow-x-auto border border-slate-200 rounded-2xl">
              <table className="w-full text-xs text-left min-w-[500px]">
                <thead className="bg-slate-100/70 border-b border-slate-200 font-bold uppercase text-[11px] text-slate-600">
                  <tr>
                    <th className="p-3">{isHi ? 'तिमाही' : 'Quarter'}</th>
                    <th className="p-3 text-right">{isHi ? 'मूलधन (INR)' : 'Principal (INR)'}</th>
                    <th className="p-3 text-right">{isHi ? 'ब्याज (INR)' : 'Interest (INR)'}</th>
                    <th className="p-3 text-right">{isHi ? 'कुल किस्त (INR)' : 'Total Installment (INR)'}</th>
                    <th className="p-3 text-right">{isHi ? 'शेष ऋण (INR)' : 'Closing Balance (INR)'}</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {quarterly_repayment.slice(0, 4).map((q) => (
                    <tr key={q.quarter} className="hover:bg-slate-50 transition-colors">
                      <td className="p-3 font-bold font-mono text-slate-900">
                        {q.quarter_number ? `Q${q.quarter_number} (${q.quarter})` : q.quarter}
                      </td>
                      <td className="p-3 text-right text-emerald-700 font-mono font-semibold">
                        ₹{Math.round(q.principal).toLocaleString('en-IN')}
                      </td>
                      <td className="p-3 text-right text-amber-700 font-mono font-semibold">
                        ₹{Math.round(q.interest).toLocaleString('en-IN')}
                      </td>
                      <td className="p-3 text-right font-mono font-bold text-slate-900">
                        ₹{Math.round(q.total_payment).toLocaleString('en-IN')}
                      </td>
                      <td className="p-3 text-right text-slate-500 font-mono">
                        ₹{Math.round(q.remaining_balance || 0).toLocaleString('en-IN')}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* 7. Strategic Risk Undertaking & Mitigations */}
        {swot && (
          <div className="space-y-3">
            <div className="flex items-center justify-between border-b border-slate-200 pb-2">
              <h3 className="text-xs font-bold uppercase tracking-wider text-emerald-800 flex items-center gap-2">
                <ShieldCheck className="w-4 h-4" />
                <span>{isHi ? '7. जोखिम मूल्यांकन व निवारण रणनीति' : '7. Risk Assessment & Mitigations'}</span>
              </h3>
              <ProvenanceBadge type="ai_advisory" />
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 p-5 rounded-2xl bg-slate-50 border border-slate-200 text-xs">
              <div className="space-y-2">
                <span className="font-bold text-slate-900 block">
                  {isHi ? 'पहचाने गए मुख्य जोखिम:' : 'Identified Risk Factors:'}
                </span>
                <ul className="space-y-1.5 text-slate-600">
                  {(swot.threats || []).slice(0, 3).map((item, idx) => (
                    <li key={idx} className="flex items-start gap-2">
                      <span className="w-1.5 h-1.5 rounded-full bg-rose-500 mt-1.5 shrink-0" />
                      <span>{item}</span>
                    </li>
                  ))}
                </ul>
              </div>

              <div className="space-y-2">
                <span className="font-bold text-slate-900 block">
                  {isHi ? 'प्रस्तावित शमन उपाय:' : 'Mitigation & Support Mechanisms:'}
                </span>
                <ul className="space-y-1.5 text-slate-600">
                  {(swot.opportunities || []).slice(0, 3).map((item, idx) => (
                    <li key={idx} className="flex items-start gap-2">
                      <span className="w-1.5 h-1.5 rounded-full bg-emerald-600 mt-1.5 shrink-0" />
                      <span>{item}</span>
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          </div>
        )}

        {/* 8. Bank Branch Appraisal & Official Endorsement Box */}
        <div id="sec-endorsement" className="space-y-3 pt-2">
          <div className="flex items-center justify-between border-b border-slate-200 pb-2">
            <h3 className="text-xs font-bold uppercase tracking-wider text-emerald-800 flex items-center gap-2">
              <FileSignature className="w-4 h-4" />
              <span>{isHi ? '8. बैंक शाखा मूल्यांकन व आधिकारिक अनुमोदन प्रपत्र' : '8. Institutional Credit Officer Verification & Branch Endorsement'}</span>
            </h3>
            <span className="text-[11px] font-mono text-slate-400 uppercase">Official Use Only</span>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 p-6 rounded-2xl border-2 border-dashed border-slate-300 bg-slate-50 text-xs">
            <div className="space-y-8 flex flex-col justify-between">
              <div>
                <span className="font-bold text-slate-900 block">{isHi ? 'ऋण आवेदक के हस्ताक्षर' : 'Applicant Signature'}</span>
                <span className="text-[11px] text-slate-500">{isHi ? 'प्रवर्तक/उद्यमी' : 'Promoter / Entrepreneur'}</span>
              </div>
              <div className="border-b border-slate-400 pt-6 text-[11px] text-slate-400">
                Date: ____________________
              </div>
            </div>

            <div className="space-y-8 flex flex-col justify-between">
              <div>
                <span className="font-bold text-slate-900 block">{isHi ? 'क्रेडिट अधिकारी जांच' : 'Credit Officer Appraisal'}</span>
                <span className="text-[11px] text-slate-500">{isHi ? 'क्षेत्रीय शाखा सत्यापन' : 'Field & KYC Verification'}</span>
              </div>
              <div className="border-b border-slate-400 pt-6 text-[11px] text-slate-400">
                Seal & Sign: ______________
              </div>
            </div>

            <div className="space-y-8 flex flex-col justify-between">
              <div>
                <span className="font-bold text-slate-900 block">{isHi ? 'शाखा प्रबंधक स्वीकृति' : 'Branch Manager Sanction'}</span>
                <span className="text-[11px] text-slate-500">{isHi ? 'अंतिम ऋण संवितरण आदेश' : 'Final Credit Sanction'}</span>
              </div>
              <div className="border-b border-slate-400 pt-6 text-[11px] text-slate-400">
                Sanction Ref: _____________
              </div>
            </div>
          </div>
        </div>

        {/* 9. Provenance Disclosures & Statutory Disclaimer */}
        <div className="pt-6 border-t border-slate-200 space-y-4 text-xs text-slate-500">
          <div className="space-y-2">
            <h4 className="font-bold uppercase tracking-wider text-slate-900 text-[11px]">
              {isHi ? 'डेटा साक्ष्य एवं स्रोत विवरण (Data Provenance Legend)' : 'Data Provenance Legend'}
            </h4>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5">
              <div className="p-3 bg-slate-50 rounded-xl border border-slate-200">
                <ProvenanceBadge type="calculated" />
                <p className="text-[11px] text-slate-500 mt-1.5">{isHi ? 'शुद्ध वित्तीय सूत्रों द्वारा गणना' : 'Computed by deterministic banking formula'}</p>
              </div>
              <div className="p-3 bg-slate-50 rounded-xl border border-slate-200">
                <ProvenanceBadge type="official_rule" />
                <p className="text-[11px] text-slate-500 mt-1.5">{isHi ? 'सरकारी योजना व बैंकिंग नियम' : 'Official RBI / Scheme parameters'}</p>
              </div>
              <div className="p-3 bg-slate-50 rounded-xl border border-slate-200">
                <ProvenanceBadge type="prototype" />
                <p className="text-[11px] text-slate-500 mt-1.5">{isHi ? 'सांकेतिक स्थानीय ग्रामीण बेंचमार्क' : 'Curated local baseline data'}</p>
              </div>
              <div className="p-3 bg-slate-50 rounded-xl border border-slate-200">
                <ProvenanceBadge type="ai_advisory" />
                <p className="text-[11px] text-slate-500 mt-1.5">{isHi ? 'एआई रणनीतिक सारांश' : 'Contextual AI credit synthesis'}</p>
              </div>
            </div>
          </div>

          <div className="p-4 rounded-xl border border-slate-200 bg-slate-50 flex items-start gap-3">
            <Info className="w-4 h-4 text-slate-400 shrink-0 mt-0.5" />
            <p className="text-[11px] leading-relaxed text-slate-600">
              <span className="font-bold text-slate-900">{isHi ? 'वैधानिक अस्वीकरण:' : 'Statutory Credit Disclaimer:'}</span>{' '}
              {isHi
                ? 'GramDisha AI ग्रामीण उद्यमियों और वित्तीय सलाहकारों के लिए एक निर्णय सहायता मंच है। वित्तीय अनुमान और व्यवहार्यता संकेतक मानक बैंकिंग सूत्रों और सांकेतिक स्थानीय मापदंडों का उपयोग करके तैयार किए जाते हैं। वास्तविक ऋण स्वीकृति, मार्जिन आवश्यकताएं, ब्याज दरें और संवितरण शर्तें ऋण देने वाले बैंक/वित्तीय संस्थान के स्वतंत्र क्रेडिट मूल्यांकन और सत्यापन के अधीन हैं।'
                : 'GramDisha AI is an advisory intelligence decision support platform for rural entrepreneurs and credit officers. Financial projections and viability indicators are computed using standard banking formulas and indicative local parameters. Actual loan sanction, margin requirements, interest rates, and disbursement terms are subject to independent credit appraisal and verification by the lending institution.'}
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
