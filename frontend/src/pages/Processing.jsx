import React, { useState, useEffect, useContext } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { CheckCircle2, Loader2, AlertCircle, RefreshCw } from 'lucide-react';
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
    { key: 'market', label: isHi ? 'बाजार जांच' : 'Market check' },
    { key: 'finance', label: isHi ? 'लोन गणना' : 'Loan calculation' },
    { key: 'risk', label: isHi ? 'जोखिम विश्लेषण' : 'Risk analysis' },
    { key: 'verdict', label: isHi ? 'अंतिम निर्णय' : 'Final verdict' },
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
      if (res.data?.success) { setAnalysis(res.data); setTimeout(() => navigate('/dashboard'), 400); }
      else setError(res.data?.message || 'Error');
    } catch (e) {
      clearInterval(timer);
      setError(e.response?.data?.message || e.message || 'Connection error');
    }
  };

  useEffect(() => { run(); }, []);

  return (
    <div className="w-full max-w-sm mx-auto px-4 py-16 text-center space-y-6">
      {!error ? (
        <>
          <Loader2 className="w-10 h-10 mx-auto text-emerald-700 animate-spin" />
          <h2 className="text-lg font-bold text-gray-900">
            {isHi ? 'विश्लेषण जारी है...' : 'Analyzing...'}
          </h2>
          <div className="space-y-2 text-left">
            {steps.map((s, i) => {
              const isDone = done.includes(i);
              const isCur = currentStep === i;
              return (
                <div key={s.key} className={`flex items-center gap-2.5 px-3 py-2 rounded-lg text-sm font-medium ${
                  isDone ? 'text-emerald-800 bg-emerald-50' : isCur ? 'text-amber-800 bg-amber-50 font-bold' : 'text-gray-400'
                }`}>
                  {isDone ? <CheckCircle2 className="w-4 h-4 text-emerald-600" /> :
                   isCur ? <Loader2 className="w-4 h-4 text-amber-600 animate-spin" /> :
                   <div className="w-4 h-4 rounded-full border border-gray-300" />}
                  <span>{s.label}</span>
                </div>
              );
            })}
          </div>
        </>
      ) : (
        <>
          <AlertCircle className="w-10 h-10 mx-auto text-red-500" />
          <h3 className="text-lg font-bold">{isHi ? 'त्रुटि हुई' : 'Error'}</h3>
          <p className="text-sm text-red-700 bg-red-50 p-3 rounded-lg">{error}</p>
          <div className="flex gap-2 justify-center">
            <button onClick={() => navigate('/assess')} className="px-4 py-2 rounded-lg bg-white border border-gray-300 text-sm font-bold cursor-pointer">
              {isHi ? 'वापस जाएं' : 'Go Back'}
            </button>
            <button onClick={run} className="px-4 py-2 rounded-lg bg-emerald-800 text-white text-sm font-bold cursor-pointer flex items-center gap-1.5">
              <RefreshCw className="w-3.5 h-3.5" />{isHi ? 'पुनः प्रयास' : 'Retry'}
            </button>
          </div>
        </>
      )}
    </div>
  );
}
