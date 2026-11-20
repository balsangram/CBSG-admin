import React from 'react';
import { cn } from '../../utils/helpers';

export function Loader({ size = 'md', color = 'current', className = '' }) {
  const sizeClasses = {
    xs: 'w-3.5 h-3.5 border-2',
    sm: 'w-4 h-4 border-2',
    md: 'w-5 h-5 border-2',
    lg: 'w-8 h-8 border-3',
    xl: 'w-12 h-12 border-4',
  }[size] || 'w-5 h-5 border-2';

  const colorClasses = {
    current: 'border-current border-t-transparent',
    white: 'border-white border-t-transparent',
    primary: 'border-[#2e1c16] border-t-transparent',
    blue: 'border-blue-600 border-t-transparent',
    amber: 'border-amber-500 border-t-transparent',
  }[color] || 'border-current border-t-transparent';

  return (
    <div
      role="status"
      aria-label="Loading"
      className={cn('inline-block animate-spin rounded-full', sizeClasses, colorClasses, className)}
    >
      <span className="sr-only">Loading...</span>
    </div>
  );
}

export default Loader;

