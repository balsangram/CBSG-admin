import React from 'react';
import { NavLink } from 'react-router-dom';
import { SidebarTooltip } from './SidebarTooltip';

/**
 * Single sidebar navigation item.
 * Renders a NavLink with icon chip, optional badge, and a portal tooltip
 * when the sidebar is collapsed (icon-only).
 */
export function SidebarItem({ item, collapsed, onNavigate }) {
  const Icon = item.icon;
  const badge = item.badge || null;

  const link = (
    <NavLink
      to={item.path}
      end={item.end}
      onClick={onNavigate}
      className={({ isActive }) =>
        `group relative flex items-center rounded-xl text-xs font-semibold transition-all duration-200 select-none overflow-hidden border border-transparent active:scale-[0.97] ${
          collapsed ? 'justify-center px-0 py-2.5 mx-1' : 'justify-between px-3 py-2.5 mx-1'
        } ${
          isActive
            ? 'sidebar-link-active text-ink'
            : 'text-ink-soft hover:text-ink hover:bg-white/70 hover:shadow-2xs'
        }`
      }
    >
      {({ isActive }) => (
        <>
          {/* Active / hover left accent bar */}
          <span
            aria-hidden="true"
            className={`absolute left-0 top-1/2 -translate-y-1/2 w-[3px] rounded-r-full bg-gradient-to-b from-accent to-accent-dark transition-all duration-300 ${
              isActive
                ? 'h-5 opacity-100'
                : 'h-0 opacity-0 group-hover:h-3 group-hover:opacity-40'
            }`}
          />

          <div className="flex items-center gap-2.5 min-w-0">
            {/* Icon chip */}
            <span className="relative flex items-center justify-center w-8 h-8 rounded-lg transition-colors duration-200 shrink-0">
              <Icon
                className={`w-[18px] h-[18px] transition-colors duration-200 ${
                  isActive
                    ? 'text-accent-dark'
                    : 'text-ink-muted group-hover:text-ink'
                }`}
              />
              {/* Collapsed badge dot */}
              {collapsed && badge && (
                <span
                  aria-hidden="true"
                  className={`absolute -top-0.5 -right-0.5 w-2 h-2 rounded-full border border-cream-100 ${
                    badge.variant === 'warning' ? 'bg-accent' : 'bg-mint-text'
                  }`}
                />
              )}
            </span>
            {!collapsed && <span className="truncate">{item.name}</span>}
          </div>

          {!collapsed && badge && (
            <span
              className={`text-[10px] font-bold px-1.5 py-0.5 rounded-full border min-w-4 text-center transition-transform duration-200 group-hover:scale-110 ${
                badge.variant === 'warning'
                  ? 'bg-accent-soft text-accent-text border-accent-line'
                  : 'bg-mint text-mint-text border-mint-line'
              }`}
            >
              {badge.count}
            </span>
          )}
        </>
      )}
    </NavLink>
  );

  if (!collapsed) return <li>{link}</li>;

  return (
    <li>
      <SidebarTooltip label={item.name}>{link}</SidebarTooltip>
    </li>
  );
}

export default SidebarItem;
