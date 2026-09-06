import React from 'react';

export default function ScoreGauge({ score = 0, size = 180, strokeWidth = 12, label = '', tier = '' }) {
  const radius = (size - strokeWidth) / 2;
  const circumference = 2 * Math.PI * radius;
  // Semi-circle gauge (180 degrees)
  const arcLength = Math.PI * radius;
  const safeScore = Math.max(0, Math.min(100, Math.round(score)));
  const offset = arcLength - (safeScore / 100) * arcLength;

  // Semantic color token mapping (Green / Amber / Red only)
  let color = 'var(--color-positive)';
  let bgColor = 'var(--color-positive-bg)';
  let borderColor = 'var(--color-positive-border)';

  if (safeScore < 50) {
    color = 'var(--color-negative)';
    bgColor = 'var(--color-negative-bg)';
    borderColor = 'var(--color-negative-border)';
  } else if (safeScore < 75) {
    color = 'var(--color-caution)';
    bgColor = 'var(--color-caution-bg)';
    borderColor = 'var(--color-caution-border)';
  }

  return (
    <div className="flex flex-col items-center justify-center relative select-none">
      <div style={{ width: size, height: size / 2 + 16 }} className="relative flex justify-center items-end overflow-hidden">
        <svg
          width={size}
          height={size}
          viewBox={`0 0 ${size} ${size}`}
          className="transform -rotate-180"
          style={{ position: 'absolute', top: 0 }}
          aria-hidden="true"
        >
          {/* Background Arc */}
          <circle
            cx={size / 2}
            cy={size / 2}
            r={radius}
            fill="none"
            stroke="var(--color-surface-muted)"
            strokeWidth={strokeWidth}
            strokeDasharray={`${arcLength} ${circumference}`}
            strokeLinecap="round"
          />
          {/* Active Value Arc */}
          <circle
            cx={size / 2}
            cy={size / 2}
            r={radius}
            fill="none"
            stroke={color}
            strokeWidth={strokeWidth}
            strokeDasharray={`${arcLength} ${circumference}`}
            strokeDashoffset={offset}
            strokeLinecap="round"
            className="transition-all duration-700 ease-out"
          />
        </svg>
        <div className="flex flex-col items-center z-10 pb-1">
          <span className="text-4xl sm:text-5xl font-extrabold tracking-tight tabular-nums" style={{ color }}>
            {safeScore}
          </span>
          <span className="text-xs uppercase font-semibold text-[var(--color-text-subtle)]">/ 100</span>
        </div>
      </div>
      {label && <p className="mt-2 text-sm font-semibold text-[var(--color-text)] text-center">{label}</p>}
      {tier && (
        <span
          className="mt-1.5 px-3 py-0.5 rounded-full text-xs font-bold uppercase tracking-wider border"
          style={{ backgroundColor: bgColor, color, borderColor }}
        >
          {tier}
        </span>
      )}
    </div>
  );
}
