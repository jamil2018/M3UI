
import { Field as BaseField } from '@base-ui/react/field';
import { Input as BaseInput } from '@base-ui/react/input';
import { parseDate, CalendarDate, today, getLocalTimeZone } from '@internationalized/date';
import { useId, useState, useCallback, type CSSProperties } from 'react';
import { compVar, typeStyle } from '../lib/token-utils.js';
import { useM3I18n, useM3Message } from '../lib/i18n.js';

export type DateInputVariant = 'filled' | 'outlined';

export interface DateInputProps {
  variant?: DateInputVariant;
  label?: string;
  value?: CalendarDate | null;
  defaultValue?: CalendarDate | null;
  onValueChange?: (value: CalendarDate | null) => void;
  disabled?: boolean;
  minValue?: CalendarDate;
  maxValue?: CalendarDate;
  locale?: string;
  supportingText?: string;
  name?: string;
  className?: string;
  'data-testid'?: string;
}

/** Locale-aware date segment patterns. */
function getDateSegments(locale: string): { order: ('day' | 'month' | 'year')[]; separator: string } {
  const parts = new Intl.DateTimeFormat(locale).formatToParts(new Date(2024, 11, 31));
  const order: ('day' | 'month' | 'year')[] = [];
  let separator = '/';
  for (const p of parts) {
    if (p.type === 'literal' && p.value.trim()) separator = p.value.trim();
    if (p.type === 'day') order.push('day');
    if (p.type === 'month') order.push('month');
    if (p.type === 'year') order.push('year');
  }
  if (order.length === 0) return { order: ['month', 'day', 'year'], separator: '/' };
  return { order, separator };
}

function formatCalendarDate(date: CalendarDate, locale: string): string {
  const jsDate = new Date(date.year, date.month - 1, date.day);
  return new Intl.DateTimeFormat(locale, { year: 'numeric', month: '2-digit', day: '2-digit' }).format(jsDate);
}

function parseInputValue(raw: string, locale: string): CalendarDate | null {
  const trimmed = raw.trim();
  if (!trimmed) return null;
  const { order, separator } = getDateSegments(locale);
  const parts = trimmed.split(separator).map((s) => parseInt(s, 10));
  if (parts.some((n) => Number.isNaN(n))) return null;
  let day = 1;
  let month = 1;
  let year = 2000;
  order.forEach((seg, i) => {
    const val = parts[i];
    if (val == null) return;
    if (seg === 'day') day = val;
    if (seg === 'month') month = val;
    if (seg === 'year') year = val < 100 ? 2000 + val : val;
  });
  try {
    return parseDate(`${year}-${String(month).padStart(2, '0')}-${String(day).padStart(2, '0')}`);
  } catch {
    return null;
  }
}

function maskInput(raw: string, locale: string): string {
  const digits = raw.replace(/\D/g, '').slice(0, 8);
  const { separator } = getDateSegments(locale);
  if (digits.length <= 2) return digits;
  if (digits.length <= 4) return `${digits.slice(0, 2)}${separator}${digits.slice(2)}`;
  return `${digits.slice(0, 2)}${separator}${digits.slice(2, 4)}${separator}${digits.slice(4)}`;
}

export function DateInput({
  variant = 'outlined',
  label,
  value,
  defaultValue,
  onValueChange,
  disabled = false,
  minValue,
  maxValue,
  locale: localeProp,
  supportingText,
  name,
  className,
  'data-testid': testId,
}: DateInputProps) {
  const id = useId();
  const { locale: ctxLocale } = useM3I18n();
  const locale = localeProp ?? ctxLocale;
  const invalidMsg = useM3Message('dateInput.invalidDate');
  const placeholder = useM3Message('dateInput.placeholder');

  const initialText =
    defaultValue != null ? formatCalendarDate(defaultValue, locale) : '';
  const [internalText, setInternalText] = useState(initialText);
  const [error, setError] = useState(false);

  const isControlled = value !== undefined;
  const textValue =
    isControlled && value != null
      ? formatCalendarDate(value, locale)
      : isControlled && value == null
        ? ''
        : internalText;

  const tokenPrefix = variant === 'filled' ? 'filled-text-field' : 'outlined-text-field';

  const validate = useCallback(
    (parsed: CalendarDate | null, raw: string): boolean => {
      if (!raw.trim()) {
        setError(false);
        return true;
      }
      if (!parsed) {
        setError(true);
        return false;
      }
      if (minValue && parsed.compare(minValue) < 0) {
        setError(true);
        return false;
      }
      if (maxValue && parsed.compare(maxValue) > 0) {
        setError(true);
        return false;
      }
      setError(false);
      return true;
    },
    [minValue, maxValue],
  );

  const handleChange = (raw: string) => {
    const masked = maskInput(raw, locale);
    if (!isControlled) setInternalText(masked);
    const parsed = parseInputValue(masked, locale);
    validate(parsed, masked);
    onValueChange?.(parsed);
  };

  const handleBlur = () => {
    const parsed = parseInputValue(textValue, locale);
    validate(parsed, textValue);
  };

  const containerStyle: CSSProperties = {
    display: 'flex',
    flexDirection: 'column',
    gap: compVar('list', 'item-between-space'),
    opacity: disabled ? 'var(--md-sys-state-disabled-content-opacity, 0.38)' : 1,
  };

  const fieldWrapStyle: CSSProperties = {
    position: 'relative',
    display: 'flex',
    alignItems: 'center',
    paddingInline: compVar('outlined-text-field', 'leading-space'),
    minHeight: compVar('outlined-text-field', 'container-height'),
    borderRadius: compVar(tokenPrefix, 'container-shape'),
    background:
      variant === 'filled' ? compVar('filled-text-field', 'container-color') : 'transparent',
    border:
      variant === 'outlined'
        ? `${compVar('outlined-text-field', 'outline-width')} solid ${error ? compVar('outlined-text-field', 'error-outline-color') : compVar('outlined-text-field', 'outline-color')}`
        : 'none',
    borderBottom:
      variant === 'filled'
        ? `${compVar('filled-text-field', 'active-indicator-height')} solid ${error ? compVar('filled-text-field', 'error-active-indicator-color') : compVar('filled-text-field', 'active-indicator-color')}`
        : undefined,
  };

  return (
    <BaseField.Root
      name={name}
      invalid={error}
      disabled={disabled}
      className={className}
      data-testid={testId}
      style={containerStyle}
    >
      {label && (
        <BaseField.Label
          htmlFor={id}
          style={{
            ...typeStyle('body-small'),
            color: error
              ? compVar(tokenPrefix, 'error-focus-label-color')
              : compVar(tokenPrefix, 'focus-label-color'),
          }}
        >
          {label}
        </BaseField.Label>
      )}
      <div style={fieldWrapStyle}>
        <BaseInput
          id={id}
          value={textValue}
          onValueChange={handleChange}
          onBlur={handleBlur}
          disabled={disabled}
          placeholder={placeholder}
          inputMode="numeric"
          aria-invalid={error}
          style={{
            ...typeStyle('body-large'),
            flex: 1,
            border: 'none',
            outline: 'none',
            background: 'transparent',
            color: compVar('outlined-text-field', 'input-text-color'),
            paddingBlock: compVar('list', 'item-top-space'),
          }}
        />
      </div>
      {(error || supportingText) && (
        <BaseField.Error match={error} style={{ ...typeStyle('body-small'), color: compVar(tokenPrefix, 'error-supporting-text-color') }}>
          {error ? invalidMsg : supportingText}
        </BaseField.Error>
      )}
      {!error && supportingText && (
        <BaseField.Description style={{ ...typeStyle('body-small'), color: compVar(tokenPrefix, 'supporting-text-color') }}>
          {supportingText}
        </BaseField.Description>
      )}
    </BaseField.Root>
  );
}

export { formatCalendarDate, parseInputValue, getDateSegments, today, getLocalTimeZone };
