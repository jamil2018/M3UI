import { Radio as BaseRadio } from '@base-ui/react/radio';
import { RadioGroup as BaseRadioGroup } from '@base-ui/react/radio-group';
import { motion } from 'motion/react';
import { springs } from '@m3ui/motion';
import { createContext, useContext, useState, type CSSProperties, type ReactNode } from 'react';
import { FocusRing } from '../primitives/focus-ring.js';
import { Ripple } from '../primitives/ripple.js';
import { focusRingAttachmentStyle } from '../lib/pressable-shell.js';
import { compVar, sysShape, sysColor, typeStyle } from '../lib/token-utils.js';

const RadioGroupDisabledContext = createContext(false);
const RADIO = 'radio';
const RadioGroupValueContext = createContext<string | undefined>(undefined);

export interface RadioProps {
  value: string;
  disabled?: boolean;
  label?: ReactNode;
  className?: string;
  'data-testid'?: string;
}

function radioDotColor(disabled: boolean): string {
  return disabled
    ? compVar(RADIO, 'disabled-selected-icon-color')
    : compVar(RADIO, 'selected-icon-color');
}

export function Radio({
  value,
  disabled: disabledProp = false,
  label,
  className,
  'data-testid': testId,
}: RadioProps) {
  const groupDisabled = useContext(RadioGroupDisabledContext);
  const disabled = disabledProp || groupDisabled;
  const groupValue = useContext(RadioGroupValueContext);
  const isChecked = groupValue === value;
  const iconSize = compVar(RADIO, 'icon-size');
  const haloSize = compVar(RADIO, 'state-layer-size');
  const haloShape = sysShape('corner-full');

  const dotStyle: CSSProperties = {
    width: `calc(${iconSize} / 2)`,
    height: `calc(${iconSize} / 2)`,
    borderRadius: sysShape('corner-full'),
    background: radioDotColor(disabled),
    display: 'block',
  };

  const labelStyle: CSSProperties = {
    ...typeStyle('body-large'),
    color: sysColor('on-surface'),
    opacity: disabled ? 'var(--md-sys-state-disabled-content-opacity)' : 1,
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
          color={compVar(RADIO, 'unselected-hover-state-layer-color')}
          hoverColor={
            isChecked
              ? compVar(RADIO, 'selected-hover-state-layer-color')
              : compVar(RADIO, 'unselected-hover-state-layer-color')
          }
          hoverOpacity={
            isChecked
              ? compVar(RADIO, 'selected-hover-state-layer-opacity')
              : compVar(RADIO, 'unselected-hover-state-layer-opacity')
          }
          pressedColor={
            isChecked
              ? compVar(RADIO, 'selected-pressed-state-layer-color')
              : compVar(RADIO, 'unselected-pressed-state-layer-color')
          }
          pressedOpacity={compVar(RADIO, 'selected-pressed-state-layer-opacity')}
          style={{
            display: 'inline-flex',
            alignItems: 'center',
            justifyContent: 'center',
            width: haloSize,
            height: haloSize,
            borderRadius: haloShape,
          }}
        >
          <BaseRadio.Root
            value={value}
            disabled={disabled}
            style={(state) => ({
              width: iconSize,
              height: iconSize,
              borderRadius: sysShape('corner-full'),
              border: `2px solid ${
                disabled
                  ? state.checked
                    ? compVar(RADIO, 'disabled-selected-icon-color')
                    : compVar(RADIO, 'disabled-unselected-icon-color')
                  : state.checked
                    ? compVar(RADIO, 'selected-icon-color')
                    : compVar(RADIO, 'unselected-icon-color')
              }`,
              display: 'inline-flex',
              alignItems: 'center',
              justifyContent: 'center',
              opacity: disabled ? 'var(--md-sys-state-disabled-content-opacity)' : 1,
              position: 'relative',
              zIndex: 1,
              flexShrink: 0,
              padding: 0,
              margin: 0,
              background: 'transparent',
            })}
          >
            <BaseRadio.Indicator
              keepMounted
              render={(props, state) => (
                <span
                  {...props}
                  style={{
                    display: 'inline-flex',
                    ...(typeof props.style === 'object' ? props.style : {}),
                  }}
                >
                  <motion.span
                    initial={false}
                    animate={{
                      scale: state.checked ? 1 : 0,
                      opacity: state.checked ? 1 : 0,
                    }}
                    transition={springs.fastSpatial}
                    style={dotStyle}
                  />
                </span>
              )}
            />
          </BaseRadio.Root>
        </Ripple>
      </FocusRing>
      {label && <span style={labelStyle}>{label}</span>}
    </label>
  );
}

export interface RadioGroupProps {
  children: ReactNode;
  value?: string;
  defaultValue?: string;
  onValueChange?: (value: string) => void;
  disabled?: boolean;
  name?: string;
  className?: string;
  'data-testid'?: string;
}

export function RadioGroup({
  children,
  value,
  defaultValue,
  onValueChange,
  disabled = false,
  name,
  className,
  'data-testid': testId,
}: RadioGroupProps) {
  const [internalValue, setInternalValue] = useState(defaultValue);
  const currentValue = value ?? internalValue;

  return (
    <RadioGroupDisabledContext.Provider value={disabled}>
      <RadioGroupValueContext.Provider value={currentValue}>
        <BaseRadioGroup
          value={value}
          defaultValue={defaultValue}
          onValueChange={(next) => {
            if (value === undefined) setInternalValue(next);
            onValueChange?.(next);
          }}
          disabled={disabled}
          name={name}
          className={className}
          data-testid={testId}
          style={{
            display: 'flex',
            flexDirection: 'column',
            gap: compVar('list', 'item-between-space'),
          }}
        >
          {children}
        </BaseRadioGroup>
      </RadioGroupValueContext.Provider>
    </RadioGroupDisabledContext.Provider>
  );
}
