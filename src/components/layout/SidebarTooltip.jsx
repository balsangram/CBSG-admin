import React, { useCallback, useState } from 'react';
import { createPortal } from 'react-dom';

/**
 * Fixed-position tooltip rendered through a portal so it is never clipped
 * by the sidebar's overflow-y-auto scroll container. Handlers are merged
 * onto the single child element via cloneElement.
 */
export function SidebarTooltip({ label, children }) {
  const [pos, setPos] = useState(null);

  const show = useCallback(
    (e) => {
      const rect = e.currentTarget.getBoundingClientRect();
      setPos({
        x: rect.right + 10,
        y: rect.top + rect.height / 2,
        label,
      });
    },
    [label]
  );

  const hide = useCallback(() => setPos(null), []);

  const trigger = React.cloneElement(React.Children.only(children), {
    onMouseEnter: (e) => {
      children.props.onMouseEnter?.(e);
      show(e);
    },
    onMouseLeave: (e) => {
      children.props.onMouseLeave?.(e);
      hide();
    },
    onFocus: (e) => {
      children.props.onFocus?.(e);
      show(e);
    },
    onBlur: (e) => {
      children.props.onBlur?.(e);
      hide();
    },
  });

  return (
    <>
      {trigger}
      {pos &&
        createPortal(
          <div
            role="tooltip"
            className="fixed z-[100] px-2.5 py-1.5 rounded-lg bg-ink text-cream-50 text-[11px] font-semibold whitespace-nowrap shadow-lg pointer-events-none"
            style={{
              left: pos.x,
              top: pos.y,
              transform: 'translateY(-50%)',
            }}
          >
            {pos.label}
            <span className="absolute right-full top-1/2 -translate-y-1/2 border-4 border-transparent border-r-ink" />
          </div>,
          document.body
        )}
    </>
  );
}

export default SidebarTooltip;
