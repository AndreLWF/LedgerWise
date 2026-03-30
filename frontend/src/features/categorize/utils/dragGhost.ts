/** Builds an inline-styled HTML element for use as the HTML5 drag ghost image.
 *  Uses raw DOM with inline styles because React Native Web's CSS classes
 *  lose context when elements are appended to document.body. */

interface GhostColors {
  bg: string;
  text: string;
  subText: string;
  border: string;
}

export function buildDragGhost(
  description: string,
  amount: string,
  date: string,
  width: number,
  colors: GhostColors,
): HTMLDivElement {
  const ghost = document.createElement('div');
  Object.assign(ghost.style, {
    // In-viewport but invisible — Chrome/Safari need this for setDragImage
    position: 'fixed',
    top: '0px',
    left: '0px',
    zIndex: '-1',
    pointerEvents: 'none',
    // Layout
    width: `${width}px`,
    display: 'flex',
    flexDirection: 'row',
    alignItems: 'center',
    padding: '12px 16px',
    gap: '12px',
    boxSizing: 'border-box',
    // Visual
    opacity: '0.95',
    backgroundColor: colors.bg,
    borderRadius: '10px',
    border: `2px solid ${colors.border}`,
    boxShadow: '0 16px 40px rgba(0,0,0,0.25), 0 6px 16px rgba(0,0,0,0.12)',
    fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif',
  });

  const grip = document.createElement('div');
  Object.assign(grip.style, {
    width: '20px',
    display: 'flex',
    justifyContent: 'center',
    opacity: '0.4',
    fontSize: '14px',
    color: colors.subText,
    letterSpacing: '-4px',
    flexShrink: '0',
  });
  grip.textContent = '⋮⋮';

  const info = document.createElement('div');
  Object.assign(info.style, { flex: '1', minWidth: '0', overflow: 'hidden' });

  const desc = document.createElement('div');
  Object.assign(desc.style, {
    fontSize: '14px',
    fontWeight: '600',
    color: colors.text,
    whiteSpace: 'nowrap',
    overflow: 'hidden',
    textOverflow: 'ellipsis',
  });
  desc.textContent = description;

  const dateEl = document.createElement('div');
  Object.assign(dateEl.style, {
    fontSize: '12px',
    fontWeight: '500',
    color: colors.subText,
    marginTop: '2px',
  });
  dateEl.textContent = date;

  info.appendChild(desc);
  info.appendChild(dateEl);

  const amt = document.createElement('div');
  Object.assign(amt.style, {
    fontSize: '15px',
    fontWeight: '700',
    color: colors.text,
    flexShrink: '0',
    fontVariantNumeric: 'tabular-nums',
  });
  amt.textContent = amount;

  ghost.appendChild(grip);
  ghost.appendChild(info);
  ghost.appendChild(amt);

  return ghost;
}

/** Remove a ghost element from the DOM if it's still attached. */
export function removeDragGhost(ghost: HTMLDivElement | null): void {
  if (ghost?.parentNode) {
    ghost.parentNode.removeChild(ghost);
  }
}
