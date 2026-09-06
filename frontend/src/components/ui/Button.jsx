import React from 'react';
import { Link } from 'react-router-dom';

/**
 * Standardized Button Component for GramDisha AI
 * Professionally proportioned heights, padding, and icon spacing.
 *
 * Sizes:
 * - 'sm': px-4 py-2 min-h-[38px] text-xs font-bold gap-2 (Navbar, compact actions)
 * - 'md': px-5 py-2.5 min-h-[44px] text-sm font-bold gap-2.5 (Detail bands, wizard navigation)
 * - 'lg': px-7 py-3.5 min-h-[50px] text-base font-bold gap-3 (Hero CTA, primary submit)
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
    'inline-flex items-center justify-center font-bold rounded-xl transition-all duration-150 select-none cursor-pointer text-center';

  const sizeClasses = {
    sm: 'px-4 py-2 min-h-[38px] text-xs gap-2',
    md: 'px-5 py-2.5 min-h-[44px] text-sm gap-2.5',
    lg: 'px-7 py-3.5 min-h-[50px] text-base gap-3',
  };

  const variantClasses = {
    primary:
      'bg-[#1B5E20] hover:bg-[#144919] active:bg-[#0E3612] text-white shadow-xs hover:shadow-md hover:-translate-y-0.5 active:translate-y-0 border border-transparent',
    secondary:
      'bg-white hover:bg-[#F4EFEB] active:bg-[#EBE3D7] text-[#1C1917] border border-[#DCD3C5] hover:border-[#BCB09F] shadow-xs',
    outline:
      'bg-transparent hover:bg-[#F4EFEB] text-[#1C1917] border border-[#DCD3C5]',
    danger:
      'bg-[#B91C1C] hover:bg-[#991B1B] text-white shadow-xs',
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
        size === 'sm' ? 'w-3.5 h-3.5' : size === 'lg' ? 'w-4.5 h-4.5' : 'w-4 h-4'
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
