
import { Toolbar as BaseToolbar } from '@base-ui/react/toolbar';
import { motion, useScroll, useTransform } from 'motion/react';
import { useEffect, useRef, type CSSProperties, type ReactNode, type RefObject } from 'react';
import { compVar, elevationShadow, typeStyle } from '../lib/token-utils.js';
import { useRegisterInset } from '../lib/inset-context.js';
import { IconButton } from './icon-button.js';

export type TopAppBarSize = 'small' | 'medium' | 'large' | 'medium-flexible' | 'large-flexible';

export interface TopAppBarProps {
  title: ReactNode;
  subtitle?: ReactNode;
  size?: TopAppBarSize;
  /** Scroll container for flexible collapse — defaults to window */
  scrollTarget?: RefObject<HTMLElement | null>;
  leading?: ReactNode;
  trailing?: ReactNode;
  onBack?: () => void;
  elevated?: boolean;
  className?: string;
  'data-testid'?: string;
}

const SIZE_PREFIX: Record<TopAppBarSize, string> = {
  small: 'app-bar-small',
  medium: 'app-bar-medium',
  large: 'app-bar-large',
  'medium-flexible': 'app-bar-medium-flexible',
  'large-flexible': 'app-bar-large-flexible',
};

const FLEXIBLE_LARGE_PREFIX: Partial<Record<TopAppBarSize, string>> = {
  'medium-flexible': 'app-bar-medium-flexible',
  'large-flexible': 'app-bar-large-flexible',
};

function isFlexible(size: TopAppBarSize): boolean {
  return size === 'medium-flexible' || size === 'large-flexible';
}

export function TopAppBar({
  title,
  subtitle,
  size = 'small',
  scrollTarget,
  leading,
  trailing,
  onBack,
  elevated = false,
  className,
  'data-testid': testId,
}: TopAppBarProps) {
  const barRef = useRef<HTMLElement>(null);
  const sizePrefix = SIZE_PREFIX[size];
  const flexible = isFlexible(size);

  const collapsedHeight = compVar(sizePrefix, 'container-height');
  const expandedHeight = flexible
    ? compVar(FLEXIBLE_LARGE_PREFIX[size]!, 'large-container-height')
    : collapsedHeight;

  const { scrollY } = useScroll({
    container: scrollTarget ?? undefined,
    layoutEffect: false,
  });

  const collapseRange = flexible ? 120 : 0;
  const height = useTransform(scrollY, [0, collapseRange], [expandedHeight, collapsedHeight]);
  const titleScale = useTransform(scrollY, [0, collapseRange], [1, 0.85]);
  const subtitleOpacity = useTransform(scrollY, [0, collapseRange * 0.6], [1, 0]);

  const staticHeight = flexible ? expandedHeight : collapsedHeight;
  useRegisterInset('top', staticHeight);

  useEffect(() => {
    if (!flexible || !barRef.current) return;
    const unsub = height.on('change', (v) => {
      barRef.current!.style.height = String(v);
    });
    return () => { unsub(); };
  }, [flexible, height]);

  const barStyle: CSSProperties = {
    position: 'sticky',
    top: 0,
    zIndex: 100,
    display: 'flex',
    flexDirection: 'column',
    justifyContent: 'flex-end',
    width: '100%',
    height: staticHeight,
    paddingInlineStart: compVar('app-bar', 'leading-space'),
    paddingInlineEnd: compVar('app-bar', 'trailing-space'),
    background: elevated
      ? compVar('app-bar', 'on-scroll-container-color')
      : compVar('app-bar', 'container-color'),
    boxShadow: elevated ? elevationShadow('level2') : elevationShadow('level0'),
    color: compVar('app-bar', 'title-color'),
    overflow: 'hidden',
  };

  const rowStyle: CSSProperties = {
    display: 'flex',
    alignItems: 'center',
    gap: compVar('app-bar', 'icon-button-space'),
    minHeight: compVar('app-bar-small', 'container-height'),
    width: '100%',
  };

  const titleStyle: CSSProperties = {
    flex: 1,
    minWidth: 0,
    ...(size === 'large' || size === 'large-flexible'
      ? typeStyle('headline-medium')
      : size === 'medium' || size === 'medium-flexible'
        ? typeStyle('headline-small')
        : typeStyle('title-large')),
    color: compVar('app-bar', 'title-color'),
  };

  const subtitleStyle: CSSProperties = {
    ...typeStyle(size === 'small' ? 'label-medium' : 'title-medium'),
    color: compVar('app-bar', 'subtitle-color'),
    paddingInlineStart: onBack || leading ? compVar('app-bar-small', 'container-height') : 0,
  };

  return (
    <BaseToolbar.Root
      ref={barRef as React.RefObject<HTMLDivElement>}
      className={className}
      data-testid={testId}
      style={barStyle}
      aria-label="Top app bar"
    >
      <div style={rowStyle}>
        {onBack && (
          <IconButton aria-label="Navigate back" icon="←" variant="standard" size="md" onClick={onBack} />
        )}
        {leading}
        <motion.div style={{ flex: 1, minWidth: 0, scale: flexible ? titleScale : 1 }}>
          <div style={titleStyle}>{title}</div>
        </motion.div>
        {trailing}
      </div>
      {subtitle && (
        <motion.div style={{ opacity: flexible ? subtitleOpacity : 1, paddingBlockEnd: compVar('list', 'item-top-space') }}>
          <div style={subtitleStyle}>{subtitle}</div>
        </motion.div>
      )}
    </BaseToolbar.Root>
  );
}
