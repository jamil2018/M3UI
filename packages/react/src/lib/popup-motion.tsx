import { usePrefersReducedMotion } from './use-reduced-motion.js';
import { motion } from 'motion/react';
import { springs } from '@m3ui/motion';
import { type CSSProperties, type ReactNode } from 'react';

export interface PopupMotionProps {
  children: ReactNode;
  style?: CSSProperties;
  className?: string;
  'data-testid'?: string;
}

/** M3 popup enter/exit — fastSpatial scale/translate + fastEffects opacity */
export function PopupMotion({
  children,
  style,
  className,
  'data-testid': testId,
}: PopupMotionProps) {
  const reducedMotion = usePrefersReducedMotion();
  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.95, y: -4 }}
      animate={{ opacity: 1, scale: 1, y: 0 }}
      exit={{
        opacity: 0,
        scale: 0.95,
        y: -4,
        transition: reducedMotion
          ? { duration: 0 }
          : { ...springs.fastSpatial, opacity: springs.fastEffects },
      }}
      transition={
        reducedMotion ? { duration: 0 } : { ...springs.fastSpatial, opacity: springs.fastEffects }
      }
      className={className}
      data-testid={testId}
      style={style}
    >
      {children}
    </motion.div>
  );
}
