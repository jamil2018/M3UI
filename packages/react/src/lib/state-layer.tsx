import { type StateLayerState } from '@m3ui/tokens';
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

/** Material Web sys token reference for a state-layer opacity. */
export function stateLayerOpacityVar(state: StateLayerState): string {
  return `var(--md-sys-state-${state}-state-layer-opacity)`;
}

export const STATE_LAYER_OPACITY_VARS: Record<StateLayerState, string> = {
  hover: stateLayerOpacityVar('hover'),
  focus: stateLayerOpacityVar('focus'),
  pressed: stateLayerOpacityVar('pressed'),
  dragged: stateLayerOpacityVar('dragged'),
};

const STATE_LAYER_STYLES = `
.m3-lib-state-layer--hover { opacity: 0; }
.m3-lib-state-layer-host:hover > .m3-lib-state-layer--hover {
  opacity: var(--md-sys-state-hover-state-layer-opacity);
}
.m3-lib-state-layer-host:focus-within > .m3-lib-state-layer--focus {
  opacity: var(--md-sys-state-focus-state-layer-opacity);
}
.m3-lib-state-layer-host:active > .m3-lib-state-layer--pressed {
  opacity: var(--md-sys-state-pressed-state-layer-opacity);
}
.m3-lib-state-layer-host[data-dragging="true"] > .m3-lib-state-layer--dragged {
  opacity: var(--md-sys-state-dragged-state-layer-opacity);
}
[data-disabled="true"] .m3-lib-state-layer { display: none; }
@media (forced-colors: active) {
  .m3-lib-state-layer { forced-color-adjust: none; }
}
`;

/**
 * Token-aligned state layer — opacities read from `--md-sys-state-*-state-layer-opacity`.
 * Prefer this over the primitive when composing pressable surfaces in lib utilities.
 */
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
      className={['m3-lib-state-layer-host', className].filter(Boolean).join(' ')}
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
              className="m3-lib-state-layer m3-lib-state-layer--hover"
              style={{
                position: 'absolute',
                inset: 0,
                borderRadius: 'inherit',
                background: color ?? 'currentColor',
                opacity: 0,
                pointerEvents: 'none',
                transition:
                  'opacity var(--md-sys-motion-duration-short2) var(--md-sys-motion-easing-standard)',
              }}
            />
          )}
          {stateSet.has('focus') && (
            <span
              aria-hidden
              className="m3-lib-state-layer m3-lib-state-layer--focus"
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
              className="m3-lib-state-layer m3-lib-state-layer--pressed"
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
              className="m3-lib-state-layer m3-lib-state-layer--dragged"
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
      <style>{STATE_LAYER_STYLES}</style>
    </div>
  );
}
