import React from 'react';
import { useTranslation } from 'react-i18next';
import { Info, Calculator, FileCheck, Database, Sparkles } from 'lucide-react';

/**
 * Quiet Data-Provenance Indicator
 * Restrained, neutral metadata marker signaling data derivation methodology.
 */
export default function ProvenanceBadge({ type = 'calculated', className = '' }) {
  const { i18n } = useTranslation();
  const isHi = i18n.language === 'hi';

  const configs = {
    calculated: {
      label: isHi ? 'सूत्र गणना' : 'Formula Derived',
      desc: isHi ? 'भारतीय रिजर्व बैंक व वित्तीय सूत्रों द्वारा सत्यापित' : 'Calculated via standard banking amortization models',
      icon: Calculator,
    },
    official_rule: {
      label: isHi ? 'योजना नियम' : 'Govt Rule Mandate',
      desc: isHi ? 'मुद्रा / नाबार्ड आधिकारिक दिशानिर्देश' : 'Official scheme guideline parameter (PMMY / NABARD)',
      icon: FileCheck,
    },
    prototype: {
      label: isHi ? 'क्षेत्र सर्वेक्षण' : 'Regional Survey',
      desc: isHi ? 'ग्रामीण बाजार व हाट सर्वेक्षण डेटा' : 'Local catchment market benchmark',
      icon: Database,
    },
    ai_advisory: {
      label: isHi ? 'विश्लेषण सलाह' : 'Advisory Note',
      desc: isHi ? 'स्थानिक व क्षेत्रीय परिस्थितियों का विश्लेषण' : 'Strategic market insights tailored to location',
      icon: Sparkles,
    },
  };

  const config = configs[type] || configs.calculated;
  const Icon = config.icon;

  return (
    <span
      title={config.desc}
      className={`inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-md text-[11px] font-medium bg-slate-100 text-slate-600 border border-slate-200 cursor-help select-none shrink-0 ${className}`}
    >
      <Icon className="w-3 h-3 text-slate-500 shrink-0" />
      <span>{config.label}</span>
    </span>
  );
}
