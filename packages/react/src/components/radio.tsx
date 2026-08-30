
import { Radio as BaseRadio } from '@base-ui/react/radio';
import { RadioGroup as BaseRadioGroup } from '@base-ui/react/radio-group';
import { type CSSProperties, type ReactNode } from 'react';
import { compVar, sysShape, sysColor, typeStyle } from '../lib/token-utils.js';

const RADIO = 'radio';

export interface RadioProps {
  value: string;
  disabled?: boolean;
  label?: ReactNode;
  className?: string;
  'data-testid'?: string;
}

function radioRingColor(disabled: boolean): string {
  return disabled
    ? compVar(RADIO, 'disabled-unselected-icon-color')
    : compVar(RADIO, 'icon-color');
}

function radioDotColor(disabled: boolean): string {
  return disabled
    ? compVar(RADIO, 'disabled-selected-icon-color')
    : compVar(RADIO, 'selected-icon-color');
}

export function Radio({ value, disabled = false, label, className, 'data-testid': testId }: RadioProps) {
  const iconSize = compVar(RADIO, 'icon-size');

  const outerStyle: CSSProperties = {
    width: iconSize,
    height: iconSize,
    borderRadius: sysShape('corner-full'),
    border: `2px solid ${radioRingColor(disabled)}`,
    display: 'inline-flex',
    alignItems: 'center',
    justifyContent: 'center',
    opacity: disabled ? 'var(--md-sys-state-disabled-content-opacity)' : 1,
  };

  const dotStyle: CSSProperties = {
    width: `calc(${iconSize} / 2)`,
    height: `calc(${iconSize} / 2)`,
    borderRadius: sysShape('corner-full'),
    background: radioDotColor(disabled),
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
        minHeight: compVar(RADIO, 'state-layer-size'),
        ['--radio-disabled-selected-opacity' as string]: compVar(RADIO, 'disabled-selected-icon-opacity'),
        ['--radio-disabled-unselected-opacity' as string]: compVar(RADIO, 'disabled-unselected-icon-opacity'),
        ['--radio-selected-focus-icon' as string]: compVar(RADIO, 'selected-focus-icon-color'),
        ['--radio-selected-hover-icon' as string]: compVar(RADIO, 'selected-hover-icon-color'),
        ['--radio-selected-hover-state-color' as string]: compVar(RADIO, 'selected-hover-state-layer-color'),
        ['--radio-selected-hover-state-opacity' as string]: compVar(RADIO, 'selected-hover-state-layer-opacity'),
        ['--radio-selected-pressed-icon' as string]: compVar(RADIO, 'selected-pressed-icon-color'),
        ['--radio-selected-pressed-state-color' as string]: compVar(RADIO, 'selected-pressed-state-layer-color'),
        ['--radio-selected-pressed-state-opacity' as string]: compVar(RADIO, 'selected-pressed-state-layer-opacity'),
      }}
    >
      <BaseRadio.Root value={value} disabled={disabled} style={outerStyle}>
        <BaseRadio.Indicator style={dotStyle} />
      </BaseRadio.Root>
      {label && <span style={labelStyle}>{label}</span>}
    </label>
  );
}

export interface RadioGroupProps {
  children: ReactNode;
  value?: string;
  defaultValue?: string;
  onValueChange?: (value: string) => void;
  disabled?: boolean;
  name?: string;
  className?: string;
  'data-testid'?: string;
}

export function RadioGroup({
  children,
  value,
  defaultValue,
  onValueChange,
  disabled = false,
  name,
  className,
  'data-testid': testId,
}: RadioGroupProps) {
  return (
    <BaseRadioGroup
      value={value}
      defaultValue={defaultValue}
      onValueChange={onValueChange}
      disabled={disabled}
      name={name}
      className={className}
      data-testid={testId}
      style={{ display: 'flex', flexDirection: 'column', gap: compVar('list', 'item-between-space') }}
    >
      {children}
    </BaseRadioGroup>
  );
}
