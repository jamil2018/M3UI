
import { Separator } from '@base-ui/react/separator';
import { type CSSProperties } from 'react';
import { compVar } from '../lib/token-utils.js';

export type DividerVariant = 'full-width' | 'inset' | 'middle-inset';

export interface DividerProps {
  variant?: DividerVariant;
  vertical?: boolean;
  className?: string;
  style?: CSSProperties;
  'data-testid'?: string;
}

export function Divider({
  variant = 'full-width',
  vertical = false,
  className,
  style,
  'data-testid': testId,
}: DividerProps) {
  const baseStyle: CSSProperties = {
    background: compVar('divider', 'color'),
    border: 'none',
    flexShrink: 0,
  };

  const horizontalStyle: CSSProperties = {
    ...baseStyle,
    height: compVar('divider', 'thickness'),
    width: variant === 'full-width' ? '100%' : variant === 'inset' ? `calc(100% - ${compVar('list', 'divider-leading-space')} * 2)` : '80%',
    marginInlineStart: variant === 'inset' ? compVar('list', 'divider-leading-space') : variant === 'middle-inset' ? '10%' : 0,
  };

  const verticalStyle: CSSProperties = {
    ...baseStyle,
    width: compVar('divider', 'thickness'),
    height: '100%',
    alignSelf: 'stretch',
  };

  return (
    <Separator
      orientation={vertical ? 'vertical' : 'horizontal'}
      className={className}
      data-testid={testId}
      style={vertical ? { ...verticalStyle, ...style } : { ...horizontalStyle, ...style }}
    />
  );
}
