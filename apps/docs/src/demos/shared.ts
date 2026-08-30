import type { CSSProperties } from 'react';

export const row: CSSProperties = {
  display: 'flex',
  flexWrap: 'wrap',
  gap: 'var(--md-sys-spacing-2, 8px)',
  alignItems: 'center',
};

export const column: CSSProperties = {
  display: 'flex',
  flexDirection: 'column',
  gap: 'var(--md-sys-spacing-4, 16px)',
};

export const narrow: CSSProperties = { maxWidth: 320 };

/** Framed demo chrome using semantic surface tokens */
export const frame: CSSProperties = {
  border: '1px solid var(--md-sys-color-outline-variant)',
  borderRadius: 'var(--md-sys-shape-corner-medium, 12px)',
  background: 'var(--md-sys-color-surface-container-lowest)',
  overflow: 'hidden',
};

/** Caption for grouped demo rows (variants, sizes, elevation) */
export const caption: CSSProperties = {
  margin: 0,
  color: 'var(--md-sys-color-on-surface-variant)',
  fontSize: 'var(--md-sys-typescale-label-medium-size, 0.75rem)',
  lineHeight: 'var(--md-sys-typescale-label-medium-line-height, 1rem)',
  fontWeight: 'var(--md-sys-typescale-label-medium-weight, 500)',
};
