import React, { useContext, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import {
  Coins,
  Building2,
  Calendar,
  TrendingUp,
  ChevronDown,
} from 'lucide-react';
import {
  ResponsiveContainer,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  Legend,
  CartesianGrid,
} from 'recharts';
import { AnalysisContext } from '../App';
import ProvenanceBadge from '../components/ProvenanceBadge';

export default function Financial() {
  const { analysis } = useContext(AnalysisContext);
  const { t, i18n } = useTranslation();
  const navigate = useNavigate();
  const isHi = i18n.language === 'hi';
  const [showAllQuarters, setShowAllQuarters] = useState(false);

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

  const { financial, financial_health, business_analysis, quarterly_repayment } = analysis;

  const displayScheme = isHi ? financial.scheme_hi || financial.scheme : financial.scheme;
  const marginPct = ((financial.margin_capital / financial.project_cost) * 100).toFixed(0);
  const loanPct = ((financial.loan_amount / financial.project_cost) * 100).toFixed(0);

  // Format quarterly data for Recharts
  const chartData = (quarterly_repayment || []).slice(0, 16).map((q) => ({
    name: q.quarter_number ? `Q${q.quarter_number}` : q.quarter,
    [isHi ? 'मूलधन (Principal)' : 'Principal']: Math.round(q.principal),
    [isHi ? 'ब्याज (Interest)' : 'Interest']: Math.round(q.interest),
    total: Math.round(q.total_payment),
    balance: Math.round(q.remaining_balance || 0),
  }));

  const visibleQuarters = showAllQuarters
    ? quarterly_repayment || []
    : (quarterly_repayment || []).slice(0, 8);

  return (
    <div className="max-w-6xl mx-auto px-4 sm:px-6 py-6 sm:py-10 space-y-6 sm:space-y-8">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-[var(--color-text)] tracking-tight">
            {isHi ? 'वित्तीय संरचना व ऋण विवरण' : 'Financial Structure & Loan Details'}
          </h1>
          <p className="text-xs sm:text-sm text-[var(--color-text-muted)] mt-1">
            {isHi
              ? 'गणितीय 10:90 पूंजी अनुपात, आधिकारिक बैंक योजना व ऋण शोधन अनुसूची'
              : 'Deterministic 10:90 capital structure, official banking scheme & amortization'}
          </p>
        </div>
        <ProvenanceBadge type="calculated" />
      </div>

      {/* Grid: Capital Structure & Scheme Rule */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-stretch">
        {/* Capital Structure Card (7 cols desktop) */}
        <div className="lg:col-span-7 gd-card p-5 sm:p-6 flex flex-col justify-between space-y-5">
          <div className="space-y-4">
            <div className="flex items-center justify-between border-b border-[var(--color-border)] pb-2.5">
              <div className="flex items-center gap-2 font-bold text-[var(--color-text)] text-sm sm:text-base">
                <Coins className="w-4 h-4 text-[var(--color-positive)] shrink-0" />
                <span>{isHi ? 'पूंजी व परियोजना लागत संरचना (10:90)' : 'Project Cost Structure (10:90)'}</span>
              </div>
              <ProvenanceBadge type="calculated" />
            </div>

            {/* Total Highlight */}
            <div className="p-4 rounded-xl bg-[var(--color-surface-subtle)] border border-[var(--color-border)] flex items-center justify-between">
              <div>
                <span className="text-[11px] font-bold uppercase tracking-wider text-[var(--color-text-muted)]">
                  {isHi ? 'कुल परियोजना लागत (Project Cost)' : 'Total Project Cost'}
                </span>
                <div className="text-2xl sm:text-3xl font-black text-[var(--color-text)] tabular-nums mt-0.5">
                  ₹{(financial.project_cost || 0).toLocaleString('en-IN')}
                </div>
              </div>
              <span className="text-xs font-bold px-2 py-1 rounded bg-[var(--color-surface)] border border-[var(--color-border)] text-[var(--color-text)]">
                100%
              </span>
            </div>

            {/* Split Bar */}
            <div className="space-y-1.5">
              <div className="flex justify-between text-xs font-semibold text-[var(--color-text-muted)]">
                <span>{isHi ? 'स्वयं का अंशदान (10%)' : 'Margin Money (10%)'}</span>
                <span>{isHi ? 'बैंक ऋण अंश (90%)' : 'Bank Loan (90%)'}</span>
              </div>
              <div className="w-full h-3 bg-[var(--color-surface-subtle)] rounded-full flex overflow-hidden border border-[var(--color-border)]">
                <div
                  className="h-full transition-all"
                  style={{ width: `${marginPct}%`, backgroundColor: 'var(--color-caution)' }}
                />
                <div
                  className="h-full transition-all"
                  style={{ width: `${loanPct}%`, backgroundColor: 'var(--color-positive)' }}
                />
              </div>
            </div>

            {/* Structured 2-column breakdown table */}
            <div className="border border-[var(--color-border)] rounded-xl overflow-hidden divide-y divide-[var(--color-border)] text-xs sm:text-sm">
              <div className="p-3 flex justify-between items-center bg-[var(--color-surface)]">
                <span className="text-[var(--color-text-muted)] font-medium">
                  {isHi ? 'उपलब्ध पूंजी (मार्जिन):' : 'Available Capital (Margin):'}
                </span>
                <span className="font-bold text-[var(--color-text)] tabular-nums">
                  ₹{(financial.margin_capital || 0).toLocaleString('en-IN')}
                </span>
              </div>

              <div className="p-3 flex justify-between items-center bg-[var(--color-surface)]">
                <span className="text-[var(--color-text-muted)] font-medium">
                  {isHi ? 'स्वीकृत बैंक ऋण (90%):' : 'Sanctioned Loan Component:'}
                </span>
                <span className="font-bold text-[var(--color-positive)] tabular-nums">
                  ₹{(financial.loan_amount || 0).toLocaleString('en-IN')}
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* Scheme Rule Card (5 cols desktop) */}
        <div className="lg:col-span-5 gd-card p-5 sm:p-6 flex flex-col justify-between space-y-4 border-[var(--color-rule-border)] bg-[var(--color-rule-bg)]">
          <div className="space-y-3">
            <div className="flex items-center justify-between border-b border-[var(--color-rule-border)] pb-2.5">
              <div className="flex items-center gap-2">
                <Building2 className="w-4 h-4 text-[var(--color-rule)] shrink-0" />
                <span className="font-bold text-xs sm:text-sm text-[var(--color-rule)] uppercase tracking-wider">
                  {isHi ? 'लागू सरकारी बैंक योजना' : 'Applicable Scheme'}
                </span>
              </div>
              <ProvenanceBadge type="official_rule" />
            </div>

            <div className="space-y-1">
              <h3 className="text-xl sm:text-2xl font-black text-[var(--color-text)] leading-snug">
                {displayScheme}
              </h3>
              <p className="text-xs text-[var(--color-text-muted)]">
                {isHi ? 'आरबीआई एवं योजना नियमावली अनुसार रूटिंग' : 'Rule-based scheme assignment based on project cost'}
              </p>
            </div>

            {/* Scheme Parameters Table */}
            <div className="bg-[var(--color-surface)] p-3.5 rounded-xl border border-[var(--color-rule-border)] space-y-2 text-xs sm:text-sm">
              <div className="flex justify-between items-center">
                <span className="text-[var(--color-text-muted)]">{isHi ? 'वार्षिक ब्याज दर:' : 'Interest Rate:'}</span>
                <span className="font-bold text-[var(--color-text)] tabular-nums">{financial.interest_rate}% p.a.</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-[var(--color-text-muted)]">{isHi ? 'ऋण चुकौती अवधि:' : 'Repayment Tenure:'}</span>
                <span className="font-bold text-[var(--color-text)] tabular-nums">{financial.tenure_years} {isHi ? 'वर्ष' : 'Years'}</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-[var(--color-text-muted)]">{isHi ? 'मोरेटोरियम (छूट):' : 'Moratorium Period:'}</span>
                <span className="font-bold text-[var(--color-text)] tabular-nums">{financial.moratorium_months || 0} {isHi ? 'माह' : 'Months'}</span>
              </div>
              <div className="flex justify-between items-center pt-2 border-t border-[var(--color-border)] font-bold">
                <span className="text-[var(--color-text)]">{isHi ? 'मासिक ईएमआई (किस्त):' : 'Monthly EMI:'}</span>
                <span className="text-base font-extrabold text-[var(--color-positive)] tabular-nums">
                  ₹{(financial.estimated_emi || 0).toLocaleString('en-IN')}
                </span>
              </div>
            </div>
          </div>

          <p className="text-[11px] text-[var(--color-text-muted)] leading-relaxed">
            {financial.loan_limit_applied
              ? (isHi ? 'योजना सीमा लागू कर ऋण राशि को समायोजित किया गया है।' : 'Sanctioned loan is clamped to the statutory scheme maximum.')
              : (isHi ? 'ऋण राशि योजना के मानक दिशा-निर्देशों के पूर्णतः अनुरूप है।' : 'Loan amount conforms to standard category guidelines.')}
          </p>
        </div>
      </div>

      {/* Cash Flow Feasibility & DSCR */}
      <div className="gd-card p-5 sm:p-6 space-y-5">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-[var(--color-border)] pb-3">
          <div>
            <div className="flex items-center gap-2 font-bold text-[var(--color-text)] text-sm sm:text-base">
              <TrendingUp className="w-4 h-4 text-[var(--color-positive)] shrink-0" />
              <span>{isHi ? 'मासिक नकदी प्रवाह व ऋण भुगतान क्षमता' : 'Monthly Cash Flow & Repayment Capacity'}</span>
            </div>
            <p className="text-xs text-[var(--color-text-muted)] mt-0.5">
              {isHi
                ? 'मासिक अनुमानित आय में से परिचालन व्यय और ईएमआई घटाने के बाद शुद्ध बचत का आकलन।'
                : 'Projected monthly gross revenue minus operating overhead and EMI obligation.'}
            </p>
          </div>
          <ProvenanceBadge type="calculated" />
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          <div className="p-4 rounded-xl bg-[var(--color-surface-subtle)] border border-[var(--color-border)] space-y-1">
            <span className="text-[11px] font-bold uppercase tracking-wider text-[var(--color-text-muted)]">
              {isHi ? 'अनुमानित आय' : 'Est. Monthly Revenue'}
            </span>
            <div className="text-xl font-bold text-[var(--color-text)] tabular-nums">
              ₹{(business_analysis.estimated_monthly_revenue || 0).toLocaleString('en-IN')}
            </div>
            <span className="text-[11px] text-[var(--color-text-subtle)] block">Gross baseline</span>
          </div>

          <div className="p-4 rounded-xl bg-[var(--color-surface-subtle)] border border-[var(--color-border)] space-y-1">
            <span className="text-[11px] font-bold uppercase tracking-wider text-[var(--color-text-muted)]">
              {isHi ? 'परिचालन व्यय' : 'Est. Operating Cost'}
            </span>
            <div className="text-xl font-bold text-[var(--color-text)] tabular-nums">
              ₹{(business_analysis.estimated_operating_cost || 0).toLocaleString('en-IN')}
            </div>
            <span className="text-[11px] text-[var(--color-text-subtle)] block">Materials & utilities</span>
          </div>

          <div className="p-4 rounded-xl bg-[var(--color-surface-subtle)] border border-[var(--color-border)] space-y-1">
            <span className="text-[11px] font-bold uppercase tracking-wider text-[var(--color-text-muted)]">
              {isHi ? 'मासिक ईएमआई' : 'Monthly Loan EMI'}
            </span>
            <div className="text-xl font-bold text-[var(--color-positive)] tabular-nums">
              ₹{(financial.estimated_emi || 0).toLocaleString('en-IN')}
            </div>
            <span className="text-[11px] text-[var(--color-text-muted)] block font-medium">{financial.interest_rate}% interest</span>
          </div>

          <div
            className="p-4 rounded-xl border space-y-1"
            style={{
              backgroundColor: financial_health.status === 'comfortable' ? 'var(--color-positive-bg)' : financial_health.status === 'risky' ? 'var(--color-negative-bg)' : 'var(--color-caution-bg)',
              borderColor: financial_health.status === 'comfortable' ? 'var(--color-positive-border)' : financial_health.status === 'risky' ? 'var(--color-negative-border)' : 'var(--color-caution-border)',
            }}
          >
            <span className="text-[11px] font-bold uppercase tracking-wider text-[var(--color-text-muted)]">
              {isHi ? 'शुद्ध मासिक बचत' : 'Net Monthly Surplus'}
            </span>
            <div
              className="text-xl font-extrabold tabular-nums"
              style={{
                color: financial_health.status === 'comfortable' ? 'var(--color-positive)' : financial_health.status === 'risky' ? 'var(--color-negative)' : 'var(--color-caution)',
              }}
            >
              ₹{(financial_health.monthly_surplus || 0).toLocaleString('en-IN')}
            </div>
            <span
              className="inline-block px-2 py-0.5 rounded text-[10px] font-bold uppercase tracking-wider border bg-white mt-0.5"
              style={{
                color: financial_health.status === 'comfortable' ? 'var(--color-positive)' : financial_health.status === 'risky' ? 'var(--color-negative)' : 'var(--color-caution)',
                borderColor: financial_health.status === 'comfortable' ? 'var(--color-positive-border)' : financial_health.status === 'risky' ? 'var(--color-negative-border)' : 'var(--color-caution-border)',
              }}
            >
              {isHi ? financial_health.label_hi : financial_health.label_en}
            </span>
          </div>
        </div>
      </div>

      {/* Quarterly Amortization Chart */}
      <div className="gd-card p-5 sm:p-6 space-y-5">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-[var(--color-border)] pb-3">
          <div>
            <div className="flex items-center gap-2 font-bold text-[var(--color-text)] text-sm sm:text-base">
              <Calendar className="w-4 h-4 text-[var(--color-positive)] shrink-0" />
              <span>{isHi ? 'त्रैमासिक ऋण चुकौती अनुसूची (चार्ट)' : 'Quarterly Loan Amortization Chart'}</span>
            </div>
            <p className="text-xs text-[var(--color-text-muted)] mt-0.5">
              {isHi
                ? 'प्रत्येक तिमाही में चुकाए जाने वाले मूलधन और ब्याज का विभाजन'
                : 'Principal vs interest payment breakdown across quarterly milestones'}
            </p>
          </div>
          <ProvenanceBadge type="calculated" />
        </div>

        <div className="h-64 sm:h-72 w-full pt-2">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={chartData} margin={{ top: 10, right: 10, left: 0, bottom: 0 }}>
              <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="var(--color-border)" />
              <XAxis dataKey="name" stroke="var(--color-text-subtle)" fontSize={11} />
              <YAxis stroke="var(--color-text-subtle)" fontSize={11} tickFormatter={(v) => `₹${(v / 1000).toFixed(0)}k`} />
              <Tooltip
                formatter={(val) => `₹${Number(val).toLocaleString('en-IN')}`}
                contentStyle={{
                  backgroundColor: 'var(--color-surface)',
                  borderRadius: '10px',
                  border: '1px solid var(--color-border)',
                  fontSize: '12px',
                  boxShadow: '0 2px 8px rgba(31,27,22,0.08)',
                }}
              />
              <Legend wrapperStyle={{ fontSize: '12px', paddingTop: '8px' }} />
              <Bar dataKey={isHi ? 'मूलधन (Principal)' : 'Principal'} stackId="a" fill="var(--color-positive)" radius={[0, 0, 0, 0]} />
              <Bar dataKey={isHi ? 'ब्याज (Interest)' : 'Interest'} stackId="a" fill="var(--color-caution)" radius={[4, 4, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Repayment Table */}
      <div className="gd-card p-5 sm:p-6 space-y-4">
        <div className="flex items-center justify-between border-b border-[var(--color-border)] pb-3">
          <h3 className="text-sm sm:text-base font-bold text-[var(--color-text)]">
            {isHi ? 'विस्तृत त्रैमासिक ऋण तालिका' : 'Quarterly Repayment Schedule Table'}
          </h3>
          <span className="text-xs text-[var(--color-text-muted)] font-medium tabular-nums">
            {quarterly_repayment?.length || 0} {isHi ? 'तिमाहियां' : 'Quarters'}
          </span>
        </div>

        <div className="overflow-x-auto border border-[var(--color-border)] rounded-xl">
          <table className="w-full text-left text-xs sm:text-sm min-w-[520px]">
            <thead className="bg-[var(--color-surface-subtle)] border-b border-[var(--color-border)] text-xs font-bold uppercase text-[var(--color-text-muted)]">
              <tr>
                <th className="py-3 px-3.5">{isHi ? 'तिमाही' : 'Quarter'}</th>
                <th className="py-3 px-3.5 text-right">{isHi ? 'मूलधन (₹)' : 'Principal (₹)'}</th>
                <th className="py-3 px-3.5 text-right">{isHi ? 'ब्याज (₹)' : 'Interest (₹)'}</th>
                <th className="py-3 px-3.5 text-right">{isHi ? 'कुल किस्त (₹)' : 'Total Installment (₹)'}</th>
                <th className="py-3 px-3.5 text-right">{isHi ? 'शेष ऋण (₹)' : 'Remaining Balance (₹)'}</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[var(--color-border)]">
              {visibleQuarters.map((row) => (
                <tr key={row.quarter} className="hover:bg-[var(--color-surface-subtle)] transition-colors">
                  <td className="py-2.5 px-3.5 font-bold text-[var(--color-text)]">
                    {row.quarter_number ? `Q${row.quarter_number} (${row.quarter})` : row.quarter}
                  </td>
                  <td className="py-2.5 px-3.5 text-right font-medium text-[var(--color-positive)] tabular-nums">
                    ₹{Math.round(row.principal).toLocaleString('en-IN')}
                  </td>
                  <td className="py-2.5 px-3.5 text-right font-medium text-[var(--color-caution)] tabular-nums">
                    ₹{Math.round(row.interest).toLocaleString('en-IN')}
                  </td>
                  <td className="py-2.5 px-3.5 text-right font-bold text-[var(--color-text)] tabular-nums">
                    ₹{Math.round(row.total_payment).toLocaleString('en-IN')}
                  </td>
                  <td className="py-2.5 px-3.5 text-right text-[var(--color-text-muted)] tabular-nums">
                    ₹{Math.round(row.remaining_balance || 0).toLocaleString('en-IN')}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {quarterly_repayment && quarterly_repayment.length > 8 && (
          <div className="pt-2 text-center">
            <button
              onClick={() => setShowAllQuarters(!showAllQuarters)}
              className="gd-btn-secondary text-xs min-h-[36px] py-1.5 px-4"
            >
              <span>
                {showAllQuarters
                  ? (isHi ? 'कम दिखाएं' : 'Show Less')
                  : (isHi ? `सभी ${quarterly_repayment.length} तिमाहियां देखें` : `Show All ${quarterly_repayment.length} Quarters`)}
              </span>
              <ChevronDown className={`w-3.5 h-3.5 transition-transform ${showAllQuarters ? 'rotate-180' : ''}`} />
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
