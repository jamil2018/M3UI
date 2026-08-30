
import { Autocomplete as BaseAutocomplete } from '@base-ui/react/autocomplete';
import { Combobox as BaseCombobox } from '@base-ui/react/combobox';
import { type CSSProperties, type ReactNode } from 'react';
import { compVar, typeStyle } from '../lib/token-utils.js';
import { PopupMotion } from '../lib/popup-motion.js';

export type AutocompleteVariant = 'filled' | 'outlined';

export interface AutocompleteOption {
  value: string;
  label: ReactNode;
  disabled?: boolean;
}

export interface AutocompleteProps {
  variant?: AutocompleteVariant;
  label?: string;
  value?: string;
  defaultValue?: string;
  onValueChange?: (value: string) => void;
  options: AutocompleteOption[];
  disabled?: boolean;
  placeholder?: string;
  className?: string;
  'data-testid'?: string;
}

function inputFieldStyle(variant: AutocompleteVariant, disabled: boolean): CSSProperties {
  const textFieldPrefix = variant === 'filled' ? 'filled-text-field' : 'outlined-text-field';
  return {
    display: 'flex',
    alignItems: 'center',
    gap: compVar('list', 'item-between-space'),
    minHeight: compVar('outlined-text-field', 'container-height'),
    paddingInline: compVar('outlined-text-field', 'leading-space'),
    borderRadius: compVar(textFieldPrefix, 'text-field-container-shape'),
    background:
      variant === 'filled'
        ? disabled
          ? compVar('filled-text-field', 'disabled-container-color')
          : compVar('filled-text-field', 'container-color')
        : 'transparent',
    border:
      variant === 'outlined'
        ? `${compVar('outlined-text-field', 'outline-width')} solid ${disabled ? compVar('outlined-text-field', 'disabled-outline-color') : compVar('outlined-text-field', 'outline-color')}`
        : 'none',
    borderBottom:
      variant === 'filled'
        ? `${compVar('filled-text-field', 'active-indicator-height')} solid ${compVar('filled-text-field', 'active-indicator-color')}`
        : undefined,
    opacity: disabled ? 'var(--md-sys-state-disabled-content-opacity)' : 1,
    width: '100%',
  };
}

const popupStyle: CSSProperties = {
  background: compVar('menu', 'container-color'),
  borderRadius: compVar('menu', 'container-shape'),
  boxShadow: `0 var(--md-sys-elevation-level2) calc(var(--md-sys-elevation-level2) * 2) color-mix(in srgb, var(--md-sys-color-shadow) calc(var(--md-sys-elevation-level2-shadow-opacity) * 100%), transparent)`,
  paddingBlock: compVar('list', 'item-top-space'),
  maxHeight: compVar('search-bar', 'container-height'),
  overflow: 'auto',
  width: 'var(--anchor-width)',
  maxWidth: 'var(--available-width)',
};

const itemStyle: CSSProperties = {
  display: 'flex',
  alignItems: 'center',
  minHeight: compVar('list', 'item-one-line-container-height'),
  paddingBlock: 0,
  paddingInline: compVar('list', 'divider-leading-space'),
  ...typeStyle('body-large'),
  color: compVar('list', 'item-label-text-color'),
  cursor: 'pointer',
};

export function Autocomplete({
  variant = 'outlined',
  label,
  value,
  defaultValue,
  onValueChange,
  options,
  disabled = false,
  placeholder = 'Search…',
  className,
  'data-testid': testId,
}: AutocompleteProps) {
  const tokenPrefix = variant === 'filled' ? 'filled-text-field' : 'outlined-text-field';

  return (
    <div className={className} data-testid={testId} style={{ display: 'flex', flexDirection: 'column', gap: 4, width: '100%' }}>
      {label && (
        <span style={{ ...typeStyle('body-small'), color: compVar(tokenPrefix, 'focus-label-color') }}>{label}</span>
      )}
      <BaseAutocomplete.Root
        value={value}
        defaultValue={defaultValue}
        onValueChange={onValueChange ? (value) => { if (value != null) onValueChange(value); } : undefined}
        disabled={disabled}
        items={options.map((o) => o.value)}
        openOnInputClick
      >
        <BaseAutocomplete.InputGroup style={inputFieldStyle(variant, disabled)}>
          <BaseAutocomplete.Input
            placeholder={placeholder}
            style={{
              ...typeStyle('body-large'),
              flex: 1,
              border: 'none',
              background: 'transparent',
              outline: 'none',
              color: compVar(tokenPrefix, 'input-text-color'),
            }}
          />
        </BaseAutocomplete.InputGroup>
        <BaseAutocomplete.Portal>
          <BaseAutocomplete.Positioner sideOffset={4} style={{ zIndex: 1000 }}>
            <PopupMotion>
              <BaseAutocomplete.Popup style={popupStyle}>
                <BaseAutocomplete.List>
                  {options.map((opt) => (
                    <BaseAutocomplete.Item key={opt.value} value={opt.value} disabled={opt.disabled} style={itemStyle}>
                      {opt.label}
                    </BaseAutocomplete.Item>
                  ))}
                </BaseAutocomplete.List>
              </BaseAutocomplete.Popup>
            </PopupMotion>
          </BaseAutocomplete.Positioner>
        </BaseAutocomplete.Portal>
      </BaseAutocomplete.Root>
    </div>
  );
}

export interface ComboboxProps extends AutocompleteProps {
  freeform?: boolean;
}

/** Combobox — editable text field with optional suggestions */
export function Combobox({
  variant = 'outlined',
  label,
  value,
  defaultValue,
  onValueChange,
  options,
  disabled = false,
  placeholder = 'Type or select…',
  className,
  'data-testid': testId,
}: ComboboxProps) {
  const tokenPrefix = variant === 'filled' ? 'filled-text-field' : 'outlined-text-field';

  return (
    <div className={className} data-testid={testId} style={{ display: 'flex', flexDirection: 'column', gap: 4, width: '100%' }}>
      {label && (
        <span style={{ ...typeStyle('body-small'), color: compVar(tokenPrefix, 'focus-label-color') }}>{label}</span>
      )}
      <BaseCombobox.Root
        value={value}
        defaultValue={defaultValue}
        onValueChange={onValueChange ? (value) => { if (value != null) onValueChange(value); } : undefined}
        disabled={disabled}
        items={options.map((o) => o.value)}
        openOnInputClick
      >
        <BaseCombobox.InputGroup style={inputFieldStyle(variant, disabled)}>
          <BaseCombobox.Input
            placeholder={placeholder}
            style={{
              ...typeStyle('body-large'),
              flex: 1,
              border: 'none',
              background: 'transparent',
              outline: 'none',
              color: compVar(tokenPrefix, 'input-text-color'),
            }}
          />
        </BaseCombobox.InputGroup>
        <BaseCombobox.Portal>
          <BaseCombobox.Positioner sideOffset={4} style={{ zIndex: 1000 }}>
            <PopupMotion>
              <BaseCombobox.Popup style={popupStyle}>
                <BaseCombobox.List>
                  {options.map((opt) => (
                    <BaseCombobox.Item key={opt.value} value={opt.value} disabled={opt.disabled} style={itemStyle}>
                      {opt.label}
                    </BaseCombobox.Item>
                  ))}
                </BaseCombobox.List>
              </BaseCombobox.Popup>
            </PopupMotion>
          </BaseCombobox.Positioner>
        </BaseCombobox.Portal>
      </BaseCombobox.Root>
    </div>
  );
}
