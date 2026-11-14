import { Slider as BaseSlider } from '@base-ui/react/slider';
import { AnimatePresence, motion } from 'motion/react';
import { springs, prefersReducedMotion } from '@m3ui/motion';
import { useState, type CSSProperties, type ReactNode } from 'react';
import {
  compVar,
  disabledContainerMix,
  disabledContentMix,
  sysColor,
  typeStyle,
} from '../lib/token-utils.js';

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

function valueToPercent(v: number, min: number, max: number): number {
  if (max === min) return 0;
  return ((v - min) / (max - min)) * 100;
}

function asNumbers(
  val: number | readonly number[] | undefined,
  fallback: number | readonly number[],
): number[] {
  const source = val ?? fallback;
  return Array.isArray(source) ? [...source] : [source as number];
}

function SliderThumbVisual({
  disabled,
  focused,
  pressed,
}: {
  disabled: boolean;
  focused: boolean;
  pressed: boolean;
}) {
  const thumbWidth = disabled
    ? compVar('slider', 'disabled-handle-width')
    : pressed
      ? compVar('slider', 'pressed-handle-width')
      : focused
        ? compVar('slider', 'focus-handle-width')
        : compVar('slider', 'handle-width');

  return (
    <motion.div
      animate={{
        width: thumbWidth,
        height: compVar('slider', 'handle-height'),
      }}
      transition={prefersReducedMotion() ? { duration: 0 } : springs.fastSpatial}
      style={{
        borderRadius: compVar('slider', 'handle-shape'),
        background: disabled
          ? compVar('slider', 'disabled-handle-color')
          : pressed
            ? compVar('slider', 'pressed-handle-color')
            : compVar('slider', 'handle-color'),
      }}
    />
  );
}

function StopDots({
  min,
  max,
  step,
  values,
  isVertical,
  disabled,
}: {
  min: number;
  max: number;
  step: number;
  values: number[];
  isVertical: boolean;
  disabled: boolean;
}) {
  const stopCount = (max - min) / step;
  const isDiscrete = step > 1 && stopCount <= 20;
  const low = values[0] ?? min;
  const high = values.length > 1 ? (values[1] ?? max) : low;

  if (!isDiscrete) {
    // M3 Expressive continuous sliders render a 4px trailing stop indicator at the end of the inactive track.
    if (high >= max) return null;
    const endColor = disabled
      ? disabledContentMix(compVar('slider', 'disabled-stop-color'))
      : compVar('slider', 'stop-indicator-color');
    return (
      <span
        aria-hidden
        style={{
          position: 'absolute',
          width: compVar('slider', 'stop-indicator-size'),
          height: compVar('slider', 'stop-indicator-size'),
          borderRadius: compVar('slider', 'stop-indicator-shape'),
          background: endColor,
          zIndex: 1,
          pointerEvents: 'none',
          ...(isVertical
            ? {
                left: '50%',
                top: compVar('slider', 'stop-indicator-trailing-space'),
                transform: 'translateX(-50%)',
              }
            : {
                top: '50%',
                insetInlineEnd: compVar('slider', 'stop-indicator-trailing-space'),
                transform: 'translateY(-50%)',
              }),
        }}
      />
    );
  }

  const dots: ReactNode[] = [];

  for (let i = 0; i <= stopCount; i++) {
    const stopValue = min + i * step;
    const pct = valueToPercent(stopValue, min, max);
    const isActive = values.length > 1 ? stopValue >= low && stopValue <= high : stopValue <= low;
    const color = disabled
      ? disabledContentMix(compVar('slider', 'disabled-stop-color'))
      : isActive
        ? compVar('slider', 'stop-indicator-color-selected')
        : compVar('slider', 'stop-indicator-color');

    dots.push(
      <span
        key={stopValue}
        aria-hidden
        style={{
          position: 'absolute',
          width: compVar('slider', 'stop-indicator-size'),
          height: compVar('slider', 'stop-indicator-size'),
          borderRadius: compVar('slider', 'stop-indicator-shape'),
          background: color,
          zIndex: 1,
          pointerEvents: 'none',
          ...(isVertical
            ? {
                left: '50%',
                bottom: `${pct}%`,
                transform: 'translate(-50%, 50%)',
              }
            : {
                top: '50%',
                insetInlineStart: `${pct}%`,
                transform: 'translate(-50%, -50%)',
              }),
        }}
      />,
    );
  }

  return <>{dots}</>;
}

function SplitTracks({
  min,
  max,
  values,
  isVertical,
  disabled,
}: {
  min: number;
  max: number;
  values: number[];
  isVertical: boolean;
  disabled: boolean;
}) {
  const gap = compVar('slider', 'active-handle-leading-space');
  const handleHalf = `calc(${compVar('slider', 'handle-width')} / 2)`;
  const trackHeight = compVar('slider', 'inactive-track-height');
  const activeHeight = compVar('slider', 'active-track-height');
  const inactiveColor = disabled
    ? disabledContainerMix(compVar('slider', 'disabled-inactive-track-color'))
    : compVar('slider', 'inactive-track-color');
  const activeColor = disabled
    ? disabledContentMix(compVar('slider', 'disabled-active-track-color'))
    : compVar('slider', 'active-track-color');
  const innerRadius = '2px';

  if (values.length > 1) {
    const startPct = valueToPercent(values[0]!, min, max);
    const endPct = valueToPercent(values[1]!, min, max);

    return (
      <>
        {/* Leading inactive */}
        <span
          aria-hidden
          style={{
            position: 'absolute',
            background: inactiveColor,
            borderRadius: compVar('slider', 'inactive-track-shape'),
            ...(isVertical
              ? {
                  width: trackHeight,
                  bottom: 0,
                  height: `calc(${startPct}% - ${handleHalf} - ${gap})`,
                  left: '50%',
                  transform: 'translateX(-50%)',
                  borderStartStartRadius: innerRadius,
                  borderStartEndRadius: innerRadius,
                }
              : {
                  height: trackHeight,
                  insetInlineStart: 0,
                  width: `calc(${startPct}% - ${handleHalf} - ${gap})`,
                  top: '50%',
                  transform: 'translateY(-50%)',
                  borderStartEndRadius: innerRadius,
                  borderEndEndRadius: innerRadius,
                }),
          }}
        />
        {/* Active between thumbs */}
        <span
          aria-hidden
          style={{
            position: 'absolute',
            background: activeColor,
            borderRadius: innerRadius,
            ...(isVertical
              ? {
                  width: activeHeight,
                  bottom: `calc(${startPct}% + ${handleHalf} + ${gap})`,
                  height: `calc(${endPct - startPct}% - ${compVar('slider', 'handle-width')} - ${gap} * 2)`,
                  left: '50%',
                  transform: 'translateX(-50%)',
                }
              : {
                  height: activeHeight,
                  insetInlineStart: `calc(${startPct}% + ${handleHalf} + ${gap})`,
                  width: `calc(${endPct - startPct}% - ${compVar('slider', 'handle-width')} - ${gap} * 2)`,
                  top: '50%',
                  transform: 'translateY(-50%)',
                }),
          }}
        />
        {/* Trailing inactive */}
        <span
          aria-hidden
          style={{
            position: 'absolute',
            background: inactiveColor,
            borderRadius: compVar('slider', 'inactive-track-shape'),
            ...(isVertical
              ? {
                  width: trackHeight,
                  top: 0,
                  height: `calc(${100 - endPct}% - ${handleHalf} - ${gap})`,
                  left: '50%',
                  transform: 'translateX(-50%)',
                  borderStartEndRadius: innerRadius,
                  borderEndEndRadius: innerRadius,
                }
              : {
                  height: trackHeight,
                  insetInlineEnd: 0,
                  width: `calc(${100 - endPct}% - ${handleHalf} - ${gap})`,
                  top: '50%',
                  transform: 'translateY(-50%)',
                  borderStartStartRadius: innerRadius,
                  borderEndStartRadius: innerRadius,
                }),
          }}
        />
      </>
    );
  }

  const pct = valueToPercent(values[0] ?? min, min, max);

  return (
    <>
      <span
        aria-hidden
        style={{
          position: 'absolute',
          background: activeColor,
          borderRadius: compVar('slider', 'active-track-shape'),
          ...(isVertical
            ? {
                width: activeHeight,
                bottom: 0,
                height: `calc(${pct}% - ${handleHalf} - ${gap})`,
                left: '50%',
                transform: 'translateX(-50%)',
                borderStartStartRadius: innerRadius,
                borderStartEndRadius: innerRadius,
              }
            : {
                height: activeHeight,
                insetInlineStart: 0,
                width: `calc(${pct}% - ${handleHalf} - ${gap})`,
                top: '50%',
                transform: 'translateY(-50%)',
                borderStartEndRadius: innerRadius,
                borderEndEndRadius: innerRadius,
              }),
        }}
      />
      <span
        aria-hidden
        style={{
          position: 'absolute',
          background: inactiveColor,
          borderRadius: compVar('slider', 'inactive-track-shape'),
          ...(isVertical
            ? {
                width: trackHeight,
                top: 0,
                height: `calc(${100 - pct}% - ${handleHalf} - ${gap})`,
                left: '50%',
                transform: 'translateX(-50%)',
                borderEndStartRadius: innerRadius,
                borderEndEndRadius: innerRadius,
              }
            : {
                height: trackHeight,
                insetInlineEnd: 0,
                width: `calc(${100 - pct}% - ${handleHalf} - ${gap})`,
                top: '50%',
                transform: 'translateY(-50%)',
                borderStartStartRadius: innerRadius,
                borderEndStartRadius: innerRadius,
              }),
        }}
      />
    </>
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
  const [hoveredThumbIndex, setHoveredThumbIndex] = useState<number | null>(null);
  const [pressedThumbIndex, setPressedThumbIndex] = useState<number | null>(null);
  const [focusedThumbIndex, setFocusedThumbIndex] = useState<number | null>(null);
  const [internalValue, setInternalValue] = useState(defaultValue);

  const currentVal = value ?? internalValue;
  const values = asNumbers(currentVal, defaultValue);
  const isVertical = orientation === 'vertical';
  const isRange = values.length > 1;

  const rootStyle: CSSProperties = {
    display: 'flex',
    flexDirection: isVertical ? 'column' : 'row',
    alignItems: 'center',
    gap: compVar('list', 'item-between-space'),
    width: isVertical ? 'auto' : '100%',
    minWidth: 0,
    height: isVertical
      ? `calc(${compVar('outlined-text-field', 'container-height')} * 3.5)`
      : 'auto',
  };

  const controlStyle: CSSProperties = {
    position: 'relative',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    flex: 1,
    width: isVertical ? compVar('slider', 'handle-height') : '100%',
    height: isVertical ? '100%' : compVar('slider', 'handle-height'),
    flexDirection: isVertical ? 'column' : 'row',
    touchAction: 'none',
  };

  const trackStyle: CSSProperties = {
    position: 'relative',
    width: isVertical ? compVar('slider', 'inactive-track-height') : '100%',
    height: isVertical ? '100%' : compVar('slider', 'inactive-track-height'),
    borderRadius: compVar('slider', 'inactive-track-shape'),
    // Base fill is replaced by SplitTracks; keep a transparent shell for hit-testing layout
    background: 'transparent',
  };

  const valueIndicatorStyle: CSSProperties = {
    ...typeStyle('label-large'),
    position: 'absolute',
    display: 'inline-flex',
    alignItems: 'center',
    justifyContent: 'center',
    minWidth: '48px',
    color: compVar('slider', 'value-indicator-label-text-color'),
    background: compVar('slider', 'value-indicator-container-color'),
    borderRadius: compVar('slider', 'handle-shape'),
    paddingBlock: compVar('list', 'item-top-space'),
    paddingInline: compVar('list', 'divider-leading-space'),
    whiteSpace: 'nowrap',
    pointerEvents: 'none',
    zIndex: 2,
  };

  function thumbProps(index: number) {
    return {
      'data-slider-thumb': '',
      onPointerEnter: () => {
        setHoveredThumbIndex(index);
      },
      onPointerLeave: () => {
        setHoveredThumbIndex((prev) => (prev === index ? null : prev));
        setPressedThumbIndex((prev) => (prev === index ? null : prev));
      },
      onPointerDown: () => {
        setPressedThumbIndex(index);
      },
      onPointerUp: () => {
        setPressedThumbIndex(null);
      },
      onFocus: () => {
        setFocusedThumbIndex(index);
      },
      onBlur: () => {
        setFocusedThumbIndex((prev) => (prev === index ? null : prev));
      },
      style: {
        position: 'absolute' as const,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        ...(isVertical ? { left: '50%' } : { top: '50%' }),
      },
    };
  }

  function renderValueBubble(index: number) {
    const isThumbHovered = hoveredThumbIndex === index;
    const isThumbPressed = pressedThumbIndex === index;
    const isThumbFocused = focusedThumbIndex === index;
    const visible = showValueIndicator && (isThumbHovered || isThumbPressed || isThumbFocused);

    return (
      <AnimatePresence>
        {visible && (
          <motion.span
            key={`value-${index}`}
            initial={{ opacity: 0, scale: 0.6, y: 8 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.6, y: 8 }}
            transition={springs.fastSpatial}
            style={{
              ...valueIndicatorStyle,
              ...(isVertical
                ? {
                    insetInlineStart: '100%',
                    marginInlineStart: compVar('slider', 'active-handle-leading-space'),
                  }
                : {
                    bottom: '100%',
                    marginBottom: compVar('slider', 'value-indicator-active-bottom-space'),
                  }),
            }}
          >
            {isRange ? values[index] : <BaseSlider.Value />}
          </motion.span>
        )}
      </AnimatePresence>
    );
  }

  return (
    <BaseSlider.Root
      value={value}
      defaultValue={defaultValue}
      onValueChange={(v) => {
        setInternalValue(v);
        onValueChange?.(v);
      }}
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
        <BaseSlider.Label style={{ ...typeStyle('body-medium'), color: sysColor('on-surface') }}>
          {label}
        </BaseSlider.Label>
      )}
      <BaseSlider.Control data-slider-control="" style={controlStyle}>
        <BaseSlider.Track data-slider-track="" style={trackStyle}>
          <SplitTracks
            min={min}
            max={max}
            values={values}
            isVertical={isVertical}
            disabled={disabled}
          />
          <StopDots
            min={min}
            max={max}
            step={step}
            values={values}
            isVertical={isVertical}
            disabled={disabled}
          />
        </BaseSlider.Track>
        {isRange ? (
          <>
            <BaseSlider.Thumb {...thumbProps(0)} index={0}>
              <SliderThumbVisual
                disabled={disabled}
                focused={focusedThumbIndex === 0}
                pressed={pressedThumbIndex === 0}
              />
              {renderValueBubble(0)}
            </BaseSlider.Thumb>
            <BaseSlider.Thumb {...thumbProps(1)} index={1}>
              <SliderThumbVisual
                disabled={disabled}
                focused={focusedThumbIndex === 1}
                pressed={pressedThumbIndex === 1}
              />
              {renderValueBubble(1)}
            </BaseSlider.Thumb>
          </>
        ) : (
          <BaseSlider.Thumb {...thumbProps(0)}>
            <SliderThumbVisual
              disabled={disabled}
              focused={focusedThumbIndex === 0}
              pressed={pressedThumbIndex === 0}
            />
            {renderValueBubble(0)}
          </BaseSlider.Thumb>
        )}
      </BaseSlider.Control>
    </BaseSlider.Root>
  );
}
