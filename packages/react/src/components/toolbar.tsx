
import { Toolbar as BaseToolbar } from '@base-ui/react/toolbar';
import { motion, useMotionValueEvent, useScroll } from 'motion/react';
import { springs } from '@m3ui/motion';
import { useState, type CSSProperties, type ReactNode, type RefObject } from 'react';
import { compVar, elevationShadow } from '../lib/token-utils.js';
import { useRegisterInset } from '../lib/inset-context.js';

export type ToolbarVariant = 'docked' | 'floating';
export type ToolbarOrientation = 'horizontal' | 'vertical';

export interface ToolbarProps {
  children: ReactNode;
  variant?: ToolbarVariant;
  orientation?: ToolbarOrientation;
  /** Hide floating toolbar when scrolling down */
  hideOnScroll?: boolean;
  /** Scroll container for hideOnScroll — defaults to window */
  scrollTarget?: RefObject<HTMLElement | null>;
  vibrant?: boolean;
  className?: string;
  'data-testid'?: string;
}

export function Toolbar({
  children,
  variant = 'docked',
  orientation = 'horizontal',
  hideOnScroll = false,
  scrollTarget,
  vibrant = false,
  className,
  'data-testid': testId,
}: ToolbarProps) {
  const isFloating = variant === 'floating';
  const isVertical = orientation === 'vertical';

  useRegisterInset(
    'bottom',
    isFloating && !hideOnScroll
      ? compVar('floating-toolbar', 'container-external-padding')
      : '0px',
  );

  const { scrollY } = useScroll({ container: scrollTarget });
  const [hidden, setHidden] = useState(false);
  let lastY = 0;

  useMotionValueEvent(scrollY, 'change', (y) => {
    if (!hideOnScroll || !isFloating) return;
    if (y > lastY + 8) setHidden(true);
    else if (y < lastY - 8) setHidden(false);
    lastY = y;
  });

  const dockedStyle: CSSProperties = {
    display: 'flex',
    flexDirection: isVertical ? 'column' : 'row',
    alignItems: 'center',
    gap: compVar('docked-toolbar', 'container-min-spacing'),
    height: isVertical ? 'auto' : compVar('docked-toolbar', 'container-height'),
    width: isVertical ? compVar('docked-toolbar', 'container-height') : '100%',
    paddingInline: compVar('docked-toolbar', 'container-leading-space'),
    paddingBlock: isVertical ? compVar('docked-toolbar', 'container-leading-space') : undefined,
    background: compVar('docked-toolbar', 'container-color'),
    borderRadius: compVar('docked-toolbar', 'container-shape'),
  };

  const floatingStyle: CSSProperties = {
    display: 'inline-flex',
    flexDirection: isVertical ? 'column' : 'row',
    alignItems: 'center',
    gap: compVar('floating-toolbar', 'container-between-space'),
    height: isVertical ? 'auto' : compVar('floating-toolbar', 'container-height'),
    paddingInline: compVar('floating-toolbar', 'container-leading-space'),
    paddingBlock: isVertical ? compVar('floating-toolbar', 'container-leading-space') : undefined,
    background: vibrant
      ? compVar('floating-toolbar', 'vibrant-container-color')
      : compVar('floating-toolbar', 'standard-container-color'),
    borderRadius: compVar('floating-toolbar', 'container-shape'),
    boxShadow: elevationShadow('level2'),
    margin: compVar('floating-toolbar', 'container-external-padding'),
  };

  const barStyle = isFloating ? floatingStyle : dockedStyle;

  const motionProps = isFloating && hideOnScroll
    ? {
        animate: { y: hidden ? 120 : 0, opacity: hidden ? 0 : 1 },
        transition: springs.defaultSpatial,
        style: { ...barStyle, position: 'fixed' as const, bottom: 16, left: '50%', x: '-50%', zIndex: 100 },
      }
    : { style: barStyle };

  return (
    <motion.div {...motionProps}>
      <BaseToolbar.Root
        className={className}
        orientation={orientation}
        aria-label="Toolbar"
        data-testid={testId}
        style={{ display: 'contents' }}
      >
        {children}
      </BaseToolbar.Root>
    </motion.div>
  );
}

export interface ToolbarButtonProps {
  children: ReactNode;
  selected?: boolean;
  vibrant?: boolean;
  onClick?: () => void;
  'aria-label'?: string;
  className?: string;
}

export function ToolbarButton({
  children,
  selected = false,
  vibrant = false,
  onClick,
  'aria-label': ariaLabel,
  className,
}: ToolbarButtonProps) {
  const style: CSSProperties = vibrant
    ? {
        background: selected
          ? compVar('floating-toolbar', 'vibrant-button-selected-container-color')
          : 'transparent',
        color: selected
          ? compVar('floating-toolbar', 'vibrant-button-selected-icon-color')
          : compVar('floating-toolbar', 'vibrant-button-unselected-icon-color'),
        border: 'none',
        borderRadius: compVar('floating-toolbar', 'container-shape'),
        padding: 8,
        cursor: 'pointer',
      }
    : {
        background: 'transparent',
        color: 'inherit',
        border: 'none',
        padding: 8,
        cursor: 'pointer',
        borderRadius: compVar('docked-toolbar', 'container-shape'),
      };

  return (
    <BaseToolbar.Button
      className={className}
      aria-label={ariaLabel}
      aria-pressed={selected}
      onClick={onClick}
      style={style}
    >
      {children}
    </BaseToolbar.Button>
  );
}
