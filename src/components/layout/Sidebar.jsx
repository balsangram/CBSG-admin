import React, { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import {
  LayoutGrid,
  Users,
  ShieldAlert,
  Landmark,
  Wallet,
  BookOpen,
  Network,
  Receipt,
  Banknote,
  LineChart,
  History,
  Store,
  UserCog,
  Clock,
  Settings as SettingsIcon,
  X,
} from 'lucide-react';
import Logo from '../common/Logo';
import { ROUTES } from '../../utils/constants';
import { SidebarGroup } from './SidebarGroup';
import { useSidebarBadges } from './useSidebarBadges';

// Module-level nav config — `end` marks exact-match routes
const MENU_GROUPS = [
  {
    group: 'Dashboard',
    items: [
      { name: 'Overview', icon: LayoutGrid, path: ROUTES.DASHBOARD, end: true },
    ],
  },
  {
    group: 'Customers',
    items: [
      { name: 'Customer records', icon: Users, path: ROUTES.CUSTOMERS },
      { name: 'KYC queue', icon: ShieldAlert, path: ROUTES.KYC_QUEUE },
    ],
  },
  {
    group: 'Savings',
    items: [
      { name: 'Scheme master', icon: Landmark, path: ROUTES.SCHEME_MASTER },
      { name: 'Deposit accounts', icon: Wallet, path: ROUTES.DEPOSIT_ACCOUNTS },
    ],
  },
  {
    group: 'Collections',
    items: [
      { name: 'Daybook', icon: BookOpen, path: ROUTES.DAYBOOK },
    ],
  },
  {
    group: 'Team & Incentives',
    items: [
      { name: 'Team structure', icon: Network, path: ROUTES.TEAM_STRUCTURE },
      { name: 'Incentive ledger', icon: Receipt, path: ROUTES.INCENTIVE_LEDGER },
      { name: 'Payout management', icon: Banknote, path: ROUTES.PAYOUT_MANAGEMENT },
    ],
  },
  {
    group: 'Reports',
    items: [
      { name: 'Reports & analytics', icon: LineChart, path: ROUTES.REPORTS },
      { name: 'Transaction logs', icon: History, path: ROUTES.TRANSACTION_LOGS },
    ],
  },
  {
    group: 'Administration',
    items: [
      { name: 'Branches', icon: Store, path: ROUTES.BRANCHES },
      { name: 'Users & roles', icon: UserCog, path: ROUTES.USERS_ROLES },
      { name: 'Audit log', icon: Clock, path: ROUTES.AUDIT_LOG },
      { name: 'Settings', icon: SettingsIcon, path: ROUTES.SETTINGS },
    ],
  },
];

export function Sidebar({ mobileOpen, setMobileOpen, collapsed = false }) {
  const badges = useSidebarBadges();
  const [scrollFades, setScrollFades] = useState({ top: false, bottom: false });

  const asideRef = useRef(null);
  const scrollRef = useRef(null);
  const closeBtnRef = useRef(null);
  const lastActiveEl = useRef(null);

  // Merge badge data into items once
  const groups = useMemo(
    () =>
      MENU_GROUPS.map((g, index) => ({
        ...g,
        index,
        items: g.items.map((item) => ({
          ...item,
          badge: badges[item.path] || null,
        })),
      })),
    [badges]
  );

  // Scroll fade indicators
  const updateScrollFades = useCallback(() => {
    const el = scrollRef.current;
    if (!el) return;
    const top = el.scrollTop > 4;
    const bottom = el.scrollHeight - el.scrollTop - el.clientHeight > 4;
    setScrollFades((prev) =>
      prev.top === top && prev.bottom === bottom ? prev : { top, bottom }
    );
  }, []);

  useEffect(() => {
    const frame = requestAnimationFrame(updateScrollFades);
    window.addEventListener('resize', updateScrollFades);
    return () => {
      cancelAnimationFrame(frame);
      window.removeEventListener('resize', updateScrollFades);
    };
  }, [updateScrollFades]);

  // Mobile drawer: Escape to close, lock body scroll, focus in/out
  useEffect(() => {
    if (!mobileOpen) return;

    lastActiveEl.current = document.activeElement;
    const prevOverflow = document.body.style.overflow;
    document.body.style.overflow = 'hidden';

    const focusTarget = closeBtnRef.current || asideRef.current;
    focusTarget?.focus?.();

    const onKeyDown = (e) => {
      if (e.key === 'Escape') setMobileOpen(false);
    };
    document.addEventListener('keydown', onKeyDown);

    return () => {
      document.body.style.overflow = prevOverflow;
      document.removeEventListener('keydown', onKeyDown);
      lastActiveEl.current?.focus?.();
    };
  }, [mobileOpen, setMobileOpen]);

  const closeMobile = () => setMobileOpen(false);

  return (
    <>
      {/* Mobile Backdrop */}
      {mobileOpen && (
        <div
          className="fixed inset-0 z-40 bg-stone-900/40 backdrop-blur-xs lg:hidden transition-opacity duration-300"
          onClick={closeMobile}
          aria-hidden="true"
        />
      )}

      {/* Sidebar Container */}
      <aside
        ref={asideRef}
        tabIndex={-1}
        className={`sidebar-root fixed top-0 bottom-0 left-0 z-50 flex flex-col border-r border-cream-line-soft transition-all duration-300 ease-[cubic-bezier(0.22,1,0.36,1)] ${
          collapsed ? 'w-24' : 'w-64'
        } ${mobileOpen ? 'translate-x-0 shadow-2xl' : '-translate-x-full lg:translate-x-0'}`}
        style={{
          background:
            'linear-gradient(180deg, #f6f2e9 0%, #f3efe6 40%, #efe9de 100%)',
        }}
      >
        {/* Top Header / CBSG Logo */}
        <div className="h-16 px-4 flex items-center justify-between border-b border-cream-line/80 bg-white/40 backdrop-blur-sm">
          <div className={collapsed ? 'mx-auto' : ''}>
            <Logo variant={collapsed ? 'icon-only' : 'light'} size="sm" />
          </div>
          <button
            ref={closeBtnRef}
            type="button"
            onClick={closeMobile}
            aria-label="Close navigation menu"
            className="lg:hidden p-1.5 text-stone-400 hover:text-stone-700 rounded-lg hover:bg-cream-line transition-colors cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Scrollable Navigation */}
        <nav
          aria-label="Main navigation"
          className="relative flex-1 flex flex-col min-h-0"
        >
          <div
            ref={scrollRef}
            onScroll={updateScrollFades}
            className="sidebar-scroll flex-1 overflow-y-auto px-3 py-4 space-y-5 text-xs"
          >
            {groups.map((group) => (
              <SidebarGroup
                key={group.group}
                group={group}
                collapsed={collapsed}
                onNavigate={closeMobile}
              />
            ))}
          </div>

          {/* Top/bottom fade shadows when content overflows */}
          {scrollFades.top && (
            <div
              aria-hidden="true"
              className="pointer-events-none absolute inset-x-0 top-0 h-5 bg-gradient-to-b from-cream-100 to-transparent z-10"
            />
          )}
          {scrollFades.bottom && (
            <div
              aria-hidden="true"
              className="pointer-events-none absolute inset-x-0 bottom-0 h-5 bg-gradient-to-t from-cream-100 to-transparent z-10"
            />
          )}
        </nav>
      </aside>
    </>
  );
}

export default Sidebar;
