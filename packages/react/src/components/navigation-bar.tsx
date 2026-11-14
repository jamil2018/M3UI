import { motion } from 'motion/react';
import { springs } from '@m3ui/motion';
import { useId, useState, type CSSProperties, type ReactNode } from 'react';
import { compVar, typeStyle } from '../lib/token-utils.js';
import { useRegisterInset } from '../lib/inset-context.js';
import { PressableShell } from '../lib/pressable-shell.js';
import { Badge } from './badge.js';

export interface NavigationDestination {
  value: string;
  label: ReactNode;
  icon: ReactNode;
  badge?: number;
}

export interface NavigationBarProps {
  destinations: NavigationDestination[];
  value?: string;
  defaultValue?: string;
  onValueChange?: (value: string) => void;
  iconOnly?: boolean;
  /** Icon-above-label (vertical) or icon-beside-label (horizontal) destination layout */
  itemLayout?: 'vertical' | 'horizontal';
  className?: string;
  'data-testid'?: string;
}

export function NavigationBar({
  destinations,
  value: controlled,
  defaultValue,
  onValueChange,
  iconOnly = false,
  itemLayout = 'vertical',
  className,
  'data-testid': testId,
}: NavigationBarProps) {
  if (destinations.length < 3 || destinations.length > 5) {
    throw new RangeError('NavigationBar requires 3–5 destinations');
  }

  const navId = useId();
  const [internal, setInternal] = useState(defaultValue ?? destinations[0]?.value ?? '');
  const active = controlled ?? internal;

  const height = iconOnly
    ? compVar('navigation-bar', 'tall-container-height')
    : compVar('navigation-bar', 'container-height');
  useRegisterInset('bottom', height);

  const select = (v: string) => {
    if (controlled === undefined) setInternal(v);
    onValueChange?.(v);
  };

  const barStyle: CSSProperties = {
    position: 'fixed',
    bottom: 0,
    insetInline: 0,
    zIndex: 90,
    display: 'flex',
    alignItems: 'stretch',
    justifyContent: 'space-around',
    height,
    background: compVar('navigation-bar', 'container-color'),
    boxShadow: `0 calc(-1 * var(--md-sys-elevation-level2)) var(--md-sys-elevation-level2) color-mix(in srgb, var(--md-sys-color-shadow) calc(var(--md-sys-elevation-level2-shadow-opacity) * 100%), transparent)`,
  };

  return (
    <nav
      className={className}
      data-testid={testId}
      data-layout={iconOnly ? 'icon-only' : 'icon-label'}
      data-item-layout={itemLayout}
      style={barStyle}
      aria-label="Navigation bar"
    >
      {destinations.map((dest) => {
        const isActive = dest.value === active;
        return (
          <NavigationBarItem
            key={dest.value}
            destination={dest}
            active={isActive}
            iconOnly={iconOnly}
            itemLayout={itemLayout}
            layoutId={`${navId}-indicator`}
            onSelect={() => {
              select(dest.value);
            }}
          />
        );
      })}
    </nav>
  );
}

interface NavigationBarItemProps {
  destination: NavigationDestination;
  active: boolean;
  iconOnly: boolean;
  itemLayout: 'vertical' | 'horizontal';
  layoutId: string;
  onSelect: () => void;
}

function NavigationBarItem({
  destination,
  active,
  iconOnly,
  itemLayout,
  layoutId,
  onSelect,
}: NavigationBarItemProps) {
  const vertical = itemLayout === 'vertical';
  const itemPrefix = vertical ? 'navigation-bar-vertical-item' : 'navigation-bar-horizontal-item';

  const iconStyle: CSSProperties = {
    width: compVar(itemPrefix, 'icon-size'),
    height: compVar(itemPrefix, 'icon-size'),
    display: 'inline-flex',
    alignItems: 'center',
    justifyContent: 'center',
  };

  const indicatorStyle: CSSProperties = vertical
    ? {
        position: 'absolute',
        inset: 0,
        borderRadius: compVar('navigation-bar', 'item-active-indicator-shape'),
        background: compVar('navigation-bar', 'item-active-indicator-color'),
        zIndex: 0,
      }
    : {
        position: 'absolute',
        height: compVar('navigation-bar-horizontal-item', 'active-indicator-height'),
        insetInline: compVar('navigation-bar-horizontal-item', 'active-indicator-leading-space'),
        borderRadius: compVar('navigation-bar', 'item-active-indicator-shape'),
        background: compVar('navigation-bar', 'item-active-indicator-color'),
        zIndex: 0,
      };

  const badgeOverlay =
    destination.badge != null && destination.badge > 0 ? (
      <span style={{ position: 'absolute', top: -2, insetInlineEnd: 8, zIndex: 2 }}>
        <Badge count={destination.badge} />
      </span>
    ) : null;

  return (
    <PressableShell
      shape="round"
      shapeRound={compVar('navigation-bar', 'item-active-indicator-shape')}
      shapeSquare={compVar('navigation-bar', 'item-active-indicator-shape')}
      pressedShape={compVar('navigation-bar', 'item-active-indicator-shape')}
      style={{ flex: 1, position: 'relative' }}
    >
      <button
        type="button"
        aria-current={active ? 'page' : undefined}
        onClick={onSelect}
        style={{
          display: 'flex',
          flexDirection: vertical ? 'column' : 'row',
          alignItems: 'center',
          justifyContent: 'center',
          gap: iconOnly ? 0 : compVar('navigation-bar', 'item-active-indicator-icon-label-space'),
          width: '100%',
          height: '100%',
          paddingBlock: compVar('list', 'item-top-space'),
          border: 'none',
          background: 'transparent',
          cursor: 'pointer',
          position: 'relative',
          color: active
            ? compVar('navigation-bar', 'item-active-label-text-color')
            : compVar('navigation-bar', 'item-inactive-label-text-color'),
        }}
      >
        {!vertical && active && (
          <motion.span
            layoutId={layoutId}
            transition={springs.fastSpatial}
            style={indicatorStyle}
            aria-hidden
          />
        )}
        <span
          style={{
            position: 'relative',
            display: 'inline-flex',
            alignItems: 'center',
            justifyContent: 'center',
            width: vertical
              ? compVar('navigation-bar-vertical-item', 'active-indicator-width')
              : iconStyle.width,
            height: vertical
              ? compVar('navigation-bar-vertical-item', 'active-indicator-height')
              : iconStyle.height,
            borderRadius: compVar('navigation-bar', 'item-active-indicator-shape'),
          }}
        >
          {vertical && active && (
            <motion.span
              layoutId={layoutId}
              transition={springs.fastSpatial}
              style={indicatorStyle}
              aria-hidden
            />
          )}
          <span
            style={{
              ...iconStyle,
              zIndex: 1,
              color: active
                ? compVar('navigation-bar', 'item-active-icon-color')
                : compVar('navigation-bar', 'item-inactive-icon-color'),
            }}
          >
            {destination.icon}
          </span>
          {badgeOverlay}
        </span>
        {
          <span
            style={{
              ...typeStyle('label-medium'),
              ...(iconOnly
                ? {
                    position: 'absolute',
                    width: 1,
                    height: 1,
                    padding: 0,
                    margin: -1,
                    overflow: 'hidden',
                    clipPath: 'inset(50%)',
                    whiteSpace: 'nowrap',
                  }
                : {}),
              zIndex: 1,
            }}
          >
            {destination.label}
          </span>
        }
      </button>
    </PressableShell>
  );
}
