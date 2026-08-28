
import { Select as BaseSelect } from '@base-ui/react/select';
import { type CSSProperties, type ReactNode } from 'react';
import { compVar, typeStyle } from '../lib/token-utils.js';
import { PopupMotion } from '../lib/popup-motion.js';

export type SelectVariant = 'filled' | 'outlined';

export interface SelectOption {
  value: string;
  label: ReactNode;
  disabled?: boolean;
}

export interface SelectProps {
  variant?: SelectVariant;
  label?: string;
  value?: string;
  defaultValue?: string;
  onValueChange?: (value: string) => void;
  options: SelectOption[];
  disabled?: boolean;
  error?: boolean;
  supportingText?: string;
  placeholder?: string;
  className?: string;
  'data-testid'?: string;
}

function fieldStyles(variant: SelectVariant, disabled: boolean, error: boolean): CSSProperties {
  const tokenPrefix = variant === 'filled' ? 'filled-text-field' : 'outlined-text-field';
  return {
    display: 'flex',
    alignItems: 'center',
    gap: compVar('list', 'item-between-space'),
    minHeight: compVar('outlined-text-field', 'container-height'),
    paddingInline: compVar('outlined-text-field', 'leading-space'),
    borderRadius: compVar(tokenPrefix, 'container-shape'),
    background:
      variant === 'filled'
        ? disabled
          ? compVar('filled-text-field', 'disabled-container-color')
          : compVar('filled-text-field', 'container-color')
        : 'transparent',
    border:
      variant === 'outlined'
        ? `${compVar('outlined-text-field', 'outline-width')} solid ${error ? compVar('outlined-text-field', 'error-outline-color') : disabled ? compVar('outlined-text-field', 'disabled-outline-color') : compVar('outlined-text-field', 'outline-color')}`
        : 'none',
    borderBottom:
      variant === 'filled'
        ? `${compVar('filled-text-field', 'active-indicator-height')} solid ${error ? compVar('filled-text-field', 'error-active-indicator-color') : compVar('filled-text-field', 'active-indicator-color')}`
        : undefined,
    opacity: disabled ? 'var(--md-sys-state-disabled-content-opacity, 0.38)' : 1,
    cursor: disabled ? 'not-allowed' : 'pointer',
    ...typeStyle('body-large'),
    color: 'var(--md-sys-color-on-surface)',
  };
}

const popupStyle: CSSProperties = {
  background: compVar('menu', 'container-color'),
  borderRadius: compVar('menu', 'container-shape'),
  boxShadow: `0 var(--md-sys-elevation-level2) calc(var(--md-sys-elevation-level2) * 2) rgba(0, 0, 0, var(--md-sys-elevation-level2-shadow-opacity))`,
  paddingBlock: compVar('list', 'item-top-space'),
  maxHeight: 280,
  overflow: 'auto',
  outline: 'none',
};

const itemStyle: CSSProperties = {
  display: 'flex',
  alignItems: 'center',
  paddingBlock: compVar('list', 'item-one-line-container-height'),
  paddingInline: compVar('list', 'divider-leading-space'),
  ...typeStyle('body-large'),
  color: compVar('list', 'item-label-text-color'),
  cursor: 'pointer',
  borderRadius: compVar('list', 'item-container-expressive-shape'),
};

export function Select({
  variant = 'outlined',
  label,
  value,
  defaultValue,
  onValueChange,
  options,
  disabled = false,
  error = false,
  supportingText,
  placeholder = 'Select…',
  className,
  'data-testid': testId,
}: SelectProps) {
  const tokenPrefix = variant === 'filled' ? 'filled-text-field' : 'outlined-text-field';

  return (
    <div className={className} data-testid={testId} style={{ display: 'flex', flexDirection: 'column', gap: 4 }}>
      <BaseSelect.Root value={value} defaultValue={defaultValue} onValueChange={onValueChange ? (value) => { if (value != null) onValueChange(value); } : undefined} disabled={disabled}>
        {label && (
          <BaseSelect.Label style={{ ...typeStyle('body-small'), color: compVar(tokenPrefix, 'focus-label-color') }}>
            {label}
          </BaseSelect.Label>
        )}
        <BaseSelect.Trigger style={fieldStyles(variant, disabled, error)}>
          <BaseSelect.Value placeholder={placeholder} style={{ flex: 1, textAlign: 'start' }} />
          <BaseSelect.Icon style={{ color: 'var(--md-sys-color-on-surface-variant)' }}>▾</BaseSelect.Icon>
        </BaseSelect.Trigger>
        <BaseSelect.Portal>
          <BaseSelect.Positioner sideOffset={4} style={{ zIndex: 1000 }}>
            <PopupMotion>
              <BaseSelect.Popup style={popupStyle}>
                <BaseSelect.List>
                  {options.map((opt) => (
                    <BaseSelect.Item key={opt.value} value={opt.value} disabled={opt.disabled} style={itemStyle}>
                      <BaseSelect.ItemText>{opt.label}</BaseSelect.ItemText>
                      <BaseSelect.ItemIndicator>✓</BaseSelect.ItemIndicator>
                    </BaseSelect.Item>
                  ))}
                </BaseSelect.List>
              </BaseSelect.Popup>
            </PopupMotion>
          </BaseSelect.Positioner>
        </BaseSelect.Portal>
      </BaseSelect.Root>
      {supportingText && (
        <span style={{ ...typeStyle('body-small'), color: compVar(tokenPrefix, 'supporting-text-color') }}>
          {supportingText}
        </span>
      )}
    </div>
  );
}

/** Alias for M3 "Exposed Dropdown Menu" pattern */
export const ExposedDropdownMenu = Select;
export type ExposedDropdownMenuProps = SelectProps;
