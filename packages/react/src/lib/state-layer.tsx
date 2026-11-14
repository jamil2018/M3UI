import { type StateLayerState } from '@m3ui/tokens';
import { useEffect, type HTMLAttributes, type ReactNode } from 'react';

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

const STATE_LAYER_STYLE_ID = 'm3-lib-state-layer-styles';

const STATE_LAYER_STYLES = `
.m3-lib-state-layer { opacity: 0; }
.m3-lib-state-layer-host:hover > .m3-lib-state-layer--hover,
.m3-lib-state-layer-host[data-hovered="true"] > .m3-lib-state-layer--hover {
  opacity: var(--m3-state-layer-hover-opacity, var(--md-sys-state-hover-state-layer-opacity));
}
.m3-lib-state-layer-host:focus-within > .m3-lib-state-layer--focus,
:focus-visible > .m3-lib-state-layer-host > .m3-lib-state-layer--focus,
[data-highlighted] > .m3-lib-state-layer-host > .m3-lib-state-layer--focus {
  opacity: var(--m3-state-layer-focus-opacity, var(--md-sys-state-focus-state-layer-opacity));
}
.m3-lib-state-layer-host:active > .m3-lib-state-layer--pressed,
.m3-lib-state-layer-host:has(:active) > .m3-lib-state-layer--pressed,
.m3-lib-state-layer-host[data-pressed="true"] > .m3-lib-state-layer--pressed {
  opacity: var(--m3-state-layer-pressed-opacity, var(--md-sys-state-pressed-state-layer-opacity));
}
.m3-lib-state-layer-host[data-dragging="true"] > .m3-lib-state-layer--dragged,
.m3-lib-state-layer-host:has([data-dragging="true"]) > .m3-lib-state-layer--dragged {
  opacity: var(--m3-state-layer-dragged-opacity, var(--md-sys-state-dragged-state-layer-opacity));
}
/* Interaction layers replace one another; they must not darken the surface by stacking. */
.m3-lib-state-layer-host:has(> .m3-lib-state-layer--focus):focus-within > .m3-lib-state-layer--hover,
:focus-visible > .m3-lib-state-layer-host:has(> .m3-lib-state-layer--focus) > .m3-lib-state-layer--hover,
[data-highlighted] > .m3-lib-state-layer-host:has(> .m3-lib-state-layer--focus) > .m3-lib-state-layer--hover,
.m3-lib-state-layer-host:has(> .m3-lib-state-layer--pressed):is(:active, :has(:active), [data-pressed="true"]) > :is(.m3-lib-state-layer--hover, .m3-lib-state-layer--focus),
.m3-lib-state-layer-host:has(> .m3-lib-state-layer--dragged):is([data-dragging="true"], :has([data-dragging="true"])) > :is(.m3-lib-state-layer--hover, .m3-lib-state-layer--focus, .m3-lib-state-layer--pressed) {
  opacity: 0;
}
:is([data-disabled="true"], [data-disabled=""], :disabled) .m3-lib-state-layer { display: none; }
@media (forced-colors: active) {
  .m3-lib-state-layer { display: none; }
}
`;

function ensureStateLayerStyles() {
  if (typeof document === 'undefined') return;
  if (document.getElementById(STATE_LAYER_STYLE_ID)) return;
  const style = document.createElement('style');
  style.id = STATE_LAYER_STYLE_ID;
  style.textContent = STATE_LAYER_STYLES;
  document.head.appendChild(style);
}

/**
 * Token-aligned state layer — opacities read from `--md-sys-state-*-state-layer-opacity`.
 * Prefer this over the primitive when composing pressable surfaces in lib utilities.
 * Note: PressableShell does not mount StateLayer; Ripple already provides hover/press layers.
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

  useEffect(() => {
    ensureStateLayerStyles();
  }, []);

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
                pointerEvents: 'none',
              }}
            />
          )}
        </>
      )}
    </div>
  );
}
