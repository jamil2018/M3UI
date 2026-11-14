import { Switch as BaseSwitch } from '@base-ui/react/switch';
import { motion } from 'motion/react';
import { springs } from '@m3ui/motion';
import { useState, type CSSProperties, type ReactNode } from 'react';
import { FocusRing } from '../primitives/focus-ring.js';
import { StateLayer } from '../lib/state-layer.js';
import { focusRingAttachmentStyle } from '../lib/pressable-shell.js';
import {
  compVar,
  disabledContainerMix,
  disabledContentMix,
  sysColor,
  typeStyle,
} from '../lib/token-utils.js';

export interface SwitchProps {
  checked?: boolean;
  defaultChecked?: boolean;
  disabled?: boolean;
  onCheckedChange?: (checked: boolean) => void;
  label?: ReactNode;
  icon?: ReactNode;
  /** Icon shown on the thumb when the switch is unchecked */
  uncheckedIcon?: ReactNode;
  name?: string;
  className?: string;
  'data-testid'?: string;
}

function thumbDimensions(
  p: string,
  isChecked: boolean,
  pressed: boolean,
  hasUncheckedIcon: boolean,
): { width: string; height: string } {
  if (pressed) {
    return {
      width: compVar(p, 'pressed-handle-width'),
      height: compVar(p, 'pressed-handle-height'),
    };
  }
  if (isChecked) {
    return {
      width: compVar(p, 'selected-handle-width'),
      height: compVar(p, 'selected-handle-height'),
    };
  }
  if (hasUncheckedIcon) {
    return {
      width: compVar(p, 'with-icon-handle-width'),
      height: compVar(p, 'with-icon-handle-height'),
    };
  }
  return {
    width: compVar(p, 'unselected-handle-width'),
    height: compVar(p, 'unselected-handle-height'),
  };
}

function thumbTranslateX(
  isChecked: boolean,
  pressed: boolean,
  hasUncheckedIcon: boolean,
  rtl: boolean,
): number {
  const sign = rtl ? -1 : 1;
  // Track is 52x32px with a constant 2px border and 2px inline padding (content box = 44px wide).
  if (isChecked) {
    return sign * (pressed ? 16 : 20);
  }
  if (pressed) {
    return sign * -2;
  }
  if (!hasUncheckedIcon) {
    return sign * 4;
  }
  return 0;
}

export function Switch({
  checked,
  defaultChecked,
  disabled = false,
  onCheckedChange,
  label,
  icon,
  uncheckedIcon,
  name,
  className,
  'data-testid': testId,
}: SwitchProps) {
  const p = 'switch';
  const [internalChecked, setInternalChecked] = useState(defaultChecked ?? false);
  const [pressed, setPressed] = useState(false);
  const [hovered, setHovered] = useState(false);
  const [isRtl, setIsRtl] = useState(false);
  const isChecked = checked ?? internalChecked;
  const hasUncheckedIcon = uncheckedIcon != null;
  const dims = thumbDimensions(p, isChecked, pressed, hasUncheckedIcon);
  const thumbX = thumbTranslateX(isChecked, pressed, hasUncheckedIcon, isRtl);
  const haloSize = compVar(p, 'state-layer-size');
  const haloShape = compVar(p, 'state-layer-shape');

  const trackStyle: CSSProperties = {
    width: compVar(p, 'track-width'),
    height: compVar(p, 'track-height'),
    borderRadius: compVar(p, 'track-shape'),
    background: disabled
      ? disabledContainerMix(
          compVar(p, isChecked ? 'disabled-selected-track-color' : 'disabled-unselected-track-color'),
        )
      : hovered
        ? compVar(p, isChecked ? 'selected-hover-track-color' : 'unselected-hover-track-color')
        : pressed
          ? compVar(p, isChecked ? 'selected-pressed-track-color' : 'unselected-pressed-track-color')
          : compVar(p, isChecked ? 'selected-track-color' : 'unselected-track-color'),
    border: `${compVar(p, 'track-outline-width')} solid ${
      isChecked
        ? 'transparent'
        : disabled
          ? disabledContainerMix(compVar(p, 'disabled-unselected-track-outline-color'))
          : hovered
            ? compVar(p, 'unselected-hover-track-outline-color')
            : pressed
              ? compVar(p, 'unselected-pressed-track-outline-color')
              : compVar(p, 'unselected-track-outline-color')
    }`,
    position: 'relative',
    display: 'inline-flex',
    alignItems: 'center',
    paddingInline: 2,
    boxSizing: 'border-box',
    overflow: 'visible',
  };

  const thumbColor = disabled
    ? isChecked
      ? compVar(p, 'disabled-selected-handle-color')
      : disabledContentMix(compVar(p, 'disabled-unselected-handle-color'))
    : pressed
      ? compVar(p, isChecked ? 'selected-pressed-handle-color' : 'unselected-pressed-handle-color')
      : hovered
        ? compVar(p, isChecked ? 'selected-hover-handle-color' : 'unselected-hover-handle-color')
        : compVar(p, isChecked ? 'selected-handle-color' : 'unselected-handle-color');

  const iconStyle: CSSProperties = {
    width: compVar(p, isChecked ? 'selected-icon-size' : 'unselected-icon-size'),
    height: compVar(p, isChecked ? 'selected-icon-size' : 'unselected-icon-size'),
    color: disabled
      ? disabledContentMix(
          compVar(p, isChecked ? 'disabled-selected-icon-color' : 'disabled-unselected-icon-color'),
        )
      : pressed
        ? compVar(p, isChecked ? 'selected-pressed-icon-color' : 'unselected-pressed-icon-color')
        : hovered
          ? compVar(p, isChecked ? 'selected-hover-icon-color' : 'unselected-hover-icon-color')
          : compVar(p, isChecked ? 'selected-icon-color' : 'unselected-icon-color'),
    display: 'inline-flex',
    alignItems: 'center',
    justifyContent: 'center',
  };

  const labelStyle: CSSProperties = {
    ...typeStyle('body-large'),
    color: sysColor('on-surface'),
    opacity: disabled ? 'var(--md-sys-state-disabled-content-opacity)' : 1,
  };

  const hoverStateColor = isChecked
    ? compVar(p, 'selected-hover-state-layer-color')
    : compVar(p, 'unselected-hover-state-layer-color');

  const showIcon = (isChecked && icon) || (!isChecked && uncheckedIcon);

  return (
    <label
      ref={(node) => {
        if (!node) return;
        const dir = node.closest('[dir]')?.getAttribute('dir') ?? document.documentElement.dir;
        const nextRtl = dir === 'rtl';
        if (nextRtl !== isRtl) setIsRtl(nextRtl);
      }}
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
      <BaseSwitch.Root
        checked={checked}
        defaultChecked={defaultChecked}
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
        style={trackStyle}
      >
        <BaseSwitch.Thumb
          render={(props) => (
            <span
              {...props}
              style={{
                position: 'relative',
                display: 'inline-flex',
                alignItems: 'center',
                justifyContent: 'center',
                ...(typeof props.style === 'object' ? props.style : {}),
              }}
            >
              <motion.span
                initial={false}
                animate={{
                  x: thumbX,
                  width: dims.width,
                  height: dims.height,
                }}
                transition={springs.fastSpatial}
                style={{
                  position: 'relative',
                  display: 'inline-flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  width: dims.width,
                  height: dims.height,
                  borderRadius: compVar(p, 'handle-shape'),
                  background: thumbColor,
                  flexShrink: 0,
                }}
              >
                <FocusRing
                  style={{
                    position: 'absolute',
                    left: '50%',
                    top: '50%',
                    transform: 'translate(-50%, -50%)',
                    width: haloSize,
                    height: haloSize,
                    pointerEvents: 'none',
                    zIndex: 0,
                    ...focusRingAttachmentStyle(haloShape),
                  }}
                >
                  <StateLayer
                    disabled={disabled}
                    color={hoverStateColor}
                    states={['hover', 'pressed']}
                    data-hovered={hovered || undefined}
                    data-pressed={pressed || undefined}
                    style={{
                      width: haloSize,
                      height: haloSize,
                      borderRadius: haloShape,
                      overflow: 'hidden',
                      ['--m3-state-layer-hover-opacity' as string]: isChecked
                        ? compVar(p, 'selected-hover-state-layer-opacity')
                        : compVar(p, 'unselected-hover-state-layer-opacity'),
                      ['--m3-state-layer-pressed-opacity' as string]: isChecked
                        ? compVar(p, 'selected-pressed-state-layer-opacity')
                        : compVar(p, 'unselected-pressed-state-layer-opacity'),
                    }}
                  >
                    <span aria-hidden style={{ display: 'block', width: '100%', height: '100%' }} />
                  </StateLayer>
                </FocusRing>
                {showIcon && (
                  <span style={{ ...iconStyle, position: 'relative', zIndex: 1 }}>
                    {isChecked ? icon : uncheckedIcon}
                  </span>
                )}
              </motion.span>
            </span>
          )}
        />
      </BaseSwitch.Root>
      {label && <span style={labelStyle}>{label}</span>}
    </label>
  );
}
