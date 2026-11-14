import { type CSSProperties, type ReactNode } from 'react';
import { compVar, typeStyle } from '../lib/token-utils.js';

export type BadgeVariant = 'dot' | 'large';

export interface BadgeProps {
  count?: number;
  max?: number;
  variant?: BadgeVariant;
  /** When provided, positions the badge as an overlay on the child */
  children?: ReactNode;
  className?: string;
  'data-testid'?: string;
}

export function Badge({
  count = 0,
  max = 99,
  variant = 'large',
  children,
  className,
  'data-testid': testId,
}: BadgeProps) {
  const isDot = variant === 'dot';
  const display = count > max ? `${String(max)}+` : String(count);
  const showLarge = !isDot && count > 0;

  const badgeOrDotStyle: CSSProperties = isDot
    ? {
        width: compVar('badge', 'size'),
        height: compVar('badge', 'size'),
        borderRadius: compVar('badge', 'shape'),
        background: compVar('badge', 'color'),
        display: 'inline-block',
      }
      : {
        minWidth: compVar('badge', 'large-size'),
        height: compVar('badge', 'large-size'),
        paddingInline:
          display.length > 1 ? compVar('fab-menu-baseline', 'list-item-between-space') : 0,
        borderRadius: compVar('badge', 'large-shape'),
        background: compVar('badge', 'large-color'),
        color: compVar('badge', 'large-label-text-color'),
        ...typeStyle('label-small'),
        display: 'inline-flex',
        alignItems: 'center',
        justifyContent: 'center',
      };

  if (children != null) {
    const showOverlay = isDot || showLarge;
    return (
      <span className={className} data-testid={testId} style={{ position: 'relative', display: 'inline-flex' }}>
        {children}
        {showOverlay && (
          <span
            style={{
              ...badgeOrDotStyle,
              position: 'absolute',
              top: isDot ? 0 : -4,
              insetInlineEnd: isDot ? 0 : -6,
            }}
            aria-hidden={isDot || undefined}
            aria-label={showLarge ? `${display} notifications` : undefined}
          >
            {showLarge ? display : null}
          </span>
        )}
      </span>
    );
  }

  if (isDot) {
    return <span className={className} data-testid={testId} style={badgeOrDotStyle} aria-hidden />;
  }

  if (!showLarge) return null;

  return (
    <span className={className} data-testid={testId} style={badgeOrDotStyle} aria-label={`${display} notifications`}>
      {display}
    </span>
  );
}
