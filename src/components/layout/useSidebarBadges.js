import { useMemo } from 'react';
import { ROUTES } from '../../utils/constants';

/**
 * Pending-count badges for sidebar items, keyed by route path.
 * Placeholder values — swap for real API data later without touching the UI.
 */
const DEFAULT_BADGES = {
  [ROUTES.KYC_QUEUE]: { count: '2', variant: 'warning' },
  [ROUTES.PAYOUT_MANAGEMENT]: { count: '1', variant: 'warning' },
};

export function useSidebarBadges(overrides = {}) {
  return useMemo(() => ({ ...DEFAULT_BADGES, ...overrides }), [overrides]);
}

export default useSidebarBadges;
