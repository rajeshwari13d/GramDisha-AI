import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import {
  ArrowRight,
  CheckCircle2,
  Check,
  Sparkles,
} from 'lucide-react';
import Button from '../components/ui/Button';

const ENTERPRISES = [
  {
    id: 'dairy',
    name: 'Dairy & Milk Chilling',
    name_hi: 'डेयरी व दुग्ध केंद्र',
    icon: '🥛',
    tag_hi: 'दैनिक आय',
    tag_en: 'Daily income',
    capital: 100000,
    cost: 1000000,
    loan: 900000,
    emi: 14028,
    profit_hi: '₹28,000 - ₹35,000',
    profit_en: '₹28,000 - ₹35,000',
    scheme_hi: 'मुद्रा लोन (तरुण) / नाबार्ड',
    scheme_en: 'PMMY Tarun / NABARD',
    desc_hi: 'पशुपालकों से दूध संकलन व चिलिंग सप्लाई। स्थिर दैनिक मांग।',
    desc_en: 'Milk procurement and chilling supply with steady daily demand.',
  },
  {
    id: 'retail',
    name: 'Kirana & General Store',
    name_hi: 'किराना व जनरल स्टोर',
    icon: '🏪',
    tag_hi: 'स्थिर मांग',
    tag_en: 'Steady demand',
    capital: 50000,
    cost: 500000,
    loan: 450000,
    emi: 7014,
    profit_hi: '₹18,000 - ₹24,000',
    profit_en: '₹18,000 - ₹24,000',
    scheme_hi: 'मुद्रा लोन (किशोर)',
    scheme_en: 'PMMY Kishor',
    desc_hi: 'दैनिक घरेलू राशन, खाद्य सामग्री और आवश्यक वस्तुएं।',
    desc_en: 'Essential household groceries and packaged consumer goods.',
  },
  {
    id: 'poultry',
    name: 'Poultry Farming',
    name_hi: 'मुर्गी पालन (पोल्ट्री)',
    icon: '🐔',
    tag_hi: 'उच्च मुनाफा',
    tag_en: 'High margin',
    capital: 150000,
    cost: 1500000,
    loan: 1350000,
    emi: 21040,
    profit_hi: '₹35,000 - ₹45,000',
    profit_en: '₹35,000 - ₹45,000',
    scheme_hi: 'पशुधन मिशन / बैंक लोन',
    scheme_en: 'National Livestock / Bank Loan',
    desc_hi: 'अंडे व ब्रायलर उत्पादन, स्थानीय बाजारों में सीधी बिक्री।',
    desc_en: 'Layer egg and broiler meat supply to regional rural markets.',
  },
  {
    id: 'food_processing',
    name: 'Flour Mill & Spices',
    name_hi: 'आटा चक्की व मसाला पिसाई',
    icon: '🌾',
    tag_hi: 'कम लागत',
    tag_en: 'Low risk',
    capital: 40000,
    cost: 400000,
    loan: 360000,
    emi: 5611,
    profit_hi: '₹15,000 - ₹22,000',
    profit_en: '₹15,000 - ₹22,000',
    scheme_hi: 'मुद्रा लोन (शिशु/किशोर)',
    scheme_en: 'PMMY Shishu / Kishor',
    desc_hi: 'गेहूं, अनाज व मसालों की दैनिक पिसाई सेवा।',
    desc_en: 'Daily grain and spice milling service with zero inventory loss.',
  },
  {
    id: 'tailoring',
    name: 'Tailoring & Garments',
    name_hi: 'सिलाई व वस्त्र केंद्र',
    icon: '🧵',
    tag_hi: 'महिला समूह',
    tag_en: 'Women SHG',
    capital: 30000,
    cost: 300000,
    loan: 270000,
    emi: 4208,
    profit_hi: '₹12,000 - ₹18,000',
    profit_en: '₹12,000 - ₹18,000',
    scheme_hi: 'आजीविका मिशन (NRLM) / मुद्रा',
    scheme_en: 'NRLM SHG / PMMY',
    desc_hi: 'सिलाई, स्कूल ड्रेस व रेडीमेड वस्त्र निर्माण।',
    desc_en: 'Custom apparel, school uniforms and ready-to-wear garments.',
  },
  {
    id: 'agriculture',
    name: 'Tractor & Agro Service',
    name_hi: 'ट्रैक्टर व कृषि सेवा केंद्र',
    icon: '🚜',
    tag_hi: 'खेती सीजन',
    tag_en: 'Seasonal boost',
    capital: 200000,
    cost: 2000000,
    loan: 1800000,
    emi: 28056,
    profit_hi: '₹40,000 - ₹55,000',
    profit_en: '₹40,000 - ₹55,000',
    scheme_hi: 'कृषि यंत्रीकरण (SMAM) / AIF',
    scheme_en: 'SMAM Agri Infra Fund',
    desc_hi: 'ट्रैक्टर, रोटावेटर व थ्रेशर किराए पर देने की सेवा।',
    desc_en: 'Farm machinery and custom hiring for sowing and harvest seasons.',
  },
  {
    id: 'service_business',
    name: 'Motor & Bike Workshop',
    name_hi: 'बाइक व ऑटो रिपेयर शॉप',
    icon: '🔧',
    tag_hi: 'दैनिक सेवा',
    tag_en: 'Daily service',
    capital: 40000,
    cost: 400000,
    loan: 360000,
    emi: 5611,
    profit_hi: '₹16,000 - ₹24,000',
    profit_en: '₹16,000 - ₹24,000',
    scheme_hi: 'मुद्रा लोन (किशोर)',
    scheme_en: 'PMMY Kishor',
    desc_hi: 'टू-व्हीलर रिपेयरिंग, स्पेयर पार्ट्स व पंचर सेवा।',
    desc_en: 'Two-wheeler maintenance, puncture, and spare parts retail.',
  },
  {
    id: 'handicraft',
    name: 'Handicraft & Pottery',
    name_hi: 'हस्तशिल्प व कुटीर उद्योग',
    icon: '🎨',
    tag_hi: 'शिल्प कला',
    tag_en: 'Artisan craft',
    capital: 25000,
    cost: 250000,
    loan: 225000,
    emi: 3507,
    profit_hi: '₹12,000 - ₹16,000',
    profit_en: '₹12,000 - ₹16,000',
    scheme_hi: 'पीएम विश्वकर्मा योजना',
    scheme_en: 'PM Vishwakarma Scheme',
    desc_hi: 'मिट्टी, लकड़ी व स्थानीय शिल्प से उत्पाद निर्माण।',
    desc_en: 'Clay pottery, wooden craft and local artisan goods.',
  },
];

export default function Landing() {
  const { i18n } = useTranslation();
  const navigate = useNavigate();
  const isHi = i18n.language === 'hi';
  const [selectedEnterprise, setSelectedEnterprise] = useState(ENTERPRISES[0]);

  const handleStartAssessment = (businessId, capital) => {
    navigate('/assess', { state: { presetBusiness: businessId, presetCapital: capital } });
  };

  return (
    <div className="w-full">

      {/* ── 1. HERO SECTION (Clean balanced spacing: py-16 sm:py-22) ── */}
      <section className="w-full bg-[#FAF8F5] py-16 sm:py-22 border-b border-[#DCD3C5]/60">
        <div className="app-container text-center space-y-6">
          {/* Official Purpose Badge */}
          <div className="inline-flex items-center justify-center gap-2 px-4 py-2 rounded-full bg-white border border-[#DCD3C5] text-xs sm:text-sm font-bold text-gray-700 shadow-xs">
            <Sparkles className="w-4 h-4 text-emerald-700 shrink-0" />
            <span className="leading-none">
              {isHi
                ? 'भारत सरकार की आधिकारिक ऋण योजनाओं पर आधारित'
                : 'Official Government of India & State Loan Schemes'}
            </span>
          </div>

          {/* Consistent Headline */}
          <h1 className="text-3xl sm:text-5xl lg:text-6xl font-black text-gray-900 tracking-tight leading-tight max-w-4xl mx-auto">
            {isHi ? (
              <>
                आपके गांव के लिए सही व्यापार<br />
                और सरकारी बैंक लोन की पूरी योजना
              </>
            ) : (
              <>
                Discover the Right Business<br />
                and Bank Loan for Your Village
              </>
            )}
          </h1>

          {/* Subtitle */}
          <p className="text-base sm:text-lg text-gray-600 max-w-2xl mx-auto font-medium leading-relaxed">
            {isHi
              ? 'बिना किसी परेशानी के जानें कि आपके गांव में कौन सा काम सबसे ज्यादा चलेगा, बैंक से कितना लोन मिलेगा और महीने की कितनी कमाई होगी।'
              : 'Evaluate enterprise viability, calculate eligible government term loans (90%), monthly EMI, and project returns in under one minute.'}
          </p>

          {/* Primary Action Button */}
          <div className="pt-2 flex flex-col sm:flex-row items-center justify-center gap-4 max-w-md mx-auto">
            <Button
              to="/assess"
              size="lg"
              variant="primary"
              icon={ArrowRight}
              iconPosition="right"
              className="w-full sm:w-auto shadow-md"
            >
              {isHi ? 'व्यवसाय मूल्यांकन शुरू करें' : 'Start Viability Assessment'}
            </Button>
          </div>

          {/* Trust points */}
          <div className="pt-10 flex flex-wrap items-center justify-center gap-6 sm:gap-10 text-xs sm:text-sm font-bold text-gray-600">
            <span className="inline-flex items-center gap-2">
              <CheckCircle2 className="w-4 h-4 text-emerald-800 shrink-0" />
              <span>{isHi ? '100% सही बैंक गणित' : '100% Exact Bank Math'}</span>
            </span>
            <span className="inline-flex items-center gap-2">
              <CheckCircle2 className="w-4 h-4 text-emerald-800 shrink-0" />
              <span>{isHi ? 'मुद्रा व नाबार्ड योजनाएं' : 'PMMY & NABARD Rules'}</span>
            </span>
            <span className="inline-flex items-center gap-2">
              <CheckCircle2 className="w-4 h-4 text-emerald-800 shrink-0" />
              <span>{isHi ? 'बैंक-स्वीकृत PDF फाइल' : 'Bank-Ready PDF Dossier'}</span>
            </span>
          </div>
        </div>
      </section>

      {/* ── 2. BUSINESS MODELS & LIVE ESTIMATOR ── */}
      <section className="w-full bg-white py-16 sm:py-22 border-b border-[#DCD3C5]/60">
        <div className="app-container space-y-8">
          {/* Section Header */}
          <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-3 border-b border-[#DCD3C5] pb-5">
            <div>
              <h2 className="text-2xl sm:text-3xl font-black text-gray-900 tracking-tight">
                {isHi ? 'ग्रामीण व्यवसाय मॉडल देखें' : 'Explore Rural Business Models'}
              </h2>
              <p className="text-xs sm:text-sm text-gray-600 font-medium mt-1">
                {isHi
                  ? 'नीचे दिए गए किसी भी व्यवसाय पर क्लिक करें और अनुमानित लागत, लोन व मुनाफे का हिसाब देखें।'
                  : 'Select an enterprise below to preview loan eligibility, capital requirements, and projected profit.'}
              </p>
            </div>
            <span className="text-xs sm:text-sm font-bold text-gray-500 shrink-0">
              {isHi ? '8 प्रमुख श्रेणियां' : '8 Common Categories'}
            </span>
          </div>

          {/* 8 Business Cards Grid (Balanced p-5 padding) */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 items-stretch">
            {ENTERPRISES.map((ent) => {
              const isSelected = selectedEnterprise.id === ent.id;
              return (
                <button
                  key={ent.id}
                  type="button"
                  onClick={() => setSelectedEnterprise(ent)}
                  className={`p-5 rounded-2xl flex flex-col justify-between text-left transition-all duration-150 cursor-pointer relative bg-white h-full ${
                    isSelected
                      ? 'border-2 border-emerald-800 ring-4 ring-emerald-800/15 shadow-sm'
                      : 'border border-[#DCD3C5] hover:border-gray-400 hover:shadow-xs'
                  }`}
                >
                  <div>
                    <div className="flex items-center justify-between w-full mb-3">
                      {/* Standardized 44x44 Icon Tile */}
                      <div className="w-11 h-11 rounded-xl bg-[#F4EFEB] border border-[#DCD3C5] flex items-center justify-center text-2xl shrink-0 shadow-2xs">
                        {ent.icon}
                      </div>

                      {/* Standardized Category Chip Tag */}
                      {isSelected ? (
                        <span className="w-6 h-6 rounded-full bg-emerald-800 text-white flex items-center justify-center text-xs shrink-0 shadow-xs">
                          <Check className="w-3.5 h-3.5" />
                        </span>
                      ) : (
                        <span className="text-[11px] font-bold px-2.5 py-1 rounded-full bg-[#EBE3D7]/70 text-[#57534E] border border-[#DCD3C5] leading-tight">
                          {isHi ? ent.tag_hi : ent.tag_en}
                        </span>
                      )}
                    </div>

                    <h3 className="text-base font-black text-gray-900 leading-tight">
                      {isHi ? ent.name_hi : ent.name}
                    </h3>
                  </div>

                  {/* Description */}
                  <div className="mt-3 pt-2.5 border-t border-gray-100">
                    <p className="text-xs text-gray-500 line-clamp-2 leading-relaxed min-h-[36px]">
                      {isHi ? ent.desc_hi : ent.desc_en}
                    </p>
                  </div>
                </button>
              );
            })}
          </div>

          {/* ── Detail Band Panel (Balanced p-6 sm:p-8 padding) ── */}
          <div className="mt-8 sm:mt-10 p-6 sm:p-8 rounded-3xl bg-[#F4EFEB] border border-[#DCD3C5] shadow-xs space-y-6">
            {/* Detail Band Header */}
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-[#DCD3C5] pb-5">
              <div className="flex items-center gap-4">
                <div className="w-14 h-14 rounded-2xl bg-white border border-[#DCD3C5] flex items-center justify-center text-3xl shrink-0 shadow-xs">
                  {selectedEnterprise.icon}
                </div>
                <div>
                  <h3 className="text-xl sm:text-2xl font-black text-gray-900 leading-tight">
                    {isHi ? selectedEnterprise.name_hi : selectedEnterprise.name}
                  </h3>
                  <p className="text-xs sm:text-sm text-gray-600 font-medium mt-0.5">
                    {isHi ? selectedEnterprise.desc_hi : selectedEnterprise.desc_en}
                  </p>
                </div>
              </div>

              {/* Action Button */}
              <Button
                onClick={() => handleStartAssessment(selectedEnterprise.id, selectedEnterprise.capital)}
                size="md"
                variant="primary"
                icon={ArrowRight}
                iconPosition="right"
                className="shrink-0"
              >
                {isHi ? 'इस व्यवसाय की पूरी जांच करें' : 'Evaluate This Business'}
              </Button>
            </div>

            {/* 4 Unified Neutral Data Cards (Balanced p-5 padding) */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
              {/* Box 1: Monthly Profit */}
              <div className="p-5 rounded-2xl bg-white border border-[#DCD3C5] space-y-1.5 shadow-xs">
                <span className="text-xs font-bold uppercase text-gray-500 block leading-tight">
                  {isHi ? 'मासिक शुद्ध बचत' : 'Estimated Monthly Profit'}
                </span>
                <div className="text-2xl font-black text-gray-900 tabular-nums">
                  {isHi ? selectedEnterprise.profit_hi : selectedEnterprise.profit_en}
                </div>
                <span className="text-[11px] text-gray-500 font-medium block leading-tight">
                  {isHi ? 'किस्त व खर्चे काटने के बाद' : 'Net in hand after EMI & costs'}
                </span>
              </div>

              {/* Box 2: Govt Loan */}
              <div className="p-5 rounded-2xl bg-white border border-[#DCD3C5] space-y-1.5 shadow-xs">
                <span className="text-xs font-bold uppercase text-gray-500 block leading-tight">
                  {isHi ? 'सरकारी बैंक लोन (90%)' : 'Bank Loan (90%)'}
                </span>
                <div className="text-2xl font-black text-gray-900 tabular-nums">
                  ₹{(selectedEnterprise.loan / 100000).toFixed(1)} {isHi ? 'लाख' : 'Lakh'}
                </div>
                <span className="text-[11px] text-gray-500 font-medium block truncate leading-tight">
                  {isHi ? selectedEnterprise.scheme_hi : selectedEnterprise.scheme_en}
                </span>
              </div>

              {/* Box 3: Monthly EMI */}
              <div className="p-5 rounded-2xl bg-white border border-[#DCD3C5] space-y-1.5 shadow-xs">
                <span className="text-xs font-bold uppercase text-gray-500 block leading-tight">
                  {isHi ? 'मासिक बैंक किस्त (EMI)' : 'Monthly Bank EMI'}
                </span>
                <div className="text-2xl font-black text-gray-900 tabular-nums">
                  ₹{selectedEnterprise.emi.toLocaleString('en-IN')}{' '}
                  <span className="text-xs font-normal text-gray-500">/{isHi ? 'माह' : 'mo'}</span>
                </div>
                <span className="text-[11px] text-gray-500 font-medium block leading-tight">
                  {isHi ? '7 वर्ष @ 8.5% वार्षिक दर' : '7 Years @ 8.5% Interest'}
                </span>
              </div>

              {/* Box 4: Capital Needed */}
              <div className="p-5 rounded-2xl bg-white border border-[#DCD3C5] space-y-1.5 shadow-xs">
                <span className="text-xs font-bold uppercase text-gray-500 block leading-tight">
                  {isHi ? 'आपकी बचत (10%)' : 'Your Margin (10%)'}
                </span>
                <div className="text-2xl font-black text-gray-900 tabular-nums">
                  ₹{(selectedEnterprise.capital / 100000).toFixed(1)} {isHi ? 'लाख' : 'Lakh'}
                </div>
                <span className="text-[11px] text-gray-500 font-medium block leading-tight">
                  {isHi ? `कुल लागत: ₹${(selectedEnterprise.cost / 100000)} लाख` : `Total Cost: ₹${(selectedEnterprise.cost / 100000)} Lakh`}
                </span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ── 3. THREE VALUE PILLARS ── */}
      <section className="w-full bg-[#FAF8F5] py-16 sm:py-22">
        <div className="app-container space-y-8">
          <div className="text-center space-y-2">
            <h2 className="text-2xl sm:text-3xl font-black text-gray-900 tracking-tight">
              {isHi ? 'ग्रामदिशा एआई आपकी कैसे मदद करता है?' : 'How GramDisha AI Works For You'}
            </h2>
            <p className="text-xs sm:text-sm text-gray-600 font-medium max-w-xl mx-auto">
              {isHi
                ? 'सरकारी योजनाओं और गणितीय सूत्रों के आधार पर आपके गांव के लिए सही वित्तीय फैसला लें।'
                : 'Deterministic banking models and hyper-local intelligence combined for sound enterprise decisions.'}
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="gd-card p-6 sm:p-7 space-y-3 bg-white flex flex-col justify-between">
              <div className="space-y-3">
                <div className="w-12 h-12 rounded-xl bg-[#F4EFEB] border border-[#DCD3C5] flex items-center justify-center text-2xl shrink-0 shadow-2xs">
                  📍
                </div>
                <h3 className="text-lg font-black text-gray-900">
                  {isHi ? 'गांव की बाजार मांग' : 'Local Market Catchment'}
                </h3>
                <p className="text-sm text-gray-600 font-medium leading-relaxed">
                  {isHi
                    ? 'आपके गांव की आबादी, नजदीकी हाट-बाजार और प्रतियोगिता के अनुसार सही उत्पाद का चयन।'
                    : 'Analyses village population, catchment radius, and competitor density for realistic demand estimation.'}
                </p>
              </div>
            </div>

            <div className="gd-card p-6 sm:p-7 space-y-3 bg-white flex flex-col justify-between">
              <div className="space-y-3">
                <div className="w-12 h-12 rounded-xl bg-[#F4EFEB] border border-[#DCD3C5] flex items-center justify-center text-2xl shrink-0 shadow-2xs">
                  🏛️
                </div>
                <h3 className="text-lg font-black text-gray-900">
                  {isHi ? 'सरकारी योजना व लोन' : 'Government Loan Schemes'}
                </h3>
                <p className="text-sm text-gray-600 font-medium leading-relaxed">
                  {isHi
                    ? 'प्रधानमंत्री मुद्रा योजना, नाबार्ड, स्टैंड-अप इंडिया के तहत 90% तक बैंक लोन की पात्रता।'
                    : 'Deterministic rules for PMMY (Shishu/Kishor/Tarun), NABARD, and NRLM credit schemes.'}
                </p>
              </div>
            </div>

            <div className="gd-card p-6 sm:p-7 space-y-3 bg-white flex flex-col justify-between">
              <div className="space-y-3">
                <div className="w-12 h-12 rounded-xl bg-[#F4EFEB] border border-[#DCD3C5] flex items-center justify-center text-2xl shrink-0 shadow-2xs">
                  📄
                </div>
                <h3 className="text-lg font-black text-gray-900">
                  {isHi ? 'बैंक के लिए तैयार फाइल' : 'Bank-Ready PDF Proposal'}
                </h3>
                <p className="text-sm text-gray-600 font-medium leading-relaxed">
                  {isHi
                    ? 'बैंक मैनेजर को दिखाने के लिए 28-तिमाही किस्त तालिका व संपूर्ण डीपीआर फाइल तुरंत डाउनलोड करें।'
                    : 'Instant downloadable Detailed Project Report (DPR) with 28-quarter amortization schedule and DSCR calculations.'}
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

    </div>
  );
}
