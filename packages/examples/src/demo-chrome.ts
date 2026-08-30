import type { CSSProperties } from 'react';

/** Token-backed row layout for component galleries */
export const demoRow: CSSProperties = {
  display: 'flex',
  flexWrap: 'wrap',
  gap: 'var(--md-sys-spacing-2, 8px)',
  alignItems: 'center',
};

/** Token-backed column layout for stacked demos */
export const demoColumn: CSSProperties = {
  display: 'flex',
  flexDirection: 'column',
  gap: 'var(--md-sys-spacing-4, 16px)',
};

/** Framed demo surface using sys color and shape tokens */
export const demoFrame: CSSProperties = {
  border: '1px solid var(--md-sys-color-outline-variant)',
  borderRadius: 'var(--md-sys-shape-corner-medium, 12px)',
  background: 'var(--md-sys-color-surface-container-lowest)',
  overflow: 'hidden',
};

/** Secondary label for multi-row demo sections */
export const demoCaption: CSSProperties = {
  margin: 0,
  color: 'var(--md-sys-color-on-surface-variant)',
  fontSize: 'var(--md-sys-typescale-label-medium-size, 0.75rem)',
  lineHeight: 'var(--md-sys-typescale-label-medium-line-height, 1rem)',
  fontWeight: 'var(--md-sys-typescale-label-medium-weight, 500)',
  letterSpacing: 'var(--md-sys-typescale-label-medium-tracking, 0.031em)',
};
