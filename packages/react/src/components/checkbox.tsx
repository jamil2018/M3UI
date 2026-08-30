
import { Checkbox as BaseCheckbox } from '@base-ui/react/checkbox';
import { CheckboxGroup as BaseCheckboxGroup } from '@base-ui/react/checkbox-group';
import { type CSSProperties, type ReactNode } from 'react';
import { Icon } from '@m3ui/icons';
import { compVar, typeStyle } from '../lib/token-utils.js';

export interface CheckboxProps {
  checked?: boolean;
  defaultChecked?: boolean;
  indeterminate?: boolean;
  disabled?: boolean;
  error?: boolean;
  onCheckedChange?: (checked: boolean) => void;
  label?: ReactNode;
  name?: string;
  value?: string;
  className?: string;
  'data-testid'?: string;
}

function getCheckboxColors(error: boolean, disabled: boolean, checked: boolean) {
  const p = 'checkbox';
  if (disabled) {
    return {
      container: checked
        ? compVar(p, 'selected-disabled-container-color')
        : compVar(p, 'unselected-disabled-container-color'),
      icon: compVar(p, 'selected-disabled-icon-color'),
      outline: compVar(p, 'unselected-disabled-outline-color'),
    };
  }
  if (error && checked) {
    return {
      container: compVar(p, 'selected-error-container-color'),
      icon: compVar(p, 'selected-error-icon-color'),
      outline: 'transparent',
    };
  }
  if (error) {
    return {
      container: 'transparent',
      icon: compVar(p, 'selected-error-icon-color'),
      outline: compVar(p, 'unselected-error-outline-color'),
    };
  }
  if (checked) {
    return {
      container: compVar(p, 'selected-container-color'),
      icon: compVar(p, 'selected-icon-color'),
      outline: 'transparent',
    };
  }
  return {
    container: 'transparent',
    icon: compVar(p, 'selected-icon-color'),
    outline: compVar(p, 'unselected-outline-color'),
  };
}

export function Checkbox({
  checked,
  defaultChecked,
  indeterminate = false,
  disabled = false,
  error = false,
  onCheckedChange,
  label,
  name,
  value,
  className,
  'data-testid': testId,
}: CheckboxProps) {
  const isChecked = checked ?? defaultChecked ?? false;
  const colors = getCheckboxColors(error, disabled, isChecked || indeterminate);

  const boxStyle: CSSProperties = {
    width: compVar('checkbox', 'container-size'),
    height: compVar('checkbox', 'container-size'),
    borderRadius: compVar('checkbox', 'container-shape'),
    border: `${isChecked || indeterminate ? compVar('checkbox', 'selected-outline-width') : compVar('checkbox', 'unselected-outline-width')} solid ${colors.outline}`,
    background: colors.container,
    display: 'inline-flex',
    alignItems: 'center',
    justifyContent: 'center',
    flexShrink: 0,
    opacity: disabled ? 'var(--md-sys-state-disabled-content-opacity)' : 1,
  };

  const iconStyle: CSSProperties = {
    width: compVar('checkbox', 'icon-size'),
    height: compVar('checkbox', 'icon-size'),
    color: colors.icon,
  };

  const labelStyle: CSSProperties = {
    ...typeStyle('body-large'),
    color: disabled
      ? 'color-mix(in srgb, var(--md-sys-color-on-surface) 38%, transparent)'
      : 'var(--md-sys-color-on-surface)',
    opacity: disabled ? 'var(--md-sys-state-disabled-content-opacity)' : 1,
  };

  return (
    <label
      className={className}
      data-testid={testId}
      style={{ display: 'inline-flex', alignItems: 'center', gap: compVar('list', 'item-between-space'), cursor: disabled ? 'not-allowed' : 'pointer', minHeight: compVar('checkbox', 'state-layer-size'), borderRadius: compVar('checkbox', 'state-layer-shape'), ['--checkbox-disabled-opacity' as string]: compVar('checkbox', 'selected-disabled-container-opacity'), ['--checkbox-selected-focus-container' as string]: compVar('checkbox', 'selected-focus-container-color'), ['--checkbox-selected-focus-icon' as string]: compVar('checkbox', 'selected-focus-icon-color'), ['--checkbox-selected-hover-container' as string]: compVar('checkbox', 'selected-hover-container-color'), ['--checkbox-selected-hover-icon' as string]: compVar('checkbox', 'selected-hover-icon-color'), ['--checkbox-selected-hover-state-color' as string]: compVar('checkbox', 'selected-hover-state-layer-color'), ['--checkbox-selected-hover-state-opacity' as string]: compVar('checkbox', 'selected-hover-state-layer-opacity'), ['--checkbox-selected-pressed-container' as string]: compVar('checkbox', 'selected-pressed-container-color'), ['--checkbox-selected-pressed-icon' as string]: compVar('checkbox', 'selected-pressed-icon-color'), ['--checkbox-selected-pressed-state-color' as string]: compVar('checkbox', 'selected-pressed-state-layer-color'), ['--checkbox-selected-pressed-state-opacity' as string]: compVar('checkbox', 'selected-pressed-state-layer-opacity') }}
    >
      <BaseCheckbox.Root
        checked={checked}
        defaultChecked={defaultChecked}
        indeterminate={indeterminate}
        disabled={disabled}
        onCheckedChange={onCheckedChange}
        name={name}
        value={value}
        style={boxStyle}
      >
        <BaseCheckbox.Indicator style={iconStyle}>
          <Icon name={indeterminate ? 'remove' : 'check'} size={18} weight={700} />
        </BaseCheckbox.Indicator>
      </BaseCheckbox.Root>
      {label && <span style={labelStyle}>{label}</span>}
    </label>
  );
}

export interface CheckboxGroupProps {
  children: ReactNode;
  value?: string[];
  defaultValue?: string[];
  onValueChange?: (value: string[]) => void;
  disabled?: boolean;
  className?: string;
  'data-testid'?: string;
}

export function CheckboxGroup({
  children,
  value,
  defaultValue,
  onValueChange,
  disabled = false,
  className,
  'data-testid': testId,
}: CheckboxGroupProps) {
  return (
    <BaseCheckboxGroup
      value={value}
      defaultValue={defaultValue}
      onValueChange={onValueChange}
      disabled={disabled}
      className={className}
      data-testid={testId}
      style={{ display: 'flex', flexDirection: 'column', gap: compVar('list', 'item-between-space') }}
    >
      {children}
    </BaseCheckboxGroup>
  );
}
