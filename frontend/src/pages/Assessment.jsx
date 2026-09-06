import React, { useState, useEffect, useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import {
  MapPin,
  Coins,
  Briefcase,
  ArrowRight,
  Info,
  AlertCircle,
  Check,
} from 'lucide-react';
import { AnalysisContext } from '../App';
import { getLocations, getCategories } from '../services/api';
import ProvenanceBadge from '../components/ProvenanceBadge';

const DEFAULT_LOCATIONS = {
  states: [
    {
      name: 'Maharashtra',
      name_hi: 'महाराष्ट्र',
      districts: [
        {
          name: 'Dhule',
          name_hi: 'धुळे',
          blocks: [
            {
              name: 'Shirpur',
              name_hi: 'शिरपूर',
              villages: [
                { name: 'Demo Village', name_hi: 'डेमो गांव' },
                { name: 'Shirpur Town', name_hi: 'शिरपूर शहर' },
              ],
            },
            {
              name: 'Dhule City',
              name_hi: 'धुळे शहर',
              villages: [
                { name: 'Dhule Urban', name_hi: 'धुळे शहरी' },
              ],
            },
          ],
        },
      ],
    },
  ],
};

const DEFAULT_BUSINESSES = [
  { id: 'dairy', name: 'Dairy', name_hi: 'डेयरी उद्योग', icon: '🥛' },
  { id: 'retail', name: 'Retail', name_hi: 'किराना दुकान / खुदरा', icon: '🏪' },
  { id: 'poultry', name: 'Poultry', name_hi: 'मुर्गी पालन', icon: '🐔' },
  { id: 'tailoring', name: 'Tailoring', name_hi: 'सिलाई व वस्त्र निर्माण', icon: '🧵' },
  { id: 'food_processing', name: 'Food Processing', name_hi: 'खाद्य प्रसंस्करण', icon: '🌾' },
  { id: 'textile', name: 'Textile', name_hi: 'कपड़ा व हथकरघा', icon: '🧶' },
  { id: 'agriculture', name: 'Agriculture', name_hi: 'कृषि सेवा केंद्र', icon: '🚜' },
  { id: 'small_manufacturing', name: 'Small Manufacturing', name_hi: 'लघु विनिर्माण', icon: '⚙️' },
  { id: 'service_business', name: 'Service Business', name_hi: 'सेवा व्यवसाय', icon: '🔧' },
  { id: 'handicraft', name: 'Handicraft', name_hi: 'हस्तशिल्प व कला', icon: '🎨' },
];

export default function Assessment() {
  const { t, i18n } = useTranslation();
  const navigate = useNavigate();
  const { setFormData } = useContext(AnalysisContext);
  const isHi = i18n.language === 'hi';

  const [locations, setLocations] = useState(DEFAULT_LOCATIONS);
  const [businesses, setBusinesses] = useState(DEFAULT_BUSINESSES);

  // Form states
  const [selectedState, setSelectedState] = useState('Maharashtra');
  const [selectedDistrict, setSelectedDistrict] = useState('Dhule');
  const [selectedBlock, setSelectedBlock] = useState('Shirpur');
  const [selectedVillage, setSelectedVillage] = useState('Demo Village');
  const [capital, setCapital] = useState('100000');
  const [selectedBusiness, setSelectedBusiness] = useState('dairy');
  const [error, setError] = useState('');

  useEffect(() => {
    getLocations()
      .then((res) => {
        if (res.data?.states && res.data.states.length > 0) {
          setLocations(res.data);
        } else if (res.data?.locations?.states) {
          setLocations(res.data.locations);
        }
      })
      .catch(() => {});

    getCategories()
      .then((res) => {
        if (res.data?.categories && res.data.categories.length > 0) {
          setBusinesses(res.data.categories);
        }
      })
      .catch(() => {});
  }, []);

  // Cascading lists
  const currentStateObj = locations.states.find((s) => s.name === selectedState) || locations.states[0];
  const districts = currentStateObj?.districts || [];
  const currentDistrictObj = districts.find((d) => d.name === selectedDistrict) || districts[0];
  const blocks = currentDistrictObj?.blocks || [];
  const currentBlockObj = blocks.find((b) => b.name === selectedBlock) || blocks[0];
  const villages = currentBlockObj?.villages || [];

  // Live calculation preview
  const numCapital = Math.max(0, parseFloat(capital) || 0);
  const projectedProjectCost = numCapital * 10;
  const projectedLoan = numCapital * 9;

  const handleSubmit = (e) => {
    e.preventDefault();
    setError('');

    if (!selectedState) return setError(t('assessment.validation.state_required'));
    if (!selectedDistrict) return setError(t('assessment.validation.district_required'));
    if (!selectedBlock) return setError(t('assessment.validation.block_required'));
    if (!selectedVillage) return setError(t('assessment.validation.village_required'));
    if (!numCapital || numCapital <= 0) return setError(t('assessment.validation.capital_positive'));
    if (numCapital > 5000000) return setError(t('assessment.validation.capital_max'));
    if (!selectedBusiness) return setError(t('assessment.validation.business_required'));

    const data = {
      state: selectedState,
      district: selectedDistrict,
      block: selectedBlock,
      village: selectedVillage,
      capital: numCapital,
      business: selectedBusiness,
      language: i18n.language === 'hi' ? 'hi' : 'en',
    };

    setFormData(data);
    navigate('/processing', { state: data });
  };

  return (
    <div className="max-w-6xl mx-auto px-4 sm:px-6 py-6 sm:py-10 space-y-6">
      {/* Clean Header */}
      <div className="text-left">
        <h1 className="text-2xl sm:text-3xl font-extrabold text-[var(--color-text)] tracking-tight">
          {t('assessment.title')}
        </h1>
        <p className="text-xs sm:text-sm text-[var(--color-text-muted)] mt-1">
          {t('assessment.subtitle')}
        </p>
      </div>

      {error && (
        <div
          role="alert"
          className="p-3.5 rounded-xl border flex items-start gap-2.5 text-xs sm:text-sm font-medium"
          style={{
            backgroundColor: 'var(--color-negative-bg)',
            color: 'var(--color-negative)',
            borderColor: 'var(--color-negative-border)',
          }}
        >
          <AlertCircle className="w-4 h-4 shrink-0 mt-0.5" />
          <span>{error}</span>
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-6">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
          {/* Left Column (5 cols desktop): Location & Capital with live 10:90 preview */}
          <div className="lg:col-span-5 space-y-5">
            {/* Section 1: Location */}
            <div className="gd-card p-4 sm:p-5 space-y-4">
              <div className="flex items-center gap-2 border-b border-[var(--color-border)] pb-2.5 text-[var(--color-text)] font-bold text-sm">
                <MapPin className="w-4 h-4 text-[var(--color-positive)] shrink-0" />
                <span>{isHi ? '1. भौगोलिक स्थान' : '1. Location Details'}</span>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                {/* State */}
                <div>
                  <label htmlFor="select-state" className="gd-label">
                    {t('assessment.state')}
                  </label>
                  <select
                    id="select-state"
                    value={selectedState}
                    onChange={(e) => {
                      setSelectedState(e.target.value);
                      const st = locations.states.find((s) => s.name === e.target.value);
                      if (st && st.districts.length > 0) {
                        setSelectedDistrict(st.districts[0].name);
                        setSelectedBlock(st.districts[0].blocks[0]?.name || '');
                        setSelectedVillage(st.districts[0].blocks[0]?.villages[0]?.name || '');
                      }
                    }}
                    className="gd-select text-xs font-medium"
                  >
                    {locations.states.map((s) => (
                      <option key={s.name} value={s.name}>
                        {isHi ? s.name_hi || s.name : s.name}
                      </option>
                    ))}
                  </select>
                </div>

                {/* District */}
                <div>
                  <label htmlFor="select-district" className="gd-label">
                    {t('assessment.district')}
                  </label>
                  <select
                    id="select-district"
                    value={selectedDistrict}
                    onChange={(e) => {
                      setSelectedDistrict(e.target.value);
                      const dt = districts.find((d) => d.name === e.target.value);
                      if (dt && dt.blocks.length > 0) {
                        setSelectedBlock(dt.blocks[0].name);
                        setSelectedVillage(dt.blocks[0].villages[0]?.name || '');
                      }
                    }}
                    className="gd-select text-xs font-medium"
                  >
                    {districts.map((d) => (
                      <option key={d.name} value={d.name}>
                        {isHi ? d.name_hi || d.name : d.name}
                      </option>
                    ))}
                  </select>
                </div>

                {/* Block */}
                <div>
                  <label htmlFor="select-block" className="gd-label">
                    {t('assessment.block')}
                  </label>
                  <select
                    id="select-block"
                    value={selectedBlock}
                    onChange={(e) => {
                      setSelectedBlock(e.target.value);
                      const bk = blocks.find((b) => b.name === e.target.value);
                      if (bk && bk.villages.length > 0) {
                        setSelectedVillage(bk.villages[0].name);
                      }
                    }}
                    className="gd-select text-xs font-medium"
                  >
                    {blocks.map((b) => (
                      <option key={b.name} value={b.name}>
                        {isHi ? b.name_hi || b.name : b.name}
                      </option>
                    ))}
                  </select>
                </div>

                {/* Village */}
                <div>
                  <label htmlFor="select-village" className="gd-label">
                    {t('assessment.village')}
                  </label>
                  <select
                    id="select-village"
                    value={selectedVillage}
                    onChange={(e) => setSelectedVillage(e.target.value)}
                    className="gd-select text-xs font-medium"
                  >
                    {villages.map((v) => (
                      <option key={v.name} value={v.name}>
                        {isHi ? v.name_hi || v.name : v.name}
                      </option>
                    ))}
                  </select>
                </div>
              </div>
            </div>

            {/* Section 2: Capital & 10:90 Live Preview */}
            <div className="gd-card p-4 sm:p-5 space-y-4">
              <div className="flex items-center gap-2 border-b border-[var(--color-border)] pb-2.5 text-[var(--color-text)] font-bold text-sm">
                <Coins className="w-4 h-4 text-[var(--color-positive)] shrink-0" />
                <span>{isHi ? '2. उपलब्ध पूंजी (मार्जिन)' : '2. Your Margin Capital'}</span>
              </div>

              <div className="space-y-3">
                <div className="relative">
                  <span className="absolute left-3.5 top-1/2 -translate-y-1/2 text-[var(--color-text-muted)] font-bold text-base">
                    ₹
                  </span>
                  <input
                    id="input-capital"
                    type="number"
                    min="5000"
                    step="5000"
                    value={capital}
                    onChange={(e) => setCapital(e.target.value)}
                    placeholder="e.g. 100000"
                    className="gd-input pl-8 font-bold text-base sm:text-lg tabular-nums"
                  />
                </div>

                {/* Quick chip buttons */}
                <div className="flex flex-wrap gap-1.5">
                  {[50000, 100000, 200000, 500000].map((amt) => (
                    <button
                      key={amt}
                      type="button"
                      onClick={() => setCapital(String(amt))}
                      className="px-2.5 py-1 text-xs font-semibold rounded-md bg-[var(--color-surface-subtle)] text-[var(--color-text)] hover:bg-[var(--color-surface-muted)] border border-[var(--color-border)] transition-colors tabular-nums min-h-[32px] cursor-pointer"
                    >
                      ₹{(amt).toLocaleString('en-IN')}
                    </button>
                  ))}
                </div>

                {/* Compact 10:90 Preview Card */}
                <div className="p-3.5 rounded-lg bg-[var(--color-surface-subtle)] border border-[var(--color-border)] space-y-2 text-xs">
                  <div className="flex justify-between items-center text-[var(--color-text-muted)]">
                    <span>{isHi ? 'पूंजी (10% मार्जिन):' : 'Margin Money (10%):'}</span>
                    <span className="font-bold text-[var(--color-text)] tabular-nums">₹{numCapital.toLocaleString('en-IN')}</span>
                  </div>
                  <div className="flex justify-between items-center text-[var(--color-text-muted)]">
                    <span>{isHi ? 'परियोजना लागत (10x):' : 'Project Cost (10x):'}</span>
                    <span className="font-bold text-[var(--color-positive)] tabular-nums">₹{projectedProjectCost.toLocaleString('en-IN')}</span>
                  </div>
                  <div className="flex justify-between items-center pt-1.5 border-t border-[var(--color-border)] font-semibold text-[var(--color-text)]">
                    <span>{isHi ? 'अनुमानित ऋण (90%):' : 'Theoretical Loan (90%):'}</span>
                    <span className="font-extrabold text-[var(--color-positive)] tabular-nums">₹{projectedLoan.toLocaleString('en-IN')}</span>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Right Column (7 cols desktop): Business Category Selection */}
          <div className="lg:col-span-7 gd-card p-4 sm:p-5 space-y-4">
            <div className="flex items-center justify-between border-b border-[var(--color-border)] pb-2.5">
              <div className="flex items-center gap-2 text-[var(--color-text)] font-bold text-sm">
                <Briefcase className="w-4 h-4 text-[var(--color-positive)] shrink-0" />
                <span>{isHi ? '3. ग्रामीण व्यवसाय चुनें' : '3. Select Rural Business'}</span>
              </div>
              <span className="text-xs text-[var(--color-text-subtle)] font-medium">10 Categories</span>
            </div>

            <div className="grid grid-cols-2 sm:grid-cols-2 xl:grid-cols-3 gap-2.5">
              {businesses.map((biz) => {
                const bizId = biz.id || biz.name.toLowerCase().replace(/\s+/g, '_');
                const isSelected = selectedBusiness === bizId;
                return (
                  <button
                    key={bizId}
                    type="button"
                    onClick={() => setSelectedBusiness(bizId)}
                    className={`p-3 rounded-lg border text-left transition-all flex items-center gap-3 cursor-pointer ${
                      isSelected
                        ? 'bg-[var(--color-positive-bg)] border-[var(--color-positive)] ring-1 ring-[var(--color-positive)] shadow-xs'
                        : 'bg-[var(--color-surface)] border-[var(--color-border)] hover:bg-[var(--color-surface-subtle)] hover:border-[var(--color-border-strong)]'
                    }`}
                    aria-pressed={isSelected}
                  >
                    <span className="text-2xl shrink-0" aria-hidden="true">{biz.icon || '🌾'}</span>
                    <div className="min-w-0 flex-1">
                      <span className={`text-xs font-bold block truncate ${isSelected ? 'text-[var(--color-positive)]' : 'text-[var(--color-text)]'}`}>
                        {isHi ? biz.name_hi || biz.name : biz.name}
                      </span>
                    </div>
                    {isSelected && (
                      <Check className="w-4 h-4 text-[var(--color-positive)] shrink-0" />
                    )}
                  </button>
                );
              })}
            </div>
          </div>
        </div>

        {/* Action Button */}
        <div className="sticky bottom-0 sm:static bg-[var(--color-bg)] sm:bg-transparent py-3 sm:py-2 border-t sm:border-t-0 border-[var(--color-border)] z-30 flex justify-center">
          <button
            type="submit"
            className="gd-btn-primary w-full sm:w-auto min-w-[280px] text-sm sm:text-base px-8 py-3 shadow-xs cursor-pointer"
          >
            <span>{t('assessment.submit')}</span>
            <ArrowRight className="w-4 h-4" />
          </button>
        </div>
      </form>
    </div>
  );
}
