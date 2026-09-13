import React from 'react';
import { useTranslation } from 'react-i18next';

/**
 * High-Impact Radial Viability Gauge
 * The central focal point of the Viability Appraisal Dashboard.
 *
 * @param {number} score - Viability score out of 100
 * @param {string} state - RECOMMENDED, RECOMMENDED_WITH_CONDITIONS, NOT_RECOMMENDED
 */
export default function RadialGauge({ score = 0, state = 'RECOMMENDED_WITH_CONDITIONS', size = 260 }) {
  const { i18n } = useTranslation();
  const isHi = i18n.language === 'hi';

  const clampedScore = Math.max(0, Math.min(100, Number(score) || 0));
  
  // Radial calculations for 220-degree gauge arc
  const radius = 96;
  const circumference = 2 * Math.PI * radius;
  // Arc spans 240 degrees (from 150 to 390)
  const arcLength = circumference * (240 / 360);
  const strokeDashoffset = arcLength - (arcLength * clampedScore) / 100;

  // Semantic verdict configuration
  let verdictColor = '#157347'; // Recommended Green
  let verdictText = isHi ? 'अनुशंसित (व्यावहारिक)' : 'Appraised Viable';
  let badgeBg = '#EBF7EE';
  let badgeBorder = '#B7E4C7';

  if (state === 'NOT_RECOMMENDED' || clampedScore < 50) {
    verdictColor = '#BA1A1A'; // High Risk Red
    verdictText = isHi ? 'उच्च वित्तीय जोखिम (अस्वीकृत)' : 'High Risk / Not Recommended';
    badgeBg = '#FDF2F2';
    badgeBorder = '#F8B6B6';
  } else if (state === 'RECOMMENDED_WITH_CONDITIONS' || clampedScore < 75) {
    verdictColor = '#C25E00'; // Terracotta / Amber Caution
    verdictText = isHi ? 'शर्तों के साथ व्यावहारिक' : 'Viable with Conditions';
    badgeBg = '#FEF7E6';
    badgeBorder = '#FCDA9C';
  }

  return (
    <div className="flex flex-col items-center justify-center text-center select-none py-2">
      <div className="relative flex items-center justify-center" style={{ width: size, height: size * 0.88 }}>
        <svg
          width={size}
          height={size * 0.88}
          viewBox="0 0 240 210"
          className="overflow-visible"
        >
          {/* Background Track Arc */}
          <path
            d="M 36 170 A 96 96 0 1 1 204 170"
            fill="none"
            stroke="#E7E0D3"
            strokeWidth="14"
            strokeLinecap="round"
          />

          {/* Value Progress Arc with Terracotta/Emerald gradient */}
          <path
            d="M 36 170 A 96 96 0 1 1 204 170"
            fill="none"
            stroke={verdictColor}
            strokeWidth="14"
            strokeLinecap="round"
            strokeDasharray={`${arcLength} ${circumference}`}
            strokeDashoffset={strokeDashoffset}
            className="transition-all duration-1000 ease-out"
          />

          {/* Scale Marker Ticks */}
          <text x="34" y="195" fontSize="10" fill="#77837C" fontWeight="600" textAnchor="middle">0</text>
          <text x="70" y="70" fontSize="10" fill="#77837C" fontWeight="600" textAnchor="middle">25</text>
          <text x="120" y="42" fontSize="10" fill="#77837C" fontWeight="600" textAnchor="middle">50</text>
          <text x="170" y="70" fontSize="10" fill="#77837C" fontWeight="600" textAnchor="middle">75</text>
          <text x="206" y="195" fontSize="10" fill="#77837C" fontWeight="600" textAnchor="middle">100</text>
        </svg>

        {/* Central Core Score Lockup */}
        <div className="absolute inset-0 flex flex-col items-center justify-center pt-5">
          <span className="text-[11px] font-bold text-[#525B56] uppercase tracking-widest leading-none mb-1">
            {isHi ? 'व्यवहार्यता स्कोर' : 'Viability Index'}
          </span>
          <div className="flex items-baseline gap-1 font-serif">
            <span className="text-5xl sm:text-6xl font-black text-[#1B221E] tracking-tight tabular-nums leading-none">
              {clampedScore}
            </span>
            <span className="text-lg font-bold text-[#77837C]">/100</span>
          </div>
          
          {/* Institutional Verdict Chip */}
          <div
            style={{ backgroundColor: badgeBg, borderColor: badgeBorder, color: verdictColor }}
            className="mt-3 px-3 py-1 rounded-full text-xs font-bold border flex items-center gap-1.5 shadow-2xs"
          >
            <span className="w-1.5 h-1.5 rounded-full" style={{ backgroundColor: verdictColor }} />
            <span>{verdictText}</span>
          </div>
        </div>
      </div>
    </div>
  );
}
