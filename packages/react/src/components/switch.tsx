
import { Switch as BaseSwitch } from '@base-ui/react/switch';
import { type CSSProperties, type ReactNode } from 'react';
import { compVar, typeStyle } from '../lib/token-utils.js';

export interface SwitchProps {
  checked?: boolean;
  defaultChecked?: boolean;
  disabled?: boolean;
  onCheckedChange?: (checked: boolean) => void;
  label?: ReactNode;
  icon?: ReactNode;
  name?: string;
  className?: string;
  'data-testid'?: string;
}

export function Switch({
  checked,
  defaultChecked,
  disabled = false,
  onCheckedChange,
  label,
  icon,
  name,
  className,
  'data-testid': testId,
}: SwitchProps) {
  const p = 'switch';

  const trackStyle: CSSProperties = {
    width: compVar(p, 'track-width'),
    height: compVar(p, 'track-height'),
    borderRadius: compVar(p, 'track-shape'),
    background: disabled
      ? compVar(p, 'disabled-unselected-track-color')
      : compVar(p, 'unselected-track-color'),
    border: `${compVar(p, 'unselected-track-outline-width')} solid ${disabled ? compVar(p, 'disabled-unselected-track-outline-color') : compVar(p, 'unselected-track-outline-color')}`,
    position: 'relative',
    display: 'inline-flex',
    alignItems: 'center',
    opacity: disabled ? 'var(--md-sys-state-disabled-content-opacity, 0.38)' : 1,
    transition: `background var(--md-sys-motion-duration-short2) var(--md-sys-motion-easing-standard)`,
  };

  const thumbStyle: CSSProperties = {
    width: compVar(p, 'selected-handle-width'),
    height: compVar(p, 'selected-handle-height'),
    borderRadius: compVar(p, 'handle-shape'),
    background: disabled
      ? compVar(p, 'disabled-unselected-handle-color')
      : compVar(p, 'unselected-handle-color'),
    display: 'inline-flex',
    alignItems: 'center',
    justifyContent: 'center',
    transition: `transform var(--md-sys-motion-duration-short4) var(--md-sys-motion-easing-emphasized), width var(--md-sys-motion-duration-short4) var(--md-sys-motion-easing-emphasized), height var(--md-sys-motion-duration-short4) var(--md-sys-motion-easing-emphasized)`,
  };

  const iconStyle: CSSProperties = {
    width: compVar(p, 'selected-icon-size'),
    height: compVar(p, 'selected-icon-size'),
    color: compVar(p, 'selected-icon-color'),
  };

  const labelStyle: CSSProperties = {
    ...typeStyle('body-large'),
    color: 'var(--md-sys-color-on-surface)',
    opacity: disabled ? 'var(--md-sys-state-disabled-content-opacity, 0.38)' : 1,
  };

  return (
    <label
      className={className}
      data-testid={testId}
      style={{
        display: 'inline-flex',
        alignItems: 'center',
        gap: compVar(p, 'state-layer-size'),
        cursor: disabled ? 'not-allowed' : 'pointer',
      }}
    >
      <BaseSwitch.Root
        checked={checked}
        defaultChecked={defaultChecked}
        disabled={disabled}
        onCheckedChange={onCheckedChange}
        name={name}
        style={trackStyle}
      >
        <BaseSwitch.Thumb style={thumbStyle}>
          {icon && <span style={iconStyle}>{icon}</span>}
        </BaseSwitch.Thumb>
      </BaseSwitch.Root>
      {label && <span style={labelStyle}>{label}</span>}
    </label>
  );
}
