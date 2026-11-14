import { usePrefersReducedMotion } from './use-reduced-motion.js';
import { motion, type HTMLMotionProps } from 'motion/react';
import { presets, springs } from '@m3ui/motion';
import { type CSSProperties, type ReactNode, type ComponentPropsWithRef } from 'react';

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
  const reducedMotion = usePrefersReducedMotion();
  return (
    <motion.div
      initial={{ opacity: 0, scale: fullScreen ? 1 : 0.92, y: fullScreen ? 16 : 0 }}
      animate={{ opacity: 1, scale: 1, y: 0 }}
      exit={{
        opacity: 0,
        scale: fullScreen ? 1 : 0.92,
        y: fullScreen ? 16 : 0,
        transition: reducedMotion
          ? { duration: 0 }
          : { ...presets.spatial.exit, opacity: springs.fastEffects },
      }}
      transition={
        reducedMotion
          ? { duration: 0 }
          : { ...presets.spatial.enter, opacity: springs.defaultEffects }
      }
      className={className}
      data-testid={testId}
      style={style}
    >
      {children}
    </motion.div>
  );
}

export interface ScrimMotionProps extends Omit<ComponentPropsWithRef<'div'>, 'children'> {
  'data-testid'?: string;
}

export function ScrimMotion({
  style,
  className,
  'data-testid': testId,
  ...props
}: ScrimMotionProps) {
  const reducedMotion = usePrefersReducedMotion();
  return (
    <motion.div
      {...(props as HTMLMotionProps<'div'>)}
      initial={{ opacity: 0 }}
      animate={{ opacity: style?.opacity ?? 0.32 }}
      exit={{ opacity: 0, transition: reducedMotion ? { duration: 0 } : presets.effects.exit }}
      transition={reducedMotion ? { duration: 0 } : presets.effects.enter}
      className={className}
      data-testid={testId}
      style={style}
      aria-hidden
    />
  );
}
