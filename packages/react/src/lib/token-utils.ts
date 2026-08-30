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
export const DISABLED_CONTENT_OPACITY = 'var(--md-sys-state-disabled-content-opacity)';

/** Elevation box-shadow: Material Web two-layer key (0.3) + ambient (0.15). */
export function elevationShadow(
  level: 'level0' | 'level1' | 'level2' | 'level3' | 'level4' | 'level5',
): string {
  if (level === 'level0') return 'none';
  const l = String({ level0: 0, level1: 1, level2: 2, level3: 3, level4: 4, level5: 5 }[level]);
  const keyY = `calc(1px * (clamp(0, ${l}, 1) + clamp(0, ${l} - 3, 1) + calc(2 * clamp(0, ${l} - 4, 1))))`;
  const keyBlur = `calc(1px * (calc(2 * clamp(0, ${l}, 1)) + clamp(0, ${l} - 2, 1) + clamp(0, ${l} - 4, 1)))`;
  const keyColor = 'color-mix(in srgb, var(--md-sys-color-shadow) 30%, transparent)';
  const ambientY = `calc(1px * (clamp(0, ${l}, 1) + clamp(0, ${l} - 1, 1) + calc(2 * clamp(0, ${l} - 2, 3))))`;
  const ambientBlur = `calc(1px * (calc(3 * clamp(0, ${l}, 2)) + calc(2 * clamp(0, ${l} - 2, 3))))`;
  const ambientSpread = `calc(1px * (clamp(0, ${l}, 4) + calc(2 * clamp(0, ${l} - 4, 1))))`;
  const ambientColor = 'color-mix(in srgb, var(--md-sys-color-shadow) 15%, transparent)';
  return `0px ${keyY} ${keyBlur} 0px ${keyColor}, 0px ${ambientY} ${ambientBlur} ${ambientSpread} ${ambientColor}`;
}

/** Box shadow from md-comp container-elevation token (labs/gb supported-tokens). */
export function compElevation(prefix: string, property = 'container-elevation'): string {
  return compVar(prefix, property);
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
