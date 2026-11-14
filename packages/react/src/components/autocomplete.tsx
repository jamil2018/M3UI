import { M3PortalScope } from '../provider/m3-provider.js';

import { Autocomplete as BaseAutocomplete } from '@base-ui/react/autocomplete';
import { Combobox as BaseCombobox } from '@base-ui/react/combobox';
import { useId, useState, type CSSProperties, type ReactNode } from 'react';
import {
  FieldDecorations,
  FieldFloatingLabel,
  fieldInputStyles,
  fieldTokenPrefix,
  fieldWrapStyles,
  type FieldVariant,
} from '../lib/field-internals.js';
import { StateLayer } from '../lib/state-layer.js';
import { compVar, elevationShadow, typeStyle } from '../lib/token-utils.js';
import { PopupMotion } from '../lib/popup-motion.js';

export type AutocompleteVariant = FieldVariant;

export interface AutocompleteOption {
  value: string;
  label: ReactNode;
  /** Search text for a rich label; plain text labels are used automatically. */
  textValue?: string;
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

function optionText(option: AutocompleteOption | undefined, fallback: string) {
  return option?.textValue ?? (typeof option?.label === 'string' ? option.label : fallback);
}

const popupStyle: CSSProperties = {
  background: compVar('menu', 'container-color'),
  borderRadius: compVar('menu', 'container-shape'),
  boxShadow: elevationShadow('level2'),
  paddingBlock: compVar('list', 'item-top-space'),
  maxHeight: '280px',
  overflowX: 'hidden',
  overflowY: 'auto',
  width: 'var(--anchor-width)',
  maxWidth: 'var(--available-width)',
};

const itemStyle: CSSProperties = {
  display: 'flex',
  alignItems: 'center',
  minHeight: compVar('list-item', 'one-line-container-height'),
  paddingBlock: 0,
  paddingInline: 0,
  ...typeStyle('body-large'),
  color: compVar('list', 'item-label-text-color'),
  cursor: 'pointer',
  borderRadius: compVar('list', 'item-container-shape'),
};

function FieldInputShell({
  variant,
  label,
  disabled,
  value,
  inputId,
  children,
}: {
  variant: AutocompleteVariant;
  label?: string;
  disabled: boolean;
  value?: string;
  inputId: string;
  children: (args: {
    inputStyle: CSSProperties;
    interaction: { disabled: boolean; focused: boolean; hovered: boolean };
    floated: boolean;
    prefixToken: string;
  }) => ReactNode;
}) {
  const [focused, setFocused] = useState(false);
  const [hovered, setHovered] = useState(false);
  const prefixToken = fieldTokenPrefix(variant);
  const interaction = { disabled, focused, hovered };
  const floated = focused || Boolean(value);
  const notched = variant === 'outlined' && Boolean(label);

  return (
    <div
      style={fieldWrapStyles(variant, interaction, { notched })}
      onMouseEnter={() => {
        setHovered(true);
      }}
      onMouseLeave={() => {
        setHovered(false);
      }}
      onFocusCapture={() => {
        setFocused(true);
      }}
      onBlurCapture={(e) => {
        if (!e.currentTarget.contains(e.relatedTarget)) {
          setFocused(false);
        }
      }}
    >
      <FieldDecorations
        variant={variant}
        prefix={prefixToken}
        state={interaction}
        label={label}
        floated={floated}
      />
      {label && (
        <FieldFloatingLabel
          variant={variant}
          prefix={prefixToken}
          state={interaction}
          label={label}
          floated={floated}
          htmlFor={inputId}
        />
      )}
      {children({
        inputStyle: {
          ...fieldInputStyles(prefixToken, interaction, Boolean(label)),
        },
        interaction,
        floated,
        prefixToken,
      })}
    </div>
  );
}

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
  const inputId = useId();
  const [internalValue, setInternalValue] = useState(defaultValue ?? '');
  const currentValue = value ?? internalValue;

  return (
    <div
      className={className}
      data-testid={testId}
      style={{ display: 'flex', flexDirection: 'column', gap: 4, width: '100%' }}
    >
      <BaseAutocomplete.Root
        value={value}
        defaultValue={defaultValue}
        onValueChange={(next) => {
          if (next == null) return;
          if (value === undefined) setInternalValue(next);
          onValueChange?.(next);
        }}
        disabled={disabled}
        items={options.map((o) => o.value)}
        itemToStringValue={(item) =>
          optionText(
            options.find((o) => o.value === item),
            item,
          )
        }
        openOnInputClick
      >
        <BaseAutocomplete.InputGroup style={{ width: '100%' }}>
          <FieldInputShell
            variant={variant}
            label={label}
            disabled={disabled}
            value={currentValue}
            inputId={inputId}
          >
            {({ inputStyle, floated }) => (
              <BaseAutocomplete.Input
                id={inputId}
                placeholder={!label ? placeholder : floated ? placeholder : undefined}
                aria-label={label}
                style={inputStyle}
              />
            )}
          </FieldInputShell>
        </BaseAutocomplete.InputGroup>
        <BaseAutocomplete.Portal>
          <M3PortalScope>
            <BaseAutocomplete.Positioner
              sideOffset={4}
              style={{ zIndex: 'calc(var(--m3-overlay-layer, 1100) + 1)' }}
            >
              <PopupMotion>
                <BaseAutocomplete.Popup style={popupStyle}>
                  <BaseAutocomplete.Empty style={{ padding: 16 }}>
                    No results found
                  </BaseAutocomplete.Empty>
                  <BaseAutocomplete.List>
                    {(optionValue: string) => {
                      const opt = options.find((option) => option.value === optionValue)!;
                      return (
                        <BaseAutocomplete.Item
                          key={opt.value}
                          value={opt.value}
                          disabled={opt.disabled}
                          style={(state) => ({
                            ...itemStyle,
                            background: state.highlighted
                              ? compVar('list', 'item-selected-container-color')
                              : undefined,
                            color: state.highlighted
                              ? compVar('list', 'item-selected-label-text-color')
                              : itemStyle.color,
                            opacity: state.disabled ? 0.38 : 1,
                          })}
                        >
                          <StateLayer
                            states={['hover', 'pressed']}
                            disabled={opt.disabled}
                            style={{
                              display: 'flex',
                              alignItems: 'center',
                              width: '100%',
                              minHeight: compVar('list-item', 'one-line-container-height'),
                              paddingInline: compVar('list', 'divider-leading-space'),
                              borderRadius: 'inherit',
                            }}
                          >
                            {opt.label}
                          </StateLayer>
                        </BaseAutocomplete.Item>
                      );
                    }}
                  </BaseAutocomplete.List>
                </BaseAutocomplete.Popup>
              </PopupMotion>
            </BaseAutocomplete.Positioner>
          </M3PortalScope>
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
  const inputId = useId();
  const [internalValue, setInternalValue] = useState(defaultValue ?? '');
  const currentValue = value ?? internalValue;

  return (
    <div
      className={className}
      data-testid={testId}
      style={{ display: 'flex', flexDirection: 'column', gap: 4, width: '100%' }}
    >
      <BaseCombobox.Root
        value={value}
        defaultValue={defaultValue}
        onValueChange={(next) => {
          if (next == null) return;
          if (value === undefined) setInternalValue(next);
          onValueChange?.(next);
        }}
        disabled={disabled}
        items={options.map((o) => o.value)}
        itemToStringLabel={(item) =>
          optionText(
            options.find((o) => o.value === item),
            item,
          )
        }
        openOnInputClick
      >
        <BaseCombobox.InputGroup style={{ width: '100%' }}>
          <FieldInputShell
            variant={variant}
            label={label}
            disabled={disabled}
            value={currentValue}
            inputId={inputId}
          >
            {({ inputStyle, floated }) => (
              <BaseCombobox.Input
                id={inputId}
                placeholder={!label ? placeholder : floated ? placeholder : undefined}
                aria-label={label}
                style={inputStyle}
              />
            )}
          </FieldInputShell>
        </BaseCombobox.InputGroup>
        <BaseCombobox.Portal>
          <M3PortalScope>
            <BaseCombobox.Positioner
              sideOffset={4}
              style={{ zIndex: 'calc(var(--m3-overlay-layer, 1100) + 1)' }}
            >
              <PopupMotion>
                <BaseCombobox.Popup style={popupStyle}>
                  <BaseCombobox.Empty style={{ padding: 16 }}>No results found</BaseCombobox.Empty>
                  <BaseCombobox.List>
                    {(optionValue: string) => {
                      const opt = options.find((option) => option.value === optionValue)!;
                      return (
                        <BaseCombobox.Item
                          key={opt.value}
                          value={opt.value}
                          disabled={opt.disabled}
                          style={(state) => ({
                            ...itemStyle,
                            background: state.highlighted
                              ? compVar('list', 'item-selected-container-color')
                              : undefined,
                            color: state.highlighted
                              ? compVar('list', 'item-selected-label-text-color')
                              : itemStyle.color,
                            opacity: state.disabled ? 0.38 : 1,
                          })}
                        >
                          <StateLayer
                            states={['hover', 'pressed']}
                            disabled={opt.disabled}
                            style={{
                              display: 'flex',
                              alignItems: 'center',
                              width: '100%',
                              minHeight: compVar('list-item', 'one-line-container-height'),
                              paddingInline: compVar('list', 'divider-leading-space'),
                              borderRadius: 'inherit',
                            }}
                          >
                            {opt.label}
                          </StateLayer>
                        </BaseCombobox.Item>
                      );
                    }}
                  </BaseCombobox.List>
                </BaseCombobox.Popup>
              </PopupMotion>
            </BaseCombobox.Positioner>
          </M3PortalScope>
        </BaseCombobox.Portal>
      </BaseCombobox.Root>
    </div>
  );
}
