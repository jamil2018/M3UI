import { motion, useReducedMotionConfig } from 'motion/react';
import { prefersReducedMotion } from '@m3ui/motion';
import { LoadingIndicatorShapes, MaterialShapes, cubicsToClipPath, useMorph } from '@m3ui/shapes';
import { useEffect, useState, type CSSProperties } from 'react';
import { compVar } from '../lib/token-utils.js';

export interface LoadingIndicatorProps {
  /** When true, renders inside a contained surface */
  contained?: boolean;
  size?: number;
  className?: string;
  'data-testid'?: string;
}

const SHAPE_COUNT = LoadingIndicatorShapes.length;
const MORPH_INTERVAL_MS = 650;
const MORPH_SPRING = { type: 'spring' as const, stiffness: 200, damping: 0.6 * 2 * Math.sqrt(200), mass: 1 };
const FIRST_SHAPE = LoadingIndicatorShapes[0]!;
const REDUCED_CLIP = cubicsToClipPath(FIRST_SHAPE.cubics);

function MorphingShape({
  from,
  to,
  style,
}: {
  from: (typeof LoadingIndicatorShapes)[number];
  to: (typeof LoadingIndicatorShapes)[number];
  style: CSSProperties;
}) {
  const [active, setActive] = useState(false);

  useEffect(() => {
    setActive(true);
  }, []);

  const { clipPath, progress } = useMorph({
    from,
    to,
    active,
    transition: MORPH_SPRING,
  });

  return <div style={{ ...style, clipPath, transform: `rotate(${progress * 90}deg)` }} />;
}

export function LoadingIndicator({
  contained = false,
  size,
  className,
  'data-testid': testId,
}: LoadingIndicatorProps) {
  const reduced = useReducedMotionConfig() ?? prefersReducedMotion();
  const [cycle, setCycle] = useState(0);
  const idx = cycle % SHAPE_COUNT;

  useEffect(() => {
    if (reduced) return;
    const id = window.setInterval(() => {
      setCycle((i) => i + 1);
    }, MORPH_INTERVAL_MS);
    return () => window.clearInterval(id);
  }, [reduced]);

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

  const from = LoadingIndicatorShapes[idx] ?? FIRST_SHAPE;
  const to = LoadingIndicatorShapes[(idx + 1) % SHAPE_COUNT] ?? FIRST_SHAPE;

  return (
    <div className={className} data-testid={testId} style={wrapperStyle} role="status" aria-label="Loading">
      <motion.div
        animate={{ rotate: reduced ? 0 : [0, 360] }}
        transition={reduced ? { duration: 0 } : { duration: 4.666, repeat: Infinity, ease: 'linear' }}
        style={{ display: 'inline-flex' }}
      >
        {reduced ? (
          <div style={{ ...shapeStyle, clipPath: REDUCED_CLIP }} />
        ) : (
          <div style={{ transform: `rotate(${cycle * 90}deg)` }}>
            <MorphingShape key={cycle} from={from} to={to} style={shapeStyle} />
          </div>
        )}
      </motion.div>
    </div>
  );
}

/** Re-export default shape sequence for customization */
export { LoadingIndicatorShapes, MaterialShapes };
