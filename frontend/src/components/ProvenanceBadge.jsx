import React from 'react';
import { useTranslation } from 'react-i18next';
import { ShieldCheck, Database, Sparkles, BookOpen } from 'lucide-react';

export default function ProvenanceBadge({ type = 'calculated', className = '' }) {
  const { i18n } = useTranslation();
  const isHi = i18n.language === 'hi';

  const badgeConfigs = {
    calculated: {
      label: isHi ? 'गणित द्वारा सत्यापित' : 'Calculated',
      desc: isHi ? 'शुद्ध वित्तीय सूत्रों से गणितीय गणना' : 'Computed by deterministic formula',
      icon: ShieldCheck,
      style: {
        backgroundColor: 'var(--color-positive-bg)',
        color: 'var(--color-positive)',
        borderColor: 'var(--color-positive-border)',
      },
    },
    official_rule: {
      label: isHi ? 'आधिकारिक योजना नियम' : 'Official Scheme Rule',
      desc: isHi ? 'सरकारी योजना मानदंडों पर आधारित' : 'RBI / Scheme official parameter',
      icon: BookOpen,
      style: {
        backgroundColor: 'var(--color-rule-bg)',
        color: 'var(--color-rule)',
        borderColor: 'var(--color-rule-border)',
      },
    },
    prototype: {
      label: isHi ? 'प्रोटोटाइप डेटा' : 'Prototype Demo Data',
      desc: isHi ? 'प्रदर्शन हेतु सांकेतिक डेटा' : 'Curated local baseline data',
      icon: Database,
      style: {
        backgroundColor: 'var(--color-caution-bg)',
        color: 'var(--color-caution)',
        borderColor: 'var(--color-caution-border)',
      },
    },
    ai_advisory: {
      label: isHi ? 'एआई रणनीतिक सलाह' : 'AI Advisory',
      desc: isHi ? 'कृत्रिम बुद्धिमत्ता आधारित विश्लेषण' : 'Contextual AI synthesis',
      icon: Sparkles,
      style: {
        backgroundColor: 'var(--color-advisory-bg)',
        color: 'var(--color-advisory)',
        borderColor: 'var(--color-advisory-border)',
      },
    },
  };

  const config = badgeConfigs[type] || badgeConfigs.calculated;
  const Icon = config.icon;

  return (
    <span
      title={config.desc}
      style={config.style}
      className={`inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-[11px] sm:text-xs font-semibold border transition-opacity cursor-help select-none shrink-0 ${className}`}
    >
      <Icon className="w-3.5 h-3.5 shrink-0" />
      <span className="whitespace-nowrap">{config.label}</span>
    </span>
  );
}
