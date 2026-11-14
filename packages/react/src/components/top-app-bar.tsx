import { Toolbar as BaseToolbar } from '@base-ui/react/toolbar';
import { motion, useMotionValueEvent, useScroll, useTransform } from 'motion/react';
import { Icon } from '@m3ui/icons';
import {
  useEffect,
  useRef,
  useState,
  type CSSProperties,
  type ReactNode,
  type RefObject,
} from 'react';
import { compVar, compElevation, typeStyle } from '../lib/token-utils.js';
import { useRegisterInset } from '../lib/inset-context.js';
import { IconButton } from './icon-button.js';

export type TopAppBarSize = 'small' | 'medium' | 'large' | 'medium-flexible' | 'large-flexible';

export interface TopAppBarProps {
  title: ReactNode;
  subtitle?: ReactNode;
  size?: TopAppBarSize;
  variant?: 'default' | 'center-aligned';
  /** Scroll container for flexible collapse — defaults to window */
  scrollTarget?: RefObject<HTMLElement | null>;
  leading?: ReactNode;
  trailing?: ReactNode;
  onBack?: () => void;
  elevated?: boolean;
  className?: string;
  'data-testid'?: string;
}

function isFlexible(size: TopAppBarSize): boolean {
  return size === 'medium-flexible' || size === 'large-flexible';
}

function expandedHeightPx(size: TopAppBarSize, subtitle: boolean): number {
  if (size === 'large' || size === 'large-flexible') return subtitle ? 176 : 152;
  if (size === 'medium' || size === 'medium-flexible') return subtitle ? 152 : 128;
  return 64;
}

const scrollAnchorUsers = new WeakMap<HTMLElement, { count: number; previous: string }>();

export function TopAppBar({
  title,
  subtitle,
  size = 'small',
  variant = 'default',
  scrollTarget,
  leading,
  trailing,
  onBack,
  elevated = false,
  className,
  'data-testid': testId,
}: TopAppBarProps) {
  const barRef = useRef<HTMLElement>(null);
  const flexible = isFlexible(size);
  const twoRow = size !== 'small';
  const expandedPx = expandedHeightPx(size, Boolean(subtitle));
  const collapsedPx = 64;
  const [scrolled, setScrolled] = useState(false);
  const [collapsed, setCollapsed] = useState(false);

  const { scrollY } = useScroll({
    container: scrollTarget ?? undefined,
  });

  useMotionValueEvent(scrollY, 'change', (y) => {
    setScrolled(y > 4);
    setCollapsed(flexible && y >= 72);
  });

  useEffect(() => {
    if (!flexible) return;
    const container = scrollTarget?.current ?? document.documentElement;
    // Scroll anchoring otherwise compensates for our shrinking header by moving
    // scrollTop backwards, feeding that movement back into the collapse itself.
    const entry = scrollAnchorUsers.get(container) ?? {
      count: 0,
      previous: container.style.overflowAnchor,
    };
    entry.count += 1;
    scrollAnchorUsers.set(container, entry);
    container.style.overflowAnchor = 'none';
    return () => {
      entry.count -= 1;
      if (entry.count === 0) {
        container.style.overflowAnchor = entry.previous;
        scrollAnchorUsers.delete(container);
      }
    };
  }, [flexible, scrollTarget]);

  const isElevated = elevated || scrolled;
  const collapseRange = flexible ? 120 : 0;
  const height = useTransform(scrollY, [0, collapseRange], [expandedPx, collapsedPx]);
  const large = size === 'large' || size === 'large-flexible';
  const titleTop = useTransform(scrollY, [0, collapseRange || 1], [64, 18]);
  const titleStart = useTransform(
    scrollY,
    [0, collapseRange || 1],
    [16, onBack || leading ? 64 : 16],
  );
  const titleSize = useTransform(scrollY, [0, collapseRange || 1], [large ? 36 : 28, 22]);
  const titleLineHeight = useTransform(
    scrollY,
    [0, collapseRange || 1],
    [large ? '44px' : '36px', '28px'],
  );
  const subtitleOpacity = useTransform(scrollY, [0, (collapseRange || 1) * 0.6], [1, 0]);

  const staticHeight = twoRow || flexible ? `${expandedPx}px` : `${collapsedPx}px`;
  useRegisterInset('top', staticHeight);

  useEffect(() => {
    if (!flexible || !barRef.current) return;
    const unsub = height.on('change', (v) => {
      barRef.current!.style.height = typeof v === 'number' ? `${v}px` : String(v);
    });
    return () => {
      unsub();
    };
  }, [flexible, height]);

  const barStyle: CSSProperties = {
    position: 'sticky',
    top: 0,
    zIndex: 100,
    display: 'flex',
    flexDirection: 'column',
    justifyContent: twoRow ? 'flex-start' : 'center',
    width: '100%',
    height: staticHeight,
    paddingInlineStart: compVar('app-bar', 'leading-space'),
    paddingInlineEnd: compVar('app-bar', 'trailing-space'),
    borderRadius: compVar('app-bar', 'container-shape'),
    background: isElevated
      ? compVar('app-bar', 'on-scroll-container-color')
      : compVar('app-bar', 'container-color'),
    boxShadow: isElevated
      ? compElevation('app-bar', 'on-scroll-container-elevation')
      : compElevation('app-bar'),
    color: compVar('app-bar', 'title-color'),
    overflow: 'hidden',
  };

  const rowStyle: CSSProperties = {
    display: 'flex',
    alignItems: 'center',
    gap: compVar('app-bar', 'icon-button-space'),
    minHeight: compVar('app-bar-small', 'container-height'),
    height: compVar('app-bar-small', 'container-height'),
    width: '100%',
    flexShrink: 0,
  };

  const titleStyle: CSSProperties = {
    minWidth: 0,
    whiteSpace: 'nowrap',
    textOverflow: 'ellipsis',
    overflow: 'hidden',
    ...(size === 'large' || size === 'large-flexible'
      ? typeStyle('display-small')
      : size === 'medium' || size === 'medium-flexible'
        ? typeStyle('headline-medium')
        : typeStyle('title-large')),
    color: compVar('app-bar', 'title-color'),
    textAlign: variant === 'center-aligned' && size === 'small' ? 'center' : undefined,
  };

  const subtitleStyle: CSSProperties = {
    ...typeStyle(
      size === 'large' || size === 'large-flexible'
        ? 'title-medium'
        : size === 'medium' || size === 'medium-flexible'
          ? 'label-large'
          : 'label-medium',
    ),
    color: compVar('app-bar', 'subtitle-color'),
  };

  const navRow = (
    <div style={rowStyle}>
      {onBack && (
        <span style={{ color: compVar('app-bar', 'leading-icon-color'), display: 'inline-flex' }}>
          <IconButton
            aria-label="Navigate back"
            icon={<Icon name="arrow_back" />}
            variant="standard"
            size="sm"
            onClick={onBack}
          />
        </span>
      )}
      {leading && (
        <span style={{ color: compVar('app-bar', 'leading-icon-color'), display: 'inline-flex' }}>
          {leading}
        </span>
      )}
      {!twoRow && (
        <div
          style={{
            flex: 1,
            minWidth: 0,
            marginInline: 4,
            textAlign: variant === 'center-aligned' ? 'center' : undefined,
          }}
        >
          <div data-app-bar-title style={titleStyle}>
            {title}
          </div>
          {subtitle && (
            <div data-app-bar-subtitle style={subtitleStyle}>
              {subtitle}
            </div>
          )}
        </div>
      )}
      {twoRow && <div style={{ flex: 1, minWidth: 0 }} />}
      {trailing && (
        <span style={{ color: compVar('app-bar', 'trailing-icon-color'), display: 'inline-flex' }}>
          {trailing}
        </span>
      )}
    </div>
  );

  return (
    <BaseToolbar.Root
      ref={barRef as React.RefObject<HTMLDivElement>}
      className={className}
      data-testid={testId}
      style={barStyle}
      aria-label="Top app bar"
    >
      {navRow}
      {twoRow && (
        <motion.div
          style={{
            position: 'absolute',
            top: flexible ? titleTop : 64,
            insetInlineStart: flexible ? titleStart : 16,
            insetInlineEnd: trailing ? 64 : 16,
            minWidth: 0,
          }}
        >
          <motion.div
            data-app-bar-title
            style={{
              ...titleStyle,
              fontSize: flexible ? titleSize : titleStyle.fontSize,
              lineHeight: flexible ? titleLineHeight : titleStyle.lineHeight,
            }}
          >
            {title}
          </motion.div>
          {subtitle && (
            <motion.div
              data-app-bar-subtitle
              aria-hidden={collapsed || undefined}
              style={{
                ...subtitleStyle,
                opacity: flexible ? subtitleOpacity : 1,
                visibility: collapsed ? 'hidden' : undefined,
                whiteSpace: 'nowrap',
                overflow: 'hidden',
                textOverflow: 'ellipsis',
              }}
            >
              {subtitle}
            </motion.div>
          )}
        </motion.div>
      )}
    </BaseToolbar.Root>
  );
}
