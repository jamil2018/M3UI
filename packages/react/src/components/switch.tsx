
import { Switch as BaseSwitch } from '@base-ui/react/switch';
import { useState, type CSSProperties, type ReactNode } from 'react';
import { compVar, sysColor, typeStyle } from '../lib/token-utils.js';

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
  const [internalChecked, setInternalChecked] = useState(defaultChecked ?? false);
  const isChecked = checked ?? internalChecked;

  const trackStyle: CSSProperties = {
    width: compVar(p, 'track-width'),
    height: compVar(p, 'track-height'),
    borderRadius: compVar(p, 'track-shape'),
    background: disabled
      ? compVar(p, isChecked ? 'disabled-selected-track-color' : 'disabled-unselected-track-color')
      : compVar(p, isChecked ? 'selected-track-color' : 'unselected-track-color'),
    border: isChecked
      ? 'none'
      : `${compVar(p, 'unselected-track-outline-width')} solid ${disabled ? compVar(p, 'disabled-unselected-track-outline-color') : compVar(p, 'unselected-track-outline-color')}`,
    position: 'relative',
    display: 'inline-flex',
    alignItems: 'center',
    opacity: disabled ? 'var(--md-sys-state-disabled-content-opacity)' : 1,
    transition: `background var(--md-sys-motion-duration-short2) var(--md-sys-motion-easing-standard)`,
  };

  const thumbStyle: CSSProperties = {
    width: compVar(p, isChecked ? 'selected-handle-width' : 'unselected-handle-width'),
    height: compVar(p, isChecked ? 'selected-handle-height' : 'unselected-handle-height'),
    borderRadius: compVar(p, 'handle-shape'),
    background: disabled
      ? compVar(p, isChecked ? 'disabled-selected-handle-color' : 'disabled-unselected-handle-color')
      : compVar(p, isChecked ? 'selected-handle-color' : 'unselected-handle-color'),
    display: 'inline-flex',
    alignItems: 'center',
    justifyContent: 'center',
    transition: `transform var(--md-sys-motion-duration-short4) var(--md-sys-motion-easing-emphasized), width var(--md-sys-motion-duration-short4) var(--md-sys-motion-easing-emphasized), height var(--md-sys-motion-duration-short4) var(--md-sys-motion-easing-emphasized)`,
  };

  const iconStyle: CSSProperties = {
    width: compVar(p, isChecked ? 'selected-icon-size' : 'unselected-icon-size'),
    height: compVar(p, isChecked ? 'selected-icon-size' : 'unselected-icon-size'),
    color: disabled
      ? compVar(p, isChecked ? 'disabled-selected-icon-color' : 'disabled-unselected-icon-color')
      : compVar(p, isChecked ? 'selected-icon-color' : 'unselected-icon-color'),
  };

  const labelStyle: CSSProperties = {
    ...typeStyle('body-large'),
    color: sysColor('on-surface'),
    opacity: disabled ? 'var(--md-sys-state-disabled-content-opacity)' : 1,
  };

  return (
    <label
      className={className}
      data-testid={testId}
      style={{
        display: 'inline-flex',
        alignItems: 'center',
        gap: compVar('list', 'item-between-space'),
        cursor: disabled ? 'not-allowed' : 'pointer',
        minHeight: compVar(p, 'state-layer-size'),
        borderRadius: compVar(p, 'state-layer-shape'),
        ['--switch-disabled-handle-opacity' as string]: compVar(p, 'disabled-handle-opacity'),
        ['--switch-disabled-selected-handle' as string]: compVar(p, 'disabled-selected-handle-color'),
        ['--switch-disabled-selected-handle-opacity' as string]: compVar(p, 'disabled-selected-handle-opacity'),
        ['--switch-disabled-selected-icon' as string]: compVar(p, 'disabled-selected-icon-color'),
        ['--switch-disabled-selected-icon-opacity' as string]: compVar(p, 'disabled-selected-icon-opacity'),
        ['--switch-disabled-selected-track' as string]: compVar(p, 'disabled-selected-track-color'),
        ['--switch-disabled-track-opacity' as string]: compVar(p, 'disabled-track-opacity'),
        ['--switch-handle-height' as string]: compVar(p, 'handle-height'),
        ['--switch-handle-width' as string]: compVar(p, 'handle-width'),
      }}
    >
      <BaseSwitch.Root
        checked={checked}
        defaultChecked={defaultChecked}
        disabled={disabled}
        onCheckedChange={(next) => {
          setInternalChecked(next);
          onCheckedChange?.(next);
        }}
        name={name}
        style={trackStyle}
      >
        <BaseSwitch.Thumb style={thumbStyle}>
          {icon && isChecked && <span style={iconStyle}>{icon}</span>}
        </BaseSwitch.Thumb>
      </BaseSwitch.Root>
      {label && <span style={labelStyle}>{label}</span>}
    </label>
  );
}
