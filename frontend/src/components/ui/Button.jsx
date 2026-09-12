import React from 'react';
import { Link } from 'react-router-dom';

/**
 * Standardized Modern Button Component for GramDisha AI
 * High-end elevation, refined pill/rounded geometry, and crisp icon rhythm.
 */
export default function Button({
  children,
  variant = 'primary',
  size = 'md',
  to,
  href,
  onClick,
  type = 'button',
  disabled = false,
  className = '',
  icon: Icon,
  iconPosition = 'right',
  fullWidth = false,
  ...props
}) {
  const baseClasses =
    'inline-flex items-center justify-center font-bold rounded-2xl transition-all duration-200 select-none cursor-pointer text-center';

  const sizeClasses = {
    sm: 'px-4 py-2 min-h-[40px] text-xs gap-2',
    md: 'px-5 py-2.5 min-h-[46px] text-sm gap-2.5',
    lg: 'px-7 py-3.5 min-h-[52px] text-base gap-3 shadow-md hover:shadow-lg',
  };

  const variantClasses = {
    primary:
      'bg-gradient-to-r from-emerald-600 to-emerald-700 hover:from-emerald-700 hover:to-emerald-800 active:from-emerald-800 active:to-emerald-900 text-white shadow-sm hover:-translate-y-0.5 active:translate-y-0 border border-emerald-500/30',
    secondary:
      'bg-white hover:bg-slate-50 active:bg-slate-100 text-slate-900 border border-slate-200 hover:border-slate-300 shadow-xs hover:-translate-y-0.5 active:translate-y-0',
    outline:
      'bg-transparent hover:bg-slate-100/80 text-slate-800 border border-slate-300',
    danger:
      'bg-gradient-to-r from-red-600 to-red-700 hover:from-red-700 hover:to-red-800 text-white shadow-sm',
  };

  const widthClass = fullWidth ? 'w-full' : '';
  const disabledClass = disabled
    ? 'opacity-50 cursor-not-allowed pointer-events-none'
    : '';

  const combinedClasses = `${baseClasses} ${sizeClasses[size] || sizeClasses.md} ${
    variantClasses[variant] || variantClasses.primary
  } ${widthClass} ${disabledClass} ${className}`.trim();

  const iconElement = Icon ? (
    <Icon
      className={`shrink-0 ${
        size === 'sm' ? 'w-4 h-4' : size === 'lg' ? 'w-5 h-5' : 'w-4.5 h-4.5'
      } ${
        iconPosition === 'right'
          ? 'transition-transform group-hover:translate-x-0.5'
          : ''
      }`}
    />
  ) : null;

  const content = (
    <>
      {Icon && iconPosition === 'left' && iconElement}
      <span className="leading-snug inline-block">{children}</span>
      {Icon && iconPosition === 'right' && iconElement}
    </>
  );

  if (to) {
    return (
      <Link to={to} className={`group ${combinedClasses}`} {...props}>
        {content}
      </Link>
    );
  }

  if (href) {
    return (
      <a href={href} className={`group ${combinedClasses}`} {...props}>
        {content}
      </a>
    );
  }

  return (
    <button
      type={type}
      onClick={onClick}
      disabled={disabled}
      className={`group ${combinedClasses}`}
      {...props}
    >
      {content}
    </button>
  );
}
