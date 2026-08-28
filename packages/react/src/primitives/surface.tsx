import { ELEVATION_LEVELS, type ElevationLevel } from '@m3ui/tokens';
import { type HTMLAttributes, type ReactNode } from 'react';
import { useM3Theme } from '../provider/m3-provider.js';

export interface SurfaceProps extends HTMLAttributes<HTMLDivElement> {
  children: ReactNode;
  elevation?: ElevationLevel;
  tint?: boolean;
}

function elevationToShadow(level: ElevationLevel): string {
  const { elevation, shadowOpacity } = ELEVATION_LEVELS[level];
  if (elevation === 0) return 'none';
  return `0px ${elevation}px ${elevation * 2}px rgba(0, 0, 0, ${shadowOpacity})`;
}

export function Surface({
  children,
  elevation = 'level0',
  tint = true,
  className,
  style,
  ...props
}: SurfaceProps) {
  const theme = useM3Theme();
  const { surfaceTintOpacity } = ELEVATION_LEVELS[elevation];
  const primary = theme.colors.primary ?? '#6750A4';

  const tintOverlay =
    tint && surfaceTintOpacity > 0
      ? `linear-gradient(color-mix(in srgb, ${primary} ${surfaceTintOpacity * 100}%, transparent), color-mix(in srgb, ${primary} ${surfaceTintOpacity * 100}%, transparent))`
      : undefined;

  return (
    <div
      className={className}
      style={{
        background: tintOverlay
          ? `${tintOverlay}, var(--md-sys-color-surface, ${theme.colors.surface})`
          : `var(--md-sys-color-surface, ${theme.colors.surface})`,
        boxShadow: elevationToShadow(elevation),
        borderRadius: 'var(--md-sys-shape-corner-medium, 12px)',
        color: `var(--md-sys-color-on-surface, ${theme.colors.onSurface})`,
        ...style,
      }}
      data-elevation={elevation}
      {...props}
    >
      {children}
    </div>
  );
}

export { ELEVATION_LEVELS };
