import React, { useState, useEffect, useContext } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import {
  ArrowRight,
  ArrowLeft,
  MapPin,
  AlertCircle,
  Coins,
  Check,
  Building2,
  Landmark,
  Store,
  Milk,
  Egg,
  Wheat,
  Scissors,
  Tractor,
  Wrench,
  Palette,
  Calculator,
  Compass,
  Sparkles,
  Layers,
  ShieldCheck,
} from 'lucide-react';
import { AnalysisContext } from '../App';
import { getLocations } from '../services/api';
import Button from '../components/ui/Button';

const DEFAULT_LOCATIONS = {
  states: [
    {
      name: 'Maharashtra', name_hi: 'महाराष्ट्र',
      districts: [{
        name: 'Dhule', name_hi: 'धुळे',
        blocks: [{
          name: 'Shirpur', name_hi: 'शिरपूर',
          villages: [
            { name: 'Demo Village', name_hi: 'डेमो गांव' },
            { name: 'Shirpur Rural', name_hi: 'शिरपूर ग्रामीण' },
            { name: 'Holnanthe', name_hi: 'होलनांथे' },
          ],
        }],
      }],
    },
    {
      name: 'Madhya Pradesh', name_hi: 'मध्य प्रदेश',
      districts: [{
        name: 'Indore', name_hi: 'इंदौर',
        blocks: [{
          name: 'Sanwer', name_hi: 'सांवेर',
          villages: [{ name: 'Sanwer Gram', name_hi: 'सांवेर ग्राम' }],
        }],
      }],
    },
    {
      name: 'Uttar Pradesh', name_hi: 'उत्तर प्रदेश',
      districts: [{
        name: 'Varanasi', name_hi: 'वाराणसी',
        blocks: [{
          name: 'Kashi Rural', name_hi: 'काशी ग्रामीण',
          villages: [{ name: 'Shivpur Gram', name_hi: 'शिवपुर ग्राम' }],
        }],
      }],
    },
  ],
};

const CATEGORIES = [
  { id: 'all', name_en: 'All Models', name_hi: 'सभी मॉडल' },
  { id: 'livestock', name_en: 'Livestock & Dairy', name_hi: 'पशुपालन व डेयरी' },
  { id: 'processing', name_en: 'Agro & Food Processing', name_hi: 'कृषि व प्रसंस्करण' },
  { id: 'retail_service', name_en: 'Retail & Services', name_hi: 'दुकान व सेवाएं' },
];

const ALL_BUSINESSES = [
  { id: 'dairy', category: 'livestock', name: 'Dairy & Milk Chilling', name_hi: 'डेयरी व दूध केंद्र', icon: Milk, tag: 'Agri Allied', desc_hi: 'गाय-भैंस दूध संकलन, चिलिंग व थोक सप्लाई', desc_en: 'Procurement, chilling and regional bulk distribution' },
  { id: 'retail', category: 'retail_service', name: 'Kirana & Grocery Store', name_hi: 'किराना दुकान व जनरल स्टोर', icon: Store, tag: 'Daily Retail', desc_hi: 'दैनिक घरेलू राशन व आवश्यक उपभोक्ता वस्तुएं', desc_en: 'Essential household packaged consumer provisions' },
  { id: 'poultry', category: 'livestock', name: 'Poultry Farm (Broiler/Layer)', name_hi: 'मुर्गी पालन (पोल्ट्री)', icon: Egg, tag: 'Livestock', desc_hi: 'अंडे व ब्रायलर उत्पादन व क्षेत्रीय आपूर्ति', desc_en: 'Layer egg and broiler bird farming with local market supply' },
  { id: 'food_processing', category: 'processing', name: 'Flour Mill (Atta Chakki)', name_hi: 'आटा चक्की व मसाला पिसाई', icon: Wheat, tag: 'Processing', desc_hi: 'गेहूं, अनाज व मसाले पिसाई सेवा', desc_en: 'Custom grain milling and local spice grinding unit' },
  { id: 'tailoring', category: 'retail_service', name: 'Tailoring & Garments', name_hi: 'सिलाई व वस्त्र केंद्र', icon: Scissors, tag: 'SHG / MSME', desc_hi: 'कपड़े सिलाई, स्कूल ड्रेस व रेडीमेड निर्माण', desc_en: 'School uniforms, custom stitching, and ready-to-wear apparel' },
  { id: 'agriculture', category: 'processing', name: 'Tractor & Agro Machinery', name_hi: 'ट्रैक्टर व कृषि सेवा', icon: Tractor, tag: 'Farm Tech', desc_hi: 'खेती उपकरण किराया व कस्टम हायरिंग केंद्र', desc_en: 'Farm equipment hire and mechanized tillage services' },
  { id: 'service_business', category: 'retail_service', name: 'Motorcycle Workshop', name_hi: 'बाइक व मोटर रिपेयर', icon: Wrench, tag: 'Auto Service', desc_hi: 'गाड़ी मरम्मत, स्पेयर पार्ट्स व पंचर सेवा', desc_en: 'Two-wheeler service, repair, and replacement spares retail' },
  { id: 'handicraft', category: 'retail_service', name: 'Handicraft & Pottery', name_hi: 'हस्तशिल्प व कुटीर उद्योग', icon: Palette, tag: 'Artisan Craft', desc_hi: 'मिट्टी, लकड़ी व पारंपरिक हस्तशिल्प उत्पाद', desc_en: 'Clay pottery, wooden craft, and regional artisan goods' },
];

const CAPITAL_PRESETS = [
  { value: 25000, label: '₹25,000' },
  { value: 50000, label: '₹50,000' },
  { value: 100000, label: '₹1,00,000' },
  { value: 200000, label: '₹2,00,000' },
  { value: 500000, label: '₹5,00,000' },
];

export default function Assessment() {
  const { i18n } = useTranslation();
  const navigate = useNavigate();
  const location = useLocation();
  const { setFormData } = useContext(AnalysisContext);
  const isHi = i18n.language === 'hi';

  const routerState = location.state || {};

  const [locations, setLocations] = useState(DEFAULT_LOCATIONS);
  const [step, setStep] = useState(1);
  const [activeCategory, setActiveCategory] = useState('all');
  const [selectedBusiness, setSelectedBusiness] = useState(routerState.presetBusiness || 'dairy');
  const [selectedState, setSelectedState] = useState('Maharashtra');
  const [selectedDistrict, setSelectedDistrict] = useState('Dhule');
  const [selectedBlock, setSelectedBlock] = useState('Shirpur');
  const [selectedVillage, setSelectedVillage] = useState('Demo Village');
  const [capital, setCapital] = useState(routerState.presetCapital ? Number(routerState.presetCapital) : 100000);
  const [error, setError] = useState('');

  useEffect(() => {
    getLocations().then((res) => {
      if (res.data?.states?.length > 0) setLocations(res.data);
      else if (res.data?.locations?.states) setLocations(res.data.locations);
    }).catch(() => {});
  }, []);

  // Cascading
  const states = locations.states || [];
  const stateObj = states.find((s) => s.name === selectedState) || states[0];
  const districts = stateObj?.districts || [];
  const distObj = districts.find((d) => d.name === selectedDistrict) || districts[0];
  const blocks = distObj?.blocks || [];
  const blockObj = blocks.find((b) => b.name === selectedBlock) || blocks[0];
  const villages = blockObj?.villages || [];

  const handleStateChange = (stateName) => {
    setSelectedState(stateName);
    const st = states.find((s) => s.name === stateName);
    const d = st?.districts?.[0]; setSelectedDistrict(d?.name || '');
    const bl = d?.blocks?.[0]; setSelectedBlock(bl?.name || '');
    setSelectedVillage(bl?.villages?.[0]?.name || '');
  };

  const handleDistrictChange = (distName) => {
    setSelectedDistrict(distName);
    const d = districts.find((dist) => dist.name === distName);
    const bl = d?.blocks?.[0]; setSelectedBlock(bl?.name || '');
    setSelectedVillage(bl?.villages?.[0]?.name || '');
  };

  const handleBlockChange = (blkName) => {
    setSelectedBlock(blkName);
    const bl = blocks.find((b) => b.name === blkName);
    setSelectedVillage(bl?.villages?.[0]?.name || '');
  };

  const handleSubmit = (e) => {
    if (e) e.preventDefault();
    const capNum = Number(capital);
    if (!selectedBusiness) {
      setError(isHi ? 'कृपया व्यापार का चयन करें।' : 'Please select a business enterprise.');
      return;
    }
    if (!capNum || capNum <= 0) {
      setError(isHi ? 'कृपया मान्य पूंजी राशि दर्ज करें।' : 'Please enter a valid capital amount.');
      return;
    }
    setError('');
    const payload = {
      state: selectedState,
      district: selectedDistrict,
      block: selectedBlock,
      village: selectedVillage,
      capital: capNum,
      business: selectedBusiness,
      business_category: selectedBusiness,
    };
    setFormData(payload);
    navigate('/processing', { state: payload });
  };

  const businessObj = ALL_BUSINESSES.find((b) => b.id === selectedBusiness) || ALL_BUSINESSES[0];
  const currentCapitalNum = Number(capital) || 0;
  const projectedTotalCost = currentCapitalNum * 10;
  const projectedLoan = currentCapitalNum * 9;

  // 60-month EMI estimation at 9.0%
  const annualRate = 0.09;
  const monthlyRate = annualRate / 12;
  const tenureMonths = 60;
  const estimatedEmi = Math.round(
    (projectedLoan * monthlyRate * Math.pow(1 + monthlyRate, tenureMonths)) /
      (Math.pow(1 + monthlyRate, tenureMonths) - 1)
  );

  let matchedScheme = isHi ? 'मुद्रा योजना (शिशु)' : 'PMMY Shishu';
  if (projectedLoan > 50000 && projectedLoan <= 500000) {
    matchedScheme = isHi ? 'मुद्रा योजना (किशोर)' : 'PMMY Kishor';
  } else if (projectedLoan > 500000) {
    matchedScheme = isHi ? 'मुद्रा योजना (तरुण) / नाबार्ड' : 'PMMY Tarun / NABARD';
  }

  const filteredBusinesses = activeCategory === 'all'
    ? ALL_BUSINESSES
    : ALL_BUSINESSES.filter((b) => b.category === activeCategory);

  return (
    <div className="app-container py-8 sm:py-10 space-y-7 max-w-4xl">
      {/* Header */}
      <div className="space-y-1.5 border-b border-slate-200 pb-4">
        <div className="flex items-center gap-1.5 text-xs font-bold uppercase tracking-wider text-emerald-700">
          <Building2 className="w-3.5 h-3.5" />
          <span>{isHi ? 'चरणबद्ध क्रेडिट मूल्यांकन' : 'Structured Credit Appraisal Wizard'}</span>
        </div>
        <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight">
          {isHi ? 'ग्रामीण व्यवसाय व्यवहार्यता मूल्यांकन' : 'Enterprise Feasibility Appraisal'}
        </h1>
        <p className="text-xs sm:text-sm text-slate-500">
          {isHi
            ? '3 सरल चरणों में अपने व्यवसाय मॉडल, स्थान व पूंजी का विवरण दर्ज करें।'
            : 'Complete 3 guided steps to generate your bank-compliant credit appraisal dossier.'}
        </p>
      </div>

      {/* Stepper Progress Bar */}
      <div className="grid grid-cols-3 gap-3 select-none">
        {[
          { num: 1, title_hi: '1. व्यवसाय चयन', title_en: '1. Trade Model' },
          { num: 2, title_hi: '2. क्षेत्रीय स्थान', title_en: '2. Location' },
          { num: 3, title_hi: '3. पूंजी व ऋण', title_en: '3. Capital & Loan' },
        ].map((s) => {
          const isActive = step === s.num;
          const isCompleted = step > s.num;
          return (
            <button
              key={s.num}
              type="button"
              onClick={() => setStep(s.num)}
              className={`p-3 rounded-xl flex items-center gap-2.5 text-left transition-all cursor-pointer border ${
                isActive
                  ? 'bg-white border-emerald-700 ring-2 ring-emerald-700/15 shadow-xs'
                  : isCompleted
                  ? 'bg-emerald-50/60 border-emerald-200 text-emerald-800'
                  : 'bg-white border-slate-200 text-slate-500 hover:bg-slate-50'
              }`}
            >
              <span
                className={`w-6 h-6 rounded-lg font-bold flex items-center justify-center text-xs shrink-0 ${
                  isActive || isCompleted
                    ? 'bg-emerald-700 text-white'
                    : 'bg-slate-100 text-slate-500'
                }`}
              >
                {isCompleted ? <Check className="w-3.5 h-3.5" /> : s.num}
              </span>
              <span className={`text-xs sm:text-sm font-semibold truncate ${isActive ? 'text-slate-900 font-bold' : 'text-slate-600'}`}>
                {isHi ? s.title_hi : s.title_en}
              </span>
            </button>
          );
        })}
      </div>

      {error && (
        <div className="p-3.5 rounded-xl bg-red-50 border border-red-200 text-red-700 font-semibold text-xs sm:text-sm flex items-center gap-2.5">
          <AlertCircle className="w-4 h-4 shrink-0" />
          <span>{error}</span>
        </div>
      )}

      {/* ══════ STEP 1: ENTERPRISE MODEL PICKER ══════ */}
      {step === 1 && (
        <div className="bg-white border border-slate-200 rounded-2xl p-6 sm:p-7 space-y-6 shadow-sm">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-slate-100 pb-4">
            <div>
              <h2 className="text-lg sm:text-xl font-bold text-slate-900">
                {isHi ? '1. प्रस्तावित ग्रामीण व्यवसाय का चयन करें' : '1. Select Proposed Enterprise Model'}
              </h2>
              <p className="text-xs text-slate-500 mt-0.5">
                {isHi ? 'मानकीकृत 8 ग्रामीण व्यवसाय श्रेणियों में से चुनें:' : 'Select one of the 8 curated rural enterprise models below:'}
              </p>
            </div>

            {/* Category Filter Pills */}
            <div className="flex flex-wrap items-center gap-1 p-1 bg-slate-100 rounded-xl border border-slate-200">
              {CATEGORIES.map((cat) => (
                <button
                  key={cat.id}
                  type="button"
                  onClick={() => setActiveCategory(cat.id)}
                  className={`px-2.5 py-1 rounded-lg text-xs font-semibold transition-all cursor-pointer ${
                    activeCategory === cat.id
                      ? 'bg-emerald-700 text-white shadow-xs font-bold'
                      : 'text-slate-600 hover:text-slate-900'
                  }`}
                >
                  {isHi ? cat.name_hi : cat.name_en}
                </button>
              ))}
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3.5">
            {filteredBusinesses.map((b) => {
              const isSelected = selectedBusiness === b.id;
              const Icon = b.icon;
              return (
                <button
                  key={b.id}
                  type="button"
                  onClick={() => { setSelectedBusiness(b.id); setError(''); }}
                  className={`p-4 rounded-xl flex flex-col justify-between text-left transition-all duration-150 cursor-pointer border ${
                    isSelected
                      ? 'border-emerald-700 bg-emerald-50/30 ring-2 ring-emerald-700/20 shadow-xs'
                      : 'border-slate-200 bg-white hover:border-slate-300 hover:shadow-xs'
                  }`}
                >
                  <div>
                    <div className="flex items-center justify-between w-full mb-2.5">
                      <div
                        className={`w-9 h-9 rounded-lg flex items-center justify-center shrink-0 border ${
                          isSelected
                            ? 'bg-emerald-700 text-white border-emerald-700'
                            : 'bg-slate-50 text-emerald-700 border-slate-200'
                        }`}
                      >
                        <Icon className="w-4.5 h-4.5" />
                      </div>
                      {isSelected ? (
                        <span className="w-4.5 h-4.5 rounded-full bg-emerald-700 text-white flex items-center justify-center text-[10px]">
                          <Check className="w-2.5 h-2.5" />
                        </span>
                      ) : (
                        <span className="text-[10px] font-semibold px-2 py-0.5 rounded-full bg-slate-100 text-slate-600">
                          {b.tag}
                        </span>
                      )}
                    </div>
                    <h3 className="text-sm font-bold text-slate-900 leading-snug">
                      {isHi ? b.name_hi : b.name}
                    </h3>
                  </div>
                  <p className="text-[11px] mt-2 text-slate-500 line-clamp-2 leading-relaxed">
                    {isHi ? b.desc_hi : b.desc_en}
                  </p>
                </button>
              );
            })}
          </div>

          <div className="pt-4 flex flex-col sm:flex-row items-center justify-between gap-4 border-t border-slate-100">
            <span className="text-xs font-semibold text-slate-600">
              {isHi ? `चयनित उद्यम: ${businessObj?.name_hi}` : `Selected Trade: ${businessObj?.name}`}
            </span>
            <Button
              onClick={() => setStep(2)}
              size="md"
              variant="primary"
              icon={ArrowRight}
              iconPosition="right"
              className="w-full sm:w-auto font-bold"
            >
              {isHi ? 'अगला: स्थान निर्धारण' : 'Proceed to Location'}
            </Button>
          </div>
        </div>
      )}

      {/* ══════ STEP 2: LOCATION & CATCHMENT SELECTOR ══════ */}
      {step === 2 && (
        <div className="bg-white border border-slate-200 rounded-2xl p-6 sm:p-7 space-y-6 shadow-sm">
          <div className="border-b border-slate-100 pb-3">
            <h2 className="text-lg sm:text-xl font-bold text-slate-900">
              {isHi ? '2. क्षेत्रीय कार्यक्षेत्र व गांव का चयन' : '2. Define Enterprise Catchment Area'}
            </h2>
            <p className="text-xs text-slate-500 mt-0.5">
              {isHi ? 'प्रशासनिक क्षेत्राधिकार चुनें ताकि स्थानीय जनसंख्या व मांग का सटीक विश्लेषण हो सके:' : 'Select administrative boundaries to model population density and local demand:'}
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 p-5 rounded-xl bg-slate-50 border border-slate-200/80">
            <div>
              <label className="doc-label flex items-center gap-1.5">
                <MapPin className="w-3.5 h-3.5 text-emerald-700" />
                <span>{isHi ? 'राज्य (State)' : 'State'}</span>
              </label>
              <select
                value={selectedState}
                onChange={(e) => handleStateChange(e.target.value)}
                className="doc-select font-semibold"
              >
                {states.map((s) => (
                  <option key={s.name} value={s.name}>
                    {isHi ? s.name_hi || s.name : s.name}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="doc-label flex items-center gap-1.5">
                <MapPin className="w-3.5 h-3.5 text-emerald-700" />
                <span>{isHi ? 'जिला (District)' : 'District'}</span>
              </label>
              <select
                value={selectedDistrict}
                onChange={(e) => handleDistrictChange(e.target.value)}
                className="doc-select font-semibold"
              >
                {districts.map((d) => (
                  <option key={d.name} value={d.name}>
                    {isHi ? d.name_hi || d.name : d.name}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="doc-label flex items-center gap-1.5">
                <Compass className="w-3.5 h-3.5 text-emerald-700" />
                <span>{isHi ? 'तहसील / ब्लॉक (Taluka / Block)' : 'Block / Taluka'}</span>
              </label>
              <select
                value={selectedBlock}
                onChange={(e) => handleBlockChange(e.target.value)}
                className="doc-select font-semibold"
              >
                {blocks.map((b) => (
                  <option key={b.name} value={b.name}>
                    {isHi ? b.name_hi || b.name : b.name}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="doc-label flex items-center gap-1.5">
                <Building2 className="w-3.5 h-3.5 text-emerald-700" />
                <span>{isHi ? 'गांव / कस्बा (Village)' : 'Village / Town'}</span>
              </label>
              <select
                value={selectedVillage}
                onChange={(e) => setSelectedVillage(e.target.value)}
                className="doc-select font-semibold"
              >
                {villages.map((v) => (
                  <option key={v.name} value={v.name}>
                    {isHi ? v.name_hi || v.name : v.name}
                  </option>
                ))}
              </select>
            </div>
          </div>

          <div className="p-3.5 rounded-xl bg-emerald-50 border border-emerald-200 flex items-center justify-between text-xs font-semibold text-emerald-800">
            <div className="flex items-center gap-2">
              <MapPin className="w-4 h-4 text-emerald-700 shrink-0" />
              <span>{isHi ? 'सक्रिय सेवा दायरा:' : 'Selected Catchment:'}</span>
              <span className="font-bold text-emerald-900">{selectedVillage}, {selectedBlock}, {selectedDistrict}</span>
            </div>
            <span className="text-[11px] font-bold bg-white px-2.5 py-0.5 rounded-full border border-emerald-200">
              {isHi ? '5-15 किमी सेवा परिधि' : '5–15 km Radius'}
            </span>
          </div>

          <div className="pt-4 flex flex-col sm:flex-row items-center justify-between gap-4 border-t border-slate-100">
            <Button
              onClick={() => setStep(1)}
              size="md"
              variant="secondary"
              icon={ArrowLeft}
              iconPosition="left"
              className="w-full sm:w-auto"
            >
              {isHi ? 'पिछला' : 'Back'}
            </Button>
            <Button
              onClick={() => setStep(3)}
              size="md"
              variant="primary"
              icon={ArrowRight}
              iconPosition="right"
              className="w-full sm:w-auto font-bold"
            >
              {isHi ? 'अगला: पूंजी संरचना' : 'Proceed to Capital'}
            </Button>
          </div>
        </div>
      )}

      {/* ══════ STEP 3: CAPITAL & 10:90 LOAN SIMULATOR ══════ */}
      {step === 3 && (
        <div className="bg-white border border-slate-200 rounded-2xl p-6 sm:p-7 space-y-6 shadow-sm">
          <div className="border-b border-slate-100 pb-3">
            <h2 className="text-lg sm:text-xl font-bold text-slate-900">
              {isHi ? '3. प्रवर्तक अंशदान व पूंजी संरचना (10:90 अनुपात)' : '3. Promoter Margin & Capital Structure'}
            </h2>
            <p className="text-xs text-slate-500 mt-0.5">
              {isHi
                ? 'सरकारी ऋण नीतियों के अनुसार 10% राशि स्वयं की पूंजी होती है, तथा 90% राशि सावधि बैंक ऋण द्वारा वित्तपोषित होती है:'
                : 'Under standard RBI schemes, promoter contributes 10% equity, while 90% is financed via term loan:'}
            </p>
          </div>

          {/* Interactive Range Slider */}
          <div className="space-y-3.5 p-5 rounded-xl bg-slate-50 border border-slate-200/80">
            <div className="flex items-baseline justify-between">
              <label className="text-xs font-bold text-slate-600 uppercase tracking-wider">
                {isHi ? 'आपकी स्वयं की उपलब्ध पूंजी (10% Margin):' : 'Your Available Own Margin (10%):'}
              </label>
              <span className="font-mono text-2xl sm:text-3xl font-bold text-emerald-700">
                ₹{currentCapitalNum.toLocaleString('en-IN')}
              </span>
            </div>

            <input
              type="range"
              min={10000}
              max={500000}
              step={5000}
              value={currentCapitalNum}
              onChange={(e) => setCapital(Number(e.target.value))}
              className="interactive-slider"
              aria-label="Own capital slider"
            />

            <div className="flex justify-between text-[11px] text-slate-400 font-medium">
              <span>Min: ₹10,000</span>
              <span>Max: ₹5,00,000</span>
            </div>

            {/* Presets */}
            <div className="flex flex-wrap items-center gap-2 pt-1 border-t border-slate-200/60">
              <span className="text-xs font-semibold text-slate-500 mr-1">
                {isHi ? 'त्वरित चयन:' : 'Quick Presets:'}
              </span>
              {CAPITAL_PRESETS.map((p) => {
                const isSelected = currentCapitalNum === p.value;
                return (
                  <button
                    key={p.value}
                    type="button"
                    onClick={() => setCapital(p.value)}
                    className={`px-3 py-1 rounded-lg text-xs font-semibold transition-all cursor-pointer ${
                      isSelected
                        ? 'bg-emerald-700 text-white shadow-xs font-bold'
                        : 'bg-white text-slate-600 hover:bg-slate-100 border border-slate-200'
                    }`}
                  >
                    {p.label}
                  </button>
                );
              })}
            </div>
          </div>

          {/* 3 Output Tiles */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3.5">
            <div className="p-4 rounded-xl bg-slate-50 border border-slate-200/80 space-y-1">
              <span className="text-[11px] font-bold text-slate-500 block uppercase tracking-wider">
                {isHi ? 'प्रवर्तक पूंजी (10%)' : 'Promoter Margin (10%)'}
              </span>
              <div className="text-xl font-bold text-slate-900 tabular-nums">
                ₹{currentCapitalNum.toLocaleString('en-IN')}
              </div>
              <span className="text-[11px] text-slate-500 block">
                {isHi ? 'स्वयं का अंशदान' : 'Direct Equity Investment'}
              </span>
            </div>

            <div className="p-4 rounded-xl bg-emerald-50 border border-emerald-200 space-y-1">
              <span className="text-[11px] font-bold text-emerald-800 block uppercase tracking-wider">
                {isHi ? 'स्वीकृत बैंक ऋण (90%)' : 'Bank Term Loan (90%)'}
              </span>
              <div className="text-xl font-bold text-emerald-700 tabular-nums">
                ₹{projectedLoan.toLocaleString('en-IN')}
              </div>
              <span className="text-[11px] text-emerald-700 font-medium block truncate">
                {matchedScheme}
              </span>
            </div>

            <div className="p-4 rounded-xl bg-amber-50 border border-amber-200 space-y-1">
              <span className="text-[11px] font-bold text-amber-800 block uppercase tracking-wider">
                {isHi ? 'अनुमानित ईएमआई' : 'Est. Monthly EMI'}
              </span>
              <div className="text-xl font-bold text-amber-700 tabular-nums">
                ₹{estimatedEmi.toLocaleString('en-IN')}
                <span className="text-xs font-normal text-amber-600">/mo</span>
              </div>
              <span className="text-[11px] text-amber-700 block">
                {isHi ? '5 वर्ष @ 9.0% वार्षिक दर' : '5-Year Tenure @ 9.0%'}
              </span>
            </div>
          </div>

          {/* Step 3 Actions */}
          <div className="pt-4 flex flex-col sm:flex-row items-center justify-between gap-4 border-t border-slate-100">
            <Button
              onClick={() => setStep(2)}
              size="md"
              variant="secondary"
              icon={ArrowLeft}
              iconPosition="left"
              className="w-full sm:w-auto"
            >
              {isHi ? 'पिछला' : 'Back'}
            </Button>

            <Button
              onClick={handleSubmit}
              size="lg"
              variant="primary"
              icon={ArrowRight}
              iconPosition="right"
              className="w-full sm:w-auto font-bold shadow-sm"
            >
              {isHi ? 'व्यवसाय मूल्यांकन पूर्ण करें' : 'Generate Full Appraisal'}
            </Button>
          </div>
        </div>
      )}
    </div>
  );
}
