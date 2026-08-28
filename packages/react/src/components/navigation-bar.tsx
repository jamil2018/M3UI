
import { motion } from 'motion/react';
import { springs } from '@m3ui/motion';
import { useState, type CSSProperties, type ReactNode } from 'react';
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
  className?: string;
  'data-testid'?: string;
}

export function NavigationBar({
  destinations,
  value: controlled,
  defaultValue,
  onValueChange,
  iconOnly = false,
  className,
  'data-testid': testId,
}: NavigationBarProps) {
  if (destinations.length < 3 || destinations.length > 5) {
    throw new RangeError('NavigationBar requires 3–5 destinations');
  }

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
    boxShadow: `0 calc(-1 * var(--md-sys-elevation-level2)) var(--md-sys-elevation-level2) rgba(0,0,0,var(--md-sys-elevation-level2-shadow-opacity))`,
  };

  return (
    <nav
      className={className}
      data-testid={testId}
      data-layout={iconOnly ? 'icon-only' : 'icon-label'}
      role="tablist"
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
            onSelect={() => select(dest.value)}
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
  onSelect: () => void;
}

function NavigationBarItem({ destination, active, iconOnly, onSelect }: NavigationBarItemProps) {
  const iconStyle: CSSProperties = {
    width: compVar('navigation-bar-horizontal-item', 'icon-size'),
    height: compVar('navigation-bar-horizontal-item', 'icon-size'),
    display: 'inline-flex',
    alignItems: 'center',
    justifyContent: 'center',
  };

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
        role="tab"
        aria-selected={active}
        onClick={onSelect}
        style={{
          display: 'flex',
          flexDirection: 'column',
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
        {active && (
          <motion.span
            layoutId="nav-bar-indicator"
            transition={springs.fastSpatial}
            style={{
              position: 'absolute',
              height: compVar('navigation-bar-horizontal-item', 'active-indicator-height'),
              insetInline: compVar('navigation-bar-horizontal-item', 'active-indicator-leading-space'),
              borderRadius: compVar('navigation-bar', 'item-active-indicator-shape'),
              background: compVar('navigation-bar', 'item-active-indicator-color'),
              zIndex: 0,
            }}
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
        {!iconOnly && (
          <span
            style={{
              ...typeStyle('label-medium'),
              zIndex: 1,
            }}
          >
            {destination.label}
          </span>
        )}
        {destination.badge != null && destination.badge > 0 && (
          <span style={{ position: 'absolute', top: 4, insetInlineEnd: '20%', zIndex: 2 }}>
            <Badge count={destination.badge} />
          </span>
        )}
      </button>
    </PressableShell>
  );
}
