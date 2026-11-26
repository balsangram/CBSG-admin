import React from 'react';
import { cn } from '../../utils/helpers';

// Uniform scale factors — the loader's internal design is a fixed 300x100 box
const SIZE_SCALE = {
  xs: 0.35,
  sm: 0.45,
  md: 0.6,
  lg: 0.9,
  xl: 1.3,
};

const COLOR_HEX = {
  current: 'currentColor',
  white: '#ffffff',
  primary: '#2e1c16',
  blue: '#2563eb',
  amber: '#d97706',
};

export function Loader({ size = 'md', color = 'current', className = '' }) {
  const scale = SIZE_SCALE[size] || SIZE_SCALE.md;
  const barColor = COLOR_HEX[color] || COLOR_HEX.current;

  return (
    <div
      role="status"
      aria-label="Loading"
      className={cn('wave-loader', className)}
      style={{
        width: 300 * scale,
        height: 100 * scale,
        '--wl-color': barColor,
      }}
    >
      <div
        className="wave-loader__inner"
        style={{ transform: `translate(-50%, -50%) scale(${scale})` }}
      >
        <span className="wave-loader__bar" />
        <span className="wave-loader__bar" />
        <span className="wave-loader__bar" />
        <span className="wave-loader__bar" />
      </div>
      <span className="sr-only">Loading...</span>
    </div>
  );
}

export default Loader;
