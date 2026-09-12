import React, { useState, useEffect, useContext } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { ArrowRight, ArrowLeft, MapPin, AlertCircle, Coins, Check, Sparkles, Building2, CheckCircle2 } from 'lucide-react';
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

const ALL_BUSINESSES = [
  { id: 'dairy', name: 'Dairy & Milk Chilling', name_hi: 'डेयरी व दूध केंद्र', icon: '🥛', desc_hi: 'गाय-भैंस दूध संकलन व चिलिंग सप्लाई', desc_en: 'Milk procurement & chilling' },
  { id: 'retail', name: 'Kirana & Grocery Store', name_hi: 'किराना दुकान व जनरल स्टोर', icon: '🏪', desc_hi: 'दैनिक घरेलू राशन व आवश्यक वस्तुएं', desc_en: 'Daily household groceries' },
  { id: 'poultry', name: 'Poultry Farm (Broiler/Layer)', name_hi: 'मुर्गी पालन (पोल्ट्री)', icon: '🐔', desc_hi: 'अंडे व ब्रायलर उत्पादन व सप्लाई', desc_en: 'Egg & broiler bird farming' },
  { id: 'food_processing', name: 'Flour Mill (Atta Chakki)', name_hi: 'आटा चक्की व मसाला पिसाई', icon: '🌾', desc_hi: 'गेहूं, अनाज व मसाले पिसाई', desc_en: 'Grain & spice milling' },
  { id: 'tailoring', name: 'Tailoring & Garments', name_hi: 'सिलाई व वस्त्र केंद्र', icon: '🧵', desc_hi: 'कपड़े सिलाई, स्कूल ड्रेस व रेडीमेड', desc_en: 'Stitching & garments' },
  { id: 'agriculture', name: 'Tractor & Agro Machinery', name_hi: 'ट्रैक्टर व कृषि सेवा', icon: '🚜', desc_hi: 'खेती उपकरण किराया व सेवा केंद्र', desc_en: 'Farm equipment hire' },
  { id: 'service_business', name: 'Motor & Bike Workshop', name_hi: 'बाइक व मोटर रिपेयर', icon: '🔧', desc_hi: 'गाड़ी मरम्मत, पंचर व स्पेयर पार्ट्स', desc_en: 'Vehicle repair service' },
  { id: 'handicraft', name: 'Handicraft & Pottery', name_hi: 'हस्तशिल्प व कुटीर उद्योग', icon: '🎨', desc_hi: 'मिट्टी, लकड़ी व हस्तशिल्प उत्पाद', desc_en: 'Artisan craftwork' },
];

const CAPITAL_PRESETS = [
  { value: 25000, label_hi: '₹25,000', label_en: '₹25K', sub_hi: 'छोटे स्तर पर', sub_en: 'Micro' },
  { value: 50000, label_hi: '₹50,000', label_en: '₹50K', sub_hi: 'शुरुआती स्तर', sub_en: 'Starter' },
  { value: 100000, label_hi: '₹1,00,000 (1 लाख)', label_en: '₹1 Lakh', sub_hi: 'सबसे लोकप्रिय', sub_en: 'Popular' },
  { value: 200000, label_hi: '₹2,00,000 (2 लाख)', label_en: '₹2 Lakh', sub_hi: 'मध्यम स्तर', sub_en: 'Medium' },
  { value: 500000, label_hi: '₹5,00,000 (5 लाख)', label_en: '₹5 Lakh', sub_hi: 'बड़ा स्तर', sub_en: 'Commercial' },
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
  const [selectedBusiness, setSelectedBusiness] = useState(routerState.presetBusiness || 'dairy');
  const [selectedState, setSelectedState] = useState('Maharashtra');
  const [selectedDistrict, setSelectedDistrict] = useState('Dhule');
  const [selectedBlock, setSelectedBlock] = useState('Shirpur');
  const [selectedVillage, setSelectedVillage] = useState('Demo Village');
  const [capital, setCapital] = useState(routerState.presetCapital ? String(routerState.presetCapital) : '100000');
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
    const capNum = parseFloat(capital);
    if (!selectedBusiness) {
      setError(isHi ? 'कृपया व्यापार चुनें।' : 'Please select a business.');
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

  return (
    <div className="app-container py-12 sm:py-20 space-y-10 max-w-[1060px]">
      {/* Header */}
      <div className="text-center space-y-3 border-b border-slate-200 pb-8">
        <h1 className="text-2xl sm:text-4xl font-black text-slate-950 tracking-tight">
          {isHi ? 'अपने गांव के लिए व्यापार योजना बनाएं' : 'Evaluate Your Village Enterprise'}
        </h1>
        <p className="text-sm sm:text-base text-slate-600 font-medium max-w-lg mx-auto">
          {isHi
            ? '3 आसान चरणों में व्यापार, स्थान और पूंजी चुनें और बैंक-स्वीकृत मूल्यांकन पाएं।'
            : 'Complete the 3 simple steps below to generate an official viability report and loan dossier.'}
        </p>
      </div>

      {/* Modern 3 Step Indicator */}
      <div className="grid grid-cols-3 gap-3 sm:gap-4 select-none">
        {[
          { num: 1, title_hi: '1. व्यवसाय चुनें', title_en: '1. Enterprise' },
          { num: 2, title_hi: '2. गांव व स्थान', title_en: '2. Location' },
          { num: 3, title_hi: '3. बचत व पूंजी', title_en: '3. Capital' },
        ].map((s) => {
          const isActive = step === s.num;
          const isCompleted = step > s.num;
          return (
            <button
              key={s.num}
              type="button"
              onClick={() => setStep(s.num)}
              className={`p-4 sm:p-5 rounded-2xl flex items-center justify-center sm:justify-start gap-3.5 border transition-all duration-200 cursor-pointer select-none ${
                isActive
                  ? 'bg-white border-2 border-emerald-600 ring-4 ring-emerald-500/15 shadow-sm -translate-y-0.5'
                  : isCompleted
                  ? 'bg-emerald-50/60 border-emerald-200 text-emerald-900'
                  : 'bg-white text-slate-600 border-slate-200 hover:bg-slate-50'
              }`}
            >
              <span
                className={`w-8 h-8 sm:w-9 sm:h-9 rounded-xl font-black flex items-center justify-center text-xs sm:text-sm shrink-0 transition-all ${
                  isActive
                    ? 'bg-emerald-600 text-white shadow-xs'
                    : isCompleted
                    ? 'bg-emerald-600 text-white'
                    : 'bg-slate-100 text-slate-600'
                }`}
              >
                {isCompleted ? <Check className="w-4 h-4" /> : s.num}
              </span>
              <span className={`hidden sm:block text-sm sm:text-base font-black leading-tight ${isActive ? 'text-slate-950' : 'text-slate-600'}`}>
                {isHi ? s.title_hi : s.title_en}
              </span>
            </button>
          );
        })}
      </div>

      {error && (
        <div className="p-5 rounded-2xl bg-red-50 border border-red-200 text-red-900 font-bold flex items-center gap-3">
          <AlertCircle className="w-5 h-5 text-red-600 shrink-0" />
          <span className="leading-none">{error}</span>
        </div>
      )}

      {/* ══════ STEP 1: BUSINESS PICKER ══════ */}
      {step === 1 && (
        <div className="gd-card p-6 sm:p-10 space-y-8 bg-white">
          <div className="flex items-center justify-between border-b border-slate-100 pb-5">
            <div>
              <h2 className="text-xl sm:text-2xl font-black text-slate-900">
                {isHi ? '1. आप कौन सा काम शुरू करना चाहते हैं?' : '1. Pick the Enterprise You Want to Start'}
              </h2>
              <p className="text-xs sm:text-sm text-slate-500 mt-1 font-medium">
                {isHi ? 'नीचे दिए गए 8 प्रमुख ग्रामीण व्यवसायों में से एक चुनें:' : 'Select one of the 8 rural enterprise models below:'}
              </p>
            </div>
            <span className="text-3xl sm:text-4xl">{businessObj?.icon}</span>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4.5">
            {ALL_BUSINESSES.map((b) => {
              const isSelected = selectedBusiness === b.id;
              return (
                <button
                  key={b.id}
                  type="button"
                  onClick={() => { setSelectedBusiness(b.id); setError(''); }}
                  className={`p-5 sm:p-6 rounded-2xl flex flex-col text-left transition-all duration-200 cursor-pointer relative bg-white ${
                    isSelected
                      ? 'border-2 border-emerald-600 ring-4 ring-emerald-500/15 shadow-md -translate-y-0.5'
                      : 'border border-slate-200 hover:border-slate-300 hover:shadow-xs hover:-translate-y-0.5'
                  }`}
                >
                  <div className="flex items-center justify-between w-full mb-3.5">
                    <div className="w-12 h-12 rounded-2xl bg-slate-50 border border-slate-200/80 flex items-center justify-center text-2xl shrink-0 shadow-2xs">
                      {b.icon}
                    </div>
                    {isSelected && (
                      <span className="w-7 h-7 rounded-full bg-emerald-600 text-white flex items-center justify-center text-xs shrink-0 shadow-xs">
                        <Check className="w-4 h-4" />
                      </span>
                    )}
                  </div>
                  <h3 className="text-base font-black text-slate-900 leading-tight">
                    {isHi ? b.name_hi : b.name}
                  </h3>
                  <p className="text-xs mt-2 text-slate-500 line-clamp-2 leading-relaxed">
                    {isHi ? b.desc_hi : b.desc_en}
                  </p>
                </button>
              );
            })}
          </div>

          {/* Step 1 Actions */}
          <div className="pt-6 flex flex-col sm:flex-row items-center justify-between gap-4 border-t border-slate-100">
            <span className="text-sm font-bold text-slate-700">
              {isHi ? `चुना हुआ: ${businessObj?.name_hi}` : `Selected: ${businessObj?.name}`}
            </span>
            <Button
              onClick={() => setStep(2)}
              size="md"
              variant="primary"
              icon={ArrowRight}
              iconPosition="right"
              className="w-full sm:w-auto shadow-sm"
            >
              {isHi ? 'अगला: स्थान चुनें' : 'Next: Location'}
            </Button>
          </div>
        </div>
      )}

      {/* ══════ STEP 2: LOCATION SELECTOR ══════ */}
      {step === 2 && (
        <div className="gd-card p-6 sm:p-10 space-y-8 bg-white">
          <div className="border-b border-slate-100 pb-5">
            <h2 className="text-xl sm:text-2xl font-black text-slate-900">
              {isHi ? '2. आपका गांव या कस्बा कहाँ है?' : '2. Select Your Village Location'}
            </h2>
            <p className="text-xs sm:text-sm text-slate-500 mt-1 font-medium">
              {isHi
                ? 'राज्य, जिला और गांव चुनें ताकि स्थानीय बाजार और जनसंख्या की गणना की जा सके:'
                : 'Select your state, district, and village to calculate local customer demand:'}
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-5 sm:gap-6 bg-slate-50/80 p-6 sm:p-8 rounded-3xl border border-slate-200">
            <div>
              <label className="gd-label flex items-center gap-2 text-slate-800">
                <MapPin className="w-4 h-4 text-emerald-600 shrink-0" />
                <span>{isHi ? 'राज्य (State)' : 'State'}</span>
              </label>
              <select
                value={selectedState}
                onChange={(e) => handleStateChange(e.target.value)}
                className="gd-select font-bold bg-white"
              >
                {states.map((s) => (
                  <option key={s.name} value={s.name}>
                    {isHi ? s.name_hi || s.name : s.name}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="gd-label flex items-center gap-2 text-slate-800">
                <MapPin className="w-4 h-4 text-emerald-600 shrink-0" />
                <span>{isHi ? 'जिला (District)' : 'District'}</span>
              </label>
              <select
                value={selectedDistrict}
                onChange={(e) => handleDistrictChange(e.target.value)}
                className="gd-select font-bold bg-white"
              >
                {districts.map((d) => (
                  <option key={d.name} value={d.name}>
                    {isHi ? d.name_hi || d.name : d.name}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="gd-label flex items-center gap-2 text-slate-800">
                <MapPin className="w-4 h-4 text-emerald-600 shrink-0" />
                <span>{isHi ? 'ब्लॉक / तहसील (Block)' : 'Block / Taluka'}</span>
              </label>
              <select
                value={selectedBlock}
                onChange={(e) => handleBlockChange(e.target.value)}
                className="gd-select font-bold bg-white"
              >
                {blocks.map((b) => (
                  <option key={b.name} value={b.name}>
                    {isHi ? b.name_hi || b.name : b.name}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="gd-label flex items-center gap-2 text-slate-800">
                <MapPin className="w-4 h-4 text-emerald-600 shrink-0" />
                <span>{isHi ? 'गांव / कस्बा (Village)' : 'Village'}</span>
              </label>
              <select
                value={selectedVillage}
                onChange={(e) => setSelectedVillage(e.target.value)}
                className="gd-select font-bold bg-white"
              >
                {villages.map((v) => (
                  <option key={v.name} value={v.name}>
                    {isHi ? v.name_hi || v.name : v.name}
                  </option>
                ))}
              </select>
            </div>
          </div>

          {/* Step 2 Actions */}
          <div className="pt-6 flex flex-col sm:flex-row items-center justify-between gap-4 border-t border-slate-100">
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
              className="w-full sm:w-auto shadow-sm"
            >
              {isHi ? 'अगला: पूंजी चुनें' : 'Next: Capital'}
            </Button>
          </div>
        </div>
      )}

      {/* ══════ STEP 3: CAPITAL & SUBMIT ══════ */}
      {step === 3 && (
        <div className="gd-card p-6 sm:p-10 space-y-8 bg-white">
          <div className="border-b border-slate-100 pb-5">
            <h2 className="text-xl sm:text-2xl font-black text-slate-900">
              {isHi ? '3. आपके पास लगाने के लिए कितनी पूंजी है?' : '3. How Much Margin Savings Do You Have?'}
            </h2>
            <p className="text-xs sm:text-sm text-slate-500 mt-1 font-medium">
              {isHi
                ? 'यह आपकी 10% स्वयं की बचत राशि है। बाकी 90% राशि सरकारी बैंक लोन से मिलेगी:'
                : 'Your 10% promoter equity. The remaining 90% is financed via term loan:'}
            </p>
          </div>

          {/* 5 Preset Chips */}
          <div className="space-y-3">
            <span className="text-xs sm:text-sm font-bold text-slate-500 block">
              {isHi ? 'राशि चुनें:' : 'Select Margin Amount:'}
            </span>
            <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-3.5">
              {CAPITAL_PRESETS.map((p) => {
                const isSelected = Number(capital) === p.value;
                return (
                  <button
                    key={p.value}
                    type="button"
                    onClick={() => setCapital(String(p.value))}
                    className={`p-4 sm:p-5 rounded-2xl flex flex-col items-center text-center transition-all duration-200 cursor-pointer border select-none bg-white ${
                      isSelected
                        ? 'border-2 border-emerald-600 ring-4 ring-emerald-500/15 shadow-sm -translate-y-0.5'
                        : 'border-slate-200 hover:border-slate-300 hover:bg-slate-50'
                    }`}
                  >
                    <span className="text-2xl mb-1.5">🪙</span>
                    <span className="text-base sm:text-lg font-black text-slate-900 leading-tight">
                      {isHi ? p.label_hi : p.label_en}
                    </span>
                    <span className="text-xs font-medium text-slate-500 mt-1 leading-tight">
                      {isHi ? p.sub_hi : p.sub_en}
                    </span>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Custom Input & Live Calculation Breakdown */}
          <div className="p-6 sm:p-8 rounded-3xl bg-slate-50/80 border border-slate-200 space-y-6">
            <div className="space-y-3">
              <label className="gd-label flex items-center justify-between">
                <span className="flex items-center gap-2 text-sm sm:text-base font-bold text-slate-800">
                  <Coins className="w-4.5 h-4.5 text-emerald-600 shrink-0" />
                  <span>{isHi ? 'या अपनी राशि दर्ज करें (₹):' : 'Or Enter Custom Amount (₹):'}</span>
                </span>
                <span className="text-xs sm:text-sm font-bold text-slate-600 tabular-nums">
                  {currentCapitalNum > 0 && `(₹${(currentCapitalNum / 100000).toFixed(2)} ${isHi ? 'लाख' : 'Lakh'})`}
                </span>
              </label>
              <div className="relative">
                <span className="absolute left-4 top-1/2 -translate-y-1/2 text-xl font-bold text-slate-400">₹</span>
                <input
                  type="number"
                  min="10000"
                  step="5000"
                  value={capital}
                  onChange={(e) => setCapital(e.target.value)}
                  placeholder="100000"
                  className="gd-input pl-10 text-xl sm:text-2xl font-black text-slate-900 bg-white"
                />
              </div>
            </div>

            {/* Live 10:90 Ratio Preview Cards */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3.5 pt-2">
              <div className="p-4 rounded-2xl bg-white border border-slate-200 space-y-1 shadow-2xs">
                <span className="text-[11px] font-bold uppercase tracking-wider text-slate-500 block">
                  {isHi ? 'आपकी पूंजी (10%)' : 'Your Margin (10%)'}
                </span>
                <div className="text-lg sm:text-xl font-black text-slate-900 tabular-nums">
                  ₹{currentCapitalNum.toLocaleString('en-IN')}
                </div>
              </div>

              <div className="p-4 rounded-2xl bg-white border border-slate-200 space-y-1 shadow-2xs">
                <span className="text-[11px] font-bold uppercase tracking-wider text-slate-500 block">
                  {isHi ? 'सरकारी बैंक लोन (90%)' : 'Bank Loan (90%)'}
                </span>
                <div className="text-lg sm:text-xl font-black text-emerald-700 tabular-nums">
                  ₹{projectedLoan.toLocaleString('en-IN')}
                </div>
              </div>

              <div className="p-4 rounded-2xl bg-white border border-slate-200 space-y-1 shadow-2xs">
                <span className="text-[11px] font-bold uppercase tracking-wider text-slate-500 block">
                  {isHi ? 'कुल परियोजना लागत' : 'Total Project Cost'}
                </span>
                <div className="text-lg sm:text-xl font-black text-slate-900 tabular-nums">
                  ₹{projectedTotalCost.toLocaleString('en-IN')}
                </div>
              </div>
            </div>
          </div>

          {/* Neutral Summary Card */}
          <div className="p-6 rounded-3xl bg-slate-50/80 border border-slate-200 space-y-3">
            <h4 className="text-sm sm:text-base font-bold text-slate-800">
              {isHi ? 'मूल्यांकन विवरण:' : 'Selected Assessment Parameters:'}
            </h4>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 text-xs sm:text-sm font-bold text-slate-700">
              <div>🏢 {isHi ? 'व्यापार:' : 'Business:'} {businessObj?.name_hi || businessObj?.name}</div>
              <div>📍 {isHi ? 'स्थान:' : 'Location:'} {selectedVillage}, {selectedDistrict}</div>
              <div>💵 {isHi ? 'आपकी पूंजी:' : 'Your Capital:'} ₹{currentCapitalNum.toLocaleString('en-IN')}</div>
            </div>
          </div>

          {/* Step 3 Actions */}
          <div className="pt-6 flex flex-col sm:flex-row items-center justify-between gap-4 border-t border-slate-100">
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
              className="w-full sm:w-auto shadow-md hover:shadow-lg"
            >
              {isHi ? 'व्यवसाय मूल्यांकन शुरू करें' : 'Run Viability Check'}
            </Button>
          </div>
        </div>
      )}
    </div>
  );
}
