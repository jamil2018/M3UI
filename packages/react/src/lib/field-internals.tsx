import { motion } from 'motion/react';
import { springs } from '@m3ui/motion';
import type { CSSProperties, ReactNode } from 'react';
import { compVar, disabledContainerMix, disabledContentMix, typeStyle } from './token-utils.js';

export type FieldVariant = 'filled' | 'outlined';

export interface FieldInteractionState {
  disabled?: boolean;
  error?: boolean;
  focused?: boolean;
  hovered?: boolean;
}

export interface FieldWrapOptions {
  multiline?: boolean;
  /** When true with outlined + label, outer border is omitted (fieldset notch draws it). */
  notched?: boolean;
}

/** Resolve classic M3 field tokens for the current interaction state. */
export function fieldToken(prefix: string, base: string, state: FieldInteractionState): string {
  const { disabled, error, focused, hovered } = state;
  if (disabled) {
    const raw = compVar(prefix, `disabled-${base}`);
    if (base === 'container-color') {
      return `color-mix(in srgb, ${raw} 4%, transparent)`;
    }
    if (base === 'outline-color') {
      return disabledContainerMix(raw);
    }
    return disabledContentMix(raw);
  }
  if (error && focused) return compVar(prefix, `error-focus-${base}`);
  if (error && hovered) return compVar(prefix, `error-hover-${base}`);
  if (error) return compVar(prefix, `error-${base}`);
  if (focused) return compVar(prefix, `focus-${base}`);
  if (hovered) return compVar(prefix, `hover-${base}`);
  return compVar(prefix, base);
}

export function fieldTokenPrefix(variant: FieldVariant): string {
  return variant === 'filled' ? 'filled-text-field' : 'outlined-text-field';
}

export function fieldLeadingSpace(): string {
  return compVar('outlined-text-field', 'leading-space');
}

export function fieldContainerHeight(): string {
  return compVar('outlined-text-field', 'container-height');
}

export function fieldOutlineWidth(prefix: string, state: FieldInteractionState): string {
  if (state.focused) return compVar(prefix, 'focus-outline-width');
  if (state.hovered) return compVar(prefix, 'hover-outline-width');
  return compVar(prefix, 'outline-width');
}

export function fieldWrapStyles(
  variant: FieldVariant,
  state: FieldInteractionState,
  multilineOrOptions?: boolean | FieldWrapOptions,
): CSSProperties {
  const options: FieldWrapOptions =
    typeof multilineOrOptions === 'boolean'
      ? { multiline: multilineOrOptions }
      : (multilineOrOptions ?? {});
  const { multiline, notched } = options;
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
  };

  if (variant === 'filled') {
    styles.background = fieldToken(prefix, 'container-color', state);
    styles.border = 'none';
    // Resting 1px indicator; focused thickness grows via FieldFilledActiveIndicator.
    styles.borderBottom = `${compVar(prefix, 'active-indicator-height')} solid ${fieldToken(prefix, 'active-indicator-color', state)}`;
  } else if (notched) {
    styles.background = 'transparent';
    styles.border = 'none';
  } else {
    styles.background = 'transparent';
    styles.border = `${fieldOutlineWidth(prefix, state)} solid ${fieldToken(prefix, 'outline-color', state)}`;
  }

  return styles;
}

export function fieldLabelStyles(
  prefix: string,
  state: FieldInteractionState,
  floated: boolean,
  variant: FieldVariant = 'filled',
): CSSProperties {
  const outlinedFloated = variant === 'outlined' && floated;
  return {
    ...typeStyle(floated ? 'body-small' : 'body-large'),
    color: fieldToken(prefix, 'label-color', state),
    position: 'absolute',
    insetInlineStart: fieldLeadingSpace(),
    top: outlinedFloated ? '0%' : floated ? '8px' : '50%',
    transform: outlinedFloated
      ? 'translateY(-50%)'
      : floated
        ? 'translateY(0%)'
        : 'translateY(-50%)',
    transformOrigin: 'start top',
    pointerEvents: 'none',
    transition:
      'color var(--md-sys-motion-duration-short2) var(--md-sys-motion-easing-standard), font-size var(--md-sys-motion-duration-short3) var(--md-sys-motion-easing-emphasized), line-height var(--md-sys-motion-duration-short3) var(--md-sys-motion-easing-emphasized)',
    zIndex: 1,
  };
}

export function fieldLabelAnimate(variant: FieldVariant, floated: boolean) {
  if (variant === 'outlined') {
    return {
      top: floated ? '0%' : '50%',
      transform: 'translateY(-50%)',
    };
  }
  return {
    top: floated ? '8px' : '50%',
    transform: floated ? 'translateY(0%)' : 'translateY(-50%)',
  };
}

export function fieldInputStyles(
  prefix: string,
  state: FieldInteractionState,
  hasLabel: boolean,
): CSSProperties {
  const isFilled = prefix === 'filled-text-field';
  return {
    ...typeStyle('body-large'),
    flex: 1,
    border: 'none',
    outline: 'none',
    background: 'transparent',
    color: fieldToken(prefix, 'input-color', state),
    paddingBlock:
      hasLabel && isFilled
        ? `${compVar('button-medium', 'leading-space')} ${compVar('fab-menu-baseline', 'close-button-between-space')}`
        : compVar('list', 'divider-leading-space'),
    caretColor: fieldToken(prefix, 'caret-color', state),
    position: 'relative',
    zIndex: 1,
  };
}

export function fieldSupportingStyles(prefix: string, state: FieldInteractionState): CSSProperties {
  return {
    ...typeStyle('body-small'),
    color: fieldToken(prefix, 'supporting-color', state),
    paddingInline: fieldLeadingSpace(),
    paddingTop: '4px',
  };
}

export function fieldIconStyles(prefix: string, state: FieldInteractionState): CSSProperties {
  return {
    width: compVar(prefix, 'leading-icon-size'),
    height: compVar(prefix, 'leading-icon-size'),
    color: fieldToken(prefix, 'leading-icon-color', state),
    flexShrink: 0,
    position: 'relative',
    zIndex: 1,
  };
}

export function fieldTrailingIconStyles(
  prefix: string,
  state: FieldInteractionState,
): CSSProperties {
  return {
    width: compVar(prefix, 'trailing-icon-size'),
    height: compVar(prefix, 'trailing-icon-size'),
    color: fieldToken(prefix, 'trailing-icon-color', state),
    flexShrink: 0,
    position: 'relative',
    zIndex: 1,
  };
}

export function fieldAffixStyles(prefix: string, kind: 'prefix' | 'suffix'): CSSProperties {
  return {
    ...typeStyle('body-large'),
    color: compVar(
      prefix,
      kind === 'prefix' ? 'input-text-prefix-color' : 'input-text-suffix-color',
    ),
    flexShrink: 0,
    position: 'relative',
    zIndex: 1,
  };
}

export function fieldTriggerStyles(
  variant: FieldVariant,
  state: FieldInteractionState,
  options?: FieldWrapOptions,
): CSSProperties {
  const prefix = fieldTokenPrefix(variant);
  return {
    ...fieldWrapStyles(variant, state, options),
    cursor: state.disabled ? 'not-allowed' : 'pointer',
    ...typeStyle('body-large'),
    color: fieldToken(prefix, 'input-color', state),
  };
}

export function fieldNotchFieldsetStyles(
  prefix: string,
  state: FieldInteractionState,
): CSSProperties {
  return {
    position: 'absolute',
    inset: '-6px 0 0 0',
    textAlign: 'start',
    margin: 0,
    padding: '0 12px',
    borderRadius: compVar(prefix, 'container-shape'),
    border: `${fieldOutlineWidth(prefix, state)} solid ${fieldToken(prefix, 'outline-color', state)}`,
    pointerEvents: 'none',
    transition:
      'border-color var(--md-sys-motion-duration-short3) var(--md-sys-motion-easing-standard), border-width var(--md-sys-motion-duration-short3) var(--md-sys-motion-easing-standard)',
    minWidth: 0,
  };
}

export function fieldNotchLegendStyles(floated: boolean): CSSProperties {
  return {
    height: '12px',
    lineHeight: '12px',
    padding: floated ? '0 4px' : 0,
    maxWidth: floated ? '100%' : '0.01px',
    overflow: 'hidden',
    visibility: 'hidden',
    whiteSpace: 'nowrap',
    ...typeStyle('body-small'),
    transition:
      'max-width var(--md-sys-motion-duration-short3) var(--md-sys-motion-easing-emphasized), padding var(--md-sys-motion-duration-short3) var(--md-sys-motion-easing-emphasized)',
  };
}

/** Outlined floating-label notch cutout (fieldset + legend). */
export function FieldOutlinedNotch({
  prefix,
  state,
  label,
  floated,
}: {
  prefix: string;
  state: FieldInteractionState;
  label: string;
  floated: boolean;
}) {
  return (
    <fieldset aria-hidden style={fieldNotchFieldsetStyles(prefix, state)}>
      <legend style={fieldNotchLegendStyles(floated)}>{label}</legend>
    </fieldset>
  );
}

/** Filled hover state-layer + center-growing active indicator. */
export function FieldFilledDecorations({ state }: { state: FieldInteractionState }) {
  const prefix = 'filled-text-field';
  return (
    <>
      {state.hovered && !state.disabled && (
        <span
          aria-hidden
          style={{
            position: 'absolute',
            inset: 0,
            borderRadius: 'inherit',
            background: compVar(prefix, 'hover-state-layer-color'),
            opacity: compVar(prefix, 'hover-state-layer-opacity'),
            pointerEvents: 'none',
          }}
        />
      )}
      <motion.span
        aria-hidden
        initial={false}
        animate={{ scaleX: state.focused ? 1 : 0 }}
        transition={springs.fastSpatial}
        style={{
          position: 'absolute',
          bottom: 0,
          insetInline: 0,
          height: compVar(prefix, 'focus-active-indicator-height'),
          background: fieldToken(prefix, 'active-indicator-color', state),
          transformOrigin: 'center',
          pointerEvents: 'none',
        }}
      />
    </>
  );
}

/** Shared field chrome: notch / filled decorations + floating label. */
export function FieldFloatingLabel({
  variant,
  prefix,
  state,
  label,
  floated,
  htmlFor,
}: {
  variant: FieldVariant;
  prefix: string;
  state: FieldInteractionState;
  label: string;
  floated: boolean;
  htmlFor?: string;
}) {
  return (
    <motion.label
      htmlFor={htmlFor}
      style={fieldLabelStyles(prefix, state, floated, variant)}
      animate={fieldLabelAnimate(variant, floated)}
      transition={springs.fastSpatial}
    >
      {label}
    </motion.label>
  );
}

export function FieldDecorations({
  variant,
  prefix,
  state,
  label,
  floated,
}: {
  variant: FieldVariant;
  prefix: string;
  state: FieldInteractionState;
  label?: string;
  floated: boolean;
}): ReactNode {
  if (variant === 'outlined' && label) {
    return <FieldOutlinedNotch prefix={prefix} state={state} label={label} floated={floated} />;
  }
  if (variant === 'filled') {
    return <FieldFilledDecorations state={state} />;
  }
  return null;
}
