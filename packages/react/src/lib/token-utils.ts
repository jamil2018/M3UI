import type { CSSProperties } from 'react';

/** Reference a Phase 1 md-comp token CSS custom property */
export function compVar(prefix: string, property: string): string {
  return `var(--md-comp-${prefix}-${property})`;
}

/** Reference a sys color role */
export function sysColor(role: string): string {
  return `var(--md-sys-color-${role})`;
}

/** Reference a sys shape corner */
export function sysShape(corner: string): string {
  return `var(--md-sys-shape-${corner})`;
}

/** M3 typescale as inline font shorthand parts */
export function typeStyle(role: string): CSSProperties {
  return {
    fontSize: `var(--md-sys-typescale-${role}-size)`,
    lineHeight: `var(--md-sys-typescale-${role}-line-height)`,
    fontWeight: `var(--md-sys-typescale-${role}-weight)`,
    letterSpacing: `var(--md-sys-typescale-${role}-tracking)`,
  };
}

/** Standard disabled content opacity from M3 spec */
export const DISABLED_CONTENT_OPACITY = 'var(--md-sys-state-disabled-content-opacity, 0.38)';

/** Elevation box-shadow from sys tokens */
export function elevationShadow(level: 'level0' | 'level1' | 'level2' | 'level3' | 'level4' | 'level5'): string {
  if (level === 'level0') return 'none';
  return `0 var(--md-sys-elevation-${level}) calc(var(--md-sys-elevation-${level}) * 2) rgba(0, 0, 0, var(--md-sys-elevation-${level}-shadow-opacity))`;
}

export const BUTTON_SIZES = ['xs', 'sm', 'md', 'lg', 'xl'] as const;
export type ButtonSize = (typeof BUTTON_SIZES)[number];

export const BUTTON_SIZE_PREFIX: Record<ButtonSize, string> = {
  xs: 'button-xsmall',
  sm: 'button-small',
  md: 'button-medium',
  lg: 'button-large',
  xl: 'button-xlarge',
};

export const ICON_BUTTON_SIZE_PREFIX: Record<ButtonSize, string> = {
  xs: 'xsmall-icon-button',
  sm: 'small-icon-button',
  md: 'medium-icon-button',
  lg: 'large-icon-button',
  xl: 'xlarge-icon-button',
};

export function buttonSizeTokens(size: ButtonSize) {
  const p = BUTTON_SIZE_PREFIX[size];
  return {
    height: compVar(p, 'container-height'),
    shapeRound: compVar(p, 'container-shape-round'),
    shapeSquare: compVar(p, 'container-shape-square'),
    pressedShape: compVar(p, 'pressed-container-shape'),
    leadingSpace: compVar(p, 'leading-space'),
    trailingSpace: compVar(p, 'trailing-space'),
    iconLabelSpace: compVar(p, 'icon-label-space'),
    iconSize: compVar(p, 'icon-size'),
    outlineWidth: compVar(p, 'outlined-outline-width'),
  };
}

export function iconButtonSizeTokens(size: ButtonSize, width: 'narrow' | 'default' | 'wide') {
  const p = ICON_BUTTON_SIZE_PREFIX[size];
  const padKey =
    width === 'narrow'
      ? 'narrow-leading-space'
      : width === 'wide'
        ? 'wide-leading-space'
        : size === 'md' || size === 'lg' || size === 'xl'
          ? 'default-leading-space'
          : 'default-leading-space';
  const padTrailKey = padKey.replace('leading', 'trailing');
  return {
    height: compVar(p, 'container-height'),
    shapeRound: compVar(p, 'container-shape-round'),
    shapeSquare: compVar(p, 'container-shape-square'),
    pressedShape: compVar(p, 'pressed-container-shape'),
    leadingSpace: compVar(p, padKey),
    trailingSpace: compVar(p, padTrailKey),
    iconSize: compVar(p, 'icon-size'),
    outlineWidth: compVar(p, 'outlined-outline-width'),
  };
}
