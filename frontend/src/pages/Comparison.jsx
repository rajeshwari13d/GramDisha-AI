import React, { useState, useEffect, useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import {
  Scale,
  Award,
  Loader2,
  ArrowRight,
  Sparkles,
  Milk,
  ShoppingBag,
  Scissors,
  Wheat,
  Egg,
  Factory,
  Palette,
  UtensilsCrossed,
  FileCheck2,
  RefreshCw,
  TrendingUp,
} from 'lucide-react';
import { AnalysisContext } from '../App';
import { compareBusiness } from '../services/api';
import ProvenanceBadge from '../components/ProvenanceBadge';

const ALL_CANDIDATES = [
  'dairy',
  'retail',
  'tailoring',
  'food_processing',
  'poultry',
  'agriculture',
  'small_manufacturing',
  'handicraft',
];

const TRADE_ICONS = {
  dairy: Milk,
  retail: ShoppingBag,
  tailoring: Scissors,
  food_processing: UtensilsCrossed,
  poultry: Egg,
  agriculture: Wheat,
  small_manufacturing: Factory,
  handicraft: Palette,
};

export default function Comparison() {
  const { analysis, formData } = useContext(AnalysisContext);
  const { t, i18n } = useTranslation();
  const navigate = useNavigate();
  const isHi = i18n.language === 'hi';

  const defaultCapital = analysis?.financial?.margin_capital || formData?.capital || 100000;
  const defaultLocation = analysis?.location || formData || {
    state: 'Maharashtra',
    district: 'Dhule',
    block: 'Shirpur',
    village: 'Demo Village',
  };

  const [capital, setCapital] = useState(defaultCapital);
  const [selectedList, setSelectedList] = useState(['dairy', 'retail', 'tailoring', 'food_processing']);
  const [results, setResults] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const runComparison = async () => {
    setLoading(true);
    setError(null);
    try {
      const res = await compareBusiness({
        state: defaultLocation.state,
        district: defaultLocation.district,
        block: defaultLocation.block,
        village: defaultLocation.village,
        capital: Number(capital),
        language: i18n.language === 'hi' ? 'hi' : 'en',
        businesses: selectedList,
      });

      if (res.data?.success && res.data?.comparison) {
        setResults(res.data.comparison);
      } else {
        setError('Comparison calculation failed.');
      }
    } catch (err) {
      setError(err.response?.data?.message || 'Error running multi-business comparison.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    runComparison();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [selectedList, capital, i18n.language]);

  const toggleBusiness = (biz) => {
    if (selectedList.includes(biz)) {
      if (selectedList.length <= 2) return; // Keep at least 2
      setSelectedList(selectedList.filter((b) => b !== biz));
    } else {
      if (selectedList.length >= 4) return; // Max 4
      setSelectedList([...selectedList, biz]);
    }
  };

  return (
    <div className="app-container py-8 sm:py-12 space-y-8">
      {/* Header Ledger */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-200 pb-5">
        <div>
          <div className="flex items-center gap-2 text-xs font-bold text-slate-500 uppercase tracking-wider">
            <Scale className="w-3.5 h-3.5 text-emerald-700" />
            <span>{isHi ? 'तुलनात्मक व्यवहार्यता मैट्रिक्स' : 'Comparative Enterprise Feasibility Matrix'}</span>
          </div>
          <h1 className="text-2xl sm:text-3.5xl font-bold text-slate-900 tracking-tight mt-1">
            {isHi ? 'ग्रामीण व्यवसाय तुलनात्मक विश्लेषण' : 'Multi-Enterprise Viability Comparison'}
          </h1>
          <p className="text-xs sm:text-sm text-slate-600 mt-1">
            {isHi
              ? `समान पूंजी (₹${Number(capital).toLocaleString('en-IN')}) में विभिन्न ग्रामीण व्यवसायों का तुलनात्मक मूल्यांकन`
              : `Evaluation across alternative enterprise models for identical margin capital: ₹${Number(capital).toLocaleString('en-IN')}`}
          </p>
        </div>
        <ProvenanceBadge type="calculated" />
      </div>

      {/* Selectors Bar */}
      <div className="doc-card-elevated p-6 space-y-5 bg-white">
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-5">
          <div className="space-y-2.5 flex-1">
            <label className="text-xs font-bold text-slate-900 uppercase tracking-wider block">
              {isHi ? 'तुलना हेतु व्यवसाय चुनें (2 से 4 मॉडल):' : 'Select Enterprises to Compare (2 to 4):'}
            </label>
            <div className="flex flex-wrap gap-2">
              {ALL_CANDIDATES.map((b) => {
                const active = selectedList.includes(b);
                const IconComponent = TRADE_ICONS[b] || Wheat;
                return (
                  <button
                    key={b}
                    type="button"
                    onClick={() => toggleBusiness(b)}
                    className={`inline-flex items-center gap-2 px-3.5 py-2 rounded-xl text-xs font-bold capitalize transition-all border min-h-[38px] cursor-pointer ${
                      active
                        ? 'bg-emerald-700 text-white border-emerald-700 shadow-xs'
                        : 'bg-white text-slate-700 border-slate-200 hover:bg-slate-50 hover:border-slate-300'
                    }`}
                  >
                    <IconComponent className={`w-3.5 h-3.5 ${active ? 'text-emerald-100' : 'text-slate-400'}`} />
                    <span>{b.replace(/_/g, ' ')}</span>
                  </button>
                );
              })}
            </div>
          </div>

          <div className="flex items-end gap-3 shrink-0">
            <div>
              <label htmlFor="compare-capital" className="text-xs font-bold text-slate-500 uppercase tracking-wider block mb-1">
                {isHi ? 'मार्जिन पूंजी (₹)' : 'Margin Capital (₹)'}
              </label>
              <input
                id="compare-capital"
                type="number"
                step="10000"
                value={capital}
                onChange={(e) => setCapital(e.target.value)}
                className="doc-input w-36 font-mono font-bold"
              />
            </div>
            <button
              type="button"
              onClick={runComparison}
              disabled={loading}
              className="gd-btn-secondary text-xs px-4 min-h-[44px] font-bold"
            >
              {loading ? <Loader2 className="w-4 h-4 animate-spin" /> : <RefreshCw className="w-3.5 h-3.5" />}
              <span>{loading ? (isHi ? 'गणना...' : 'Evaluating...') : (isHi ? 'पुनः गणना' : 'Recalculate')}</span>
            </button>
          </div>
        </div>
      </div>

      {error && (
        <div
          role="alert"
          className="p-4 rounded-xl border text-xs sm:text-sm font-medium bg-rose-50 text-rose-700 border-rose-200"
        >
          {error}
        </div>
      )}

      {/* Comparison Grid */}
      {loading ? (
        <div className="py-20 flex flex-col items-center justify-center text-slate-500 space-y-3">
          <Loader2 className="w-8 h-8 animate-spin text-emerald-700" />
          <span className="text-xs sm:text-sm font-medium">
            {isHi ? 'वित्तीय एवं जनसांख्यिकीय तुलना जारी है...' : 'Evaluating financial feasibility models across candidates...'}
          </span>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5 items-stretch">
          {results.map((biz) => {
            const isBest = biz.is_recommended;
            const bizName = isHi ? biz.business_hi || biz.business : biz.business;
            const bandName = isHi ? biz.viability_band_hi || biz.viability_band : biz.viability_band;
            const IconComponent = TRADE_ICONS[biz.business] || Wheat;

            return (
              <div
                key={biz.business}
                className={`doc-card-elevated p-5 flex flex-col justify-between space-y-4 relative transition-all ${
                  isBest
                    ? 'border-2 border-emerald-600 shadow-md ring-2 ring-emerald-600/10'
                    : 'border-slate-200'
                }`}
              >
                {isBest && (
                  <div className="absolute -top-3 left-1/2 -translate-x-1/2 bg-emerald-700 text-white px-3 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wider shadow-xs flex items-center gap-1.5 whitespace-nowrap">
                    <Award className="w-3 h-3 text-amber-300" />
                    <span>{isHi ? 'सर्वश्रेष्ठ व्यवहार्यता' : 'Optimal Candidate'}</span>
                  </div>
                )}

                <div className="space-y-4 pt-1">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-xl bg-slate-50 border border-slate-200 flex items-center justify-center text-emerald-700 shrink-0">
                      <IconComponent className="w-5 h-5" />
                    </div>
                    <div className="min-w-0">
                      <h3 className="font-bold text-slate-900 text-sm sm:text-base leading-tight truncate">
                        {bizName}
                      </h3>
                      <span className="text-[11px] text-slate-500 font-medium">
                        {bandName}
                      </span>
                    </div>
                  </div>

                  {/* Viability Score Banner */}
                  <div className="p-3.5 bg-slate-50 rounded-xl text-center border border-slate-200">
                    <span className="text-[10px] uppercase font-bold text-slate-500 tracking-wider block">
                      {isHi ? 'व्यवहार्यता स्कोर' : 'Viability Score'}
                    </span>
                    <div className="text-3xl font-bold text-emerald-700 tabular-nums mt-0.5">
                      {biz.viability_score}
                      <span className="text-xs font-sans font-normal text-slate-400">/100</span>
                    </div>
                  </div>

                  {/* Metric Ledger List with Visual Progress */}
                  <div className="border border-slate-200 rounded-xl divide-y divide-slate-100 text-xs">
                    <div className="p-2.5 flex justify-between items-center">
                      <span className="text-slate-500">{isHi ? 'मांग सूचकांक' : 'Demand Index'}:</span>
                      <span className="font-mono font-bold text-slate-900">{biz.demand_score}/100</span>
                    </div>
                    <div className="p-2.5 flex justify-between items-center">
                      <span className="text-slate-500">{isHi ? 'प्रतिस्पर्धा स्तर' : 'Competition'}:</span>
                      <span className="font-semibold text-slate-900 capitalize">{biz.competition_level}</span>
                    </div>
                    <div className="p-2.5 flex justify-between items-center">
                      <span className="text-slate-500">{isHi ? 'अवसर स्कोर' : 'Opportunity'}:</span>
                      <span className="font-mono font-bold text-emerald-700">{biz.opportunity_score}/100</span>
                    </div>
                    <div className="p-2.5 flex justify-between items-center">
                      <span className="text-slate-500">{isHi ? 'जोखिम रेटिंग' : 'Risk Rating'}:</span>
                      <span className="font-semibold text-amber-700">{biz.risk_level || `${biz.risk_score}/100`}</span>
                    </div>
                    <div className="p-2.5 flex justify-between items-center">
                      <span className="text-slate-500">{isHi ? 'नकदी प्रवाह' : 'Cashflow'}:</span>
                      <span className="font-semibold text-slate-900 capitalize">{biz.financial_health}</span>
                    </div>
                  </div>
                </div>

                <div className="pt-2 border-t border-slate-200">
                  <button
                    type="button"
                    onClick={() => navigate('/assess', { state: { presetBusiness: biz.business, presetCapital: capital } })}
                    className={`w-full py-2.5 rounded-xl text-xs font-bold transition-all min-h-[38px] cursor-pointer ${
                      isBest
                        ? 'bg-emerald-700 text-white hover:bg-emerald-800 shadow-xs'
                        : 'bg-slate-100 text-slate-800 hover:bg-slate-200 border border-slate-200'
                    }`}
                  >
                    {isHi ? 'इस उद्यम का विश्लेषण करें' : 'Appraise Enterprise'}
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
