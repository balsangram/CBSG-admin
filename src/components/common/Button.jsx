import React from 'react';
import { cn } from '../../utils/helpers';
import ButtonLoader from './ButtonLoader';

export function Button({
  children,
  type = 'button',
  variant = 'primary', // 'primary' (auth dark brown), 'blue' (dashboard blue), 'secondary', 'outline', 'ghost', 'danger'
  size = 'md', // 'sm', 'md', 'lg'
  fullWidth = false,
  loading = false,
  disabled = false,
  icon: Icon = null,
  iconPosition = 'left',
  onClick,
  className = '',
  ...props
}) {
  const baseClasses =
    'relative inline-flex items-center justify-center font-medium transition-all duration-200 select-none focus:outline-none focus:ring-2 focus:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-60 cursor-pointer active:scale-[0.99]';

  const sizeClasses = {
    sm: 'text-xs px-3 py-1.5 rounded-lg gap-1.5',
    md: 'text-sm px-4 py-2.5 rounded-xl gap-2',
    lg: 'text-base px-6 py-3.5 rounded-2xl gap-2.5',
  }[size] || 'text-sm px-4 py-2.5 rounded-xl gap-2';

  const variantClasses = {
    primary:
      'bg-[#2e1c16] hover:bg-[#1f120e] text-white shadow-sm focus:ring-[#2e1c16]/30',
    blue:
      'bg-blue-600 hover:bg-blue-700 text-white shadow-sm focus:ring-blue-500/30',
    secondary:
      'bg-slate-100 hover:bg-slate-200 text-slate-800 focus:ring-slate-400/20',
    outline:
      'border border-slate-300 hover:bg-slate-50 text-slate-700 focus:ring-slate-400/20',
    ghost:
      'text-slate-600 hover:text-slate-900 hover:bg-slate-100 focus:ring-slate-300/20',
    danger:
      'bg-rose-600 hover:bg-rose-700 text-white shadow-sm focus:ring-rose-500/30',
  }[variant] || 'bg-[#2e1c16] hover:bg-[#1f120e] text-white shadow-sm';

  const widthClass = fullWidth ? 'w-full' : '';

  return (
    <button
      type={type}
      disabled={disabled || loading}
      onClick={onClick}
      className={cn(baseClasses, sizeClasses, variantClasses, widthClass, className)}
      {...props}
    >
      {loading ? (
        <>
          <ButtonLoader
            size={size === 'sm' ? 'xs' : 'sm'}
            color="white"
          />
          <span>{children}</span>
        </>
      ) : (
        <>
          {Icon && iconPosition === 'left' && <Icon className="w-4 h-4 shrink-0" />}
          <span>{children}</span>
          {Icon && iconPosition === 'right' && <Icon className="w-4 h-4 shrink-0" />}
        </>
      )}
    </button>
  );
}

export default Button;

