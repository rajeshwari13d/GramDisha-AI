import React, { useState, useEffect, useContext } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { CheckCircle2, Loader2, AlertCircle, RefreshCw, Landmark, ShieldCheck } from 'lucide-react';
import { AnalysisContext } from '../App';
import { analyzeBusinessFull } from '../services/api';

export default function Processing() {
  const { i18n } = useTranslation();
  const navigate = useNavigate();
  const location = useLocation();
  const { setAnalysis, formData } = useContext(AnalysisContext);
  const isHi = i18n.language === 'hi';
  const requestData = location.state || formData;

  const steps = [
    { key: 'market', label: isHi ? '1. क्षेत्रीय जनसंख्या व हाट-बाजार मांग मिलान' : '1. Regional Catchment & Market Demand Matching' },
    { key: 'finance', label: isHi ? '2. 10:90 ऋण संरचना व 28-तिमाही किस्त गणना' : '2. 10:90 Debt Structuring & 28-Quarter Amortization' },
    { key: 'risk', label: isHi ? '3. ऋण सेवा व्याप्ति अनुपात (DSCR) व जोखिम मूल्यांकन' : '3. Debt Service Coverage Ratio (DSCR) Appraisal' },
    { key: 'verdict', label: isHi ? '4. वैधानिक योजना रूटिंग व अंतिम व्यवहार्यता निर्णय' : '4. Statutory Policy Routing & Viability Indexing' },
  ];

  const [currentStep, setCurrentStep] = useState(0);
  const [done, setDone] = useState([]);
  const [error, setError] = useState(null);

  const run = async () => {
    if (!requestData) { navigate('/assess'); return; }
    setError(null); setCurrentStep(0); setDone([]);
    const timer = setInterval(() => {
      setCurrentStep((p) => { if (p < steps.length - 1) { setDone((d) => [...d, p]); return p + 1; } return p; });
    }, 500);
    try {
      const res = await analyzeBusinessFull({ ...requestData, language: isHi ? 'hi' : 'en' });
      clearInterval(timer);
      setDone(steps.map((_, i) => i)); setCurrentStep(steps.length);
      if (res.data?.success) {
        setAnalysis(res.data);
        setTimeout(() => navigate('/dashboard'), 400);
      } else {
        setError(res.data?.message || 'Appraisal computation failed.');
      }
    } catch (e) {
      clearInterval(timer);
      setError(e.response?.data?.message || e.message || 'Connection error while contacting credit appraisal engine.');
    }
  };

  useEffect(() => { run(); }, []);

  return (
    <div className="w-full max-w-md mx-auto px-4 py-20 text-center space-y-7">
      {!error ? (
        <div className="doc-card p-8 space-y-6 bg-white border border-slate-200 shadow-md">
          <div className="w-14 h-14 rounded-2xl bg-emerald-50 border border-emerald-200 text-emerald-700 mx-auto flex items-center justify-center shadow-xs">
            <Landmark className="w-7 h-7 animate-pulse text-emerald-700" />
          </div>

          <div className="space-y-1">
            <h2 className="text-xl font-bold text-slate-900 tracking-tight">
              {isHi ? 'वित्तीय व्यवहार्यता मूल्यांकन जारी...' : 'Credit Appraisal in Progress...'}
            </h2>
            <p className="text-xs text-slate-500">
              {isHi ? 'आरबीआई एवं सरकारी योजना नियमों के तहत सटीक वित्तीय गणना' : 'Validating parameters against statutory banking models'}
            </p>
          </div>

          <div className="space-y-2.5 text-left pt-2">
            {steps.map((s, i) => {
              const isDone = done.includes(i);
              const isCur = currentStep === i;
              return (
                <div
                  key={s.key}
                  className={`flex items-center gap-3 px-3.5 py-3 rounded-xl text-xs font-semibold transition-all border ${
                    isDone
                      ? 'text-emerald-800 bg-emerald-50/80 border-emerald-200'
                      : isCur
                      ? 'text-amber-800 bg-amber-50 border-amber-300 font-bold shadow-xs'
                      : 'text-slate-400 bg-slate-50/50 border-slate-200'
                  }`}
                >
                  {isDone ? (
                    <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
                  ) : isCur ? (
                    <Loader2 className="w-4 h-4 text-amber-600 animate-spin shrink-0" />
                  ) : (
                    <div className="w-4 h-4 rounded-full border border-slate-300 shrink-0" />
                  )}
                  <span className="leading-snug">{s.label}</span>
                </div>
              );
            })}
          </div>
        </div>
      ) : (
        <div className="doc-card p-8 space-y-5 bg-white border border-rose-200 shadow-md">
          <AlertCircle className="w-10 h-10 mx-auto text-rose-600" />
          <h3 className="text-lg font-bold text-slate-900">{isHi ? 'मूल्यांकन त्रुटि' : 'Appraisal Error'}</h3>
          <p className="text-xs text-rose-700 bg-rose-50 p-3.5 rounded-xl border border-rose-200 leading-relaxed font-medium">
            {error}
          </p>
          <div className="flex gap-3 justify-center pt-2">
            <button
              type="button"
              onClick={() => navigate('/assess')}
              className="gd-btn-secondary text-xs px-4 py-2"
            >
              {isHi ? 'वापस जाएं' : 'Return to Form'}
            </button>
            <button
              type="button"
              onClick={run}
              className="gd-btn-primary text-xs px-4 py-2 flex items-center gap-1.5"
            >
              <RefreshCw className="w-3.5 h-3.5" />
              {isHi ? 'पुनः प्रयास' : 'Retry'}
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
