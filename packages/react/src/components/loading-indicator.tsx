
import { motion } from 'motion/react';
import { prefersReducedMotion } from '@m3ui/motion';
import { LoadingIndicatorShapes, MaterialShapes, cubicsToClipPath } from '@m3ui/shapes';
import { type CSSProperties } from 'react';
import { compVar } from '../lib/token-utils.js';

export interface LoadingIndicatorProps {
  /** When true, renders inside a contained surface */
  contained?: boolean;
  size?: number;
  className?: string;
  'data-testid'?: string;
}

const SHAPE_CLIP_PATHS = LoadingIndicatorShapes.map((poly) => cubicsToClipPath(poly.cubics));

export function LoadingIndicator({
  contained = false,
  size = 48,
  className,
  'data-testid': testId,
}: LoadingIndicatorProps) {
  const reduced = prefersReducedMotion();

  const shapeStyle: CSSProperties = {
    width: size,
    height: size,
    background: compVar('progress-indicator', 'active-indicator-color'),
  };

  const wrapperStyle: CSSProperties = contained
    ? {
        display: 'inline-flex',
        alignItems: 'center',
        justifyContent: 'center',
        padding: compVar('list', 'item-between-space'),
        borderRadius: compVar('menu', 'container-shape'),
        background: compVar('menu', 'container-color'),
        boxShadow: `0 var(--md-sys-elevation-level1) calc(var(--md-sys-elevation-level1) * 2) rgba(0, 0, 0, var(--md-sys-elevation-level1-shadow-opacity))`,
      }
    : { display: 'inline-flex' };

  return (
    <div className={className} data-testid={testId} style={wrapperStyle} role="status" aria-label="Loading">
      <motion.div
        style={shapeStyle}
        animate={
          reduced
            ? { clipPath: SHAPE_CLIP_PATHS[0], rotate: 0 }
            : {
                clipPath: SHAPE_CLIP_PATHS,
                rotate: 360,
              }
        }
        transition={
          reduced
            ? { duration: 0 }
            : {
                clipPath: { duration: 2, repeat: Infinity, ease: 'linear' },
                rotate: { duration: 1.5, repeat: Infinity, ease: 'linear' },
              }
        }
      />
    </div>
  );
}

/** Re-export default shape sequence for customization */
export { LoadingIndicatorShapes, MaterialShapes };
