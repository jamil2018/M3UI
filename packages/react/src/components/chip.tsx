import { Button as BaseButton } from '@base-ui/react/button';
import { Toggle } from '@base-ui/react/toggle';
import { ToggleGroup } from '@base-ui/react/toggle-group';
import { AnimatePresence, motion } from 'motion/react';
import { springs } from '@m3ui/motion';
import {
  createContext,
  useContext,
  useState,
  useId,
  type CSSProperties,
  type ReactNode,
} from 'react';
import { Icon } from '@m3ui/icons';
import {
  compVar,
  compElevation,
  disabledContainerMix,
  disabledContentMix,
  typeStyle,
} from '../lib/token-utils.js';
import { PressableShell } from '../lib/pressable-shell.js';

export type ChipType = 'assist' | 'filter' | 'input' | 'suggestion';

export interface ChipProps {
  type?: ChipType;
  label: ReactNode;
  elevated?: boolean;
  selected?: boolean;
  defaultSelected?: boolean;
  onSelectedChange?: (selected: boolean) => void;
  leadingIcon?: ReactNode;
  trailingIcon?: ReactNode;
  onRemove?: () => void;
  disabled?: boolean;
  onClick?: () => void;
  value?: string;
  className?: string;
  'data-testid'?: string;
}

interface FilterChipGroupContextValue {
  selectedValues: readonly string[];
  disabled: boolean;
}

const FilterChipGroupContext = createContext<FilterChipGroupContextValue | null>(null);

function chipPrefix(type: ChipType): string {
  switch (type) {
    case 'assist':
      return 'assist-chip';
    case 'filter':
      return 'filter-chip';
    case 'input':
      return 'input-chip';
    case 'suggestion':
      return 'suggestion-chip';
  }
}

interface ChipInteraction {
  hovered: boolean;
  focused: boolean;
  pressed: boolean;
}

function getChipStyles(
  type: ChipType,
  elevated: boolean,
  selected: boolean,
  disabled: boolean,
  interaction: ChipInteraction = { hovered: false, focused: false, pressed: false },
): CSSProperties {
  const p = chipPrefix(type);
  const { hovered, focused, pressed } = interaction;

  if (type === 'filter') {
    const sel = selected ? 'selected' : 'unselected';
    const labelColor = disabled
      ? disabledContentMix(compVar(p, 'disabled-label-text-color'))
      : pressed
        ? compVar(p, `${sel}-pressed-label-text-color`)
        : focused
          ? compVar(p, `${sel}-focus-label-text-color`)
          : hovered
            ? compVar(p, `${sel}-hover-label-text-color`)
            : compVar(p, `${sel}-label-text-color`);

    let boxShadow =
      elevated && !disabled
        ? compElevation(p, 'elevated-container-elevation')
        : compElevation(p, 'flat-container-elevation');
    if (elevated && !disabled) {
      if (pressed) boxShadow = compElevation(p, 'elevated-pressed-container-elevation');
      else if (hovered) boxShadow = compElevation(p, 'elevated-hover-container-elevation');
      else if (focused) boxShadow = compElevation(p, 'elevated-focus-container-elevation');
    }

    return {
      color: labelColor,
      background: elevated
        ? disabled
          ? disabledContainerMix(compVar(p, 'elevated-disabled-container-color'))
          : selected
            ? compVar(p, 'elevated-selected-container-color')
            : compVar(p, 'elevated-unselected-container-color')
        : selected
          ? disabled
            ? disabledContainerMix(compVar(p, 'flat-disabled-selected-container-color'))
            : compVar(p, 'flat-selected-container-color')
          : 'transparent',
      border: elevated
        ? 'none'
        : `${compVar(p, `flat-${sel}-outline-width`)} solid ${disabled ? disabledContainerMix(compVar(p, 'flat-disabled-unselected-outline-color')) : compVar(p, `flat-${sel === 'selected' ? 'selected' : 'unselected'}-outline-color`)}`,
      boxShadow,
    };
  }

  if (type === 'input') {
    const labelColor = disabled
      ? disabledContentMix(compVar(p, 'disabled-label-text-color'))
      : pressed
        ? compVar(
            p,
            selected ? 'selected-pressed-label-text-color' : 'unselected-pressed-label-text-color',
          )
        : focused
          ? compVar(
              p,
              selected ? 'selected-focus-label-text-color' : 'unselected-focus-label-text-color',
            )
          : hovered
            ? compVar(
                p,
                selected ? 'selected-hover-label-text-color' : 'unselected-hover-label-text-color',
              )
            : selected
              ? compVar(p, 'selected-label-text-color')
              : compVar(p, 'unselected-label-text-color');

    return {
      color: labelColor,
      background: disabled
        ? selected
          ? disabledContainerMix(compVar(p, 'disabled-selected-container-color'))
          : 'transparent'
        : selected
          ? compVar(p, 'selected-container-color')
          : 'transparent',
      border: `${compVar(p, selected ? 'selected-outline-width' : 'unselected-outline-width')} solid ${disabled ? disabledContainerMix(compVar(p, 'disabled-unselected-outline-color')) : selected ? 'transparent' : compVar(p, 'unselected-outline-color')}`,
      boxShadow: !disabled ? compElevation(p, 'container-elevation') : 'none',
    };
  }

  // assist & suggestion
  const labelColor = disabled
    ? disabledContentMix(compVar(p, 'disabled-label-text-color'))
    : pressed
      ? compVar(p, 'pressed-label-text-color')
      : focused
        ? compVar(p, 'focus-label-text-color')
        : hovered
          ? compVar(p, 'hover-label-text-color')
          : compVar(p, 'label-text-color');

  let boxShadow =
    elevated && !disabled
      ? compElevation(p, 'elevated-container-elevation')
      : compElevation(p, 'flat-container-elevation');
  if (elevated && !disabled) {
    if (pressed) boxShadow = compElevation(p, 'elevated-pressed-container-elevation');
    else if (hovered) boxShadow = compElevation(p, 'elevated-hover-container-elevation');
    else if (focused) boxShadow = compElevation(p, 'elevated-focus-container-elevation');
  }

  return {
    color: labelColor,
    background: elevated
      ? disabled
        ? disabledContainerMix(compVar(p, 'elevated-disabled-container-color'))
        : compVar(p, 'elevated-container-color')
      : 'transparent',
    border: elevated
      ? 'none'
      : `${compVar(p, 'flat-outline-width')} solid ${disabled ? disabledContainerMix(compVar(p, 'flat-disabled-outline-color')) : compVar(p, 'flat-outline-color')}`,
    boxShadow,
  };
}

function ChipInner({
  type,
  label,
  elevated,
  selected,
  leadingIcon,
  trailingIcon,
  onRemove,
  disabled,
  className,
  'data-testid': testId,
  hovered = false,
  focused = false,
  pressed = false,
  children,
}: ChipProps & {
  children?: ReactNode;
  hovered?: boolean;
  focused?: boolean;
  pressed?: boolean;
}) {
  const p = chipPrefix(type ?? 'assist');
  const styles = getChipStyles(
    type ?? 'assist',
    elevated ?? false,
    selected ?? false,
    disabled ?? false,
    { hovered, focused, pressed },
  );

  const showFilterCheck = type === 'filter' && selected && !leadingIcon;
  const hasLeading = Boolean(leadingIcon) || showFilterCheck;
  const hasTrailing = Boolean(trailingIcon) || Boolean(onRemove);

  const chipStyle: CSSProperties = {
    position: 'relative',
    display: 'inline-flex',
    alignItems: 'center',
    gap: compVar('fab-menu-baseline', 'close-button-between-space'),
    height: compVar(p, 'container-height'),
    paddingInlineStart: hasLeading
      ? compVar('fab-menu-baseline', 'close-button-between-space')
      : compVar('list', 'item-between-space'),
    paddingInlineEnd: hasTrailing
      ? compVar('fab-menu-baseline', 'close-button-between-space')
      : compVar('list', 'item-between-space'),
    borderRadius: compVar(p, 'container-shape'),
    cursor: disabled ? 'not-allowed' : 'pointer',
    ...typeStyle('label-large'),
    ...styles,
  };

  const resolvedLeadingIconColor = disabled
    ? disabledContentMix(
        compVar(p, type === 'assist' ? 'disabled-icon-color' : 'disabled-leading-icon-color'),
      )
    : type === 'filter' || type === 'input'
      ? compVar(p, selected ? 'selected-leading-icon-color' : 'unselected-leading-icon-color')
      : type === 'suggestion'
        ? compVar(p, 'leading-icon-color')
        : compVar(p, 'icon-color');

  const iconStyle: CSSProperties = {
    width: compVar(p, type === 'suggestion' ? 'leading-icon-size' : 'icon-size'),
    height: compVar(p, type === 'suggestion' ? 'leading-icon-size' : 'icon-size'),
    color: resolvedLeadingIconColor,
    display: 'inline-flex',
    alignItems: 'center',
    justifyContent: 'center',
    flexShrink: 0,
  };

  return (
    <span className={className} data-testid={testId} style={chipStyle}>
      {children ?? (
        <>
          <AnimatePresence initial={false}>
            {showFilterCheck && (
              <motion.span
                key="filter-check"
                initial={{ width: 0, scale: 0, opacity: 0 }}
                animate={{ width: 18, scale: 1, opacity: 1 }}
                exit={{ width: 0, scale: 0, opacity: 0 }}
                transition={{ ...springs.fastSpatial, opacity: springs.fastEffects }}
                style={{
                  ...iconStyle,
                  overflow: 'hidden',
                  display: 'inline-flex',
                }}
              >
                <Icon name="check" size={18} />
              </motion.span>
            )}
          </AnimatePresence>
          {leadingIcon && <span style={iconStyle}>{leadingIcon}</span>}
          <span>{label}</span>
          {trailingIcon && <span style={iconStyle}>{trailingIcon}</span>}
          {onRemove && (
            <span
              aria-hidden
              onClick={(e) => {
                if (disabled) return;
                e.stopPropagation();
                onRemove();
              }}
              style={{
                ...iconStyle,
                width: compVar('input-chip', 'trailing-icon-size'),
                height: compVar('input-chip', 'trailing-icon-size'),
                background: 'transparent',
                border: 'none',
                padding: 0,
                color: 'inherit',
                cursor: disabled ? 'not-allowed' : 'pointer',
              }}
            >
              <Icon name="close" size={18} />
            </span>
          )}
        </>
      )}
    </span>
  );
}

export function Chip({
  type = 'assist',
  label,
  elevated = false,
  selected: selectedProp,
  defaultSelected = false,
  onSelectedChange,
  leadingIcon,
  trailingIcon,
  onRemove,
  disabled = false,
  onClick,
  value,
  className,
  'data-testid': testId,
}: ChipProps) {
  const labelId = useId();
  const removeId = useId();
  const p = chipPrefix(type);
  const filterCtx = useContext(FilterChipGroupContext);
  const [internalSelected, setInternalSelected] = useState(defaultSelected);
  const [hovered, setHovered] = useState(false);
  const [focused, setFocused] = useState(false);
  const [pressed, setPressed] = useState(false);

  const selectedFromGroup =
    type === 'filter' && filterCtx != null && value != null
      ? filterCtx.selectedValues.includes(value)
      : undefined;
  const selected = selectedFromGroup ?? selectedProp ?? internalSelected;
  const isDisabled = disabled || (filterCtx?.disabled ?? false);
  const styles = getChipStyles(type, elevated, selected, isDisabled, { hovered, focused, pressed });

  const filterHoverColor = selected
    ? compVar(p, 'selected-hover-state-layer-color')
    : compVar(p, 'unselected-hover-state-layer-color');
  const filterPressedColor = selected
    ? compVar(p, 'selected-pressed-state-layer-color')
    : compVar(p, 'unselected-pressed-state-layer-color');
  const defaultHoverColor =
    type === 'input' && selected
      ? compVar(p, 'selected-hover-state-layer-color')
      : compVar(p, 'hover-state-layer-color');
  const defaultPressedColor =
    type === 'input' && selected
      ? compVar(p, 'selected-pressed-state-layer-color')
      : compVar(p, 'pressed-state-layer-color');

  const shellProps = {
    disabled: isDisabled,
    shape: 'round' as const,
    shapeRound:
      type === 'filter' && selected
        ? `calc(${compVar(p, 'container-height')} / 2)`
        : compVar(p, 'container-shape'),
    shapeSquare: compVar(p, 'container-shape'),
    pressedShape: compVar('chips', 'pressed-shape'),
    stateLayerColor: styles.color as string,
    hoverStateColor: type === 'filter' ? filterHoverColor : defaultHoverColor,
    hoverStateOpacity:
      type === 'filter'
        ? selected
          ? compVar(p, 'selected-hover-state-layer-opacity')
          : compVar(p, 'unselected-hover-state-layer-opacity')
        : type === 'input' && selected
          ? compVar(p, 'selected-hover-state-layer-opacity')
          : compVar(p, 'hover-state-layer-opacity'),
    pressedStateColor: type === 'filter' ? filterPressedColor : defaultPressedColor,
    pressedStateOpacity:
      type === 'filter'
        ? selected
          ? compVar(p, 'selected-pressed-state-layer-opacity')
          : compVar(p, 'unselected-pressed-state-layer-opacity')
        : type === 'input' && selected
          ? compVar(p, 'selected-pressed-state-layer-opacity')
          : compVar(p, 'pressed-state-layer-opacity'),
  };

  const interactionHandlers = {
    onPointerEnter: () => !isDisabled && setHovered(true),
    onPointerLeave: () => {
      setHovered(false);
      setPressed(false);
    },
    onPointerDown: () => !isDisabled && setPressed(true),
    onPointerUp: () => setPressed(false),
    onFocus: () => setFocused(true),
    onBlur: () => setFocused(false),
  };

  const inner = (
    <ChipInner
      type={type}
      label={label}
      elevated={elevated}
      selected={selected}
      leadingIcon={leadingIcon}
      trailingIcon={trailingIcon}
      onRemove={onRemove}
      disabled={isDisabled}
      hovered={hovered}
      focused={focused}
      pressed={pressed}
    />
  );

  if (type === 'filter') {
    const inGroup = filterCtx != null;
    const toggleProps = inGroup
      ? {
          value,
          onPressedChange: (next: boolean) => {
            onSelectedChange?.(next);
          },
        }
      : selectedProp !== undefined
        ? { pressed: selectedProp, onPressedChange: onSelectedChange }
        : {
            defaultPressed: defaultSelected,
            onPressedChange: (next: boolean) => {
              setInternalSelected(next);
              onSelectedChange?.(next);
            },
          };

    return (
      <PressableShell {...shellProps} data-testid={testId}>
        <Toggle
          {...toggleProps}
          disabled={isDisabled}
          value={value}
          className={className}
          style={{ display: 'inline-flex', borderRadius: 'inherit' }}
          {...interactionHandlers}
        >
          {inner}
        </Toggle>
      </PressableShell>
    );
  }

  if (onRemove) {
    const actionStyle: CSSProperties = {
      display: 'inline-flex',
      alignItems: 'center',
      gap: 8,
      background: 'transparent',
      border: 0,
      padding: 0,
      color: 'inherit',
      font: 'inherit',
      cursor: isDisabled ? 'not-allowed' : 'pointer',
      minHeight: 32,
    };
    return (
      <PressableShell {...shellProps} data-testid={testId}>
        <ChipInner
          type={type}
          label={label}
          elevated={elevated}
          selected={selected}
          disabled={isDisabled}
          hovered={hovered}
          focused={focused}
          pressed={pressed}
        >
          {onClick ? (
            <BaseButton
              disabled={isDisabled}
              onClick={onClick}
              style={actionStyle}
              {...interactionHandlers}
            >
              {leadingIcon}
              <span id={labelId}>{label}</span>
            </BaseButton>
          ) : (
            <span id={labelId}>
              {leadingIcon}
              {label}
            </span>
          )}
          <BaseButton
            disabled={isDisabled}
            onClick={onRemove}
            aria-labelledby={`${removeId} ${labelId}`}
            style={{ ...actionStyle, minWidth: 24 }}
          >
            <span
              id={removeId}
              style={{
                position: 'absolute',
                width: 1,
                height: 1,
                overflow: 'hidden',
                clipPath: 'inset(50%)',
              }}
            >
              Remove
            </span>
            <Icon name="close" size={18} />
          </BaseButton>
        </ChipInner>
      </PressableShell>
    );
  }

  return (
    <PressableShell {...shellProps} data-testid={testId}>
      <BaseButton
        type="button"
        disabled={isDisabled}
        onClick={onClick ?? onRemove}
        className={className}
        style={{
          display: 'inline-flex',
          borderRadius: 'inherit',
          background: 'transparent',
          border: 'none',
          padding: 0,
        }}
        {...interactionHandlers}
      >
        {inner}
      </BaseButton>
    </PressableShell>
  );
}

export interface ChipSetProps {
  children: ReactNode;
  className?: string;
  'data-testid'?: string;
}

/** Wraps chips with M3 set spacing and wrapping behavior */
export function ChipSet({ children, className, 'data-testid': testId }: ChipSetProps) {
  return (
    <div
      className={className}
      data-testid={testId}
      style={{
        display: 'flex',
        flexWrap: 'wrap',
        gap: compVar('list', 'segmented-gap'),
        alignItems: 'center',
      }}
    >
      {children}
    </div>
  );
}

export interface FilterChipGroupProps {
  children: ReactNode;
  value?: readonly string[];
  defaultValue?: readonly string[];
  onValueChange?: (value: string[]) => void;
  multiple?: boolean;
  disabled?: boolean;
  className?: string;
  'data-testid'?: string;
}

export function FilterChipGroup({
  children,
  value,
  defaultValue,
  onValueChange,
  multiple = false,
  disabled = false,
  className,
  'data-testid': testId,
}: FilterChipGroupProps) {
  const [internalValue, setInternalValue] = useState<readonly string[]>(defaultValue ?? []);
  const activeValues = value ?? internalValue;

  return (
    <FilterChipGroupContext.Provider value={{ selectedValues: activeValues, disabled }}>
      <ToggleGroup
        value={value}
        defaultValue={defaultValue}
        onValueChange={(next) => {
          if (value === undefined) setInternalValue(next);
          onValueChange?.(next);
        }}
        multiple={multiple}
        disabled={disabled}
        className={className}
        data-testid={testId}
        style={{ display: 'inline-flex', flexWrap: 'wrap', gap: compVar('list', 'segmented-gap') }}
      >
        {children}
      </ToggleGroup>
    </FilterChipGroupContext.Provider>
  );
}
