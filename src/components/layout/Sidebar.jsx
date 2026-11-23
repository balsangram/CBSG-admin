import React from 'react';
import { NavLink } from 'react-router-dom';
import {
  LayoutGrid,
  Users,
  UserCheck,
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
  X,
  ArrowLeft,
} from 'lucide-react';
import Logo from '../common/Logo';
import { ROUTES, APP_CONFIG } from '../../utils/constants';

export function Sidebar({ mobileOpen, setMobileOpen, collapsed = false }) {
  const menuGroups = [
    {
      group: 'Dashboard',
      items: [
        {
          name: 'Overview',
          icon: LayoutGrid,
          path: ROUTES.DASHBOARD,
          badge: null,
          isExact: true,
        },
      ],
    },
    {
      group: 'Customers',
      items: [
        { name: 'Customer records', icon: Users, path: ROUTES.CUSTOMERS, badge: null, isNavLink: true },
        { name: 'Customer 360', icon: UserCheck, path: ROUTES.CUSTOMER_360, badge: null, isNavLink: true },
        { name: 'KYC queue', icon: ShieldAlert, path: ROUTES.KYC_QUEUE, badge: '2', badgeVariant: 'warning', isNavLink: true },
      ],
    },
    {
      group: 'Savings',
      items: [
        { name: 'Scheme master', icon: Landmark, path: ROUTES.SCHEME_MASTER, badge: null, isNavLink: true },
        { name: 'Deposit accounts', icon: Wallet, path: ROUTES.DEPOSIT_ACCOUNTS, badge: null, isNavLink: true },
      ],
    },
    {
      group: 'Collections',
      items: [
        { name: 'Daybook', icon: BookOpen, path: ROUTES.DAYBOOK, badge: null, isNavLink: true },
      ],
    },
    {
      group: 'Team & Incentives',
      items: [
        { name: 'Team structure', icon: Network, path: ROUTES.TEAM_STRUCTURE, badge: null, isNavLink: true },
        { name: 'Incentive ledger', icon: Receipt, path: ROUTES.INCENTIVE_LEDGER, badge: null, isNavLink: true },
        { name: 'Payout management', icon: Banknote, path: '#payout-management', badge: '1', badgeVariant: 'warning' },
      ],
    },
    {
      group: 'Reports',
      items: [
        { name: 'Reports & analytics', icon: LineChart, path: '#reports', badge: null },
        { name: 'Transaction logs', icon: History, path: '#transaction-logs', badge: null },
      ],
    },
    {
      group: 'Administration',
      items: [
        { name: 'Branches', icon: Store, path: '#branches', badge: null },
        { name: 'Users & roles', icon: UserCog, path: '#users-roles', badge: null },
        { name: 'Audit log', icon: Clock, path: '#audit-log', badge: null },
      ],
    },
  ];

  return (
    <>
      {/* Mobile Backdrop */}
      {mobileOpen && (
        <div
          className="fixed inset-0 z-40 bg-stone-900/40 backdrop-blur-xs lg:hidden transition-opacity"
          onClick={() => setMobileOpen(false)}
        />
      )}

      {/* Sidebar Container */}
      <aside
        className={`fixed top-0 bottom-0 left-0 z-50 bg-[#f3efe6] border-r border-[#e5dfd2] flex flex-col justify-between transition-all duration-300 ease-in-out ${
          collapsed ? 'w-20' : 'w-64'
        } ${mobileOpen ? 'translate-x-0 shadow-2xl' : '-translate-x-full lg:translate-x-0'}`}
      >
        {/* Top Header / CBSG Logo */}
        <div className="h-16 px-5 flex items-center justify-between border-b border-[#e8e2d5]">
          <Logo variant="light" size="sm" />
          <button
            type="button"
            onClick={() => setMobileOpen(false)}
            className="lg:hidden p-1.5 text-stone-400 hover:text-stone-700 rounded-lg hover:bg-[#e8e2d5] cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Scrollable Navigation Items */}
        <div className="flex-1 overflow-y-auto px-3.5 py-3 space-y-4 text-xs">
          {menuGroups.map((group) => (
            <div key={group.group} className="space-y-1">
              {!collapsed && (
                <div className="px-2.5 py-1 text-[10.5px] font-medium text-[#8f8278] select-none">
                  {group.group}
                </div>
              )}

              {group.items.map((item) => {
                const Icon = item.icon;
                const isNav = item.isNavLink || item.isExact;

                return isNav ? (
                  <NavLink
                    key={item.name}
                    to={item.path}
                    onClick={() => setMobileOpen(false)}
                    className={({ isActive }) =>
                      `flex items-center justify-between px-3 py-2 rounded-xl text-xs font-semibold transition-all select-none ${
                        isActive
                          ? 'bg-white text-[#2c1b15] shadow-xs border border-[#e6e0d4]'
                          : 'text-[#61554d] hover:text-[#2c1b15] hover:bg-white/60'
                      }`
                    }
                  >
                    <div className="flex items-center gap-2.5 min-w-0">
                      <Icon className="w-4 h-4 text-[#2c1b15] shrink-0" />
                      {!collapsed && <span className="truncate">{item.name}</span>}
                    </div>

                    {!collapsed && item.badge && (
                      <span className="text-[10px] font-bold px-1.5 py-0.2 rounded-full bg-[#fef1db] text-[#b46500] border border-[#fbd398] min-w-4 text-center">
                        {item.badge}
                      </span>
                    )}
                  </NavLink>
                ) : (
                  <a
                    key={item.name}
                    href={item.path}
                    onClick={(e) => {
                      if (item.path.startsWith('#')) e.preventDefault();
                      setMobileOpen(false);
                    }}
                    className="flex items-center justify-between px-3 py-1.5 rounded-xl text-xs font-medium text-[#61554d] hover:text-[#2c1b15] hover:bg-white/60 transition-colors select-none group"
                  >
                    <div className="flex items-center gap-2.5 min-w-0">
                      <Icon className="w-3.5 h-3.5 text-[#7a6e66] group-hover:text-[#2c1b15] shrink-0" />
                      {!collapsed && <span className="truncate">{item.name}</span>}
                    </div>

                    {!collapsed && item.badge && (
                      <span className="text-[10px] font-bold px-1.5 py-0.2 rounded-full bg-[#fef1db] text-[#b46500] border border-[#fbd398] min-w-4 text-center">
                        {item.badge}
                      </span>
                    )}
                  </a>
                );
              })}
            </div>
          ))}
        </div>

        {/* Bottom Back to Launcher Link */}
        <div className="p-3 border-t border-[#e8e2d5] bg-[#ece7dd]">
          <a
            href={APP_CONFIG.LAUNCHER_URL}
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center gap-2 px-3 py-2 rounded-xl text-xs font-medium text-[#6e6158] hover:text-[#2c1b15] hover:bg-white/70 transition-colors select-none"
          >
            <ArrowLeft className="w-3.5 h-3.5" />
            {!collapsed && <span>Back to Launcher</span>}
          </a>
        </div>
      </aside>
    </>
  );
}

export default Sidebar;
