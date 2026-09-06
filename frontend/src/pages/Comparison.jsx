import React, { useState, useEffect, useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import {
  Scale,
  Award,
  Loader2,
  ArrowRight,
  Sparkles,
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
    <div className="max-w-6xl mx-auto px-4 sm:px-6 py-6 sm:py-10 space-y-6 sm:space-y-8">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-[var(--color-text)] tracking-tight">
            {isHi ? 'व्यवसाय तुलना विश्लेषण' : 'Multi-Business Viability Comparison'}
          </h1>
          <p className="text-xs sm:text-sm text-[var(--color-text-muted)] mt-1">
            {isHi
              ? `समान पूंजी (₹${Number(capital).toLocaleString('en-IN')}) में विभिन्न ग्रामीण व्यवसायों का तुलनात्मक मूल्यांकन`
              : `Comparative evaluation across alternative rural enterprise models for identical capital: ₹${Number(capital).toLocaleString('en-IN')}`}
          </p>
        </div>
        <ProvenanceBadge type="calculated" />
      </div>

      {/* Selectors Bar */}
      <div className="gd-card p-5 sm:p-6 space-y-4">
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
          <div className="space-y-2 flex-1">
            <label className="gd-label">
              {isHi ? 'तुलना हेतु व्यवसाय चुनें (2 से 4)' : 'Select Businesses to Compare (2 to 4)'}
            </label>
            <div className="flex flex-wrap gap-2">
              {ALL_CANDIDATES.map((b) => {
                const active = selectedList.includes(b);
                return (
                  <button
                    key={b}
                    type="button"
                    onClick={() => toggleBusiness(b)}
                    className={`px-3 py-1.5 rounded-lg text-xs font-semibold capitalize transition-all border min-h-[38px] cursor-pointer ${
                      active
                        ? 'bg-[var(--color-positive)] text-white border-[var(--color-positive)]'
                        : 'bg-[var(--color-surface)] text-[var(--color-text)] border-[var(--color-border)] hover:bg-[var(--color-surface-subtle)]'
                    }`}
                  >
                    {b.replace(/_/g, ' ')}
                  </button>
                );
              })}
            </div>
          </div>

          <div className="flex items-end gap-3 shrink-0">
            <div>
              <label htmlFor="compare-capital" className="gd-label">
                {isHi ? 'पूंजी (₹)' : 'Capital (₹)'}
              </label>
              <input
                id="compare-capital"
                type="number"
                step="10000"
                value={capital}
                onChange={(e) => setCapital(e.target.value)}
                className="gd-input w-36 font-bold tabular-nums"
              />
            </div>
            <button
              type="button"
              onClick={runComparison}
              disabled={loading}
              className="gd-btn-secondary text-xs px-4 min-h-[44px]"
            >
              {loading ? <Loader2 className="w-4 h-4 animate-spin" /> : (isHi ? 'पुनः तुलना' : 'Refresh')}
            </button>
          </div>
        </div>
      </div>

      {error && (
        <div
          role="alert"
          className="p-4 rounded-xl border text-sm font-medium"
          style={{
            backgroundColor: 'var(--color-negative-bg)',
            color: 'var(--color-negative)',
            borderColor: 'var(--color-negative-border)',
          }}
        >
          {error}
        </div>
      )}

      {/* Comparison Grid — Stacked cards on mobile, 2-col tablet, 4-col desktop */}
      {loading ? (
        <div className="py-20 flex flex-col items-center justify-center text-[var(--color-text-muted)] space-y-2">
          <Loader2 className="w-7 h-7 animate-spin text-[var(--color-positive)]" />
          <span className="text-xs sm:text-sm font-medium">
            {isHi ? 'तुलनात्मक गणना जारी है...' : 'Calculating comparative metrics...'}
          </span>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5 items-stretch">
          {results.map((biz) => {
            const isBest = biz.is_recommended;
            const bizName = isHi ? biz.business_hi || biz.business : biz.business;
            const bandName = isHi ? biz.viability_band_hi || biz.viability_band : biz.viability_band;

            return (
              <div
                key={biz.business}
                className={`gd-card p-5 flex flex-col justify-between space-y-4 relative transition-colors ${
                  isBest
                    ? 'border-2 border-[var(--color-positive)] ring-1 ring-[var(--color-positive-border)] shadow-sm'
                    : 'border-[var(--color-border)]'
                }`}
              >
                {isBest && (
                  <div className="absolute -top-3 left-1/2 -translate-x-1/2 bg-[var(--color-positive)] text-white px-3 py-0.5 rounded-full text-[10px] font-black uppercase tracking-wider shadow-xs flex items-center gap-1">
                    <Award className="w-3 h-3 text-amber-200" />
                    <span>{isHi ? 'सर्वश्रेष्ठ विकल्प' : 'Top Candidate'}</span>
                  </div>
                )}

                <div className="space-y-4 pt-1">
                  <div className="flex items-center gap-3">
                    <div className="w-11 h-11 rounded-xl bg-[var(--color-surface-subtle)] border border-[var(--color-border)] flex items-center justify-center text-2xl shrink-0">
                      {biz.icon || '🌾'}
                    </div>
                    <div className="min-w-0">
                      <h3 className="font-extrabold text-[var(--color-text)] text-sm sm:text-base leading-tight truncate">
                        {bizName}
                      </h3>
                      <span className="text-xs text-[var(--color-text-muted)] font-medium">
                        {bandName}
                      </span>
                    </div>
                  </div>

                  {/* Viability Score Banner */}
                  <div className="p-3 bg-[var(--color-surface-subtle)] rounded-xl text-center border border-[var(--color-border)]">
                    <span className="text-[10px] uppercase font-bold text-[var(--color-text-muted)] tracking-wider block">
                      {isHi ? 'व्यवहार्यता स्कोर' : 'Viability Score'}
                    </span>
                    <div className="text-3xl font-extrabold text-[var(--color-positive)] tabular-nums mt-0.5">
                      {biz.viability_score}
                      <span className="text-xs font-normal text-[var(--color-text-subtle)]">/100</span>
                    </div>
                  </div>

                  {/* Metric List */}
                  <div className="border border-[var(--color-border)] rounded-xl divide-y divide-[var(--color-border)] text-xs">
                    <div className="p-2.5 flex justify-between items-center">
                      <span className="text-[var(--color-text-muted)]">{isHi ? 'मांग स्कोर' : 'Demand Index'}:</span>
                      <span className="font-bold text-[var(--color-text)] tabular-nums">{biz.demand_score}/100</span>
                    </div>
                    <div className="p-2.5 flex justify-between items-center">
                      <span className="text-[var(--color-text-muted)]">{isHi ? 'प्रतिस्पर्धा स्तर' : 'Competition'}:</span>
                      <span className="font-bold text-[var(--color-text)] capitalize">{biz.competition_level}</span>
                    </div>
                    <div className="p-2.5 flex justify-between items-center">
                      <span className="text-[var(--color-text-muted)]">{isHi ? 'अवसर स्कोर' : 'Opportunity'}:</span>
                      <span className="font-bold text-[var(--color-positive)] tabular-nums">{biz.opportunity_score}/100</span>
                    </div>
                    <div className="p-2.5 flex justify-between items-center">
                      <span className="text-[var(--color-text-muted)]">{isHi ? 'जोखिम स्तर' : 'Risk Rating'}:</span>
                      <span className="font-bold text-[var(--color-caution)]">{biz.risk_level || `${biz.risk_score}/100`}</span>
                    </div>
                    <div className="p-2.5 flex justify-between items-center">
                      <span className="text-[var(--color-text-muted)]">{isHi ? 'वित्तीय स्थिति' : 'Cashflow'}:</span>
                      <span className="font-bold text-[var(--color-text)] capitalize">{biz.financial_health}</span>
                    </div>
                  </div>
                </div>

                <div className="pt-2 border-t border-[var(--color-border)]">
                  <button
                    type="button"
                    onClick={() => navigate('/assess')}
                    className={`w-full py-2.5 rounded-lg text-xs font-bold transition-colors min-h-[38px] cursor-pointer ${
                      isBest
                        ? 'bg-[var(--color-positive)] text-white hover:bg-[#1A4931]'
                        : 'bg-[var(--color-surface-subtle)] text-[var(--color-text)] hover:bg-[var(--color-surface-muted)] border border-[var(--color-border)]'
                    }`}
                  >
                    {isHi ? 'इस व्यवसाय का चयन करें' : 'Select & Analyze'}
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
