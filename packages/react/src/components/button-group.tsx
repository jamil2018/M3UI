
import { Button as BaseButton } from '@base-ui/react/button';
import { motion } from 'motion/react';
import { springs } from '@m3ui/motion';
import {
  Children,
  cloneElement,
  isValidElement,
  useState,
  type CSSProperties,
  type ReactElement,
  type ReactNode,
} from 'react';
import { compVar, typeStyle } from '../lib/token-utils.js';
import { StateLayer } from '../primitives/state-layer.js';
import { Ripple } from '../primitives/ripple.js';
import { EXPRESSIVE_PATTERNS } from '@m3ui/shapes';

export type ButtonGroupVariant = 'standard' | 'connected';

export interface ButtonGroupProps {
  children: ReactNode;
  variant?: ButtonGroupVariant;
  className?: string;
  'data-testid'?: string;
}

export interface ButtonGroupItemProps {
  children: ReactNode;
  onClick?: () => void;
  disabled?: boolean;
  className?: string;
  'data-testid'?: string;
}

const { widenFactor, compressFactor } = EXPRESSIVE_PATTERNS.buttonGroupBump;

function useGroupTokens(variant: ButtonGroupVariant) {
  if (variant === 'connected') {
    return {
      betweenSpace: compVar('connected-button-group-small', 'between-space'),
      height: compVar('connected-button-group-small', 'container-height'),
      shape: compVar('connected-button-group-small', 'container-shape'),
    };
  }
  return {
    betweenSpace: compVar('button-group-small', 'between-space'),
    height: compVar('button-group-small', 'container-height'),
    shape: compVar('button-medium', 'container-shape-round'),
  };
}

export function ButtonGroup({
  children,
  variant = 'standard',
  className,
  'data-testid': testId,
}: ButtonGroupProps) {
  const tokens = useGroupTokens(variant);
  const items = Children.toArray(children);
  const [pressedIndex, setPressedIndex] = useState<number | null>(null);

  const groupStyle: CSSProperties = {
    display: 'inline-flex',
    alignItems: 'stretch',
    gap: variant === 'standard' ? tokens.betweenSpace : tokens.betweenSpace,
    borderRadius: variant === 'connected' ? tokens.shape : undefined,
    overflow: variant === 'connected' ? 'hidden' : undefined,
  };

  return (
    <div className={className} data-testid={testId} style={groupStyle} role="group">
      {items.map((child, index) => {
        if (!isValidElement(child)) return child;
        const flex =
          pressedIndex === index
            ? widenFactor
            : pressedIndex !== null &&
                (pressedIndex === index - 1 || pressedIndex === index + 1)
              ? compressFactor
              : 1;

        return (
          <motion.div
            key={index}
            style={{ display: 'flex', flex: `${flex} 1 0%`, minWidth: 0 }}
            animate={{ flexGrow: flex }}
            transition={springs.fastSpatial}
            onPointerDown={() => { setPressedIndex(index); }}
            onPointerUp={() => { setPressedIndex(null); }}
            onPointerLeave={() => { setPressedIndex(null); }}
            onPointerCancel={() => { setPressedIndex(null); }}
          >
            {cloneElement(child as ReactElement<ButtonGroupItemProps>, {
              'data-group-index': index,
              'data-pressed-neighbor': pressedIndex !== null && pressedIndex !== index,
            } as unknown as ButtonGroupItemProps)}
          </motion.div>
        );
      })}
    </div>
  );
}

export function ButtonGroupItem({
  children,
  onClick,
  disabled = false,
  className,
  'data-testid': testId,
}: ButtonGroupItemProps & { 'data-group-index'?: number; 'data-pressed-neighbor'?: boolean }) {
  const itemStyle: CSSProperties = {
    position: 'relative',
    display: 'inline-flex',
    alignItems: 'center',
    justifyContent: 'center',
    width: '100%',
    height: compVar('button-group-small', 'container-height'),
    paddingInline: compVar('button-medium', 'leading-space'),
    ...typeStyle('label-large'),
    background: compVar('filled-button', 'container-color'),
    color: compVar('filled-button', 'label-text-color'),
    border: 'none',
    borderRadius: 'inherit',
    cursor: disabled ? 'not-allowed' : 'pointer',
    opacity: disabled ? 'var(--md-sys-state-disabled-content-opacity, 0.38)' : 1,
  };

  return (
    <Ripple disabled={disabled}>
      <StateLayer disabled={disabled} style={{ display: 'flex', width: '100%' }}>
        <BaseButton
          type="button"
          disabled={disabled}
          onClick={onClick}
          className={className}
          data-testid={testId}
          style={itemStyle}
        >
          {children}
        </BaseButton>
      </StateLayer>
    </Ripple>
  );
}
