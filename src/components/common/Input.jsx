import React, { forwardRef } from 'react';
import { cn } from '../../utils/helpers';

export const Input = forwardRef(function Input(
  {
    label,
    error,
    helperText,
    icon: Icon = null,
    rightAction = null,
    type = 'text',
    className = '',
    containerClassName = '',
    id,
    disabled = false,
    ...props
  },
  ref
) {
  const inputId = id || props.name || undefined;

  return (
    <div className={cn('w-full flex flex-col gap-1.5', containerClassName)}>
      {label && (
        <label
          htmlFor={inputId}
          className="text-xs font-semibold text-stone-700 tracking-wide select-none"
        >
          {label}
        </label>
      )}

      <div className="relative flex items-center">
        {Icon && (
          <div className="absolute left-3.5 text-stone-400 pointer-events-none flex items-center justify-center">
            <Icon className="w-4 h-4" />
          </div>
        )}

        <input
          ref={ref}
          id={inputId}
          type={type}
          disabled={disabled}
          className={cn(
            'w-full bg-white text-stone-900 placeholder:text-stone-400 text-sm rounded-xl border transition-all duration-200 outline-none',
            'py-3 px-4 shadow-2xs',
            Icon ? 'pl-10' : 'pl-4',
            rightAction ? 'pr-11' : 'pr-4',
            error
              ? 'border-rose-400 focus:border-rose-500 focus:ring-3 focus:ring-rose-500/15'
              : 'border-stone-200 hover:border-stone-300 focus:border-stone-400 focus:ring-3 focus:ring-stone-400/15',
            disabled && 'bg-stone-50 cursor-not-allowed opacity-70',
            className
          )}
          {...props}
        />

        {rightAction && (
          <div className="absolute right-3.5 flex items-center justify-center text-stone-400">
            {rightAction}
          </div>
        )}
      </div>

      {error ? (
        <p className="text-xs text-rose-600 font-medium flex items-center gap-1 mt-0.5 animate-fadeIn">
          <svg className="w-3.5 h-3.5 shrink-0" viewBox="0 0 20 20" fill="currentColor">
            <path
              fillRule="evenodd"
              d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z"
              clipRule="evenodd"
            />
          </svg>
          {error}
        </p>
      ) : helperText ? (
        <p className="text-xs text-stone-500 mt-0.5">{helperText}</p>
      ) : null}
    </div>
  );
});

export default Input;

