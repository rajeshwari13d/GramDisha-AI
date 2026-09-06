import React, { useState, useEffect, useContext } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { CheckCircle2, Loader2, AlertCircle, RefreshCw } from 'lucide-react';
import { AnalysisContext } from '../App';
import { analyzeBusinessFull } from '../services/api';

export default function Processing() {
  const { t, i18n } = useTranslation();
  const navigate = useNavigate();
  const location = useLocation();
  const { setAnalysis, formData } = useContext(AnalysisContext);
  const isHi = i18n.language === 'hi';

  const requestData = location.state || formData;

  const steps = [
    { key: 'profile', text: t('processing.steps.profile') },
    { key: 'location', text: t('processing.steps.location') },
    { key: 'market', text: t('processing.steps.market') },
    { key: 'competition', text: t('processing.steps.competition') },
    { key: 'financing', text: t('processing.steps.financing') },
    { key: 'loan', text: t('processing.steps.loan') },
    { key: 'risks', text: t('processing.steps.risks') },
    { key: 'strategy', text: t('processing.steps.strategy') },
    { key: 'viability', text: t('processing.steps.viability') },
  ];

  const [currentStep, setCurrentStep] = useState(0);
  const [completedSteps, setCompletedSteps] = useState([]);
  const [error, setError] = useState(null);

  const runAnalysis = async () => {
    if (!requestData) {
      navigate('/assess');
      return;
    }

    setError(null);
    setCurrentStep(0);
    setCompletedSteps([]);

    // Step ticker timer
    const stepInterval = setInterval(() => {
      setCurrentStep((prev) => {
        if (prev < steps.length - 1) {
          setCompletedSteps((done) => [...done, prev]);
          return prev + 1;
        }
        return prev;
      });
    }, 450);

    try {
      const response = await analyzeBusinessFull({
        ...requestData,
        language: i18n.language === 'hi' ? 'hi' : 'en',
      });

      clearInterval(stepInterval);
      setCompletedSteps(steps.map((_, i) => i));
      setCurrentStep(steps.length);

      if (response.data?.success) {
        setAnalysis(response.data);
        setTimeout(() => {
          navigate('/dashboard');
        }, 500);
      } else {
        setError(response.data?.message || t('processing.error'));
      }
    } catch (err) {
      clearInterval(stepInterval);
      const errMsg =
        err.response?.data?.message ||
        err.message ||
        t('processing.error');
      setError(errMsg);
    }
  };

  useEffect(() => {
    runAnalysis();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <div className="min-h-[75vh] flex items-center justify-center px-4 py-8 sm:py-12">
      <div className="w-full max-w-md gd-card p-6 sm:p-8 text-center space-y-6">
        {!error ? (
          <>
            <div className="w-14 h-14 mx-auto rounded-xl bg-[var(--color-surface-subtle)] border border-[var(--color-border)] text-[var(--color-positive)] flex items-center justify-center">
              <Loader2 className="w-7 h-7 animate-spin" />
            </div>

            <div className="space-y-1">
              <h2 className="text-xl sm:text-2xl font-bold text-[var(--color-text)]">
                {t('processing.title')}
              </h2>
              <p className="text-xs text-[var(--color-text-muted)]">
                {isHi
                  ? 'गणितीय वित्तीय मॉडल एवं एआई रणनीतिक विश्लेषण जारी है'
                  : 'Deterministic models & strategic advisory processing'}
              </p>
            </div>

            {/* Steps List */}
            <div className="space-y-2 text-left pt-2">
              {steps.map((step, idx) => {
                const isDone = completedSteps.includes(idx);
                const isCurrent = currentStep === idx;
                return (
                  <div
                    key={step.key}
                    className={`flex items-center gap-3 p-2.5 rounded-lg text-xs sm:text-sm font-medium transition-colors ${
                      isDone
                        ? 'bg-[var(--color-positive-bg)] text-[var(--color-positive)]'
                        : isCurrent
                        ? 'bg-[var(--color-caution-bg)] text-[var(--color-caution)] font-bold'
                        : 'text-[var(--color-text-subtle)] opacity-50'
                    }`}
                  >
                    {isDone ? (
                      <CheckCircle2 className="w-4 h-4 text-[var(--color-positive)] shrink-0" />
                    ) : isCurrent ? (
                      <Loader2 className="w-4 h-4 text-[var(--color-caution)] animate-spin shrink-0" />
                    ) : (
                      <div className="w-4 h-4 rounded-full border border-[var(--color-border)] shrink-0" />
                    )}
                    <span className="flex-1 truncate">{step.text}</span>
                  </div>
                );
              })}
            </div>
          </>
        ) : (
          <div className="space-y-5 py-2">
            <div
              className="w-14 h-14 mx-auto rounded-xl flex items-center justify-center"
              style={{
                backgroundColor: 'var(--color-negative-bg)',
                color: 'var(--color-negative)',
              }}
            >
              <AlertCircle className="w-7 h-7" />
            </div>

            <div className="space-y-1">
              <h3 className="text-lg font-bold text-[var(--color-text)]">
                {isHi ? 'विश्लेषण में त्रुटि' : 'Analysis Interrupted'}
              </h3>
              <p
                className="text-xs p-3 rounded-lg border leading-relaxed"
                style={{
                  backgroundColor: 'var(--color-negative-bg)',
                  color: 'var(--color-negative)',
                  borderColor: 'var(--color-negative-border)',
                }}
              >
                {error}
              </p>
            </div>

            <div className="flex flex-col sm:flex-row gap-2.5 justify-center pt-2">
              <button
                onClick={() => navigate('/assess')}
                className="gd-btn-secondary text-xs min-h-[40px]"
              >
                {isHi ? 'विवरण बदलें' : 'Edit Input'}
              </button>
              <button
                onClick={runAnalysis}
                className="gd-btn-primary text-xs min-h-[40px]"
              >
                <RefreshCw className="w-3.5 h-3.5" />
                <span>{t('processing.retry')}</span>
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
