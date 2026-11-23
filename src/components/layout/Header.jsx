import React, { useState, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Search,
  Bell,
  PanelLeft,
  ChevronDown,
  User,
  Settings,
  LogOut,
  ExternalLink,
  Shield,
} from 'lucide-react';
import useAuth from '../../modules/auth/hooks/useAuth';
import useClickOutside from '../../hooks/useClickOutside';
import { APP_CONFIG, ROUTES } from '../../utils/constants';

export function Header({ setMobileOpen, toggleSidebarCollapse }) {
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
    <header className="h-16 bg-[#f6f4ed] border-b border-[#e8e2d5] sticky top-0 z-30 px-4 sm:px-6 flex items-center justify-between gap-4">
      {/* Left: Sidebar Toggle & Search Input */}
      <div className="flex items-center gap-3 flex-1 max-w-xl">
        {/* Mobile menu trigger */}
        <button
          type="button"
          onClick={() => setMobileOpen(true)}
          className="lg:hidden p-2 text-[#70645c] hover:text-[#2c1b15] rounded-xl hover:bg-[#ede8de] cursor-pointer"
          aria-label="Toggle navigation drawer"
        >
          <PanelLeft className="w-4 h-4" />
        </button>

        {/* Desktop collapse toggle */}
        <button
          type="button"
          onClick={toggleSidebarCollapse}
          className="hidden lg:flex p-2 text-[#70645c] hover:text-[#2c1b15] rounded-xl hover:bg-[#ede8de] cursor-pointer"
          aria-label="Toggle sidebar collapse"
        >
          <PanelLeft className="w-4 h-4" />
        </button>

        {/* Search Bar matching screenshot */}
        <div className="relative w-full max-w-md">
          <Search className="w-3.5 h-3.5 text-[#8c8076] absolute left-3.5 top-1/2 -translate-y-1/2 pointer-events-none" />
          <input
            type="text"
            placeholder="Search customers, mobile, referral code..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full bg-[#eee9df] hover:bg-[#eae5da] focus:bg-white text-[#2c1b15] placeholder:text-[#94887e] text-xs rounded-full border border-transparent focus:border-[#d9d2c4] pl-9 pr-4 py-2 transition-all outline-none"
          />
        </div>
      </div>

      {/* Right: Notifications & Staff Profile */}
      <div className="flex items-center gap-3">
        {/* Notification Bell */}
        <div className="relative" ref={notifRef}>
          <button
            type="button"
            onClick={() => setNotificationsOpen(!notificationsOpen)}
            className="p-2 text-[#70645c] hover:text-[#2c1b15] rounded-xl hover:bg-[#ede8de] transition-colors relative cursor-pointer"
            aria-label="Notifications"
          >
            <Bell className="w-4 h-4" />
            {unreadCount > 0 && (
              <span className="absolute top-1 right-1 w-3.5 h-3.5 rounded-full bg-[#f4b33d] text-[9px] font-bold text-[#2c1b15] flex items-center justify-center ring-2 ring-[#f6f4ed]">
                {unreadCount}
              </span>
            )}
          </button>

          {/* Notifications Dropdown */}
          {notificationsOpen && (
            <div className="absolute right-0 mt-2 w-80 bg-white rounded-2xl shadow-xl border border-[#e8e2d5] overflow-hidden z-50">
              <div className="p-3.5 border-b border-[#f0ebdF] flex items-center justify-between bg-[#fbf9f5]">
                <span className="font-bold text-xs text-[#2c1b15]">Notifications</span>
                <span className="text-[10px] font-semibold text-[#b86a04] bg-[#fef1db] px-2 py-0.5 rounded-full">
                  1 pending
                </span>
              </div>
              <div className="divide-y divide-[#f2efe8] max-h-72 overflow-y-auto">
                {notifications.map((n) => (
                  <div key={n.id} className="p-3 hover:bg-[#faf8f4] text-xs">
                    <p className="font-bold text-[#2c1b15] text-[11px]">{n.title}</p>
                    <p className="text-[#786b62] text-[11px] mt-0.5">{n.message}</p>
                    <span className="text-[9px] text-[#a0948b] mt-1 block">{n.time}</span>
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
            className="flex items-center gap-2.5 p-1 rounded-xl hover:bg-[#ede8de] transition-colors cursor-pointer"
          >
            <img
              src="https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?auto=format&fit=crop&w=120&q=80"
              alt="Sanjay Kulkarni"
              className="w-8 h-8 rounded-full object-cover border border-[#d8d1c3]"
            />
            <div className="hidden sm:block text-left leading-tight">
              <p className="text-xs font-bold text-[#2c1b15]">
                {user?.name || APP_CONFIG.DEMO_STAFF_NAME}
              </p>
              <p className="text-[10.5px] text-[#85786f]">
                {user?.role || APP_CONFIG.DEMO_STAFF_ROLE}
              </p>
            </div>
            <ChevronDown className="w-3.5 h-3.5 text-[#85786f] hidden sm:block" />
          </button>

          {/* Profile Dropdown */}
          {profileDropdownOpen && (
            <div className="absolute right-0 mt-2 w-60 bg-white rounded-2xl shadow-xl border border-[#e8e2d5] p-2 z-50">
              <div className="p-3 border-b border-[#f0ebdF] bg-[#faf8f4] rounded-xl mb-1">
                <p className="text-xs font-bold text-[#2c1b15]">
                  {user?.name || APP_CONFIG.DEMO_STAFF_NAME}
                </p>
                <p className="text-[11px] text-[#85786f] truncate">
                  {user?.email || APP_CONFIG.DEMO_EMAIL}
                </p>
                <div className="mt-2 inline-flex items-center gap-1.5 text-[10px] font-semibold text-emerald-800 bg-[#e7f7ed] px-2 py-0.5 rounded-full border border-emerald-200">
                  <Shield className="w-3 h-3 text-emerald-600" />
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
                  className="w-full flex items-center gap-2.5 px-3 py-2 text-[#4f433b] hover:text-[#2c1b15] hover:bg-[#f6f3eb] rounded-lg cursor-pointer"
                >
                  <User className="w-3.5 h-3.5 text-[#85786f]" />
                  <span>My Profile</span>
                </button>

                <button
                  type="button"
                  onClick={() => {
                    setProfileDropdownOpen(false);
                    navigate(ROUTES.SETTINGS);
                  }}
                  className="w-full flex items-center gap-2.5 px-3 py-2 text-[#4f433b] hover:text-[#2c1b15] hover:bg-[#f6f3eb] rounded-lg cursor-pointer"
                >
                  <Settings className="w-3.5 h-3.5 text-[#85786f]" />
                  <span>Settings</span>
                </button>

                <a
                  href={APP_CONFIG.LAUNCHER_URL}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-full flex items-center justify-between px-3 py-2 text-[#4f433b] hover:text-[#2c1b15] hover:bg-[#f6f3eb] rounded-lg"
                >
                  <span className="flex items-center gap-2.5">
                    <ExternalLink className="w-3.5 h-3.5 text-[#85786f]" />
                    <span>Launcher</span>
                  </span>
                  <span className="text-[10px] text-[#9c9087]">cbsg.online</span>
                </a>
              </div>

              <div className="pt-1 mt-1 border-t border-[#f0ebdF]">
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
