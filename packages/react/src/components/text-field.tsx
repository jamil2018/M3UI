
import { Field as BaseField } from '@base-ui/react/field';
import { Input as BaseInput } from '@base-ui/react/input';
import { motion } from 'motion/react';
import { springs } from '@m3ui/motion';
import { useId, useState, type CSSProperties, type ReactNode } from 'react';
import { compVar, typeStyle } from '../lib/token-utils.js';

export type TextFieldVariant = 'filled' | 'outlined';

export interface TextFieldProps {
  variant?: TextFieldVariant;
  label?: string;
  value?: string;
  defaultValue?: string;
  onValueChange?: (value: string) => void;
  placeholder?: string;
  disabled?: boolean;
  error?: boolean;
  supportingText?: string;
  errorText?: string;
  leadingIcon?: ReactNode;
  trailingIcon?: ReactNode;
  prefix?: string;
  suffix?: string;
  counter?: boolean;
  maxLength?: number;
  multiline?: boolean;
  rows?: number;
  name?: string;
  type?: string;
  className?: string;
  'data-testid'?: string;
}

export function TextField({
  variant = 'filled',
  label,
  value,
  defaultValue,
  onValueChange,
  placeholder,
  disabled = false,
  error = false,
  supportingText,
  errorText,
  leadingIcon,
  trailingIcon,
  prefix,
  suffix,
  counter = false,
  maxLength,
  multiline = false,
  rows = 3,
  name,
  type = 'text',
  className,
  'data-testid': testId,
}: TextFieldProps) {
  const id = useId();
  const [focused, setFocused] = useState(false);
  const [internalValue, setInternalValue] = useState(defaultValue ?? '');
  const currentValue = value ?? internalValue;
  const hasValue = currentValue.length > 0;
  const floated = focused || hasValue;

  const tokenPrefix = variant === 'filled' ? 'filled-text-field' : 'outlined-text-field';

  const containerStyle: CSSProperties = {
    position: 'relative',
    display: 'flex',
    flexDirection: 'column',
    gap: compVar('list', 'item-between-space'),
    opacity: disabled ? 'var(--md-sys-state-disabled-content-opacity, 0.38)' : 1,
  };

  const fieldWrapStyle: CSSProperties = {
    position: 'relative',
    display: 'flex',
    alignItems: multiline ? 'flex-start' : 'center',
    gap: compVar('list', 'item-between-space'),
    minHeight: variant === 'outlined' ? compVar('outlined-text-field', 'container-height') : undefined,
    paddingInline: compVar('outlined-text-field', 'leading-space'),
    paddingBlock: multiline ? compVar('list', 'item-bottom-space') : undefined,
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
  };

  const labelStyle: CSSProperties = {
    ...typeStyle(floated ? 'body-small' : 'body-large'),
    color: error
      ? compVar(tokenPrefix, 'error-focus-label-color')
      : disabled
        ? compVar(tokenPrefix, 'disabled-label-color')
        : compVar(tokenPrefix, 'focus-label-color'),
    position: 'absolute',
    insetInlineStart: compVar('outlined-text-field', 'leading-space'),
    top: floated ? compVar('list', 'item-top-space') : '50%',
    transform: floated ? 'translateY(0)' : 'translateY(-50%)',
    transformOrigin: 'start top',
    pointerEvents: 'none',
    transition: `color var(--md-sys-motion-duration-short2) var(--md-sys-motion-easing-standard)`,
  };

  const inputStyle: CSSProperties = {
    ...typeStyle('body-large'),
    flex: 1,
    border: 'none',
    outline: 'none',
    background: 'transparent',
    color: disabled
      ? compVar(tokenPrefix, 'disabled-input-color')
      : compVar(tokenPrefix, 'input-color'),
    paddingBlock: variant === 'filled' ? compVar('list', 'item-bottom-space') : undefined,
    paddingTop: label && variant === 'filled' ? compVar('list', 'item-top-space') : undefined,
    resize: multiline ? 'vertical' : undefined,
    minHeight: multiline ? `calc(${compVar('outlined-text-field', 'container-height')} * ${String(rows)})` : undefined,
  };

  const supportingStyle: CSSProperties = {
    ...typeStyle('body-small'),
    color: error
      ? compVar(tokenPrefix, 'error-supporting-color')
      : compVar(tokenPrefix, 'supporting-color'),
    paddingInline: compVar('outlined-text-field', 'leading-space'),
  };

  const iconStyle: CSSProperties = {
    width: compVar('outlined-text-field', 'icon-size'),
    height: compVar('outlined-text-field', 'icon-size'),
    color: compVar('outlined-text-field', 'leading-icon-color'),
    flexShrink: 0,
  };

  const handleChange = (next: string) => {
    if (value === undefined) setInternalValue(next);
    onValueChange?.(next);
  };

  return (
    <BaseField.Root
      className={className}
      data-testid={testId}
      style={containerStyle}
      invalid={error}
      disabled={disabled}
    >
      <div style={fieldWrapStyle}>
        {leadingIcon && <span style={iconStyle}>{leadingIcon}</span>}
        {prefix && (
          <span style={{ ...typeStyle('body-large'), color: compVar(tokenPrefix, 'input-color') }}>{prefix}</span>
        )}
        {label && (
          <motion.label
            htmlFor={id}
            style={labelStyle}
            animate={{
              top: floated ? compVar('list', 'item-top-space') : '50%',
              transform: floated ? 'translateY(0)' : 'translateY(-50%)',
            }}
            transition={springs.fastSpatial}
          >
            {label}
          </motion.label>
        )}
        {multiline ? (
          <textarea
            id={id}
            name={name}
            rows={rows}
            value={currentValue}
            placeholder={!label ? placeholder : floated ? placeholder : undefined}
            disabled={disabled}
            maxLength={maxLength}
            onFocus={() => setFocused(true)}
            onBlur={() => setFocused(false)}
            onChange={(e) => handleChange(e.target.value)}
            style={inputStyle}
          />
        ) : (
          <BaseInput
            id={id}
            name={name}
            type={type}
            value={currentValue}
            placeholder={!label ? placeholder : floated ? placeholder : undefined}
            disabled={disabled}
            maxLength={maxLength}
            onFocus={() => setFocused(true)}
            onBlur={() => setFocused(false)}
            onValueChange={handleChange}
            style={inputStyle}
          />
        )}
        {suffix && (
          <span style={{ ...typeStyle('body-large'), color: compVar(tokenPrefix, 'input-color') }}>{suffix}</span>
        )}
        {trailingIcon && <span style={iconStyle}>{trailingIcon}</span>}
      </div>
      {(supportingText || errorText || counter) && (
        <div style={{ display: 'flex', justifyContent: 'space-between', gap: compVar('list', 'item-between-space') }}>
          <BaseField.Description style={supportingStyle}>
            {error && errorText ? errorText : supportingText}
          </BaseField.Description>
          {counter && maxLength !== undefined && (
            <span style={supportingStyle}>
              {currentValue.length}/{maxLength}
            </span>
          )}
        </div>
      )}
    </BaseField.Root>
  );
}
