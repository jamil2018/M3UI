
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
  size,
  className,
  'data-testid': testId,
}: LoadingIndicatorProps) {
  const reduced = prefersReducedMotion();

  const shapeStyle: CSSProperties = {
    width: size ?? compVar('loading-indicator', 'active-size'),
    height: size ?? compVar('loading-indicator', 'active-size'),
    background: contained
      ? compVar('loading-indicator', 'contained-active-color')
      : compVar('loading-indicator', 'active-indicator-color'),
  };

  const wrapperStyle: CSSProperties = contained
    ? {
        display: 'inline-flex',
        alignItems: 'center',
        justifyContent: 'center',
        width: compVar('loading-indicator', 'container-width'),
        height: compVar('loading-indicator', 'container-height'),
        borderRadius: compVar('loading-indicator', 'container-shape'),
        background: compVar('loading-indicator', 'contained-container-color'),
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
