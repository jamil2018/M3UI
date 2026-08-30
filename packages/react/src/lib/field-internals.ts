import type { CSSProperties } from 'react';
import { compVar, DISABLED_CONTENT_OPACITY, typeStyle } from './token-utils.js';

export type FieldVariant = 'filled' | 'outlined';

export interface FieldInteractionState {
  disabled?: boolean;
  error?: boolean;
  focused?: boolean;
  hovered?: boolean;
}

export function fieldTokenPrefix(variant: FieldVariant): string {
  return variant === 'filled' ? 'filled-text-field' : 'outlined-text-field';
}

/** Resolve classic M3 field tokens for the current interaction state. */
export function fieldToken(prefix: string, base: string, state: FieldInteractionState): string {
  const { disabled, error, focused, hovered } = state;
  if (disabled) return compVar(prefix, `disabled-${base}`);
  if (error && focused) return compVar(prefix, `error-focus-${base}`);
  if (error && hovered) return compVar(prefix, `error-hover-${base}`);
  if (error) return compVar(prefix, `error-${base}`);
  if (focused) return compVar(prefix, `focus-${base}`);
  if (hovered) return compVar(prefix, `hover-${base}`);
  return compVar(prefix, base);
}

export function fieldLeadingSpace(): string {
  return compVar('outlined-text-field', 'leading-space');
}

export function fieldContainerHeight(): string {
  return compVar('outlined-text-field', 'container-height');
}

export function fieldWrapStyles(
  variant: FieldVariant,
  state: FieldInteractionState,
  multiline?: boolean,
): CSSProperties {
  const prefix = fieldTokenPrefix(variant);

  const styles: CSSProperties = {
    position: 'relative',
    display: 'flex',
    alignItems: multiline ? 'flex-start' : 'center',
    gap: compVar('list', 'item-between-space'),
    minHeight: fieldContainerHeight(),
    paddingInline: fieldLeadingSpace(),
    paddingBlock: multiline ? compVar('list', 'item-bottom-space') : undefined,
    borderRadius: compVar(prefix, 'container-shape'),
    opacity: state.disabled ? DISABLED_CONTENT_OPACITY : 1,
  };

  if (variant === 'filled') {
    styles.background = fieldToken(prefix, 'container-color', state);
    styles.border = 'none';
    styles.borderBottom = `${fieldToken(prefix, 'active-indicator-height', state)} solid ${fieldToken(prefix, 'active-indicator-color', state)}`;
  } else {
    styles.background = 'transparent';
    const outlineWidth = state.focused
      ? compVar(prefix, 'focus-outline-width')
      : state.hovered
        ? compVar(prefix, 'hover-outline-width')
        : compVar(prefix, 'outline-width');
    styles.border = `${outlineWidth} solid ${fieldToken(prefix, 'outline-color', state)}`;
  }

  return styles;
}

export function fieldLabelStyles(
  prefix: string,
  state: FieldInteractionState,
  floated: boolean,
): CSSProperties {
  return {
    ...typeStyle(floated ? 'body-small' : 'body-large'),
    color: fieldToken(prefix, 'label-color', state),
    position: 'absolute',
    insetInlineStart: fieldLeadingSpace(),
    top: floated ? compVar('list', 'item-top-space') : '50%',
    transform: floated ? 'translateY(0)' : 'translateY(-50%)',
    transformOrigin: 'start top',
    pointerEvents: 'none',
    transition: `color var(--md-sys-motion-duration-short2) var(--md-sys-motion-easing-standard)`,
  };
}

export function fieldInputStyles(
  prefix: string,
  state: FieldInteractionState,
  hasLabel: boolean,
): CSSProperties {
  return {
    ...typeStyle('body-large'),
    flex: 1,
    border: 'none',
    outline: 'none',
    background: 'transparent',
    color: fieldToken(prefix, 'input-color', state),
    paddingBlock: hasLabel
      ? `${compVar('list', 'divider-leading-space')} ${compVar('list', 'item-top-space')}`
      : compVar('list', 'item-bottom-space'),
    caretColor: fieldToken(prefix, 'caret-color', state),
  };
}

export function fieldSupportingStyles(prefix: string, state: FieldInteractionState): CSSProperties {
  return {
    ...typeStyle('body-small'),
    color: fieldToken(prefix, 'supporting-color', state),
    paddingInline: fieldLeadingSpace(),
  };
}

export function fieldIconStyles(prefix: string, state: FieldInteractionState): CSSProperties {
  return {
    width: compVar(prefix, 'leading-icon-size'),
    height: compVar(prefix, 'leading-icon-size'),
    color: fieldToken(prefix, 'leading-icon-color', state),
    flexShrink: 0,
  };
}

export function fieldTriggerStyles(
  variant: FieldVariant,
  state: FieldInteractionState,
): CSSProperties {
  const prefix = fieldTokenPrefix(variant);
  return {
    ...fieldWrapStyles(variant, state),
    cursor: state.disabled ? 'not-allowed' : 'pointer',
    ...typeStyle('body-large'),
    color: fieldToken(prefix, 'input-color', state),
  };
}

/** Static references for token-coverage gate (fieldToken resolves these at runtime). */
const FIELD_COVERAGE_REFS = [
  compVar('filled-text-field', 'input-color'),
  compVar('filled-text-field', 'supporting-color'),
  compVar('filled-text-field', 'error-supporting-color'),
  compVar('outlined-text-field', 'input-color'),
  compVar('outlined-text-field', 'supporting-color'),
  compVar('outlined-text-field', 'error-supporting-color'),
] as const;

void FIELD_COVERAGE_REFS;
