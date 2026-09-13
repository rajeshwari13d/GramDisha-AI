import React from 'react';
import { Link } from 'react-router-dom';

/**
 * Institutional Button Component for GramDisha AI
 * Credible banking authority with deep institutional green and crisp typography.
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
    'inline-flex items-center justify-center font-bold rounded-lg transition-all duration-150 select-none cursor-pointer text-center';

  const sizeClasses = {
    sm: 'px-3.5 py-1.5 min-h-[38px] text-xs gap-1.5',
    md: 'px-5 py-2.5 min-h-[44px] text-sm gap-2',
    lg: 'px-6 py-3 min-h-[48px] text-base gap-2.5 shadow-xs',
  };

  const variantClasses = {
    primary:
      'bg-[#144A38] hover:bg-[#0E3B2C] active:bg-[#092B20] text-white shadow-xs border border-[#0D382B]',
    secondary:
      'bg-white hover:bg-[#F2EEE5] active:bg-[#EAE4D6] text-[#1B221E] border border-[#C7BCA9] shadow-2xs',
    outline:
      'bg-transparent hover:bg-[#F2EEE5] text-[#1B221E] border border-[#C7BCA9]',
    danger:
      'bg-[#BA1A1A] hover:bg-[#961212] text-white shadow-xs border border-[#800F0F]',
  };

  const widthClass = fullWidth ? 'w-full' : '';
  const disabledClass = disabled
    ? 'opacity-40 cursor-not-allowed pointer-events-none'
    : '';

  const combinedClasses = `${baseClasses} ${sizeClasses[size] || sizeClasses.md} ${
    variantClasses[variant] || variantClasses.primary
  } ${widthClass} ${disabledClass} ${className}`.trim();

  const iconElement = Icon ? (
    <Icon
      className={`shrink-0 ${
        size === 'sm' ? 'w-3.5 h-3.5' : size === 'lg' ? 'w-4.5 h-4.5' : 'w-4 h-4'
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
