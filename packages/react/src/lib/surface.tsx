import { ELEVATION_LEVELS, type ElevationLevel } from '@m3ui/tokens';
import { type CSSProperties, type HTMLAttributes, type ReactNode } from 'react';
import { elevationShadow, sysColor, sysShape } from './token-utils.js';

export interface SurfaceProps extends HTMLAttributes<HTMLDivElement> {
  children: ReactNode;
  elevation?: ElevationLevel;
  /** Apply surface-tint gradient overlay (Expressive elevation tint) */
  tint?: boolean;
}

/** Surface container styles using Material Web two-layer elevation tokens. */
export function surfaceStyle(
  elevation: ElevationLevel = 'level0',
  tint = true,
): CSSProperties {
  const { surfaceTintOpacity } = ELEVATION_LEVELS[elevation];
  const tintOverlay =
    tint && surfaceTintOpacity > 0
      ? `linear-gradient(color-mix(in srgb, ${sysColor('primary')} ${surfaceTintOpacity * 100}%, transparent), color-mix(in srgb, ${sysColor('primary')} ${surfaceTintOpacity * 100}%, transparent))`
      : undefined;

  return {
    background: tintOverlay
      ? `${tintOverlay}, ${sysColor('surface')}`
      : sysColor('surface'),
    boxShadow: elevationShadow(elevation),
    borderRadius: sysShape('corner-medium'),
    color: sysColor('on-surface'),
  };
}

/**
 * Token-aligned surface container — elevation via `elevationShadow()` (key + ambient).
 * Does not replace the primitive export; use for lib-level composition parity.
 */
export function Surface({
  children,
  elevation = 'level0',
  tint = true,
  className,
  style,
  ...props
}: SurfaceProps) {
  return (
    <div
      className={className}
      style={{ ...surfaceStyle(elevation, tint), ...style }}
      data-elevation={elevation}
      {...props}
    >
      {children}
    </div>
  );
}
