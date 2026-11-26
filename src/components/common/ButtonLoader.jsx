// From Uiverse.io by Li-Deheng - https://uiverse.io/Li-Deheng/bright-firefox-37
// MIT License, Copyright (c) Li-Deheng (李德恒)

import React from 'react';
import { cn } from '../../utils/helpers';

const SIZE_PX = {
  xs: 12,
  sm: 16,
  md: 20,
  lg: 28,
};

/**
 * Compact 4-circle pulse loader sized for buttons.
 * Renders the Uiverse "bright-firefox" circles scaled via CSS var.
 */
export function ButtonLoader({ size = 'sm', color = 'currentColor', className = '' }) {
  const px = SIZE_PX[size] || SIZE_PX.sm;
  const scale = px / 20; // design unit is 20px per circle

  return (
    <div
      role="status"
      aria-label="Loading"
      className={cn('button-loader inline-flex items-center', className)}
      style={{ '--bl-color': color, '--bl-scale': scale }}
    >
      {[0, 1, 2, 3].map((i) => (
        <span key={i} className="button-loader__circle" style={{ animationDelay: `${i * 0.3}s` }}>
          <span className="button-loader__dot" style={{ animationDelay: `${i * 0.3}s` }} />
          <span
            className="button-loader__outline"
            style={{ animationDelay: `${0.9 + i * 0.3}s` }}
          />
        </span>
      ))}
      <span className="sr-only">Loading...</span>
    </div>
  );
}

export default ButtonLoader;
