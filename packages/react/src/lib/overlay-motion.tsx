
import { motion } from 'motion/react';
import { presets } from '@m3ui/motion';
import { type CSSProperties, type ReactNode } from 'react';

export interface OverlayMotionProps {
  children: ReactNode;
  style?: CSSProperties;
  className?: string;
  fullScreen?: boolean;
  'data-testid'?: string;
}

/** Dialog / sheet enter — defaultSpatial scale + defaultEffects scrim */
export function OverlayMotion({
  children,
  style,
  className,
  fullScreen = false,
  'data-testid': testId,
}: OverlayMotionProps) {
  return (
    <motion.div
      initial={{ opacity: 0, scale: fullScreen ? 1 : 0.92, y: fullScreen ? 16 : 0 }}
      animate={{ opacity: 1, scale: 1, y: 0 }}
      exit={{ opacity: 0, scale: fullScreen ? 1 : 0.92, y: fullScreen ? 16 : 0 }}
      transition={presets.spatial.enter}
      className={className}
      data-testid={testId}
      style={style}
    >
      {children}
    </motion.div>
  );
}

export interface ScrimMotionProps {
  style?: CSSProperties;
  className?: string;
  'data-testid'?: string;
}

export function ScrimMotion({ style, className, 'data-testid': testId }: ScrimMotionProps) {
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={presets.effects.enter}
      className={className}
      data-testid={testId}
      style={style}
      aria-hidden
    />
  );
}
