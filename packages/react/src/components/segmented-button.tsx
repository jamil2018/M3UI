import { Toggle } from '@base-ui/react/toggle';
import { ToggleGroup } from '@base-ui/react/toggle-group';
import { AnimatePresence, motion } from 'motion/react';
import { springs } from '@m3ui/motion';
import { Icon } from '@m3ui/icons';
import {
  Children,
  cloneElement,
  createContext,
  isValidElement,
  useContext,
  useState,
  type CSSProperties,
  type ReactElement,
  type ReactNode,
} from 'react';
import {
  compVar,
  disabledContainerMix,
  disabledContentMix,
  typeStyle,
} from '../lib/token-utils.js';
import { focusRingAttachmentStyle } from '../lib/pressable-shell.js';
import { FocusRing } from '../primitives/focus-ring.js';
import { Ripple } from '../primitives/ripple.js';

const SEGMENT_PREFIX = 'outlined-segmented-button';

interface SegmentedButtonContextValue {
  selectedValues: readonly string[];
  onToggle: (val: string) => void;
  disabled: boolean;
}

const SegmentedButtonContext = createContext<SegmentedButtonContextValue | null>(null);

function segmentedItemStyles(
  selected: boolean,
  disabled: boolean,
  lastItem: boolean,
): CSSProperties {
  const sel = selected ? 'selected' : 'unselected';
  return {
    position: 'relative',
    display: 'inline-flex',
    alignItems: 'center',
    justifyContent: 'center',
    gap: compVar('button-medium', 'icon-label-space'),
    height: compVar(SEGMENT_PREFIX, 'container-height'),
    paddingInline: compVar('button-medium', 'leading-space'),
    ...typeStyle('label-large'),
    background:
      selected && !disabled ? compVar(SEGMENT_PREFIX, 'selected-container-color') : 'transparent',
    color: disabled
      ? disabledContentMix(compVar(SEGMENT_PREFIX, 'disabled-label-text-color'))
      : compVar(SEGMENT_PREFIX, `${sel}-label-text-color`),
    border: 'none',
    borderInlineEnd: lastItem
      ? 'none'
      : `${compVar(SEGMENT_PREFIX, 'outline-width')} solid ${disabled ? disabledContainerMix(compVar(SEGMENT_PREFIX, 'disabled-outline-color')) : compVar(SEGMENT_PREFIX, 'outline-color')}`,
    cursor: disabled ? 'not-allowed' : 'pointer',
  };
}

export interface SegmentedButtonProps {
  children: ReactNode;
  value?: readonly string[];
  defaultValue?: readonly string[];
  onValueChange?: (value: string[]) => void;
  multiple?: boolean;
  disabled?: boolean;
  className?: string;
  'data-testid'?: string;
}

export function SegmentedButton({
  children,
  value,
  defaultValue,
  onValueChange,
  multiple = false,
  disabled = false,
  className,
  'data-testid': testId,
}: SegmentedButtonProps) {
  const [internalValue, setInternalValue] = useState<readonly string[]>(defaultValue ?? []);
  const activeValues = value ?? internalValue;

  const handleValueChange = (next: string[]) => {
    if (value === undefined) setInternalValue(next);
    onValueChange?.(next);
  };

  const onToggle = (val: string) => {
    let next: string[];
    if (multiple) {
      next = activeValues.includes(val)
        ? activeValues.filter((v) => v !== val)
        : [...activeValues, val];
    } else {
      next = activeValues.includes(val) ? [] : [val];
    }
    handleValueChange(next);
  };

  return (
    <SegmentedButtonContext.Provider value={{ selectedValues: activeValues, onToggle, disabled }}>
      <ToggleGroup
        value={[...activeValues]}
        onValueChange={handleValueChange}
        multiple={multiple}
        disabled={disabled}
        className={className}
        data-testid={testId}
        style={{
          display: 'inline-flex',
          width: 'fit-content',
          maxWidth: '100%',
          overflowX: 'auto',
          borderRadius: compVar(SEGMENT_PREFIX, 'shape'),
          border: `${compVar(SEGMENT_PREFIX, 'outline-width')} solid ${compVar(SEGMENT_PREFIX, 'outline-color')}`,
        }}
      >
        {Children.toArray(children).map((child, index, items) =>
          isValidElement(child)
            ? cloneElement(
                child as ReactElement<SegmentedButtonItemProps>,
                {
                  'data-last-item': index === items.length - 1,
                } as SegmentedButtonItemProps & { 'data-last-item': boolean },
              )
            : child,
        )}
      </ToggleGroup>
    </SegmentedButtonContext.Provider>
  );
}

export interface SegmentedButtonItemProps {
  value: string;
  children?: ReactNode;
  label?: ReactNode;
  icon?: ReactNode;
  disabled?: boolean;
  className?: string;
  'data-testid'?: string;
}

export function SegmentedButtonItem({
  value,
  children,
  label,
  icon,
  disabled = false,
  className,
  'data-testid': testId,
  'data-last-item': lastItem = false,
}: SegmentedButtonItemProps & { 'data-last-item'?: boolean }) {
  const ctx = useContext(SegmentedButtonContext);
  const isSelected = ctx ? ctx.selectedValues.includes(value) : false;
  const isDisabled = disabled || (ctx?.disabled ?? false);
  const sel = isSelected ? 'selected' : 'unselected';
  const shape = compVar(SEGMENT_PREFIX, 'shape');

  const iconStyle: CSSProperties = {
    width: compVar(SEGMENT_PREFIX, 'icon-size'),
    height: compVar(SEGMENT_PREFIX, 'icon-size'),
    display: 'inline-flex',
    alignItems: 'center',
    justifyContent: 'center',
    color: isDisabled
      ? disabledContentMix(compVar(SEGMENT_PREFIX, 'disabled-label-text-color'))
      : compVar(SEGMENT_PREFIX, `${sel}-icon-color`),
  };

  return (
    <FocusRing style={{ display: 'inline-flex', ...focusRingAttachmentStyle(shape) }}>
      <Ripple
        disabled={isDisabled}
        hoverColor={compVar(SEGMENT_PREFIX, `${sel}-hover-state-layer-color`)}
        pressedColor={compVar(SEGMENT_PREFIX, `${sel}-pressed-state-layer-color`)}
        hoverOpacity={compVar(SEGMENT_PREFIX, 'hover-state-layer-opacity')}
        pressedOpacity={compVar(SEGMENT_PREFIX, 'pressed-state-layer-opacity')}
        style={{ display: 'inline-flex' }}
      >
        <Toggle
          value={value}
          disabled={isDisabled}
          className={className}
          data-testid={testId}
          style={segmentedItemStyles(isSelected, isDisabled, lastItem)}
        >
          <AnimatePresence initial={false}>
            {isSelected && (
              <motion.span
                key="check"
                initial={{ width: 0, scale: 0, opacity: 0 }}
                animate={{ width: 18, scale: 1, opacity: 1 }}
                exit={{ width: 0, scale: 0, opacity: 0 }}
                transition={{ ...springs.fastSpatial, opacity: springs.fastEffects }}
                style={{
                  display: 'inline-flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  overflow: 'hidden',
                  flexShrink: 0,
                }}
              >
                <Icon name="check" size={18} />
              </motion.span>
            )}
          </AnimatePresence>
          {icon && <span style={iconStyle}>{icon}</span>}
          {label ?? children}
        </Toggle>
      </Ripple>
    </FocusRing>
  );
}
