import { type CSSProperties } from 'react';

/** Position independently of transform so popup WAAPI can animate its own transform. */
export const modalPopupLayout: CSSProperties = {
  position: 'fixed',
  zIndex: 'calc(var(--m3-overlay-layer, 1100) + 1)',
  top: '50%',
  left: '50%',
  translate: '-50% -50%',
  width: 'max-content',
  maxWidth: 'calc(100vw - 32px)',
  maxHeight: 'calc(100dvh - 32px)',
  overflow: 'auto',
  boxSizing: 'border-box',
};
