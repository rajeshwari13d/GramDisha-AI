import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import {
  ArrowRight,
  Building2,
  FileCheck,
  Landmark,
  ShieldCheck,
  Coins,
  Store,
  Milk,
  Egg,
  Wheat,
  Scissors,
  Tractor,
  Wrench,
  Palette,
  Sparkles,
  ChevronRight,
  TrendingUp,
} from 'lucide-react';
import Button from '../components/ui/Button';

const ENTERPRISES = [
  {
    id: 'dairy',
    name: 'Dairy & Milk Chilling',
    name_hi: 'डेयरी व दुग्ध केंद्र',
    icon: Milk,
    tag_hi: 'दैनिक आय',
    tag_en: 'Daily Cash Flow',
    defaultCapital: 100000,
    profit_hi: '₹28,000 - ₹35,000',
    profit_en: '₹28,000 - ₹35,000',
    desc_hi: 'पशुपालकों से दूध संकलन, चिलिंग व क्षेत्रीय थोक आपूर्ति।',
    desc_en: 'Procurement, chilling, and regional bulk supply with steady demand.',
  },
  {
    id: 'retail',
    name: 'Kirana & General Store',
    name_hi: 'किराना व जनरल स्टोर',
    icon: Store,
    tag_hi: 'स्थिर मांग',
    tag_en: 'Steady FMCG',
    defaultCapital: 50000,
    profit_hi: '₹18,000 - ₹24,000',
    profit_en: '₹18,000 - ₹24,000',
    desc_hi: 'दैनिक घरेलू राशन, पैकेज्ड सामग्री व आवश्यक किराना वस्तुएं।',
    desc_en: 'Essential household provisions, grocery inventory, and staples.',
  },
  {
    id: 'poultry',
    name: 'Poultry Farming',
    name_hi: 'मुर्गी पालन (पोल्ट्री)',
    icon: Egg,
    tag_hi: 'उच्च प्रतिफल',
    tag_en: 'High Yield',
    defaultCapital: 150000,
    profit_hi: '₹35,000 - ₹45,000',
    profit_en: '₹35,000 - ₹45,000',
    desc_hi: 'अंडे व ब्रायलर उत्पादन, हाट-बाजारों व थोक खरीदारों को आपूर्ति।',
    desc_en: 'Broiler and layer egg production with institutional market channels.',
  },
  {
    id: 'food_processing',
    name: 'Flour Mill & Spices',
    name_hi: 'आटा चक्की व मसाला पिसाई',
    icon: Wheat,
    tag_hi: 'कम जोखिम',
    tag_en: 'Low Risk',
    defaultCapital: 40000,
    profit_hi: '₹15,000 - ₹22,000',
    profit_en: '₹15,000 - ₹22,000',
    desc_hi: 'गेहूं, अनाज व मसालों की दैनिक पिसाई सेवा।',
    desc_en: 'Custom grain and spice milling services with zero perishability risk.',
  },
  {
    id: 'tailoring',
    name: 'Tailoring & Garments',
    name_hi: 'सिलाई व वस्त्र केंद्र',
    icon: Scissors,
    tag_hi: 'एसएचजी अनुकूल',
    tag_en: 'SHG Friendly',
    defaultCapital: 30000,
    profit_hi: '₹12,000 - ₹18,000',
    profit_en: '₹12,000 - ₹18,000',
    desc_hi: 'कपड़े सिलाई, स्कूल यूनिफॉर्म व स्थानीय परिधान निर्माण।',
    desc_en: 'Apparel fabrication, school uniform orders, and bespoke tailoring.',
  },
  {
    id: 'agriculture',
    name: 'Tractor & Agro Hiring',
    name_hi: 'ट्रैक्टर व कृषि सेवा केंद्र',
    icon: Tractor,
    tag_hi: 'कृषि सेवा',
    tag_en: 'Asset Rental',
    defaultCapital: 200000,
    profit_hi: '₹40,000 - ₹55,000',
    profit_en: '₹40,000 - ₹55,000',
    desc_hi: 'ट्रैक्टर, रोटावेटर व थ्रेशर का कस्टम हायरिंग केंद्र।',
    desc_en: 'Agricultural machinery hire and tillage support during cropping cycles.',
  },
  {
    id: 'service_business',
    name: 'Motorcycle Workshop',
    name_hi: 'बाइक व ऑटो रिपेयर शॉप',
    icon: Wrench,
    tag_hi: 'नियमित सेवा',
    tag_en: 'Recurring Service',
    defaultCapital: 40000,
    profit_hi: '₹16,000 - ₹24,000',
    profit_en: '₹16,000 - ₹24,000',
    desc_hi: 'टू-व्हीलर मरम्मत, स्पेयर पार्ट्स खुदरा व रखरखाव।',
    desc_en: 'Two-wheeler repairs, spare part replacements, and servicing.',
  },
  {
    id: 'handicraft',
    name: 'Handicraft & Pottery',
    name_hi: 'हस्तशिल्प व कुटीर उद्योग',
    icon: Palette,
    tag_hi: 'कारीगर संवर्धन',
    tag_en: 'Artisan Credit',
    defaultCapital: 25000,
    profit_hi: '₹12,000 - ₹16,000',
    profit_en: '₹12,000 - ₹16,000',
    desc_hi: 'मिट्टी, लकड़ी व स्थानीय पारंपरिक शिल्प उत्पाद निर्माण।',
    desc_en: 'Terracotta pottery, woodcraft, and value-added artisan merchandise.',
  },
];

const PRESETS = [
  { label: '₹25,000', value: 25000 },
  { label: '₹50,000', value: 50000 },
  { label: '₹1,00,000', value: 100000 },
  { label: '₹2,00,000', value: 200000 },
  { label: '₹5,00,000', value: 500000 },
];

export default function Landing() {
  const { i18n } = useTranslation();
  const navigate = useNavigate();
  const isHi = i18n.language === 'hi';

  const [selectedTrade, setSelectedTrade] = useState(ENTERPRISES[0]);
  const [capital, setCapital] = useState(50000);

  // 10:90 Math Calculations
  const projectCost = capital * 10;
  const loanAmount = capital * 9;

  // 7-Year Amortization @ 8.5%
  const annualRate = 0.085;
  const monthlyRate = annualRate / 12;
  const tenureMonths = 84;
  const emi = Math.round(
    (loanAmount * monthlyRate * Math.pow(1 + monthlyRate, tenureMonths)) /
      (Math.pow(1 + monthlyRate, tenureMonths) - 1)
  );

  // Scheme Router
  let schemeName = isHi ? 'मुद्रा योजना (शिशु)' : 'PMMY Shishu';
  if (loanAmount > 50000 && loanAmount <= 500000) {
    schemeName = isHi ? 'मुद्रा योजना (किशोर)' : 'PMMY Kishor';
  } else if (loanAmount > 500000) {
    schemeName = isHi ? 'मुद्रा योजना (तरुण) / नाबार्ड' : 'PMMY Tarun / NABARD';
  }

  const handleStart = (tradeId, customCapital) => {
    navigate('/assess', {
      state: {
        presetBusiness: tradeId || selectedTrade.id,
        presetCapital: customCapital || capital,
      },
    });
  };

  const SelectedIcon = selectedTrade.icon;

  return (
    <div className="w-full space-y-12 sm:space-y-16 pb-16">
      {/* ── 1. HERO BANNER ── */}
      <section className="w-full bg-white border-b border-slate-200 pt-10 sm:pt-14 pb-10 sm:pb-12">
        <div className="app-container text-center max-w-4xl mx-auto space-y-6">
          {/* Institutional Trust Badge */}
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-emerald-50 border border-emerald-200 text-xs font-semibold text-emerald-800">
            <Building2 className="w-4 h-4 text-emerald-700 shrink-0" />
            <span>
              {isHi
                ? 'भारत सरकार व आरबीआई क्रेडिट मूल्यांकन ढांचा (PMMY • NABARD • SMAM • NRLM)'
                : 'Govt. of India & RBI Credit Appraisal Framework (PMMY • NABARD • SMAM)'}
            </span>
          </div>

          {/* Main Headline */}
          <h1 className="text-3xl sm:text-5xl font-extrabold text-slate-900 tracking-tight leading-tight">
            {isHi ? (
              <>
                ग्रामीण व्यवसाय व्यवहार्यता एवं <br />
                <span className="text-emerald-700">90% सरकारी बैंक ऋण</span> परामर्श
              </>
            ) : (
              <>
                Rural Enterprise Viability & <br />
                <span className="text-emerald-700">90% Bank Term Loan</span> Advisory
              </>
            )}
          </h1>

          {/* Subtitle */}
          <p className="text-sm sm:text-base text-slate-600 max-w-2xl mx-auto leading-relaxed">
            {isHi
              ? 'गांव की जनसंख्या, 5-15 किमी सेवा दायरा और 10% स्वयं की पूंजी के आधार पर अधिकतम स्वीकृत बैंक ऋण, 28-तिमाही ईएमआई और शुद्ध मुनाफे का सटीक वित्तीय विश्लेषण।'
              : 'Assess rural catchment demand, eligible statutory loan schemes (PMMY / NABARD), 28-quarter amortization schedules, and DSCR bankability in under one minute.'}
          </p>

          {/* Primary Action Buttons */}
          <div className="pt-2 flex flex-wrap items-center justify-center gap-3.5">
            <Button
              to="/assess"
              size="lg"
              variant="primary"
              icon={ArrowRight}
              iconPosition="right"
              className="font-bold text-sm px-6 py-3 shadow-sm"
            >
              {isHi ? 'व्यवसाय मूल्यांकन शुरू करें' : 'Begin Viability Appraisal'}
            </Button>
            <Button
              to="/comparison"
              size="lg"
              variant="secondary"
              className="font-semibold text-sm px-6 py-3"
            >
              {isHi ? '8 मॉडलों की तुलना करें' : 'Compare 8 Models'}
            </Button>
          </div>

          {/* 3 Inline Trust Anchors */}
          <div className="pt-4 flex flex-wrap items-center justify-center gap-6 text-xs font-semibold text-slate-500">
            <span className="inline-flex items-center gap-1.5">
              <ShieldCheck className="w-4 h-4 text-emerald-700 shrink-0" />
              <span>{isHi ? '100% सटीक वित्तीय गणित' : '100% Deterministic Math'}</span>
            </span>
            <span className="inline-flex items-center gap-1.5">
              <Landmark className="w-4 h-4 text-emerald-700 shrink-0" />
              <span>{isHi ? 'आरबीआई गाइडलाइन्स अनुरूप' : 'RBI Master Circular Aligned'}</span>
            </span>
            <span className="inline-flex items-center gap-1.5">
              <FileCheck className="w-4 h-4 text-emerald-700 shrink-0" />
              <span>{isHi ? 'बैंक DPR फाइल (PDF)' : 'Bank-Ready DPR Report'}</span>
            </span>
          </div>
        </div>
      </section>

      {/* ── 2. SIMPLE, ELEGANT LOAN & VIABILITY CALCULATOR ── */}
      <section className="app-container">
        <div className="bg-white border border-slate-200 rounded-2xl shadow-sm overflow-hidden">
          {/* Box Header */}
          <div className="px-6 py-5 sm:px-8 sm:py-6 border-b border-slate-100 flex flex-col sm:flex-row sm:items-center justify-between gap-3 bg-slate-50/50">
            <div>
              <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-emerald-700">
                <Sparkles className="w-3.5 h-3.5 text-amber-500" />
                <span>{isHi ? '10:90 ऋण एवं वित्तीय सिमुलेटर' : '10:90 Loan & Viability Calculator'}</span>
              </div>
              <h2 className="text-xl sm:text-2xl font-bold text-slate-900 mt-1">
                {isHi ? 'अपनी पूंजी के अनुसार ऋण व ईएमआई देखें' : 'Calculate Your Loan Eligibility & Monthly EMI'}
              </h2>
            </div>
            <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-100/70 border border-emerald-200 text-xs font-bold text-emerald-800 self-start sm:self-auto">
              <ShieldCheck className="w-4 h-4 text-emerald-700" />
              <span>{isHi ? '10% पूंजी = 90% बैंक ऋण' : '10% Margin = 90% Term Loan'}</span>
            </span>
          </div>

          {/* Calculator Body: 2 Clean Columns */}
          <div className="p-6 sm:p-8 grid grid-cols-1 lg:grid-cols-12 gap-8 items-stretch">
            {/* Left Column: Simple Inputs */}
            <div className="lg:col-span-7 space-y-6 flex flex-col justify-between">
              {/* Input 1: Enterprise Dropdown */}
              <div className="space-y-2">
                <label className="text-xs font-bold text-slate-700 uppercase tracking-wider block">
                  {isHi ? '1. व्यवसाय का चयन करें:' : '1. Select Rural Enterprise:'}
                </label>
                <div className="relative">
                  <select
                    value={selectedTrade.id}
                    onChange={(e) => {
                      const found = ENTERPRISES.find((ent) => ent.id === e.target.value);
                      if (found) {
                        setSelectedTrade(found);
                        setCapital(found.defaultCapital);
                      }
                    }}
                    className="doc-select font-semibold text-slate-900 bg-white pr-10 cursor-pointer"
                  >
                    {ENTERPRISES.map((ent) => (
                      <option key={ent.id} value={ent.id}>
                        {isHi ? `${ent.name_hi} (${ent.tag_hi})` : `${ent.name} (${ent.tag_en})`}
                      </option>
                    ))}
                  </select>
                </div>
                <p className="text-xs text-slate-500">
                  {isHi ? selectedTrade.desc_hi : selectedTrade.desc_en}
                </p>
              </div>

              {/* Input 2: Margin Capital Slider */}
              <div className="space-y-3 pt-4 border-t border-slate-100">
                <div className="flex items-baseline justify-between">
                  <label className="text-xs font-bold text-slate-700 uppercase tracking-wider">
                    {isHi ? '2. आपकी स्वयं की उपलब्ध पूंजी (10% Margin):' : '2. Your Margin Capital (10% Equity):'}
                  </label>
                  <span className="font-mono text-2xl sm:text-3xl font-bold text-emerald-700">
                    ₹{capital.toLocaleString('en-IN')}
                  </span>
                </div>

                {/* Range Slider */}
                <input
                  type="range"
                  min={10000}
                  max={500000}
                  step={5000}
                  value={capital}
                  onChange={(e) => setCapital(Number(e.target.value))}
                  className="interactive-slider w-full"
                  aria-label="Margin capital slider"
                />

                <div className="flex justify-between text-[11px] text-slate-400 font-medium">
                  <span>Min: ₹10,000</span>
                  <span>Max: ₹5,00,000</span>
                </div>

                {/* Presets */}
                <div className="flex flex-wrap items-center gap-2 pt-2">
                  <span className="text-xs font-semibold text-slate-500 mr-1">
                    {isHi ? 'त्वरित चयन:' : 'Quick Presets:'}
                  </span>
                  {PRESETS.map((p) => {
                    const isSelected = capital === p.value;
                    return (
                      <button
                        key={p.value}
                        type="button"
                        onClick={() => setCapital(p.value)}
                        className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-all cursor-pointer ${
                          isSelected
                            ? 'bg-emerald-700 text-white shadow-xs font-bold'
                            : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
                        }`}
                      >
                        {p.label}
                      </button>
                    );
                  })}
                </div>
              </div>
            </div>

            {/* Right Column: Clean Bankable Financial Summary */}
            <div className="lg:col-span-5 bg-slate-50 rounded-2xl border border-slate-200/80 p-6 flex flex-col justify-between space-y-6">
              <div>
                <span className="text-xs font-bold uppercase tracking-wider text-slate-500 block mb-4">
                  {isHi ? 'बैंक ऋण एवं किस्त सारांश' : 'Bank Credit & Repayment Summary'}
                </span>

                <div className="space-y-4">
                  {/* Sanctioned Loan */}
                  <div className="flex items-center justify-between pb-3 border-b border-slate-200/80">
                    <div>
                      <span className="text-xs text-slate-600 font-medium block">
                        {isHi ? 'पात्र बैंक ऋण (90%)' : 'Sanctioned Term Loan (90%)'}
                      </span>
                      <span className="font-mono text-2xl font-bold text-emerald-700">
                        ₹{loanAmount.toLocaleString('en-IN')}
                      </span>
                    </div>
                    <span className="text-xs font-bold text-emerald-800 bg-emerald-100/70 px-2.5 py-1 rounded-md border border-emerald-200 text-right">
                      {schemeName}
                    </span>
                  </div>

                  {/* Monthly EMI */}
                  <div className="flex items-center justify-between pb-3 border-b border-slate-200/80">
                    <div>
                      <span className="text-xs text-slate-600 font-medium block">
                        {isHi ? 'मासिक बैंक किस्त (EMI)' : 'Monthly Debt (EMI)'}
                      </span>
                      <span className="font-mono text-xl font-bold text-slate-900">
                        ₹{emi.toLocaleString('en-IN')}{' '}
                        <span className="text-xs font-normal text-slate-500">/{isHi ? 'माह' : 'mo'}</span>
                      </span>
                    </div>
                    <span className="text-[11px] font-medium text-slate-500">
                      7 Yrs @ 8.5% p.a.
                    </span>
                  </div>

                  {/* Monthly Surplus */}
                  <div className="flex items-center justify-between">
                    <div>
                      <span className="text-xs text-slate-600 font-medium block">
                        {isHi ? 'अनुमानित मासिक शुद्ध आय' : 'Est. Monthly Net Surplus'}
                      </span>
                      <span className="font-mono text-lg font-bold text-slate-900">
                        {isHi ? selectedTrade.profit_hi : selectedTrade.profit_en}
                      </span>
                    </div>
                    <span className="text-[11px] font-semibold text-emerald-700">
                      {isHi ? 'किस्त भुगतान उपरांत' : 'Post-EMI Surplus'}
                    </span>
                  </div>
                </div>
              </div>

              {/* Action Button */}
              <div className="pt-2">
                <button
                  type="button"
                  onClick={() => handleStart(selectedTrade.id, capital)}
                  className="w-full py-3.5 rounded-xl bg-emerald-700 hover:bg-emerald-800 text-white font-bold text-sm flex items-center justify-center gap-2 transition-all cursor-pointer shadow-sm hover:shadow-md"
                >
                  <span>
                    {isHi
                      ? `इस व्यवसाय का पूर्ण मूल्यांकन करें`
                      : `Start Viability Appraisal for ${selectedTrade.name}`}
                  </span>
                  <ArrowRight className="w-4 h-4" />
                </button>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ── 3. 8 CURATED RURAL ENTERPRISES GRID ── */}
      <section className="app-container space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-3 border-b border-slate-200 pb-4">
          <div>
            <span className="text-xs font-bold uppercase tracking-wider text-emerald-700 block mb-1">
              {isHi ? 'मानकीकृत व्यवसाय मॉडल' : 'Standardized Enterprise Models'}
            </span>
            <h2 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight">
              {isHi ? '8 प्रमुख ग्रामीण व्यवसाय श्रेणियां' : 'Explore 8 Curated Rural Trade Blueprints'}
            </h2>
          </div>
          <span className="text-xs text-slate-500">
            {isHi ? 'किसी भी मॉडल पर क्लिक करके तुरंत मूल्यांकन करें' : 'Click any model to load preset and start appraisal'}
          </span>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {ENTERPRISES.map((ent) => {
            const Icon = ent.icon;
            return (
              <button
                key={ent.id}
                type="button"
                onClick={() => handleStart(ent.id, ent.defaultCapital)}
                className="p-5 rounded-2xl bg-white border border-slate-200 hover:border-emerald-600 hover:shadow-md transition-all text-left flex flex-col justify-between group cursor-pointer"
              >
                <div>
                  <div className="flex items-center justify-between mb-3">
                    <div className="w-10 h-10 rounded-xl bg-emerald-50 border border-emerald-200 flex items-center justify-center text-emerald-700 group-hover:bg-emerald-700 group-hover:text-white transition-colors">
                      <Icon className="w-5 h-5" />
                    </div>
                    <span className="text-[11px] font-semibold px-2 py-0.5 rounded-full bg-slate-100 text-slate-600">
                      {isHi ? ent.tag_hi : ent.tag_en}
                    </span>
                  </div>

                  <h3 className="text-base font-bold text-slate-900 leading-snug group-hover:text-emerald-800 transition-colors">
                    {isHi ? ent.name_hi : ent.name}
                  </h3>
                  <p className="text-xs text-slate-500 mt-1.5 line-clamp-2 leading-relaxed">
                    {isHi ? ent.desc_hi : ent.desc_en}
                  </p>
                </div>

                <div className="mt-4 pt-3 border-t border-slate-100 flex items-center justify-between text-xs">
                  <span className="font-semibold text-emerald-700">
                    {isHi ? ent.profit_hi : ent.profit_en}
                  </span>
                  <span className="text-slate-400 group-hover:text-emerald-700 font-bold flex items-center gap-1">
                    {isHi ? 'मूल्यांकन' : 'Appraise'} <ChevronRight className="w-3.5 h-3.5" />
                  </span>
                </div>
              </button>
            );
          })}
        </div>
      </section>

      {/* ── 3. METHODOLOGY PILLARS ── */}
      <section className="app-container space-y-6">
        <div className="text-center max-w-2xl mx-auto space-y-1.5">
          <span className="text-xs font-bold uppercase tracking-wider text-emerald-700 block">
            {isHi ? 'कार्यप्रणाली' : 'Appraisal Methodology'}
          </span>
          <h2 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight">
            {isHi ? 'ग्रामदिशा एआई कैसे कार्य करता है' : 'How GramDisha Appraises Feasibility'}
          </h2>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
          <div className="bg-white border border-slate-200 rounded-2xl p-6 sm:p-7 space-y-3 shadow-sm">
            <div className="w-10 h-10 rounded-xl bg-emerald-50 border border-emerald-200 flex items-center justify-center text-emerald-700">
              <Store className="w-5 h-5" />
            </div>
            <h3 className="text-base font-bold text-slate-900">
              {isHi ? '1. क्षेत्रीय सेवा दायरा व मांग' : '1. Catchment Radius & Demand'}
            </h3>
            <p className="text-xs sm:text-sm text-slate-600 leading-relaxed">
              {isHi
                ? 'गांव की आबादी, 5-15 किमी सेवा दायरा और स्थानीय हाट-बाजार प्रतियोगिता के आधार पर वास्तविक राजस्व क्षमता का आंकलन।'
                : 'Synthesizes demographic data, 5–15 km village catchment radius, and competitor density for realistic revenue.'}
            </p>
          </div>

          <div className="bg-white border border-slate-200 rounded-2xl p-6 sm:p-7 space-y-3 shadow-sm">
            <div className="w-10 h-10 rounded-xl bg-emerald-50 border border-emerald-200 flex items-center justify-center text-emerald-700">
              <Landmark className="w-5 h-5" />
            </div>
            <h3 className="text-base font-bold text-slate-900">
              {isHi ? '2. सरकारी योजना व 90% ऋण रूटिंग' : '2. Statutory Scheme Routing'}
            </h3>
            <p className="text-xs sm:text-sm text-slate-600 leading-relaxed">
              {isHi
                ? 'मुद्रा (शिशु/किशोर/तरुण), नाबार्ड, एवं एनआरएलएम के वैधानिक नियमों के तहत 90% रियायती ऋण की पात्रता सुनिश्चित करना।'
                : 'Automated policy routing across PMMY, NABARD, and NRLM credit guarantee frameworks.'}
            </p>
          </div>

          <div className="bg-white border border-slate-200 rounded-2xl p-6 sm:p-7 space-y-3 shadow-sm">
            <div className="w-10 h-10 rounded-xl bg-emerald-50 border border-emerald-200 flex items-center justify-center text-emerald-700">
              <FileCheck className="w-5 h-5" />
            </div>
            <h3 className="text-base font-bold text-slate-900">
              {isHi ? '3. बैंक-स्वीकृत प्रोजेक्ट रिपोर्ट (DPR)' : '3. Bank-Ready DPR Dossier'}
            </h3>
            <p className="text-xs sm:text-sm text-slate-600 leading-relaxed">
              {isHi
                ? 'बैंक शाखा प्रबंधक को प्रस्तुत करने योग्य 28-तिमाही किस्त सारणी, डीएससीआर विश्लेषण व औपचारिक प्रस्ताव फाइल।'
                : 'Generates formal printable Detailed Project Reports with full 28-quarter amortization ledgers and DSCR indicators.'}
            </p>
          </div>
        </div>
      </section>
    </div>
  );
}
