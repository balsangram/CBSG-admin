import React from 'react';
import { SidebarItem } from './SidebarItem';

/**
 * Sidebar nav group — label header plus its items. In collapsed
 * (icon-only) mode only a thin divider is shown between groups.
 */
export function SidebarGroup({ group, collapsed, onNavigate }) {
  return (
    <div>
      {!collapsed && (
        <div className="px-3 pb-1.5 text-[10px] font-bold uppercase tracking-[0.12em] text-ink-muted select-none">
          {group.group}
        </div>
      )}
      {collapsed && group.index > 0 && (
        <div aria-hidden="true" className="mx-3 mb-1.5 border-t border-cream-line-soft" />
      )}

      <ul aria-label={group.group} className="space-y-1">
        {group.items.map((item) => (
          <SidebarItem
            key={item.name}
            item={item}
            collapsed={collapsed}
            onNavigate={onNavigate}
          />
        ))}
      </ul>
    </div>
  );
}

export default SidebarGroup;
