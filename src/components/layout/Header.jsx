import React, { useState, useRef } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import {
  Bell,
  Menu,
  ChevronDown,
  User,
  Settings,
  LogOut,
  ExternalLink,
  Shield,
} from 'lucide-react';
import { GoSidebarCollapse, GoSidebarExpand } from 'react-icons/go';
import useAuth from '../../modules/auth/hooks/useAuth';
import useClickOutside from '../../hooks/useClickOutside';
import { APP_CONFIG, ROUTES } from '../../utils/constants';
import { notify } from '../../utils/notify';

const PAGE_TITLES = [
  { prefix: ROUTES.CUSTOMER_360, title: 'Customer 360' },
  { prefix: ROUTES.CUSTOMERS, title: 'Customer Records' },
  { prefix: ROUTES.CUSTOMER_RECORDS, title: 'Customer Records' },
  { prefix: ROUTES.KYC_QUEUE, title: 'KYC Queue' },
  { prefix: ROUTES.KYC_REVIEW, title: 'KYC Review' },
  { prefix: ROUTES.SCHEME_MASTER, title: 'Scheme Master' },
  { prefix: ROUTES.DEPOSIT_ACCOUNTS, title: 'Deposit Accounts' },
  { prefix: ROUTES.DAYBOOK, title: 'Daybook' },
  { prefix: ROUTES.TEAM_STRUCTURE, title: 'Team Structure' },
  { prefix: ROUTES.INCENTIVE_LEDGER, title: 'Incentive Ledger' },
  { prefix: ROUTES.PAYOUT_MANAGEMENT, title: 'Payout Management' },
  { prefix: ROUTES.REPORTS, title: 'Reports & Analytics' },
  { prefix: ROUTES.REPORTS_ANALYTICS, title: 'Reports & Analytics' },
  { prefix: ROUTES.TRANSACTION_LOGS, title: 'Transaction Logs' },
  { prefix: ROUTES.BRANCHES, title: 'Branches' },
  { prefix: ROUTES.USERS_ROLES, title: 'Users & Roles' },
  { prefix: ROUTES.AUDIT_LOG, title: 'Audit Log' },
  { prefix: ROUTES.PROFILE, title: 'Profile' },
  { prefix: ROUTES.SETTINGS, title: 'Settings' },
  { prefix: ROUTES.DASHBOARD, title: 'Dashboard', exact: true },
];

const getPageTitle = (pathname) => {
  const match = PAGE_TITLES.find(
    (p) =>
      (p.exact ? pathname === p.prefix : pathname === p.prefix || pathname.startsWith(`${p.prefix}/`))
  );
  return match?.title || 'Dashboard';
};

export function Header({ setMobileOpen, toggleSidebarCollapse, collapsed = false }) {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const pageTitle = getPageTitle(location.pathname);

  const [profileDropdownOpen, setProfileDropdownOpen] = useState(false);
  const [notificationsOpen, setNotificationsOpen] = useState(false);

  const profileRef = useRef(null);
  const notifRef = useRef(null);

  useClickOutside(profileRef, () => setProfileDropdownOpen(false));
  useClickOutside(notifRef, () => setNotificationsOpen(false));

  const handleLogout = async () => {
    try {
      await logout();
      notify.info('You have been signed out.');
    } catch {
      notify.error('Sign out failed. Please try again.');
    }
    navigate(ROUTES.LOGIN);
  };

  const notifications = [
    {
      id: 1,
      title: 'KYC Document Verification',
      message: '2 customer KYC applications pending in review queue.',
      time: '12m ago',
      unread: true,
    },
    {
      id: 2,
      title: 'Incentive Payout Approved',
      message: 'Payout batch cleared by Super Admin.',
      time: '1h ago',
      unread: false,
    },
  ];

  const unreadCount = 1;

  return (
    <header className="h-16 bg-cream-50/90 backdrop-blur-md border-b border-cream-line sticky top-0 z-30 px-4 sm:px-6 flex items-center justify-between gap-4">
      {/* Left: nav triggers + page title */}
      <div className="flex items-center gap-2.5 min-w-0">
        {/* Mobile menu trigger */}
        <button
          type="button"
          onClick={() => setMobileOpen(true)}
          className="lg:hidden p-2 text-ink-soft hover:text-ink rounded-xl hover:bg-cream-200 transition-colors cursor-pointer"
          aria-label="Open navigation menu"
        >
          <Menu className="w-4.5 h-4.5" />
        </button>

        {/* Desktop collapse toggle — icon reflects state */}
        <button
          type="button"
          onClick={toggleSidebarCollapse}
          className="hidden lg:flex p-2 text-ink-soft hover:text-accent-dark rounded-xl hover:bg-cream-200 transition-colors cursor-pointer"
          aria-label={collapsed ? 'Expand sidebar' : 'Collapse sidebar'}
          title={collapsed ? 'Expand sidebar' : 'Collapse sidebar'}
        >
          {collapsed ? (
            <GoSidebarExpand className="w-4.5 h-4.5" />
          ) : (
            <GoSidebarCollapse className="w-4.5 h-4.5" />
          )}
        </button>

        {/* Page title */}
        <div className="min-w-0">
          <h1 className="text-sm sm:text-base font-bold text-ink tracking-tight truncate leading-tight">
            {pageTitle}
          </h1>
          <p className="hidden sm:block text-[10.5px] text-ink-muted leading-tight">
            {APP_CONFIG.APP_NAME}
          </p>
        </div>
      </div>

      {/* Right: Notifications & Staff Profile */}
      <div className="flex items-center gap-2 sm:gap-3">
        {/* Notification Bell */}
        <div className="relative" ref={notifRef}>
          <button
            type="button"
            onClick={() => setNotificationsOpen(!notificationsOpen)}
            className="p-2 text-ink-soft hover:text-ink rounded-xl hover:bg-cream-200 transition-colors relative cursor-pointer"
            aria-label="Notifications"
            aria-expanded={notificationsOpen}
          >
            <Bell className="w-4.5 h-4.5" />
            {unreadCount > 0 && (
              <span className="absolute top-1 right-1 w-3.5 h-3.5 rounded-full bg-accent text-[9px] font-bold text-ink flex items-center justify-center ring-2 ring-cream-50">
                {unreadCount}
              </span>
            )}
          </button>

          {/* Notifications Dropdown */}
          {notificationsOpen && (
            <div className="absolute right-0 mt-2 w-80 bg-white rounded-2xl shadow-xl border border-cream-line overflow-hidden z-50">
              <div className="p-3.5 border-b border-cream-line/60 flex items-center justify-between bg-cream-100/60">
                <span className="font-bold text-xs text-ink">Notifications</span>
                <span className="text-[10px] font-semibold text-accent-text bg-accent-soft px-2 py-0.5 rounded-full">
                  1 pending
                </span>
              </div>
              <div className="divide-y divide-cream-line/50 max-h-72 overflow-y-auto">
                {notifications.map((n) => (
                  <div key={n.id} className="p-3 hover:bg-cream-50 text-xs">
                    <p className="font-bold text-ink text-[11px]">{n.title}</p>
                    <p className="text-ink-muted text-[11px] mt-0.5">{n.message}</p>
                    <span className="text-[9px] text-ink-muted/70 mt-1 block">{n.time}</span>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* Staff Profile Avatar & Info */}
        <div className="relative" ref={profileRef}>
          <button
            type="button"
            onClick={() => setProfileDropdownOpen(!profileDropdownOpen)}
            className="flex items-center gap-2.5 p-1 rounded-xl hover:bg-cream-200 transition-colors cursor-pointer"
            aria-label="Account menu"
            aria-expanded={profileDropdownOpen}
          >
            {user?.photo ? (
              <img
                src={user.photo}
                alt={user?.name || 'Admin'}
                className="w-8 h-8 rounded-full object-cover border border-cream-line"
              />
            ) : (
              <span className="w-8 h-8 rounded-full bg-ink text-accent text-xs font-bold flex items-center justify-center border border-cream-line">
                {(user?.name || 'A').charAt(0).toUpperCase()}
              </span>
            )}
            <div className="hidden sm:block text-left leading-tight">
              <p className="text-xs font-bold text-ink">
                {user?.name || APP_CONFIG.DEMO_STAFF_NAME}
              </p>
              <p className="text-[10.5px] text-ink-muted">
                {user?.role || APP_CONFIG.DEMO_STAFF_ROLE}
              </p>
            </div>
            <ChevronDown className="w-3.5 h-3.5 text-ink-muted hidden sm:block" />
          </button>

          {/* Profile Dropdown */}
          {profileDropdownOpen && (
            <div className="absolute right-0 mt-2 w-60 bg-white rounded-2xl shadow-xl border border-cream-line p-2 z-50">
              <div className="p-3 border-b border-cream-line/60 bg-cream-100/60 rounded-xl mb-1">
                <p className="text-xs font-bold text-ink">
                  {user?.name || APP_CONFIG.DEMO_STAFF_NAME}
                </p>
                <p className="text-[11px] text-ink-muted truncate">
                  {user?.email || APP_CONFIG.DEMO_EMAIL}
                </p>
                <div className="mt-2 inline-flex items-center gap-1.5 text-[10px] font-semibold text-mint-text bg-mint px-2 py-0.5 rounded-full border border-mint-line">
                  <Shield className="w-3 h-3" />
                  Authenticated Session
                </div>
              </div>

              <div className="space-y-0.5 text-xs font-medium">
                <button
                  type="button"
                  onClick={() => {
                    setProfileDropdownOpen(false);
                    navigate(ROUTES.PROFILE);
                  }}
                  className="w-full flex items-center gap-2.5 px-3 py-2 text-ink-soft hover:text-ink hover:bg-cream-100 rounded-lg cursor-pointer"
                >
                  <User className="w-3.5 h-3.5 text-ink-muted" />
                  <span>My Profile</span>
                </button>

                <button
                  type="button"
                  onClick={() => {
                    setProfileDropdownOpen(false);
                    navigate(ROUTES.SETTINGS);
                  }}
                  className="w-full flex items-center gap-2.5 px-3 py-2 text-ink-soft hover:text-ink hover:bg-cream-100 rounded-lg cursor-pointer"
                >
                  <Settings className="w-3.5 h-3.5 text-ink-muted" />
                  <span>Settings</span>
                </button>

                <a
                  href={APP_CONFIG.LAUNCHER_URL}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-full flex items-center justify-between px-3 py-2 text-ink-soft hover:text-ink hover:bg-cream-100 rounded-lg"
                >
                  <span className="flex items-center gap-2.5">
                    <ExternalLink className="w-3.5 h-3.5 text-ink-muted" />
                    <span>Launcher</span>
                  </span>
                  <span className="text-[10px] text-ink-muted/70">cbsg.online</span>
                </a>
              </div>

              <div className="pt-1 mt-1 border-t border-cream-line/60">
                <button
                  type="button"
                  onClick={handleLogout}
                  className="w-full flex items-center gap-2.5 px-3 py-2 text-xs font-semibold text-rose-700 hover:bg-rose-50 rounded-lg cursor-pointer"
                >
                  <LogOut className="w-3.5 h-3.5" />
                  <span>Sign Out</span>
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </header>
  );
}

export default Header;
