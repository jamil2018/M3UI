
import { Radio as BaseRadio } from '@base-ui/react/radio';
import { RadioGroup as BaseRadioGroup } from '@base-ui/react/radio-group';
import { type CSSProperties, type ReactNode } from 'react';
import { compVar, typeStyle } from '../lib/token-utils.js';

export interface RadioProps {
  value: string;
  disabled?: boolean;
  label?: ReactNode;
  className?: string;
  'data-testid'?: string;
}

export function Radio({ value, disabled = false, label, className, 'data-testid': testId }: RadioProps) {
  const outerStyle: CSSProperties = {
    width: compVar('radio-button', 'icon-size'),
    height: compVar('radio-button', 'icon-size'),
    borderRadius: 'var(--md-sys-shape-corner-full)',
    border: `1px solid var(--md-sys-color-outline)`,
    display: 'inline-flex',
    alignItems: 'center',
    justifyContent: 'center',
    opacity: disabled ? 'var(--md-sys-state-disabled-content-opacity, 0.38)' : 1,
  };

  const dotStyle: CSSProperties = {
    width: `calc(${compVar('radio-button', 'icon-size')} / 2)`,
    height: `calc(${compVar('radio-button', 'icon-size')} / 2)`,
    borderRadius: 'var(--md-sys-shape-corner-full)',
    background: compVar('radio-button', 'selected-icon-color'),
  };

  const labelStyle: CSSProperties = {
    ...typeStyle('body-large'),
    color: compVar('radio-button', 'unselected-icon-color'),
    opacity: disabled ? 'var(--md-sys-state-disabled-content-opacity, 0.38)' : 1,
  };

  return (
    <label
      className={className}
      data-testid={testId}
      style={{
        display: 'inline-flex',
        alignItems: 'center',
        gap: compVar('radio-button', 'state-layer-size'),
        cursor: disabled ? 'not-allowed' : 'pointer',
        minHeight: compVar('radio-button', 'state-layer-size'),
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
