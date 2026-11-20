import React from 'react';
import { cn } from '../../utils/helpers';

export function Logo({
  variant = 'dark', // 'dark' (on dark brown bg), 'light' (on white/light bg), 'icon-only'
  size = 'md',
  className = '',
}) {
  const isDark = variant === 'dark';

  return (
    <div className={cn('inline-flex items-center gap-3 select-none', className)}>
      {/* CBSG Bar Chart Logo Mark */}
      <div className="relative flex items-end justify-center w-8 h-8 shrink-0">
        <svg
          viewBox="0 0 32 32"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
          className="w-full h-full drop-shadow-sm"
        >
          <defs>
            <linearGradient id="cbsgGrad" x1="0%" y1="100%" x2="100%" y2="0%">
              <stop offset="0%" stopColor="#f59e0b" />
              <stop offset="50%" stopColor="#d97706" />
              <stop offset="100%" stopColor="#b45309" />
            </linearGradient>
            <linearGradient id="cbsgSwoosh" x1="0%" y1="0%" x2="100%" y2="0%">
              <stop offset="0%" stopColor="#f59e0b" stopOpacity="0.4" />
              <stop offset="100%" stopColor="#d97706" />
            </linearGradient>
          </defs>

          {/* Bar 1 */}
          <rect x="4" y="18" width="4.5" height="10" rx="1.5" fill="url(#cbsgGrad)" />
          {/* Bar 2 */}
          <rect x="10.5" y="13" width="4.5" height="15" rx="1.5" fill="url(#cbsgGrad)" />
          {/* Bar 3 */}
          <rect x="17" y="8" width="4.5" height="20" rx="1.5" fill="url(#cbsgGrad)" />
          {/* Bar 4 */}
          <rect x="23.5" y="3" width="4.5" height="25" rx="1.5" fill="url(#cbsgGrad)" />

          {/* Upward curved swoosh base */}
          <path
            d="M 3 28 C 12 29, 22 26, 29 18"
            stroke="url(#cbsgSwoosh)"
            strokeWidth="2.5"
            strokeLinecap="round"
          />
        </svg>
      </div>

      {variant !== 'icon-only' && (
        <div className="flex flex-col">
          <div className="flex items-baseline gap-1.5 leading-none">
            <span
              className={cn(
                'font-extrabold tracking-wider',
                size === 'sm' ? 'text-sm' : size === 'lg' ? 'text-xl' : 'text-base',
                isDark ? 'text-white' : 'text-slate-900'
              )}
            >
              CBSG
            </span>
            <span
              className={cn(
                'font-normal leading-none',
                size === 'sm' ? 'text-xs' : 'text-xs',
                isDark ? 'text-amber-100/80' : 'text-slate-600'
              )}
            >
              Finance Limited
            </span>
          </div>
          <span
            className={cn(
              'font-semibold uppercase tracking-widest mt-1',
              size === 'sm' ? 'text-[9px]' : 'text-[10px]',
              isDark ? 'text-amber-200/60' : 'text-slate-600'
            )}
          >
            ADMIN CONSOLE
          </span>
        </div>
      )}
    </div>
  );
}

export default Logo;

