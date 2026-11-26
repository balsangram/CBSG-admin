import React from 'react';
import { cn } from '../../utils/helpers';

/**
 * Shimmer skeleton card — placeholder while content loads.
 * Adapted from Uiverse.io neat-goat-26, themed to the cream palette.
 */
export function SkeletonCard({ className = '' }) {
  return (
    <div className={cn('sk-card', className)} aria-hidden="true">
      <div className="sk-skeleton sk-title" />
      <div className="sk-skeleton sk-description" />
    </div>
  );
}

export default SkeletonCard;
