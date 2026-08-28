import { STATE_LAYER_OPACITIES, type StateLayerState } from '@m3ui/tokens';
import { type HTMLAttributes, type ReactNode } from 'react';

export interface StateLayerProps extends HTMLAttributes<HTMLDivElement> {
  children: ReactNode;
  /** Color for the state layer overlay (defaults to currentColor) */
  color?: string;
  /** Which interaction states to enable */
  states?: StateLayerState[];
  disabled?: boolean;
}

const DEFAULT_STATES: StateLayerState[] = ['hover', 'focus', 'pressed'];

export function StateLayer({
  children,
  color,
  states = DEFAULT_STATES,
  disabled = false,
  className,
  style,
  ...props
}: StateLayerProps) {
  const stateSet = new Set(states);

  return (
    <div
      className={className}
      style={{
        position: 'relative',
        overflow: 'hidden',
        ...style,
      }}
      data-disabled={disabled || undefined}
      {...props}
    >
      {children}
      {!disabled && (
        <>
          {stateSet.has('hover') && (
            <span
              aria-hidden
              className="m3-state-layer m3-state-layer--hover"
              style={{
                position: 'absolute',
                inset: 0,
                borderRadius: 'inherit',
                background: color ?? 'currentColor',
                opacity: 0,
                pointerEvents: 'none',
                transition: `opacity var(--md-sys-motion-duration-short2) var(--md-sys-motion-easing-standard)`,
              }}
            />
          )}
          {stateSet.has('focus') && (
            <span
              aria-hidden
              className="m3-state-layer m3-state-layer--focus"
              style={{
                position: 'absolute',
                inset: 0,
                borderRadius: 'inherit',
                background: color ?? 'currentColor',
                opacity: 0,
                pointerEvents: 'none',
              }}
            />
          )}
          {stateSet.has('pressed') && (
            <span
              aria-hidden
              className="m3-state-layer m3-state-layer--pressed"
              style={{
                position: 'absolute',
                inset: 0,
                borderRadius: 'inherit',
                background: color ?? 'currentColor',
                opacity: 0,
                pointerEvents: 'none',
              }}
            />
          )}
          {stateSet.has('dragged') && (
            <span
              aria-hidden
              className="m3-state-layer m3-state-layer--dragged"
              style={{
                position: 'absolute',
                inset: 0,
                borderRadius: 'inherit',
                background: color ?? 'currentColor',
                opacity: 0,
                pointerEvents: 'none',
              }}
            />
          )}
        </>
      )}
      <style>{`
        .m3-state-layer--hover { opacity: 0; }
        *:hover > .m3-state-layer--hover,
        *:hover .m3-state-layer--hover { opacity: ${STATE_LAYER_OPACITIES.hover}; }
        *:focus-visible > .m3-state-layer--focus,
        *:focus-visible .m3-state-layer--focus { opacity: ${STATE_LAYER_OPACITIES.focus}; }
        *:active > .m3-state-layer--pressed,
        *:active .m3-state-layer--pressed { opacity: ${STATE_LAYER_OPACITIES.pressed}; }
        [data-dragging="true"] > .m3-state-layer--dragged,
        [data-dragging="true"] .m3-state-layer--dragged { opacity: ${STATE_LAYER_OPACITIES.dragged}; }
        [data-disabled="true"] .m3-state-layer { display: none; }
      `}</style>
    </div>
  );
}

export { STATE_LAYER_OPACITIES };
