
import { Slider as BaseSlider } from '@base-ui/react/slider';
import { motion } from 'motion/react';
import { springs, prefersReducedMotion } from '@m3ui/motion';
import { useState, type CSSProperties, type ReactNode } from 'react';
import { compVar, typeStyle } from '../lib/token-utils.js';

export interface SliderProps {
  value?: number | readonly [number, number];
  defaultValue?: number | readonly [number, number];
  onValueChange?: (value: number | readonly [number, number]) => void;
  min?: number;
  max?: number;
  step?: number;
  disabled?: boolean;
  orientation?: 'horizontal' | 'vertical';
  centered?: boolean;
  showValueIndicator?: boolean;
  label?: ReactNode;
  name?: string;
  className?: string;
  'data-testid'?: string;
}

function SliderThumbVisual({
  disabled,
  pressed,
}: {
  disabled: boolean;
  pressed: boolean;
}) {
  const thumbBaseWidth = compVar('slider', 'handle-width');
  const thumbPressedWidth = compVar('slider', 'active-handle-width');

  return (
    <motion.div
      animate={{
        width: pressed ? thumbPressedWidth : thumbBaseWidth,
        height: compVar('slider', 'handle-height'),
      }}
      transition={prefersReducedMotion() ? { duration: 0 } : springs.fastSpatial}
      style={{
        borderRadius: compVar('slider', 'handle-shape'),
        background: disabled ? compVar('slider', 'disabled-handle-color') : compVar('slider', 'handle-color'),
        boxShadow: '0 1px 3px rgba(0,0,0,0.3)',
      }}
    />
  );
}

export function Slider({
  value,
  defaultValue = 0,
  onValueChange,
  min: minProp,
  max: maxProp,
  step = 1,
  disabled = false,
  orientation = 'horizontal',
  centered = false,
  showValueIndicator = false,
  label,
  name,
  className,
  'data-testid': testId,
}: SliderProps) {
  const min = centered ? (minProp ?? -100) : (minProp ?? 0);
  const max = maxProp ?? 100;
  const [thumbPressed, setThumbPressed] = useState(false);

  const isVertical = orientation === 'vertical';
  const resolvedDefault = defaultValue;
  const isRange = Array.isArray(value ?? resolvedDefault);

  const rootStyle: CSSProperties = {
    display: 'flex',
    flexDirection: isVertical ? 'column' : 'row',
    alignItems: 'center',
    gap: compVar('list', 'item-between-space'),
    width: isVertical ? 'auto' : '100%',
    height: isVertical ? 200 : 'auto',
    opacity: disabled ? 'var(--md-sys-state-disabled-content-opacity, 0.38)' : 1,
  };

  const controlStyle: CSSProperties = {
    position: 'relative',
    display: 'flex',
    alignItems: 'center',
    flex: 1,
    width: isVertical ? compVar('slider', 'inactive-track-height') : '100%',
    height: isVertical ? '100%' : compVar('slider', 'inactive-track-height'),
    flexDirection: isVertical ? 'column' : 'row',
    touchAction: 'none',
  };

  const trackStyle: CSSProperties = {
    position: 'absolute',
    width: isVertical ? compVar('slider', 'inactive-track-height') : '100%',
    height: isVertical ? '100%' : compVar('slider', 'inactive-track-height'),
    borderRadius: compVar('slider', 'inactive-track-shape'),
    background: disabled
      ? compVar('slider', 'disabled-inactive-track-color')
      : compVar('slider', 'inactive-track-color'),
  };

  const indicatorStyle: CSSProperties = {
    position: 'absolute',
    borderRadius: compVar('slider', 'active-track-shape'),
    background: disabled
      ? compVar('slider', 'disabled-active-track-color')
      : compVar('slider', 'active-track-color'),
    ...(isVertical
      ? { width: compVar('slider', 'active-track-height'), bottom: 0 }
      : { height: compVar('slider', 'active-track-height'), insetInlineStart: 0 }),
  };

  const thumbProps = {
    onPointerDown: () => setThumbPressed(true),
    onPointerUp: () => setThumbPressed(false),
    onPointerLeave: () => setThumbPressed(false),
    style: { position: 'absolute' as const },
  };

  return (
    <BaseSlider.Root
      value={value}
      defaultValue={defaultValue}
      onValueChange={(v) => onValueChange?.(v as number | readonly [number, number])}
      min={min}
      max={max}
      step={step}
      disabled={disabled}
      orientation={orientation}
      name={name}
      className={className}
      data-testid={testId}
      style={rootStyle}
    >
      {label && (
        <BaseSlider.Label style={{ ...typeStyle('body-medium'), color: 'var(--md-sys-color-on-surface)' }}>
          {label}
        </BaseSlider.Label>
      )}
      <BaseSlider.Control style={controlStyle}>
        <BaseSlider.Track style={trackStyle}>
          <BaseSlider.Indicator style={indicatorStyle} />
        </BaseSlider.Track>
        {isRange ? (
          <>
            <BaseSlider.Thumb {...thumbProps} index={0}>
              <SliderThumbVisual disabled={disabled} pressed={thumbPressed} />
              {showValueIndicator && (
                <BaseSlider.Value
                  style={{
                    ...typeStyle('label-small'),
                    position: 'absolute',
                    ...(isVertical ? { insetInlineStart: '100%', marginInlineStart: 8 } : { bottom: '100%', marginBottom: 8 }),
                    whiteSpace: 'nowrap',
                  }}
                />
              )}
            </BaseSlider.Thumb>
            <BaseSlider.Thumb {...thumbProps} index={1}>
              <SliderThumbVisual disabled={disabled} pressed={thumbPressed} />
            </BaseSlider.Thumb>
          </>
        ) : (
          <BaseSlider.Thumb {...thumbProps}>
            <SliderThumbVisual disabled={disabled} pressed={thumbPressed} />
            {showValueIndicator && (
              <BaseSlider.Value
                style={{
                  ...typeStyle('label-small'),
                  position: 'absolute',
                  ...(isVertical ? { insetInlineStart: '100%', marginInlineStart: 8 } : { bottom: '100%', marginBottom: 8 }),
                  whiteSpace: 'nowrap',
                }}
              />
            )}
          </BaseSlider.Thumb>
        )}
      </BaseSlider.Control>
    </BaseSlider.Root>
  );
}
