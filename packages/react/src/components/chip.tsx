
import { Button as BaseButton } from '@base-ui/react/button';
import { Toggle } from '@base-ui/react/toggle';
import { ToggleGroup } from '@base-ui/react/toggle-group';
import { type CSSProperties, type ReactNode, useState } from 'react';
import { compVar, elevationShadow, typeStyle } from '../lib/token-utils.js';
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

function getChipStyles(
  type: ChipType,
  elevated: boolean,
  selected: boolean,
  disabled: boolean,
): CSSProperties {
  const p = chipPrefix(type);

  if (type === 'filter') {
    const sel = selected ? 'selected' : 'unselected';
    return {
      color: disabled
        ? compVar(p, 'disabled-label-text-color')
        : compVar(p, `${sel}-label-text-color`),
      background: elevated
        ? disabled
          ? compVar(p, 'elevated-disabled-container-color')
          : selected
            ? compVar(p, 'elevated-selected-container-color')
            : compVar(p, 'elevated-unselected-container-color')
        : selected
          ? compVar(p, 'flat-selected-container-color')
          : 'transparent',
      border: elevated
        ? 'none'
        : `${compVar(p, `flat-${sel}-outline-width`)} solid ${disabled ? compVar(p, 'flat-disabled-unselected-outline-color') : compVar(p, `flat-${sel === 'selected' ? 'selected' : 'unselected'}-outline-color`)}`,
      boxShadow: elevated && !disabled ? elevationShadow('level1') : 'none',
    };
  }

  if (type === 'input') {
    return {
      color: disabled
        ? compVar(p, 'disabled-label-text-color')
        : selected
          ? compVar(p, 'selected-label-text-color')
          : compVar(p, 'unselected-label-text-color'),
      background: disabled
        ? compVar(p, 'disabled-selected-container-color')
        : selected
          ? compVar(p, 'selected-container-color')
          : 'transparent',
      border: `${compVar(p, selected ? 'selected-outline-width' : 'unselected-outline-width')} solid ${disabled ? compVar(p, 'disabled-unselected-outline-color') : selected ? 'transparent' : compVar(p, 'unselected-outline-color')}`,
      boxShadow: !disabled ? elevationShadow('level0') : 'none',
    };
  }

  // assist & suggestion
  return {
    color: disabled ? compVar(p, 'disabled-label-text-color') : compVar(p, 'label-text-color'),
    background: elevated
      ? disabled
        ? compVar(p, 'elevated-disabled-container-color')
        : compVar(p, 'elevated-container-color')
      : 'transparent',
    border: elevated
      ? 'none'
      : `${compVar(p, 'flat-outline-width')} solid ${disabled ? compVar(p, 'flat-disabled-outline-color') : compVar(p, 'flat-outline-color')}`,
    boxShadow: elevated && !disabled ? elevationShadow('level1') : 'none',
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
  children,
}: ChipProps & { children?: ReactNode }) {
  const p = chipPrefix(type ?? 'assist');
  const styles = getChipStyles(type ?? 'assist', elevated ?? false, selected ?? false, disabled ?? false);

  const chipStyle: CSSProperties = {
    position: 'relative',
    display: 'inline-flex',
    alignItems: 'center',
    gap: compVar('chips', 'leading-icon-size'),
    height: compVar(p, 'container-height'),
    paddingInline: compVar('list', 'item-between-space'),
    borderRadius: compVar(p, 'container-shape'),
    cursor: disabled ? 'not-allowed' : 'pointer',
    opacity: disabled ? 'var(--md-sys-state-disabled-content-opacity, 0.38)' : 1,
    ...typeStyle('label-large'),
    ...styles,
    width: '100%',
  };

  const iconStyle: CSSProperties = {
    width: compVar(p, type === 'suggestion' ? 'leading-icon-size' : 'icon-size'),
    height: compVar(p, type === 'suggestion' ? 'leading-icon-size' : 'icon-size'),
    display: 'inline-flex',
    alignItems: 'center',
    justifyContent: 'center',
    flexShrink: 0,
  };

  return (
    <span className={className} data-testid={testId} style={chipStyle}>
      {children ?? (
        <>
          {leadingIcon && <span style={iconStyle}>{leadingIcon}</span>}
          <span>{label}</span>
          {trailingIcon && <span style={iconStyle}>{trailingIcon}</span>}
          {onRemove && (
            <BaseButton
              type="button"
              disabled={disabled}
              onClick={(e) => {
                e.stopPropagation();
                onRemove();
              }}
              aria-label="Remove"
              style={{
                ...iconStyle,
                width: compVar('input-chip', 'trailing-icon-size'),
                height: compVar('input-chip', 'trailing-icon-size'),
                background: 'transparent',
                border: 'none',
                padding: 0,
                cursor: disabled ? 'not-allowed' : 'pointer',
                color: 'inherit',
              }}
            >
              ×
            </BaseButton>
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
  const p = chipPrefix(type);
  const [internalSelected, setInternalSelected] = useState(defaultSelected);
  const selected = selectedProp ?? internalSelected;
  const styles = getChipStyles(type, elevated, selected, disabled);

  const shellProps = {
    disabled,
    shape: 'round' as const,
    shapeRound: compVar(p, 'container-shape'),
    shapeSquare: compVar(p, 'container-shape'),
    pressedShape: compVar('chips', 'pressed-shape'),
    stateLayerColor: styles.color as string,
  };

  if (type === 'filter') {
    const toggleProps =
      selectedProp !== undefined
        ? { pressed: selectedProp, onPressedChange: onSelectedChange }
        : { defaultPressed: defaultSelected, onPressedChange: (p: boolean) => { setInternalSelected(p); onSelectedChange?.(p); } };

    return (
      <PressableShell {...shellProps} data-testid={testId}>
        <Toggle
          {...toggleProps}
          disabled={disabled}
          value={value}
          className={className}
          style={{ display: 'inline-flex', borderRadius: 'inherit' }}
        >
          <ChipInner
            type={type}
            label={label}
            elevated={elevated}
            selected={selected}
            leadingIcon={leadingIcon}
            trailingIcon={trailingIcon}
            disabled={disabled}
          />
        </Toggle>
      </PressableShell>
    );
  }

  return (
    <PressableShell {...shellProps} data-testid={testId}>
      <BaseButton
        type="button"
        disabled={disabled}
        onClick={onClick}
        className={className}
        style={{ display: 'inline-flex', borderRadius: 'inherit', background: 'transparent', border: 'none', padding: 0 }}
      >
        <ChipInner
          type={type}
          label={label}
          elevated={elevated}
          selected={selected}
          leadingIcon={leadingIcon}
          trailingIcon={trailingIcon}
          onRemove={onRemove}
          disabled={disabled}
        />
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
  return (
    <ToggleGroup
      value={value}
      defaultValue={defaultValue}
      onValueChange={onValueChange}
      multiple={multiple}
      disabled={disabled}
      className={className}
      data-testid={testId}
      style={{ display: 'inline-flex', flexWrap: 'wrap', gap: compVar('list', 'segmented-gap') }}
    >
      {children}
    </ToggleGroup>
  );
}
