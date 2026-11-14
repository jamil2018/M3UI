import { Checkbox as BaseCheckbox } from '@base-ui/react/checkbox';
import { CheckboxGroup as BaseCheckboxGroup } from '@base-ui/react/checkbox-group';
import { AnimatePresence, motion } from 'motion/react';
import { springs } from '@m3ui/motion';
import { createContext, useContext, useState, type CSSProperties, type ReactNode } from 'react';
import { FocusRing } from '../primitives/focus-ring.js';
import { Ripple } from '../primitives/ripple.js';
import { focusRingAttachmentStyle } from '../lib/pressable-shell.js';
import { compVar, disabledContentMix, typeStyle } from '../lib/token-utils.js';

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

interface CheckboxInteraction {
  hovered: boolean;
  pressed: boolean;
}

interface CheckboxColors {
  container: string;
  icon: string;
  outline: string;
  stateLayer: string;
  stateLayerOpacity: string;
  pressedStateLayer: string;
  pressedStateLayerOpacity: string;
}

function getCheckboxColors(
  error: boolean,
  disabled: boolean,
  active: boolean,
  { hovered, pressed }: CheckboxInteraction,
): CheckboxColors {
  const p = 'checkbox';

  if (disabled) {
    return {
      container: active
        ? disabledContentMix(compVar(p, 'selected-disabled-container-color'))
        : 'transparent',
      icon: compVar(p, 'selected-disabled-icon-color'),
      outline: disabledContentMix(compVar(p, 'unselected-disabled-outline-color')),
      stateLayer: 'transparent',
      stateLayerOpacity: '0',
      pressedStateLayer: 'transparent',
      pressedStateLayerOpacity: '0',
    };
  }

  if (error && active) {
    return {
      container: pressed
        ? compVar(p, 'selected-error-pressed-container-color')
        : hovered
          ? compVar(p, 'selected-error-hover-container-color')
          : compVar(p, 'selected-error-container-color'),
      icon: pressed
        ? compVar(p, 'selected-error-pressed-icon-color')
        : hovered
          ? compVar(p, 'selected-error-hover-icon-color')
          : compVar(p, 'selected-error-icon-color'),
      outline: 'transparent',
      stateLayer: compVar(p, 'error-hover-state-layer-color'),
      stateLayerOpacity: compVar(p, 'error-hover-state-layer-opacity'),
      pressedStateLayer: compVar(p, 'error-pressed-state-layer-color'),
      pressedStateLayerOpacity: compVar(p, 'error-pressed-state-layer-opacity'),
    };
  }

  if (error) {
    return {
      container: 'transparent',
      icon: compVar(p, 'selected-error-icon-color'),
      outline: pressed
        ? compVar(p, 'unselected-error-pressed-outline-color')
        : hovered
          ? compVar(p, 'unselected-error-hover-outline-color')
          : compVar(p, 'unselected-error-outline-color'),
      stateLayer: compVar(p, 'error-hover-state-layer-color'),
      stateLayerOpacity: compVar(p, 'error-hover-state-layer-opacity'),
      pressedStateLayer: compVar(p, 'error-pressed-state-layer-color'),
      pressedStateLayerOpacity: compVar(p, 'error-pressed-state-layer-opacity'),
    };
  }

  if (active) {
    return {
      container: pressed
        ? compVar(p, 'selected-pressed-container-color')
        : hovered
          ? compVar(p, 'selected-hover-container-color')
          : compVar(p, 'selected-container-color'),
      icon: pressed
        ? compVar(p, 'selected-pressed-icon-color')
        : hovered
          ? compVar(p, 'selected-hover-icon-color')
          : compVar(p, 'selected-icon-color'),
      outline: 'transparent',
      stateLayer: compVar(p, 'selected-hover-state-layer-color'),
      stateLayerOpacity: compVar(p, 'selected-hover-state-layer-opacity'),
      pressedStateLayer: compVar(p, 'selected-pressed-state-layer-color'),
      pressedStateLayerOpacity: compVar(p, 'selected-pressed-state-layer-opacity'),
    };
  }

  return {
    container: 'transparent',
    icon: pressed
      ? compVar(p, 'unselected-pressed-icon-color')
      : hovered
        ? compVar(p, 'unselected-hover-icon-color')
        : compVar(p, 'selected-icon-color'),
    outline: pressed
      ? compVar(p, 'unselected-pressed-outline-color')
      : hovered
        ? compVar(p, 'unselected-hover-outline-color')
        : compVar(p, 'unselected-outline-color'),
    stateLayer: compVar(p, 'unselected-hover-state-layer-color'),
    stateLayerOpacity: compVar(p, 'unselected-hover-state-layer-opacity'),
    pressedStateLayer: compVar(p, 'unselected-pressed-state-layer-color'),
    pressedStateLayerOpacity: compVar(p, 'unselected-pressed-state-layer-opacity'),
  };
}

const CheckboxGroupContext = createContext<{ value: string[]; disabled: boolean } | null>(null);

export function Checkbox({
  checked,
  defaultChecked,
  indeterminate = false,
  disabled: disabledProp = false,
  error = false,
  onCheckedChange,
  label,
  name,
  value,
  className,
  'data-testid': testId,
}: CheckboxProps) {
  const [internalChecked, setInternalChecked] = useState(defaultChecked ?? false);
  const [hovered, setHovered] = useState(false);
  const [pressed, setPressed] = useState(false);

  const group = useContext(CheckboxGroupContext);
  const disabled = disabledProp || !!group?.disabled;
  const isChecked =
    group && value !== undefined ? group.value.includes(value) : (checked ?? internalChecked);
  const active = isChecked || indeterminate;
  const colors = getCheckboxColors(error, disabled, active, { hovered, pressed });

  const haloSize = compVar('checkbox', 'state-layer-size');
  const haloShape = compVar('checkbox', 'state-layer-shape');

  const boxStyle: CSSProperties = {
    width: compVar('checkbox', 'container-size'),
    height: compVar('checkbox', 'container-size'),
    borderRadius: compVar('checkbox', 'container-shape'),
    border: `${active ? compVar('checkbox', 'selected-outline-width') : pressed ? compVar('checkbox', 'unselected-pressed-outline-width') : hovered ? compVar('checkbox', 'unselected-hover-outline-width') : compVar('checkbox', 'unselected-outline-width')} solid ${colors.outline}`,
    background: colors.container,
    display: 'inline-flex',
    alignItems: 'center',
    justifyContent: 'center',
    flexShrink: 0,
    position: 'relative',
    zIndex: 1,
  };

  const iconStyle: CSSProperties = {
    width: compVar('checkbox', 'icon-size'),
    height: compVar('checkbox', 'icon-size'),
    color: colors.icon,
    display: 'inline-flex',
    alignItems: 'center',
    justifyContent: 'center',
  };

  const labelStyle: CSSProperties = {
    ...typeStyle('body-large'),
    color: disabled
      ? 'color-mix(in srgb, var(--md-sys-color-on-surface) 38%, transparent)'
      : 'var(--md-sys-color-on-surface)',
  };

  return (
    <label
      className={className}
      data-testid={testId}
      style={{
        display: 'inline-flex',
        alignItems: 'center',
        gap: compVar('list', 'item-between-space'),
        cursor: disabled ? 'not-allowed' : 'pointer',
        minHeight: haloSize,
      }}
    >
      <FocusRing
        style={{
          display: 'inline-flex',
          alignItems: 'center',
          justifyContent: 'center',
          width: haloSize,
          height: haloSize,
          ...focusRingAttachmentStyle(haloShape),
        }}
      >
        <Ripple
          disabled={disabled}
          color={colors.stateLayer}
          hoverColor={colors.stateLayer}
          hoverOpacity={colors.stateLayerOpacity}
          pressedColor={colors.pressedStateLayer}
          pressedOpacity={colors.pressedStateLayerOpacity}
          style={{
            display: 'inline-flex',
            alignItems: 'center',
            justifyContent: 'center',
            width: haloSize,
            height: haloSize,
            borderRadius: haloShape,
          }}
        >
          <BaseCheckbox.Root
            checked={checked}
            defaultChecked={defaultChecked}
            indeterminate={indeterminate}
            disabled={disabled}
            onCheckedChange={(next) => {
              setInternalChecked(next);
              onCheckedChange?.(next);
            }}
            onPointerEnter={() => !disabled && setHovered(true)}
            onPointerLeave={() => {
              setHovered(false);
              setPressed(false);
            }}
            onPointerDown={() => !disabled && setPressed(true)}
            onPointerUp={() => setPressed(false)}
            name={name}
            value={value}
            style={boxStyle}
          >
            <BaseCheckbox.Indicator keepMounted style={iconStyle}>
              <AnimatePresence mode="wait" initial={false}>
                {active && (
                  <svg
                    viewBox="0 0 18 18"
                    style={{
                      width: compVar('checkbox', 'icon-size'),
                      height: compVar('checkbox', 'icon-size'),
                    }}
                  >
                    <motion.path
                      key={indeterminate ? 'indeterminate' : 'check'}
                      d={indeterminate ? 'M 4 9 L 14 9' : 'M 3.5 9.5 L 7.5 13.5 L 14.5 5'}
                      fill="none"
                      stroke="currentColor"
                      strokeWidth={2.2}
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      initial={{ pathLength: 0, opacity: 0 }}
                      animate={{ pathLength: 1, opacity: 1 }}
                      exit={{ pathLength: 0, opacity: 0 }}
                      transition={springs.fastEffects}
                    />
                  </svg>
                )}
              </AnimatePresence>
            </BaseCheckbox.Indicator>
          </BaseCheckbox.Root>
        </Ripple>
      </FocusRing>
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
  const [internalValue, setInternalValue] = useState(defaultValue ?? []);
  return (
    <CheckboxGroupContext.Provider value={{ value: value ?? internalValue, disabled }}>
      <BaseCheckboxGroup
        value={value}
        defaultValue={defaultValue}
        onValueChange={(next) => {
          setInternalValue(next);
          onValueChange?.(next);
        }}
        disabled={disabled}
        className={className}
        data-testid={testId}
        style={{
          display: 'flex',
          flexDirection: 'column',
          gap: compVar('list', 'item-between-space'),
        }}
      >
        {children}
      </BaseCheckboxGroup>
    </CheckboxGroupContext.Provider>
  );
}
