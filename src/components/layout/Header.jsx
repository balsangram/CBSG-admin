import React, { useState, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Search,
  Bell,
  Menu,
  ChevronDown,
  User,
  Settings,
  Shield,
  LogOut,
  ExternalLink,
} from 'lucide-react';
import useAuth from '../../modules/auth/hooks/useAuth';
import useClickOutside from '../../hooks/useClickOutside';
import { APP_CONFIG, ROUTES } from '../../utils/constants';

export function Header({ setMobileOpen, pageTitle = 'Dashboard' }) {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const [profileDropdownOpen, setProfileDropdownOpen] = useState(false);
  const [notificationsOpen, setNotificationsOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');

  const profileRef = useRef(null);
  const notifRef = useRef(null);

  useClickOutside(profileRef, () => setProfileDropdownOpen(false));
  useClickOutside(notifRef, () => setNotificationsOpen(false));

  const handleLogout = async () => {
    await logout();
    navigate(ROUTES.LOGIN);
  };

  const notifications = [
    {
      id: 1,
      title: 'Loan Disbursement #LN-8924',
      message: 'Requires checker level authorization of ₹12.5 Lakhs.',
      time: '10m ago',
      unread: true,
    },
    {
      id: 2,
      title: 'Bulk Payout Completed',
      message: 'Batch #4892 settled for 64 beneficiaries successfully.',
      time: '32m ago',
      unread: true,
    },
    {
      id: 3,
      title: 'RBI Regulatory Update',
      message: 'Quarterly compliance submission due in 48 hours.',
      time: '2h ago',
      unread: false,
    },
  ];

  const unreadCount = notifications.filter((n) => n.unread).length;

  return (
    <header className="h-20 bg-white border-b border-slate-200/90 sticky top-0 z-30 px-4 sm:px-8 flex items-center justify-between gap-4">
      {/* Left Area: Mobile Menu + Page Title */}
      <div className="flex items-center gap-4">
        <button
          type="button"
          onClick={() => setMobileOpen(true)}
          className="lg:hidden p-2 text-slate-600 hover:text-slate-900 rounded-xl hover:bg-slate-100 cursor-pointer"
          aria-label="Open sidebar"
        >
          <Menu className="w-5 h-5" />
        </button>

        <div>
          <h1 className="text-xl sm:text-2xl font-bold tracking-tight text-slate-900">
            {pageTitle}
          </h1>
          <p className="hidden sm:block text-xs text-slate-600 font-medium">
            CBSG NBFC Staff Operations Desk
          </p>
        </div>
      </div>

      {/* Middle Area: Search bar */}
      <div className="hidden md:flex flex-1 max-w-md mx-4">
        <div className="relative w-full">
          <Search className="w-4 h-4 text-slate-600 absolute left-3.5 top-1/2 -translate-y-1/2 pointer-events-none" />
          <input
            type="text"
            placeholder="Search loans, users, transactions, audit logs..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full bg-slate-50 hover:bg-slate-100/80 focus:bg-white text-slate-900 placeholder:text-slate-600 text-xs sm:text-sm rounded-xl border border-slate-200 pl-10 pr-12 py-2.5 transition-all outline-none focus:border-slate-400 focus:ring-3 focus:ring-slate-300/20"
          />
          <kbd className="absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none text-[10px] font-mono text-slate-600 bg-white px-1.5 py-0.5 rounded border border-slate-200 shadow-2xs">
            ⌘K
          </kbd>
        </div>
      </div>

      {/* Right Area: Actions, Notification, Profile */}
      <div className="flex items-center gap-3">
        {/* Notification Icon */}
        <div className="relative" ref={notifRef}>
          <button
            type="button"
            onClick={() => setNotificationsOpen(!notificationsOpen)}
            className="p-2.5 text-slate-600 hover:text-slate-900 rounded-xl hover:bg-slate-100 transition-colors relative cursor-pointer"
            aria-label="Notifications"
          >
            <Bell className="w-5 h-5" />
            {unreadCount > 0 && (
              <span className="absolute top-1.5 right-1.5 w-4 h-4 rounded-full bg-rose-600 text-[10px] font-bold text-white flex items-center justify-center ring-2 ring-white">
                {unreadCount}
              </span>
            )}
          </button>

          {/* Notifications Dropdown */}
          {notificationsOpen && (
            <div className="absolute right-0 mt-2 w-80 sm:w-96 bg-white rounded-2xl shadow-xl border border-slate-200 overflow-hidden z-50 animate-fadeIn">
              <div className="p-4 border-b border-slate-100 flex items-center justify-between bg-slate-50/50">
                <div className="flex items-center gap-2">
                  <h4 className="font-bold text-sm text-slate-900">Notifications</h4>
                  <span className="text-[10px] font-bold bg-blue-100 text-blue-700 px-2 py-0.5 rounded-full">
                    {unreadCount} new
                  </span>
                </div>
                <button
                  type="button"
                  className="text-xs text-blue-600 hover:text-blue-800 font-semibold cursor-pointer"
                >
                  Mark all read
                </button>
              </div>

              <div className="divide-y divide-slate-100 max-h-80 overflow-y-auto">
                {notifications.map((item) => (
                  <div
                    key={item.id}
                    className={`p-3.5 hover:bg-slate-50 transition-colors cursor-pointer ${
                      item.unread ? 'bg-blue-50/30' : ''
                    }`}
                  >
                    <div className="flex items-start justify-between gap-2">
                      <p className="text-xs font-bold text-slate-900">{item.title}</p>
                      <span className="text-[10px] text-slate-600 font-mono">{item.time}</span>
                    </div>
                    <p className="text-xs text-slate-600 mt-1">{item.message}</p>
                  </div>
                ))}
              </div>

              <div className="p-2.5 bg-slate-50 border-t border-slate-100 text-center">
                <a
                  href="#all-notifications"
                  className="text-xs font-semibold text-blue-600 hover:text-blue-800"
                >
                  View all NBFC notifications
                </a>
              </div>
            </div>
          )}
        </div>

        {/* Staff Profile Dropdown */}
        <div className="relative" ref={profileRef}>
          <button
            type="button"
            onClick={() => setProfileDropdownOpen(!profileDropdownOpen)}
            className="flex items-center gap-3 p-1.5 sm:px-3 sm:py-2 rounded-xl hover:bg-slate-100 transition-colors border border-transparent hover:border-slate-200 cursor-pointer"
          >
            <img
              src={user?.avatar || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=120&q=80'}
              alt={user?.name || 'Staff User'}
              className="w-8 h-8 rounded-full object-cover border border-slate-200"
            />
            <div className="hidden sm:block text-left leading-tight">
              <p className="text-xs font-bold text-slate-900">
                {user?.name || APP_CONFIG.DEMO_STAFF_NAME}
              </p>
              <p className="text-[11px] text-slate-600">
                {user?.role || APP_CONFIG.DEMO_STAFF_ROLE}
              </p>
            </div>
            <ChevronDown className="w-4 h-4 text-slate-600 hidden sm:block" />
          </button>

          {/* Dropdown Menu */}
          {profileDropdownOpen && (
            <div className="absolute right-0 mt-2 w-64 bg-white rounded-2xl shadow-xl border border-slate-200 p-2 z-50 animate-fadeIn">
              <div className="p-3 border-b border-slate-100 bg-slate-50/70 rounded-xl mb-1">
                <p className="text-xs font-bold text-slate-900">
                  {user?.name || APP_CONFIG.DEMO_STAFF_NAME}
                </p>
                <p className="text-[11px] text-slate-500 truncate">
                  {user?.email || APP_CONFIG.DEMO_EMAIL}
                </p>
                <div className="mt-2 inline-flex items-center gap-1.5 text-[10px] font-semibold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded-full border border-emerald-200">
                  <Shield className="w-3 h-3" />
                  2FA Verified Staff
                </div>
              </div>

              <div className="space-y-0.5">
                <button
                  type="button"
                  onClick={() => {
                    setProfileDropdownOpen(false);
                    navigate(ROUTES.PROFILE);
                  }}
                  className="w-full flex items-center gap-2.5 px-3 py-2 text-xs font-medium text-slate-700 hover:text-slate-900 hover:bg-slate-100 rounded-lg transition-colors cursor-pointer"
                >
                  <User className="w-4 h-4 text-slate-600" />
                  <span>My Staff Profile</span>
                </button>

                <button
                  type="button"
                  onClick={() => {
                    setProfileDropdownOpen(false);
                    navigate(ROUTES.SETTINGS);
                  }}
                  className="w-full flex items-center gap-2.5 px-3 py-2 text-xs font-medium text-slate-700 hover:text-slate-900 hover:bg-slate-100 rounded-lg transition-colors cursor-pointer"
                >
                  <Settings className="w-4 h-4 text-slate-600" />
                  <span>Account & Security</span>
                </button>

                <a
                  href={APP_CONFIG.LAUNCHER_URL}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-full flex items-center justify-between px-3 py-2 text-xs font-medium text-slate-700 hover:text-slate-900 hover:bg-slate-100 rounded-lg transition-colors"
                >
                  <span className="flex items-center gap-2.5">
                    <ExternalLink className="w-4 h-4 text-slate-600" />
                    <span>Back to Launcher</span>
                  </span>
                  <span className="text-[10px] text-slate-600">cbsg.online</span>
                </a>
              </div>

              <div className="pt-1 mt-1 border-t border-slate-100">
                <button
                  type="button"
                  onClick={handleLogout}
                  className="w-full flex items-center gap-2.5 px-3 py-2 text-xs font-semibold text-rose-600 hover:text-rose-700 hover:bg-rose-50 rounded-lg transition-colors cursor-pointer"
                >
                  <LogOut className="w-4 h-4" />
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
