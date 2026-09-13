import React, { useContext, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import {
  Coins,
  Building2,
  Calendar,
  TrendingUp,
  ChevronDown,
  FileSpreadsheet,
  Landmark,
  ShieldCheck,
  Scale,
  Sparkles,
  Layers,
  Filter,
} from 'lucide-react';
import {
  ResponsiveContainer,
  BarChart,
  Bar,
  AreaChart,
  Area,
  XAxis,
  YAxis,
  Tooltip,
  Legend,
  CartesianGrid,
} from 'recharts';
import { AnalysisContext } from '../App';
import ProvenanceBadge from '../components/ProvenanceBadge';
import VoiceButton from '../components/VoiceButton';

export default function Financial() {
  const { analysis } = useContext(AnalysisContext);
  const { i18n } = useTranslation();
  const navigate = useNavigate();
  const isHi = i18n.language === 'hi';

  const [selectedTenure, setSelectedTenure] = useState(7);
  const [chartType, setChartType] = useState('bar');
  const [yearFilter, setYearFilter] = useState('all');
  const [showAllQuarters, setShowAllQuarters] = useState(false);

  if (!analysis) {
    return (
      <div className="app-container my-16 max-w-md p-8 bg-white border border-slate-200 rounded-2xl text-center space-y-4 shadow-sm">
        <div className="w-12 h-12 rounded-xl bg-emerald-50 border border-emerald-200 text-emerald-700 mx-auto flex items-center justify-center text-lg font-bold">
          GD
        </div>
        <h3 className="text-lg font-bold text-slate-900">
          {isHi ? 'कोई सक्रिय वित्तीय विश्लेषण नहीं मिला' : 'No Active Financial Appraisal Found'}
        </h3>
        <button
          onClick={() => navigate('/assess')}
          className="gd-btn-primary mx-auto font-bold"
        >
          {isHi ? 'नया मूल्यांकन शुरू करें' : 'Start Assessment'}
        </button>
      </div>
    );
  }

  const { financial, quarterly_repayment } = analysis;

  const displayScheme = isHi ? financial.scheme_hi || financial.scheme : financial.scheme;
  const projectCost = financial.project_cost || 0;
  const marginCapital = financial.margin_capital || 0;
  const loanAmount = financial.loan_amount || 0;
  const marginPct = projectCost > 0 ? ((marginCapital / projectCost) * 100).toFixed(0) : '10';
  const loanPct = projectCost > 0 ? ((loanAmount / projectCost) * 100).toFixed(0) : '90';

  const annualRate = (financial.interest_rate || 8.5) / 100;
  const monthlyRate = annualRate / 12;
  const tenureMonths = selectedTenure * 12;
  const calculatedEmi = Math.round(
    (loanAmount * monthlyRate * Math.pow(1 + monthlyRate, tenureMonths)) /
      (Math.pow(1 + monthlyRate, tenureMonths) - 1)
  );

  const totalRepayment = calculatedEmi * tenureMonths;
  const totalInterest = Math.max(0, totalRepayment - loanAmount);

  const chartData = (quarterly_repayment || []).slice(0, selectedTenure * 4).map((q, idx) => ({
    name: q.quarter_number ? `Q${q.quarter_number}` : q.quarter || `Q${idx + 1}`,
    [isHi ? 'मूलधन (Principal)' : 'Principal']: Math.round(q.principal || (loanAmount / (selectedTenure * 4))),
    [isHi ? 'ब्याज (Interest)' : 'Interest']: Math.round(q.interest || (totalInterest / (selectedTenure * 4))),
    balance: Math.round(q.remaining_balance || Math.max(0, loanAmount - (idx + 1) * (loanAmount / (selectedTenure * 4)))),
  }));

  const allQuartersList = quarterly_repayment || [];
  const filteredQuarters = yearFilter === 'all'
    ? (showAllQuarters ? allQuartersList : allQuartersList.slice(0, 8))
    : allQuartersList.filter((_, i) => Math.floor(i / 4) + 1 === Number(yearFilter));

  const voiceFinancialText = isHi
    ? `वित्तीय संरचना: कुल लागत ₹${(projectCost / 100000).toFixed(1)} लाख है। आपकी पूंजी ₹${(marginCapital / 100000).toFixed(1)} लाख और बैंक लोन ₹${(loanAmount / 100000).toFixed(1)} लाख है। ${selectedTenure} वर्ष अवधि पर महीने की किस्त ₹${calculatedEmi} है।`
    : `Financial structure: Total project outlay is ₹${projectCost.toLocaleString('en-IN')}. Promoter margin is ₹${marginCapital.toLocaleString('en-IN')} and bank term loan is ₹${loanAmount.toLocaleString('en-IN')} under ${displayScheme}. At ${selectedTenure}-year tenure, monthly debt service is ₹${calculatedEmi}.`;

  return (
    <div className="app-container py-8 sm:py-10 space-y-7">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-200 pb-4">
        <div>
          <span className="text-xs font-bold uppercase tracking-wider text-emerald-700 block mb-0.5">
            {isHi ? 'अनुसूची I: वित्तीय संरचना' : 'Annexure I: Debt Structuring'}
          </span>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight">
            {isHi ? 'पूंजी संरचना एवं ऋण शोधन सारणी' : 'Capital Structure & Amortization Ledger'}
          </h1>
          <p className="text-xs sm:text-sm text-slate-500 mt-0.5">
            {isHi
              ? '10:90 पूंजी अनुपात, सरकारी सावधि ऋण योजना एवं 28-तिमाही किस्तों का विवरण'
              : 'Statutory 10:90 capital ratio, concessional scheme routing, and 28-quarter amortization schedule'}
          </p>
        </div>
        <div className="flex items-center gap-2.5">
          <VoiceButton
            text={voiceFinancialText}
            language={i18n.language}
            label={isHi ? 'वित्तीय विवरण सुनें' : 'Listen Summary'}
          />
          <ProvenanceBadge type="calculated" />
        </div>
      </div>

      {/* Capital Ratio & Scheme Card Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-stretch">
        {/* Capital Structure Card */}
        <div className="lg:col-span-7 bg-white border border-slate-200 rounded-2xl p-6 sm:p-7 flex flex-col justify-between space-y-5 shadow-sm">
          <div className="space-y-4">
            <div className="flex items-center justify-between border-b border-slate-100 pb-3">
              <div className="flex items-center gap-2 font-bold text-slate-900 text-sm sm:text-base">
                <Coins className="w-4 h-4 text-emerald-700 shrink-0" />
                <span>{isHi ? 'परियोजना लागत विभाजन (10:90)' : 'Project Cost Breakdown (10:90)'}</span>
              </div>
              <span className="text-xs font-semibold text-slate-500">PMMY / NABARD</span>
            </div>

            {/* Total Highlight */}
            <div className="p-4 rounded-xl bg-slate-50 border border-slate-200/80 flex items-center justify-between">
              <div>
                <span className="text-[11px] font-bold uppercase tracking-wider text-slate-500">
                  {isHi ? 'कुल परियोजना लागत (Project Cost)' : 'Total Project Outlay'}
                </span>
                <div className="text-2xl sm:text-3xl font-bold text-slate-900 tabular-nums mt-0.5">
                  ₹{projectCost.toLocaleString('en-IN')}
                </div>
              </div>
              <span className="text-xs font-bold px-2.5 py-1 rounded-md bg-white border border-slate-200 text-slate-800">
                100% Outlay
              </span>
            </div>

            {/* Split Bar */}
            <div className="space-y-1.5">
              <div className="flex justify-between text-xs font-semibold text-slate-600">
                <span>{isHi ? `प्रवर्तक पूंजी (${marginPct}%)` : `Promoter Equity (${marginPct}%)`}</span>
                <span>{isHi ? `बैंक ऋण (${loanPct}%)` : `Bank Term Loan (${loanPct}%)`}</span>
              </div>
              <div className="w-full h-3 bg-slate-100 rounded-full flex overflow-hidden border border-slate-200">
                <div
                  className="h-full bg-amber-500 transition-all"
                  style={{ width: `${marginPct}%` }}
                />
                <div
                  className="h-full bg-emerald-700 transition-all"
                  style={{ width: `${loanPct}%` }}
                />
              </div>
            </div>

            {/* Structured 2-column breakdown table */}
            <div className="border border-slate-200 rounded-xl overflow-hidden divide-y divide-slate-100 text-xs sm:text-sm">
              <div className="p-3.5 flex justify-between items-center bg-white">
                <span className="text-slate-600 font-medium">
                  {isHi ? 'प्रवर्तक मार्जिन राशि (10%):' : 'Promoter Margin Contribution (10%):'}
                </span>
                <span className="font-mono font-bold text-slate-900 tabular-nums">
                  ₹{marginCapital.toLocaleString('en-IN')}
                </span>
              </div>

              <div className="p-3.5 flex justify-between items-center bg-white">
                <span className="text-slate-600 font-medium">
                  {isHi ? 'स्वीकृत सावधि बैंक ऋण (90%):' : 'Sanctioned Term Loan (90%):'}
                </span>
                <span className="font-mono font-bold text-emerald-700 tabular-nums">
                  ₹{loanAmount.toLocaleString('en-IN')}
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* Scheme Rule Card */}
        <div className="lg:col-span-5 bg-sky-50/50 border border-sky-200 rounded-2xl p-6 sm:p-7 flex flex-col justify-between space-y-4 shadow-sm">
          <div className="space-y-3">
            <div className="flex items-center justify-between border-b border-sky-200 pb-3">
              <div className="flex items-center gap-2">
                <Building2 className="w-4 h-4 text-sky-800 shrink-0" />
                <span className="font-bold text-xs text-sky-800 uppercase tracking-wider">
                  {isHi ? 'लागू वैधानिक योजना' : 'Mandated Credit Scheme'}
                </span>
              </div>
              <ProvenanceBadge type="official_rule" />
            </div>

            <div className="space-y-1">
              <h3 className="text-xl sm:text-2xl font-bold text-slate-900 leading-snug">
                {displayScheme}
              </h3>
              <p className="text-xs text-slate-500">
                {isHi ? 'परियोजना लागत के आधार पर स्वचालित योजना आवंटन' : 'Automated scheme routing based on statutory project cost thresholds'}
              </p>
            </div>

            {/* Interactive Tenure Toggle */}
            <div className="space-y-1.5 pt-1">
              <label className="text-xs font-bold text-sky-900 uppercase tracking-wider block">
                {isHi ? 'ऋण अवधि चुनें (Tenure):' : 'Select Loan Tenure:'}
              </label>
              <div className="grid grid-cols-3 gap-2">
                {[3, 5, 7].map((yr) => (
                  <button
                    key={yr}
                    type="button"
                    onClick={() => setSelectedTenure(yr)}
                    className={`py-1.5 px-2 rounded-lg text-xs font-bold transition-all cursor-pointer border ${
                      selectedTenure === yr
                        ? 'bg-emerald-700 text-white border-emerald-700 shadow-xs'
                        : 'bg-white text-slate-800 border-sky-200 hover:bg-slate-50'
                    }`}
                  >
                    {yr} {isHi ? 'वर्ष' : 'Years'}
                  </button>
                ))}
              </div>
            </div>

            {/* Scheme Parameters Table */}
            <div className="bg-white p-3.5 rounded-xl border border-sky-200 space-y-2 text-xs sm:text-sm">
              <div className="flex justify-between items-center">
                <span className="text-slate-600">{isHi ? 'वार्षिक ब्याज दर:' : 'Interest Rate:'}</span>
                <span className="font-mono font-bold text-slate-900 tabular-nums">{financial.interest_rate || 8.5}% p.a.</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-slate-600">{isHi ? 'कुल ब्याज देय:' : 'Total Interest Payable:'}</span>
                <span className="font-mono font-bold text-amber-700 tabular-nums">₹{totalInterest.toLocaleString('en-IN')}</span>
              </div>
              <div className="flex justify-between items-center pt-2 border-t border-slate-100 font-bold">
                <span className="text-emerald-800">{isHi ? 'मासिक किस्त (EMI):' : 'Monthly EMI:'}</span>
                <span className="font-mono text-base text-emerald-700 tabular-nums">
                  ₹{calculatedEmi.toLocaleString('en-IN')}
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* ── 3. RECHARTS AMORTIZATION VISUALIZER ── */}
      <div className="bg-white border border-slate-200 rounded-2xl p-6 sm:p-7 space-y-4 shadow-sm">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-slate-100 pb-3">
          <div>
            <h3 className="text-base font-bold text-slate-900">
              {isHi ? 'ऋण शोधन प्रवृत्ति (Amortization Visualization)' : 'Amortization Trajectory & Debt Paydown'}
            </h3>
            <p className="text-xs text-slate-500">
              {isHi ? `${selectedTenure} वर्ष अवधि पर तिमाही ऋण अदायगी एवं घटते शेष का चार्ट` : `Quarterly debt repayment trajectory across ${selectedTenure}-year tenure`}
            </p>
          </div>

          {/* Chart Type Toggle */}
          <div className="flex items-center gap-1 p-1 bg-slate-100 rounded-xl border border-slate-200 self-start sm:self-auto">
            <button
              type="button"
              onClick={() => setChartType('bar')}
              className={`px-3 py-1 rounded-lg text-xs font-semibold transition-all cursor-pointer ${
                chartType === 'bar' ? 'bg-emerald-700 text-white shadow-xs font-bold' : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              {isHi ? 'किस्त विभाजन (Bar)' : 'EMI Breakdown (Bar)'}
            </button>
            <button
              type="button"
              onClick={() => setChartType('area')}
              className={`px-3 py-1 rounded-lg text-xs font-semibold transition-all cursor-pointer ${
                chartType === 'area' ? 'bg-emerald-700 text-white shadow-xs font-bold' : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              {isHi ? 'शेष ऋण कमी (Paydown)' : 'Remaining Balance (Area)'}
            </button>
          </div>
        </div>

        <div className="h-64 sm:h-72 w-full pt-2">
          <ResponsiveContainer width="100%" height="100%">
            {chartType === 'bar' ? (
              <BarChart data={chartData} margin={{ top: 10, right: 10, left: -10, bottom: 0 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="#F1F5F9" vertical={false} />
                <XAxis dataKey="name" tick={{ fontSize: 11, fill: '#64748B' }} tickLine={false} axisLine={{ stroke: '#E2E8F0' }} />
                <YAxis tick={{ fontSize: 11, fill: '#64748B' }} tickLine={false} axisLine={false} tickFormatter={(v) => `₹${(v/1000).toFixed(0)}k`} />
                <Tooltip
                  contentStyle={{
                    backgroundColor: '#FFFFFF',
                    borderColor: '#E2E8F0',
                    borderRadius: '10px',
                    boxShadow: '0 4px 12px rgba(15,23,42,0.08)',
                    fontSize: '12px',
                  }}
                  formatter={(val) => [`₹${Number(val).toLocaleString('en-IN')}`, '']}
                />
                <Legend wrapperStyle={{ fontSize: '12px', paddingTop: '10px' }} />
                <Bar dataKey={isHi ? 'मूलधन (Principal)' : 'Principal'} fill="#047857" stackId="a" />
                <Bar dataKey={isHi ? 'ब्याज (Interest)' : 'Interest'} fill="#D97706" stackId="a" radius={[4, 4, 0, 0]} />
              </BarChart>
            ) : (
              <AreaChart data={chartData} margin={{ top: 10, right: 10, left: -10, bottom: 0 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="#F1F5F9" vertical={false} />
                <XAxis dataKey="name" tick={{ fontSize: 11, fill: '#64748B' }} tickLine={false} axisLine={{ stroke: '#E2E8F0' }} />
                <YAxis tick={{ fontSize: 11, fill: '#64748B' }} tickLine={false} axisLine={false} tickFormatter={(v) => `₹${(v/100000).toFixed(1)}L`} />
                <Tooltip
                  contentStyle={{
                    backgroundColor: '#FFFFFF',
                    borderColor: '#E2E8F0',
                    borderRadius: '10px',
                    boxShadow: '0 4px 12px rgba(15,23,42,0.08)',
                    fontSize: '12px',
                  }}
                  formatter={(val) => [`₹${Number(val).toLocaleString('en-IN')}`, isHi ? 'शेष मूलधन' : 'Remaining Balance']}
                />
                <Area type="monotone" dataKey="balance" stroke="#047857" fill="#047857" fillOpacity={0.15} strokeWidth={2} />
              </AreaChart>
            )}
          </ResponsiveContainer>
        </div>
      </div>

      {/* ── 4. DETAILED 28-QUARTER TABLE ── */}
      <div className="bg-white border border-slate-200 rounded-2xl p-6 sm:p-7 space-y-4 shadow-sm">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-slate-100 pb-3">
          <div>
            <h3 className="text-base font-bold text-slate-900">
              {isHi ? '28-तिमाही ऋण शोधन सारणी' : '28-Quarter Repayment Schedule Ledger'}
            </h3>
            <p className="text-xs text-slate-500">
              {isHi ? 'बैंक ऋण प्रबंधक सत्यापन हेतु पूर्ण किस्त सारणी' : 'Comprehensive debt amortization breakdown for credit verification'}
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-2">
            <select
              value={yearFilter}
              onChange={(e) => setYearFilter(e.target.value)}
              className="text-xs font-semibold px-2.5 py-1.5 rounded-lg border border-slate-200 bg-slate-50"
            >
              <option value="all">{isHi ? 'सभी वर्ष (All Years)' : 'All Years'}</option>
              <option value="1">{isHi ? 'वर्ष 1 (Q1-Q4)' : 'Year 1'}</option>
              <option value="2">{isHi ? 'वर्ष 2 (Q5-Q8)' : 'Year 2'}</option>
              <option value="3">{isHi ? 'वर्ष 3 (Q9-Q12)' : 'Year 3'}</option>
              <option value="4">{isHi ? 'वर्ष 4 (Q13-Q16)' : 'Year 4'}</option>
              <option value="5">{isHi ? 'वर्ष 5 (Q17-Q20)' : 'Year 5'}</option>
            </select>

            {yearFilter === 'all' && (
              <button
                type="button"
                onClick={() => setShowAllQuarters(!showAllQuarters)}
                className="gd-btn-secondary text-xs px-3 py-1.5 min-h-[34px] font-semibold"
              >
                {showAllQuarters
                  ? (isHi ? 'कम देखें (8 तिमाही)' : 'Show 8')
                  : (isHi ? `सभी 28 तिमाही (${allQuartersList.length || 28})` : `Show All (${allQuartersList.length || 28})`)}
              </button>
            )}
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs border border-slate-200 rounded-xl overflow-hidden">
            <thead className="bg-slate-50 text-slate-700 font-bold border-b border-slate-200">
              <tr>
                <th className="p-3">#</th>
                <th className="p-3">{isHi ? 'तिमाही' : 'Quarter'}</th>
                <th className="p-3 text-right">{isHi ? 'मूलधन (₹)' : 'Principal (₹)'}</th>
                <th className="p-3 text-right">{isHi ? 'ब्याज (₹)' : 'Interest (₹)'}</th>
                <th className="p-3 text-right">{isHi ? 'कुल किस्त (₹)' : 'Total Debt Service (₹)'}</th>
                <th className="p-3 text-right">{isHi ? 'शेष ऋण (₹)' : 'Remaining Balance (₹)'}</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 text-slate-800">
              {filteredQuarters.map((q, idx) => (
                <tr key={idx} className="hover:bg-slate-50/80 transition-colors">
                  <td className="p-3 text-slate-400 font-sans">{idx + 1}</td>
                  <td className="p-3 font-semibold">{q.quarter || `Y${Math.ceil((idx+1)/4)}-Q${((idx)%4)+1}`}</td>
                  <td className="p-3 text-right font-mono">₹{Math.round(q.principal || 0).toLocaleString('en-IN')}</td>
                  <td className="p-3 text-right font-mono text-amber-600">₹{Math.round(q.interest || 0).toLocaleString('en-IN')}</td>
                  <td className="p-3 text-right font-mono font-bold text-emerald-700">₹{Math.round(q.total_payment || 0).toLocaleString('en-IN')}</td>
                  <td className="p-3 text-right font-mono text-slate-500">₹{Math.round(q.remaining_balance || 0).toLocaleString('en-IN')}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
