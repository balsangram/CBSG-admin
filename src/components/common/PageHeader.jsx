import React from 'react';
import { cn } from '../../utils/helpers';

/**
 * Full-width gradient page header — breadcrumb trail + title + subtitle
 * + optional action buttons, using the CBSG black→gold ramp.
 *
 * @param {string[]} crumbs - breadcrumb trail; last item is current page
 * @param {string} title
 * @param {string} subtitle
 * @param {React.ReactNode} leading - optional content rendered left of the breadcrumb (e.g. back button)
 * @param {React.ReactNode} actions - buttons rendered below subtitle
 * @param {string} className
 */
export function PageHeader({ crumbs = [], title, subtitle, leading, actions, className = '' }) {
  return (
    <div
      className={cn(
        'relative overflow-hidden rounded-2xl bg-linear-to-r from-[#2c1b15] via-[#3d2a22] to-[#c88a29] px-5 py-5 sm:px-7 shadow-md',
        className
      )}
    >
      <div
        aria-hidden="true"
        className="absolute -right-10 -top-16 h-44 w-44 rounded-full bg-[#c88a29]/20 blur-2xl"
      />
      <div className="relative">
        {(crumbs.length > 0 || leading) && (
          <div className="flex items-center gap-3">
            {leading}
            {crumbs.length > 0 && (
          <nav aria-label="Breadcrumb">
            <ol className="flex items-center gap-2 text-xs font-semibold">
              {crumbs.map((crumb, i) => {
                const isLast = i === crumbs.length - 1;
                return (
                  <React.Fragment key={crumb}>
                    {i > 0 && (
                      <li aria-hidden="true" className="text-white/40">/</li>
                    )}
                    <li
                      aria-current={isLast ? 'page' : undefined}
                      className={isLast ? 'text-[#f3e6d4]' : ''}
                    >
                      <span
                        className={cn(
                          isLast
                            ? 'cursor-default'
                            : 'text-white/70 hover:text-white transition-colors cursor-pointer'
                        )}
                      >
                        {crumb}
                      </span>
                    </li>
                  </React.Fragment>
                );
              })}
            </ol>
          </nav>
            )}
          </div>
        )}

        {title && (
          <h2 className={cn('text-xl sm:text-2xl font-bold tracking-tight text-white', crumbs.length > 0 && 'mt-3')}>
            {title}
          </h2>
        )}
        {subtitle && (
          <p className="mt-1 text-xs text-[#e8d5c4]">{subtitle}</p>
        )}
        {actions && <div className="mt-4 flex items-center gap-2 flex-wrap">{actions}</div>}
      </div>
    </div>
  );
}

export default PageHeader;
