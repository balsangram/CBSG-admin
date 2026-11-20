import React from 'react';
import { NavLink, useNavigate } from 'react-router-dom';
import {
  LayoutDashboard,
  User,
  Settings,
  LogOut,
  X,
  CreditCard,
  FileCheck2,
  Users2,
} from 'lucide-react';
import Logo from '../common/Logo';
import useAuth from '../../modules/auth/hooks/useAuth';
import { ROUTES, APP_CONFIG } from '../../utils/constants';

export function Sidebar({ mobileOpen, setMobileOpen }) {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = async () => {
    await logout();
    navigate(ROUTES.LOGIN);
  };

  const navItems = [
    {
      label: 'Dashboard',
      icon: LayoutDashboard,
      path: ROUTES.DASHBOARD,
      badge: null,
    },
    {
      label: 'Loan Desk',
      icon: CreditCard,
      path: '#loans',
      badge: '12 new',
    },
    {
      label: 'Maker-Checker Queue',
      icon: FileCheck2,
      path: '#maker-checker',
      badge: '6 pending',
    },
    {
      label: 'Staff Directory',
      icon: Users2,
      path: '#staff',
      badge: null,
    },
    {
      label: 'Profile',
      icon: User,
      path: ROUTES.PROFILE,
      badge: null,
    },
    {
      label: 'Settings',
      icon: Settings,
      path: ROUTES.SETTINGS,
      badge: null,
    },
  ];

  return (
    <>
      {/* Mobile Backdrop */}
      {mobileOpen && (
        <div
          className="fixed inset-0 z-40 bg-slate-900/50 backdrop-blur-xs lg:hidden transition-opacity"
          onClick={() => setMobileOpen(false)}
        />
      )}

      {/* Sidebar Container */}
      <aside
        className={`fixed top-0 bottom-0 left-0 z-50 w-72 bg-white border-r border-slate-200/90 flex flex-col justify-between transition-transform duration-300 ease-in-out lg:translate-x-0 ${
          mobileOpen ? 'translate-x-0 shadow-2xl' : '-translate-x-full'
        }`}
      >
        {/* Top Header / Branding */}
        <div>
          <div className="h-20 px-6 flex items-center justify-between border-b border-slate-100">
            <Logo variant="light" size="md" />
            <button
              type="button"
              onClick={() => setMobileOpen(false)}
              className="lg:hidden p-1.5 text-slate-400 hover:text-slate-600 rounded-lg hover:bg-slate-100 cursor-pointer"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* NBFC Regulatory Status Pill */}
          <div className="px-6 py-3.5 bg-slate-50/70 border-b border-slate-100 flex items-center justify-between">
            <div className="flex items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
              <span className="text-[11px] font-semibold text-slate-700 tracking-wide uppercase">
                RBI Regulated NBFC
              </span>
            </div>
            <span className="text-[10px] font-mono font-medium text-slate-600 bg-white px-2 py-0.5 rounded border border-slate-200">
              DESK 01
            </span>
          </div>

          {/* Navigation Links */}
          <nav className="p-4 space-y-1">
            <div className="px-3 py-2 text-[11px] font-bold uppercase tracking-wider text-slate-600">
              Main Operations
            </div>

            {navItems.map((item) => {
              const Icon = item.icon;
              const isDashboard = item.path === ROUTES.DASHBOARD;

              return isDashboard ? (
                <NavLink
                  key={item.label}
                  to={item.path}
                  onClick={() => setMobileOpen(false)}
                  className={({ isActive }) =>
                    `flex items-center justify-between px-3.5 py-2.5 rounded-xl text-sm font-medium transition-all group ${
                      isActive
                        ? 'bg-blue-600 text-white shadow-sm shadow-blue-500/20'
                        : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
                    }`
                  }
                >
                  {({ isActive }) => (
                    <>
                      <div className="flex items-center gap-3">
                        <Icon
                          className={`w-4 h-4 transition-colors ${
                            isActive ? 'text-white' : 'text-slate-600 group-hover:text-slate-700'
                          }`}
                        />
                        <span>{item.label}</span>
                      </div>
                      {item.badge && (
                        <span
                          className={`text-[10px] font-semibold px-2 py-0.5 rounded-full ${
                            isActive
                              ? 'bg-white/20 text-white'
                              : 'bg-blue-50 text-blue-700'
                          }`}
                        >
                          {item.badge}
                        </span>
                      )}
                    </>
                  )}
                </NavLink>
              ) : (
                <a
                  key={item.label}
                  href={item.path}
                  onClick={(e) => {
                    if (item.path.startsWith('#')) e.preventDefault();
                    setMobileOpen(false);
                  }}
                  className="flex items-center justify-between px-3.5 py-2.5 rounded-xl text-sm font-medium text-slate-600 hover:text-slate-900 hover:bg-slate-100 transition-all group"
                >
                  <div className="flex items-center gap-3">
                    <Icon className="w-4 h-4 text-slate-600 group-hover:text-slate-700" />
                    <span>{item.label}</span>
                  </div>
                  {item.badge && (
                    <span className="text-[10px] font-semibold px-2 py-0.5 rounded-full bg-amber-50 text-amber-700 border border-amber-200/50">
                      {item.badge}
                    </span>
                  )}
                </a>
              );
            })}
          </nav>
        </div>

        {/* Bottom Section: Staff Profile Card & Logout */}
        <div className="p-4 border-t border-slate-200/90 space-y-3 bg-slate-50/50">
          {/* Staff Info */}
          <div className="p-3 bg-white rounded-xl border border-slate-200/80 shadow-2xs flex items-center gap-3">
            <div className="relative">
              <img
                src={user?.avatar || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=120&q=80'}
                alt={user?.name || 'Staff Avatar'}
                className="w-10 h-10 rounded-full object-cover border border-slate-200"
              />
              <span className="absolute bottom-0 right-0 w-2.5 h-2.5 rounded-full bg-emerald-500 ring-2 ring-white" />
            </div>

            <div className="flex-1 min-w-0">
              <p className="text-xs font-bold text-slate-900 truncate">
                {user?.name || APP_CONFIG.DEMO_STAFF_NAME}
              </p>
              <p className="text-[11px] text-slate-500 truncate">
                {user?.role || APP_CONFIG.DEMO_STAFF_ROLE}
              </p>
            </div>
          </div>

          {/* Logout Button */}
          <button
            type="button"
            onClick={handleLogout}
            className="w-full flex items-center justify-center gap-2 px-3 py-2.5 rounded-xl text-xs font-semibold text-rose-700 hover:text-rose-800 bg-rose-50/70 hover:bg-rose-100/70 border border-rose-200/60 transition-colors cursor-pointer"
          >
            <LogOut className="w-3.5 h-3.5" />
            <span>Sign Out Session</span>
          </button>
        </div>
      </aside>
    </>
  );
}

export default Sidebar;
