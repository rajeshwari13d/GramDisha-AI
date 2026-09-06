import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import {
  ArrowRight,
  ShieldCheck,
  CheckCircle2,
  Coins,
  TrendingUp,
  FileText,
  Building2,
  ChevronRight,
  Sparkles,
} from 'lucide-react';

const SAMPLE_SHOWCASES = [
  {
    id: 'dairy',
    name: 'Dairy & Chilling Unit',
    name_hi: 'डेयरी व दुग्ध प्रशीतन केंद्र',
    icon: '🥛',
    capital: 100000,
    cost: 1000000,
    loan: 900000,
    emi: 14028,
    score: 65,
    tier: 'Moderate Viability',
    tier_hi: 'मध्यम व्यवहार्यता',
    scheme: 'Term Loan (NABARD / PMMY Tarun)',
    scheme_hi: 'टर्म लोन (नाबार्ड / पीएमएमवाई तरुण)',
    reach: '5 km primary • 15 km feeder',
    reach_hi: '5 किमी प्राथमिक • 15 किमी फीडर',
  },
  {
    id: 'retail',
    name: 'Rural Retail & Agro-Store',
    name_hi: 'ग्रामीण किराना व कृषि सेवा',
    icon: '🏪',
    capital: 50000,
    cost: 500000,
    loan: 450000,
    emi: 7014,
    score: 74,
    tier: 'High Viability',
    tier_hi: 'उच्च व्यवहार्यता',
    scheme: 'Micro-finance / PMMY Kishor',
    scheme_hi: 'माइक्रो-फाइनेंस / पीएमएमवाई किशोर',
    reach: '3 km direct footfall',
    reach_hi: '3 किमी प्रत्यक्ष पहुंच',
  },
  {
    id: 'poultry',
    name: 'Layer Poultry Farm',
    name_hi: 'मुर्गी पालन (पोल्ट्री फार्म)',
    icon: '🐔',
    capital: 200000,
    cost: 2000000,
    loan: 1800000,
    emi: 28056,
    score: 68,
    tier: 'Moderate Viability',
    tier_hi: 'मध्यम व्यवहार्यता',
    scheme: 'Agri-Infrastructure Term Loan',
    scheme_hi: 'कृषि अवसंरचना टर्म लोन',
    reach: '20 km regional supply',
    reach_hi: '20 किमी क्षेत्रीय आपूर्ति',
  },
];

export default function Landing() {
  const { t, i18n } = useTranslation();
  const isHi = i18n.language === 'hi';
  const [selectedShowcase, setSelectedShowcase] = useState(SAMPLE_SHOWCASES[0]);

  return (
    <div className="space-y-16 sm:space-y-24 pb-20">
      {/* 1. HERO SECTION */}
      <section className="max-w-4xl mx-auto px-4 sm:px-6 pt-12 sm:pt-20 text-center space-y-6">
        {/* Subtle Government/Hackathon Pill */}
        <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-[var(--color-surface-subtle)] border border-[var(--color-border)] text-xs font-semibold text-[var(--color-positive)]">
          <Sparkles className="w-3.5 h-3.5 text-[var(--color-positive)]" />
          <span>{isHi ? 'एसआईएच 2026 • समस्या विवरण SIH26091' : 'SIH 2026 • Problem Statement SIH26091'}</span>
        </div>

        {/* Clean, Commanding Headline */}
        <h1 className="text-3xl sm:text-5xl lg:text-6xl font-extrabold text-[var(--color-text)] tracking-tight leading-[1.14]">
          {isHi ? (
            <>
              आपका गांव। आपका व्यवसाय।<br />
              <span className="text-[var(--color-positive)]">आपकी सबसे स्मार्ट वित्तीय योजना।</span>
            </>
          ) : (
            <>
              Your Village. Your Business.<br />
              <span className="text-[var(--color-positive)]">Your Smartest Financial Plan.</span>
            </>
          )}
        </h1>

        {/* Subtitle with Generous Breathing Room */}
        <p className="text-base sm:text-lg text-[var(--color-text-muted)] max-w-2xl mx-auto leading-relaxed">
          {isHi
            ? 'ग्रामीण उद्यमियों और बैंक मित्रों के लिए पारदर्शी निर्णय समर्थन प्रणाली। 100% गणितीय सूत्रों और आधिकारिक सरकारी ऋण योजनाओं पर आधारित।'
            : 'AI-assisted rural enterprise intelligence powered by 100% deterministic banking math, official government loan schemes, and bank-ready proposals.'}
        </p>

        {/* Primary Call to Action */}
        <div className="pt-3 flex flex-col sm:flex-row items-center justify-center gap-3">
          <Link
            to="/assess"
            className="gd-btn-primary w-full sm:w-auto text-base px-8 py-3.5 rounded-xl shadow-xs"
          >
            <span>{isHi ? 'व्यवसाय मूल्यांकन शुरू करें' : 'Start Viability Assessment'}</span>
            <ArrowRight className="w-4 h-4" />
          </Link>
          <a
            href="#sample-preview"
            className="gd-btn-secondary w-full sm:w-auto text-sm px-5 py-3.5 rounded-xl"
          >
            <span>{isHi ? 'मॉडल पूर्वावलोकन देखें' : 'View Sample Model'}</span>
          </a>
        </div>

        {/* Reassuring Trust Row */}
        <div className="pt-2 flex flex-wrap items-center justify-center gap-x-6 gap-y-2 text-xs text-[var(--color-text-muted)]">
          <span className="inline-flex items-center gap-1.5">
            <CheckCircle2 className="w-3.5 h-3.5 text-[var(--color-positive)] shrink-0" />
            <span>{isHi ? '100% गणितीय गणना' : '100% Deterministic Math'}</span>
          </span>
          <span className="inline-flex items-center gap-1.5">
            <CheckCircle2 className="w-3.5 h-3.5 text-[var(--color-positive)] shrink-0" />
            <span>{isHi ? 'आरबीआई व पीएमएमवाई योजनाएं' : 'Official RBI & PMMY Rules'}</span>
          </span>
          <span className="inline-flex items-center gap-1.5">
            <CheckCircle2 className="w-3.5 h-3.5 text-[var(--color-positive)] shrink-0" />
            <span>{isHi ? 'बैंक-स्वीकृत प्रस्ताव' : 'Bank-Ready Proposal Dossier'}</span>
          </span>
        </div>
      </section>

      {/* 2. INTERACTIVE AT-A-GLANCE PRODUCT SHOWCASE */}
      <section id="sample-preview" className="max-w-4xl mx-auto px-4 sm:px-6">
        <div className="gd-card p-5 sm:p-7 space-y-6 border-[var(--color-border-strong)] shadow-sm">
          {/* Card Header & Enterprise Selector Tabs */}
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-[var(--color-border)] pb-4">
            <div>
              <span className="text-xs font-bold uppercase tracking-wider text-[var(--color-positive)] block">
                {isHi ? 'इंटरैक्टिव मॉडल प्रदर्शन' : 'Interactive System Preview'}
              </span>
              <h2 className="text-base sm:text-lg font-bold text-[var(--color-text)] mt-0.5">
                {isHi ? 'देखें कि ग्रामदिशा एआई कैसे काम करता है' : 'How GramDisha Evaluates a Rural Enterprise'}
              </h2>
            </div>

            {/* Enterprise Tabs */}
            <div className="flex items-center gap-1.5 bg-[var(--color-surface-subtle)] p-1 rounded-xl border border-[var(--color-border)] overflow-x-auto">
              {SAMPLE_SHOWCASES.map((sc) => (
                <button
                  key={sc.id}
                  type="button"
                  onClick={() => setSelectedShowcase(sc)}
                  className={`px-3 py-1.5 rounded-lg text-xs font-semibold whitespace-nowrap transition-all cursor-pointer ${
                    selectedShowcase.id === sc.id
                      ? 'bg-[var(--color-surface)] text-[var(--color-text)] shadow-xs border border-[var(--color-border)]'
                      : 'text-[var(--color-text-muted)] hover:text-[var(--color-text)]'
                  }`}
                >
                  <span className="mr-1.5">{sc.icon}</span>
                  <span>{isHi ? sc.name_hi : sc.name}</span>
                </button>
              ))}
            </div>
          </div>

          {/* Clean 3-Metric Highlight Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            {/* Metric 1: Viability Score */}
            <div className="p-4 rounded-xl bg-[var(--color-surface-subtle)] border border-[var(--color-border)] space-y-1.5">
              <span className="text-xs font-semibold text-[var(--color-text-muted)] block">
                {isHi ? 'समग्र व्यवहार्यता स्कोर' : 'Overall Viability Score'}
              </span>
              <div className="text-2xl sm:text-3xl font-extrabold text-[var(--color-positive)] tabular-nums">
                {selectedShowcase.score} <span className="text-xs font-normal text-[var(--color-text-muted)]">/ 100</span>
              </div>
              <span className="text-xs font-bold text-[var(--color-positive)] block">
                {isHi ? selectedShowcase.tier_hi : selectedShowcase.tier}
              </span>
            </div>

            {/* Metric 2: 10:90 Capital Split */}
            <div className="p-4 rounded-xl bg-[var(--color-surface-subtle)] border border-[var(--color-border)] space-y-1.5">
              <span className="text-xs font-semibold text-[var(--color-text-muted)] block">
                {isHi ? '10:90 पूंजी व ऋण' : '10:90 Capital : Loan'}
              </span>
              <div className="text-2xl sm:text-3xl font-extrabold text-[var(--color-text)] tabular-nums">
                ₹{(selectedShowcase.capital / 100000).toFixed(1)}L : ₹{(selectedShowcase.loan / 100000).toFixed(1)}L
              </div>
              <span className="text-xs text-[var(--color-text-muted)] tabular-nums block">
                {isHi ? `कुल लागत: ₹${(selectedShowcase.cost).toLocaleString('en-IN')}` : `Total Cost: ₹${(selectedShowcase.cost).toLocaleString('en-IN')}`}
              </span>
            </div>

            {/* Metric 3: Monthly EMI */}
            <div className="p-4 rounded-xl bg-[var(--color-surface-subtle)] border border-[var(--color-border)] space-y-1.5">
              <span className="text-xs font-semibold text-[var(--color-text-muted)] block">
                {isHi ? 'मासिक ईएमआई' : 'Monthly EMI'}
              </span>
              <div className="text-2xl sm:text-3xl font-extrabold text-[var(--color-text)] tabular-nums">
                ₹{(selectedShowcase.emi).toLocaleString('en-IN')}
                <span className="text-xs font-normal text-[var(--color-text-subtle)]">/mo</span>
              </div>
              <span className="text-xs text-[var(--color-text-muted)] block truncate" title={selectedShowcase.scheme}>
                {isHi ? selectedShowcase.scheme_hi : selectedShowcase.scheme}
              </span>
            </div>
          </div>

          {/* Bottom Card Footer */}
          <div className="pt-2 flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs text-[var(--color-text-muted)]">
            <span className="flex items-center gap-1.5">
              <TrendingUp className="w-4 h-4 text-[var(--color-positive)] shrink-0" />
              <span>{isHi ? `बाजार पहुंच: ${selectedShowcase.reach_hi}` : `Catchment: ${selectedShowcase.reach}`}</span>
            </span>

            <Link
              to="/assess"
              className="font-bold text-[var(--color-positive)] hover:underline inline-flex items-center gap-1 self-start sm:self-auto"
            >
              <span>{isHi ? 'इस व्यवसाय का विस्तृत विश्लेषण करें' : 'Evaluate this business for your village'}</span>
              <ChevronRight className="w-3.5 h-3.5" />
            </Link>
          </div>
        </div>
      </section>

      {/* 3. THREE VALUE PILLARS (Clean, Breathing Cards) */}
      <section className="max-w-4xl mx-auto px-4 sm:px-6 space-y-8">
        <div className="text-center space-y-2 max-w-xl mx-auto">
          <span className="text-xs font-bold uppercase tracking-wider text-[var(--color-positive)] block">
            {isHi ? 'मुख्य विशेषताएं' : 'Core Capabilities'}
          </span>
          <h2 className="text-2xl sm:text-3xl font-bold text-[var(--color-text)] tracking-tight">
            {isHi ? 'ग्रामदिशा एआई कैसे सहायता करता है' : 'Everything You Need to Plan & Fund'}
          </h2>
          <p className="text-xs sm:text-sm text-[var(--color-text-muted)]">
            {isHi
              ? 'जटिल वित्तीय प्रक्रियाओं को सरल, स्पष्ट और व्यावहारिक रूप में प्रस्तुत किया गया है।'
              : 'Designed specifically for rural entrepreneurs, village panchayats, and bank correspondents.'}
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
          {/* Pillar 1 */}
          <div className="gd-card p-6 space-y-3.5 flex flex-col justify-between">
            <div className="space-y-3">
              <div className="w-11 h-11 rounded-xl bg-[var(--color-surface-subtle)] border border-[var(--color-border)] flex items-center justify-center text-[var(--color-positive)]">
                <TrendingUp className="w-5 h-5" />
              </div>
              <h3 className="text-base font-bold text-[var(--color-text)]">
                {isHi ? '1. स्थानीय बाजार समझ' : '1. Local Market Demand'}
              </h3>
              <p className="text-xs sm:text-sm text-[var(--color-text-muted)] leading-relaxed">
                {isHi
                  ? 'गांव और ब्लॉक स्तर पर मांग, ग्राहक पहुंच त्रिज्या और स्थानीय मूल्य बेंचमार्क का पारदर्शी मूल्यांकन।'
                  : 'Surveyed baseline pricing, primary footfall radius, and customer segments tailored to rural catchments.'}
              </p>
            </div>
            <div className="pt-3 border-t border-[var(--color-border)] text-xs font-semibold text-[var(--color-positive)]">
              {isHi ? 'स्थानीय मूल्य सूचकांक' : 'Catchment Radius Mapping'}
            </div>
          </div>

          {/* Pillar 2 */}
          <div className="gd-card p-6 space-y-3.5 flex flex-col justify-between">
            <div className="space-y-3">
              <div className="w-11 h-11 rounded-xl bg-[var(--color-surface-subtle)] border border-[var(--color-border)] flex items-center justify-center text-[var(--color-positive)]">
                <Coins className="w-5 h-5" />
              </div>
              <h3 className="text-base font-bold text-[var(--color-text)]">
                {isHi ? '2. 100% सटीक वित्तीय गणित' : '2. Deterministic Banking Math'}
              </h3>
              <p className="text-xs sm:text-sm text-[var(--color-text-muted)] leading-relaxed">
                {isHi
                  ? 'मानक 10:90 पूंजी अनुपात, आधिकारिक सरकारी योजना शर्तें और सटीक त्रैमासिक ऋण शोधन अनुसूची।'
                  : 'Exact 10:90 capital split, reducing-balance EMI calculations, and 28-quarter amortization schedules.'}
              </p>
            </div>
            <div className="pt-3 border-t border-[var(--color-border)] text-xs font-semibold text-[var(--color-positive)]">
              {isHi ? 'शून्य वित्तीय अनुमान' : 'RBI / PMMY Compliant'}
            </div>
          </div>

          {/* Pillar 3 */}
          <div className="gd-card p-6 space-y-3.5 flex flex-col justify-between">
            <div className="space-y-3">
              <div className="w-11 h-11 rounded-xl bg-[var(--color-surface-subtle)] border border-[var(--color-border)] flex items-center justify-center text-[var(--color-positive)]">
                <FileText className="w-5 h-5" />
              </div>
              <h3 className="text-base font-bold text-[var(--color-text)]">
                {isHi ? '3. 90-दिवसीय रोडमैप व प्रस्ताव' : '3. 90-Day Plan & Bank DPR'}
              </h3>
              <p className="text-xs sm:text-sm text-[var(--color-text-muted)] leading-relaxed">
                {isHi
                  ? 'उद्यम आधार से वाणिज्यिक उत्पादन तक चरणबद्ध कार्य योजना और बैंक ऋण आवेदन हेतु औपचारिक रिपोर्ट।'
                  : 'Phase-by-phase execution timeline from statutory registration to break-even, with a downloadable proposal PDF.'}
              </p>
            </div>
            <div className="pt-3 border-t border-[var(--color-border)] text-xs font-semibold text-[var(--color-positive)]">
              {isHi ? 'प्रिंट योग्य पीडीएफ प्रस्ताव' : 'Downloadable Loan Dossier'}
            </div>
          </div>
        </div>
      </section>

      {/* 4. CLEAN FINAL CALL TO ACTION */}
      <section className="max-w-4xl mx-auto px-4 sm:px-6">
        <div className="gd-card p-7 sm:p-10 flex flex-col sm:flex-row items-center justify-between gap-6 border-[var(--color-border-strong)] bg-[var(--color-surface)] shadow-xs">
          <div className="space-y-1.5 text-center sm:text-left">
            <h3 className="text-xl sm:text-2xl font-bold text-[var(--color-text)]">
              {isHi ? 'क्या आप अपने ग्रामीण व्यवसाय का मूल्यांकन करना चाहते हैं?' : 'Ready to evaluate your village enterprise?'}
            </h3>
            <p className="text-xs sm:text-sm text-[var(--color-text-muted)] max-w-md">
              {isHi
                ? 'अपना स्थान चुनें, उपलब्ध पूंजी दर्ज करें और 30 सेकंड में विस्तृत व्यवहार्यता रिपोर्ट प्राप्त करें।'
                : 'Enter your available margin capital and get a complete viability assessment in under a minute.'}
            </p>
          </div>

          <Link
            to="/assess"
            className="gd-btn-primary px-7 py-3.5 text-sm sm:text-base shrink-0 rounded-xl"
          >
            <span>{isHi ? 'मूल्यांकन प्रारंभ करें' : 'Start Assessment'}</span>
            <ArrowRight className="w-4 h-4" />
          </Link>
        </div>
      </section>

      {/* 5. INSTITUTIONAL FOOTER */}
      <footer className="max-w-4xl mx-auto px-4 sm:px-6 pt-6 border-t border-[var(--color-border)] flex flex-col sm:flex-row items-center justify-between gap-3 text-xs text-[var(--color-text-muted)]">
        <div className="flex items-center gap-2">
          <span className="font-bold text-[var(--color-text)]">🌾 GramDisha AI</span>
          <span>•</span>
          <span>Smart India Hackathon (SIH 2026)</span>
        </div>
        <p className="text-center sm:text-right text-[var(--color-text-subtle)]">
          {isHi
            ? 'वित्तीय गणनाएं 100% गणितीय सूत्रों और आधिकारिक सरकारी बैंक नियमों पर आधारित हैं।'
            : 'Deterministic calculations conform strictly to official RBI & PMMY guidelines.'}
        </p>
      </footer>
    </div>
  );
}
