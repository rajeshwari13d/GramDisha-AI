import React, { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { Coins, Landmark, ShieldCheck, Sparkles, ArrowRight, CheckCircle2 } from 'lucide-react';
import Button from './ui/Button';

export default function InteractiveLoanSlider({
  initialCapital = 50000,
  min = 10000,
  max = 500000,
  step = 5000,
  onApply = null,
  showCta = true,
  className = '',
}) {
  const { i18n } = useTranslation();
  const isHi = i18n.language === 'hi';
  const [capital, setCapital] = useState(initialCapital);

  // Deterministic 10:90 Ratio
  const projectCost = capital * 10;
  const loanAmount = capital * 9;

  // Standard 60-month EMI calculation at 9.0% annual interest
  const annualRate = 0.09;
  const monthlyRate = annualRate / 12;
  const tenureMonths = 60;
  const emi = Math.round(
    (loanAmount * monthlyRate * Math.pow(1 + monthlyRate, tenureMonths)) /
      (Math.pow(1 + monthlyRate, tenureMonths) - 1)
  );

  // Determine eligible scheme based on loan amount
  let schemeName = isHi ? 'मुद्रा योजना (शिशु)' : 'PMMY Shishu';
  let schemeTag = isHi ? '₹50k तक ऋण' : 'Up to ₹50k Loan';
  if (loanAmount > 50000 && loanAmount <= 500000) {
    schemeName = isHi ? 'मुद्रा योजना (किशोर)' : 'PMMY Kishor';
    schemeTag = isHi ? '₹50k - ₹5 लाख ऋण' : '₹50k - ₹5L Loan';
  } else if (loanAmount > 500000) {
    schemeName = isHi ? 'मुद्रा योजना (तरुण) / नाबार्ड' : 'PMMY Tarun / NABARD';
    schemeTag = isHi ? '₹5 लाख - ₹10 लाख ऋण' : '₹5L - ₹10L Loan';
  }

  const presets = [
    { label: '₹25,000', value: 25000 },
    { label: '₹50,000', value: 50000 },
    { label: '₹1,00,000', value: 100000 },
    { label: '₹2,00,000', value: 200000 },
    { label: '₹5,00,000', value: 500000 },
  ];

  return (
    <div className={`bg-white border border-slate-200 rounded-2xl p-6 sm:p-7 shadow-sm space-y-6 ${className}`}>
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-slate-100 pb-4">
        <div>
          <div className="flex items-center gap-1.5 text-xs font-bold text-emerald-700 uppercase tracking-wider mb-1">
            <Sparkles className="w-3.5 h-3.5 text-amber-500" />
            <span>{isHi ? 'लाइव 10:90 ऋण व ईएमआई सिमुलेटर' : 'Live 10:90 Loan & EMI Simulator'}</span>
          </div>
          <h3 className="text-xl sm:text-2xl font-bold text-slate-900 tracking-tight">
            {isHi ? 'अपनी पूंजी के आधार पर ऋण क्षमता देखें' : 'Simulate Your Borrowing Power'}
          </h3>
        </div>
        <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-50 border border-emerald-200 text-xs font-bold text-emerald-700 shrink-0 self-start sm:self-auto">
          <ShieldCheck className="w-4 h-4" />
          <span>{isHi ? '10% पूंजी = 90% बैंक ऋण' : '10% Margin = 90% Term Loan'}</span>
        </div>
      </div>

      {/* Interactive Slider Section */}
      <div className="space-y-3.5">
        <div className="flex items-baseline justify-between">
          <label className="text-xs font-bold text-slate-600 uppercase tracking-wider">
            {isHi ? 'आपकी स्वयं की उपलब्ध पूंजी (10% Margin):' : 'Your Available Margin Equity (10%):'}
          </label>
          <span className="font-mono text-2xl sm:text-3xl font-bold text-emerald-700">
            ₹{capital.toLocaleString('en-IN')}
          </span>
        </div>

        {/* Range Track */}
        <div className="space-y-1.5">
          <input
            type="range"
            min={min}
            max={max}
            step={step}
            value={capital}
            onChange={(e) => setCapital(Number(e.target.value))}
            className="interactive-slider"
            aria-label="Margin capital slider"
          />
          <div className="flex justify-between text-[11px] text-slate-400 font-medium">
            <span>Min: ₹{min.toLocaleString('en-IN')}</span>
            <span>Max: ₹{max.toLocaleString('en-IN')}</span>
          </div>
        </div>

        {/* Presets Chips */}
        <div className="flex flex-wrap items-center gap-2 pt-1">
          <span className="text-xs font-semibold text-slate-500 mr-1">
            {isHi ? 'त्वरित चयन:' : 'Quick Presets:'}
          </span>
          {presets.map((p) => {
            const isSelected = capital === p.value;
            return (
              <button
                key={p.value}
                type="button"
                onClick={() => setCapital(p.value)}
                className={`px-3 py-1 rounded-lg text-xs font-semibold transition-all cursor-pointer ${
                  isSelected
                    ? 'bg-emerald-700 text-white shadow-xs font-bold'
                    : 'bg-slate-100 text-slate-600 hover:bg-slate-200 hover:text-slate-900'
                }`}
              >
                {p.label}
              </button>
            );
          })}
        </div>
      </div>

      {/* 4 Clean Output Metric Tiles */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3.5">
        {/* Total Project Size */}
        <div className="p-4 rounded-xl bg-slate-50 border border-slate-200/80 space-y-1">
          <span className="text-[11px] font-bold uppercase tracking-wider text-slate-500 block">
            {isHi ? 'कुल परियोजना लागत (100%)' : 'Total Project Size (100%)'}
          </span>
          <span className="font-mono text-xl font-bold text-slate-900 block">
            ₹{projectCost.toLocaleString('en-IN')}
          </span>
          <span className="text-[11px] text-slate-500 block">
            {isHi ? 'पूंजी + बैंक ऋण योग' : 'Capital + Bank Financed'}
          </span>
        </div>

        {/* 90% Bank Term Loan */}
        <div className="p-4 rounded-xl bg-emerald-50 border border-emerald-200 space-y-1">
          <span className="text-[11px] font-bold uppercase tracking-wider text-emerald-800 block">
            {isHi ? 'पात्र बैंक ऋण (90%)' : 'Eligible Bank Loan (90%)'}
          </span>
          <span className="font-mono text-xl font-bold text-emerald-700 block">
            ₹{loanAmount.toLocaleString('en-IN')}
          </span>
          <span className="text-[11px] text-emerald-700 font-medium block">
            {isHi ? 'कोलैटरल-मुक्त सरकारी गारंटी' : 'Concessional Term Loan'}
          </span>
        </div>

        {/* Monthly Estimated EMI */}
        <div className="p-4 rounded-xl bg-amber-50 border border-amber-200 space-y-1">
          <span className="text-[11px] font-bold uppercase tracking-wider text-amber-800 block">
            {isHi ? 'अनुमानित मासिक ईएमआई' : 'Estimated Monthly EMI'}
          </span>
          <span className="font-mono text-xl font-bold text-amber-700 block">
            ₹{emi.toLocaleString('en-IN')}
            <span className="text-xs font-normal text-amber-600">/mo</span>
          </span>
          <span className="text-[11px] text-amber-700 block">
            {isHi ? '5 वर्ष (60 माह) @ 9.0% दर' : '5 Years (60 mos) @ 9.0%'}
          </span>
        </div>

        {/* Eligible Scheme Match */}
        <div className="p-4 rounded-xl bg-sky-50 border border-sky-200 space-y-1">
          <span className="text-[11px] font-bold uppercase tracking-wider text-sky-800 block">
            {isHi ? 'अनुशंसित ऋण योजना' : 'Matched Loan Scheme'}
          </span>
          <span className="text-sm font-bold text-sky-900 truncate block">
            {schemeName}
          </span>
          <span className="text-[11px] text-sky-700 font-medium block">
            {schemeTag}
          </span>
        </div>
      </div>

      {/* Action CTA */}
      {showCta && (
        <div className="pt-2 flex flex-col sm:flex-row items-center justify-between gap-4 border-t border-slate-100">
          <p className="text-xs text-slate-500">
            {isHi
              ? 'इस पूंजी स्तर के साथ संपूर्ण व्यवहार्यता मूल्यांकन व बैंक प्रस्ताव रिपोर्ट बनाएं।'
              : 'Proceed with this structured capital allocation to generate full detailed viability dossier.'}
          </p>
          <Button
            onClick={() => onApply && onApply(capital)}
            to={onApply ? undefined : '/assess'}
            size="md"
            variant="primary"
            icon={ArrowRight}
            iconPosition="right"
            className="w-full sm:w-auto shrink-0 font-bold"
          >
            {isHi ? 'इस पूंजी से मूल्यांकन करें' : 'Appraise with ₹' + capital.toLocaleString('en-IN')}
          </Button>
        </div>
      )}
    </div>
  );
}
