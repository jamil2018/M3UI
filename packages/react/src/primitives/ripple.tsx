import {
  useCallback,
  useEffect,
  useRef,
  useState,
  type CSSProperties,
  type ReactNode,
} from 'react';
import { STATE_LAYER_OPACITIES } from '@m3ui/tokens';

export interface RippleProps {
  children: ReactNode;
  color?: string;
  disabled?: boolean;
  className?: string;
  style?: CSSProperties;
}

const PRESS_GROW_MS = 450;
const MINIMUM_PRESS_MS = 225;
const TOUCH_DELAY_MS = 150;
const INITIAL_ORIGIN_SCALE = 0.2;
const PADDING = 10;
const SOFT_EDGE_MINIMUM_SIZE = 75;
const SOFT_EDGE_CONTAINER_RATIO = 0.35;
const PRESS_PSEUDO = '::after';
const ANIMATION_FILL = 'forwards' as const;

enum State {
  INACTIVE,
  TOUCH_DELAY,
  HOLDING,
  WAITING_FOR_CLICK,
}

const RIPPLE_STYLE_ID = 'm3-ripple-styles';

const RIPPLE_STYLES = `
.m3-ripple-host {
  position: relative;
  overflow: hidden;
}
.m3-ripple-host[data-disabled="true"] {
  pointer-events: none;
}
.m3-ripple-host[data-disabled="true"] .m3-ripple-surface {
  display: none;
}
@media (forced-colors: active) {
  .m3-ripple-host .m3-ripple-surface {
    display: none;
  }
}
.m3-ripple-surface {
  border-radius: inherit;
  position: absolute;
  inset: 0;
  overflow: hidden;
  pointer-events: none;
  -webkit-tap-highlight-color: transparent;
}
.m3-ripple-surface::before,
.m3-ripple-surface::after {
  content: '';
  opacity: 0;
  position: absolute;
}
.m3-ripple-surface::before {
  background-color: var(--m3-ripple-hover-color, currentColor);
  inset: 0;
  transition: opacity 15ms linear, background-color 15ms linear;
}
.m3-ripple-surface::after {
  background: radial-gradient(
    closest-side,
    var(--m3-ripple-pressed-color, currentColor) max(calc(100% - 70px), 65%),
    transparent 100%
  );
  transform-origin: center center;
  transition: opacity 375ms linear;
}
.m3-ripple-surface[data-hovered="true"]::before {
  opacity: var(--m3-ripple-hover-opacity, ${STATE_LAYER_OPACITIES.hover});
}
.m3-ripple-surface[data-pressed="true"]::after {
  opacity: var(--m3-ripple-pressed-opacity, ${STATE_LAYER_OPACITIES.pressed});
  transition-duration: 105ms;
}
`;

function ensureRippleStyles() {
  if (typeof document === 'undefined') return;
  if (document.getElementById(RIPPLE_STYLE_ID)) return;
  const style = document.createElement('style');
  style.id = RIPPLE_STYLE_ID;
  style.textContent = RIPPLE_STYLES;
  document.head.appendChild(style);
}

const FORCED_COLORS =
  typeof window !== 'undefined' ? window.matchMedia('(forced-colors: active)') : null;

const RIPPLE_EVENTS = [
  'click',
  'contextmenu',
  'pointercancel',
  'pointerdown',
  'pointerenter',
  'pointerleave',
  'pointerup',
] as const;

export function Ripple({ children, color, disabled = false, className, style }: RippleProps) {
  const hostRef = useRef<HTMLDivElement>(null);
  const surfaceRef = useRef<HTMLDivElement>(null);
  const stateRef = useRef(State.INACTIVE);
  const rippleStartEventRef = useRef<PointerEvent | undefined>(undefined);
  const growAnimationRef = useRef<Animation | undefined>(undefined);
  const rippleSizeRef = useRef('');
  const rippleScaleRef = useRef('');
  const initialSizeRef = useRef(0);

  const [hovered, setHovered] = useState(false);
  const [pressed, setPressed] = useState(false);

  useEffect(() => {
    ensureRippleStyles();
  }, []);

  const isTouch = useCallback((event: PointerEvent) => event.pointerType === 'touch', []);

  const shouldReactToEvent = useCallback(
    (event: PointerEvent) => {
      if (disabled || !event.isPrimary) return false;
      if (
        rippleStartEventRef.current &&
        rippleStartEventRef.current.pointerId !== event.pointerId
      ) {
        return false;
      }
      if (event.type === 'pointerenter' || event.type === 'pointerleave') {
        return !isTouch(event);
      }
      return isTouch(event) || event.buttons === 1;
    },
    [disabled, isTouch],
  );

  const getBoundingSize = useCallback(() => {
    const surface = surfaceRef.current;
    if (!surface) return { width: 0, height: 0 };
    const { width, height } = surface.getBoundingClientRect();
    const zoom = surface.offsetWidth > 0 ? width / surface.offsetWidth : 1;
    return { width: width / zoom, height: height / zoom, zoom };
  }, []);

  const determineRippleSize = useCallback(() => {
    const { width, height, zoom = 1 } = getBoundingSize();
    const maxDim = Math.max(width, height);
    const softEdgeSize = Math.max(SOFT_EDGE_CONTAINER_RATIO * maxDim, SOFT_EDGE_MINIMUM_SIZE);
    const initialSize = Math.floor((maxDim * INITIAL_ORIGIN_SCALE) / zoom);
    const hypotenuse = Math.sqrt(width ** 2 + height ** 2);
    const maxRadius = hypotenuse + PADDING;
    initialSizeRef.current = initialSize;
    const maybeZoomedScale = (maxRadius + softEdgeSize) / initialSize;
    rippleScaleRef.current = `${maybeZoomedScale / zoom}`;
    rippleSizeRef.current = `${initialSize}px`;
  }, [getBoundingSize]);

  const getNormalizedPointerEventCoords = useCallback(
    (pointerEvent: PointerEvent) => {
      const surface = surfaceRef.current;
      if (!surface) return { x: 0, y: 0 };
      const { scrollX, scrollY } = window;
      const { left, top } = surface.getBoundingClientRect();
      const documentX = scrollX + left;
      const documentY = scrollY + top;
      const zoom = surface.offsetWidth > 0
        ? surface.getBoundingClientRect().width / surface.offsetWidth
        : 1;
      return {
        x: (pointerEvent.pageX - documentX) / zoom,
        y: (pointerEvent.pageY - documentY) / zoom,
      };
    },
    [],
  );

  const getTranslationCoordinates = useCallback(
    (positionEvent?: Event) => {
      const { width, height, zoom = 1 } = getBoundingSize();
      const endPoint = {
        x: (width / zoom - initialSizeRef.current) / 2,
        y: (height / zoom - initialSizeRef.current) / 2,
      };
      let startPoint;
      if (positionEvent instanceof PointerEvent) {
        startPoint = getNormalizedPointerEventCoords(positionEvent);
      } else {
        startPoint = { x: width / zoom / 2, y: height / zoom / 2 };
      }
      startPoint = {
        x: startPoint.x - initialSizeRef.current / 2,
        y: startPoint.y - initialSizeRef.current / 2,
      };
      return { startPoint, endPoint };
    },
    [getBoundingSize, getNormalizedPointerEventCoords],
  );

  const startPressAnimation = useCallback(
    (positionEvent?: Event) => {
      const surface = surfaceRef.current;
      if (!surface) return;
      setPressed(true);
      growAnimationRef.current?.cancel();
      if (typeof surface.animate !== 'function') return;
      determineRippleSize();
      const { startPoint, endPoint } = getTranslationCoordinates(positionEvent);
      const translateStart = `${startPoint.x}px, ${startPoint.y}px`;
      const translateEnd = `${endPoint.x}px, ${endPoint.y}px`;
      growAnimationRef.current = surface.animate(
        {
          top: [0, 0],
          left: [0, 0],
          height: [rippleSizeRef.current, rippleSizeRef.current],
          width: [rippleSizeRef.current, rippleSizeRef.current],
          transform: [
            `translate(${translateStart}) scale(1)`,
            `translate(${translateEnd}) scale(${rippleScaleRef.current})`,
          ],
        },
        {
          pseudoElement: PRESS_PSEUDO,
          duration: PRESS_GROW_MS,
          easing: 'var(--md-sys-motion-easing-standard, cubic-bezier(0.2, 0, 0, 1))',
          fill: ANIMATION_FILL,
        },
      );
    },
    [determineRippleSize, getTranslationCoordinates],
  );

  const endPressAnimation = useCallback(async () => {
    rippleStartEventRef.current = undefined;
    stateRef.current = State.INACTIVE;
    const animation = growAnimationRef.current;
    let pressAnimationPlayState = Infinity;
    if (typeof animation?.currentTime === 'number') {
      pressAnimationPlayState = animation.currentTime;
    } else if (animation?.currentTime && typeof animation.currentTime === 'object') {
      pressAnimationPlayState = (animation.currentTime as CSSNumericValue).to('ms').value;
    }
    if (pressAnimationPlayState >= MINIMUM_PRESS_MS) {
      setPressed(false);
      return;
    }
    await new Promise<void>((resolve) => {
      setTimeout(resolve, MINIMUM_PRESS_MS - pressAnimationPlayState);
    });
    if (growAnimationRef.current !== animation) return;
    setPressed(false);
  }, []);

  const handlePointerenter = useCallback(
    (event: PointerEvent) => {
      if (!shouldReactToEvent(event)) return;
      setHovered(true);
    },
    [shouldReactToEvent],
  );

  const handlePointerleave = useCallback(
    (event: PointerEvent) => {
      if (!shouldReactToEvent(event)) return;
      setHovered(false);
      if (stateRef.current !== State.INACTIVE) {
        void endPressAnimation();
      }
    },
    [shouldReactToEvent, endPressAnimation],
  );

  const handlePointerup = useCallback(
    (event: PointerEvent) => {
      if (!shouldReactToEvent(event)) return;
      if (stateRef.current === State.HOLDING) {
        stateRef.current = State.WAITING_FOR_CLICK;
        return;
      }
      if (stateRef.current === State.TOUCH_DELAY) {
        stateRef.current = State.WAITING_FOR_CLICK;
        startPressAnimation(rippleStartEventRef.current);
      }
    },
    [shouldReactToEvent, startPressAnimation],
  );

  const handlePointerdown = useCallback(
    async (event: PointerEvent) => {
      if (!shouldReactToEvent(event)) return;
      rippleStartEventRef.current = event;
      if (!isTouch(event)) {
        stateRef.current = State.WAITING_FOR_CLICK;
        startPressAnimation(event);
        return;
      }
      stateRef.current = State.TOUCH_DELAY;
      await new Promise<void>((resolve) => {
        setTimeout(resolve, TOUCH_DELAY_MS);
      });
      if (stateRef.current !== State.TOUCH_DELAY) return;
      stateRef.current = State.HOLDING;
      startPressAnimation(event);
    },
    [shouldReactToEvent, isTouch, startPressAnimation],
  );

  const handleClick = useCallback(() => {
    if (disabled) return;
    if (stateRef.current === State.WAITING_FOR_CLICK) {
      void endPressAnimation();
      return;
    }
    if (stateRef.current === State.INACTIVE) {
      startPressAnimation();
      void endPressAnimation();
    }
  }, [disabled, endPressAnimation, startPressAnimation]);

  const handlePointercancel = useCallback(
    (event: PointerEvent) => {
      if (!shouldReactToEvent(event)) return;
      void endPressAnimation();
    },
    [shouldReactToEvent, endPressAnimation],
  );

  const handleContextmenu = useCallback(() => {
    if (disabled) return;
    void endPressAnimation();
  }, [disabled, endPressAnimation]);

  const handleEvent = useCallback(
    (event: Event) => {
      if (FORCED_COLORS?.matches) return;
      switch (event.type) {
        case 'click':
          handleClick();
          break;
        case 'contextmenu':
          handleContextmenu();
          break;
        case 'pointercancel':
          handlePointercancel(event as PointerEvent);
          break;
        case 'pointerdown':
          void handlePointerdown(event as PointerEvent);
          break;
        case 'pointerenter':
          handlePointerenter(event as PointerEvent);
          break;
        case 'pointerleave':
          handlePointerleave(event as PointerEvent);
          break;
        case 'pointerup':
          handlePointerup(event as PointerEvent);
          break;
        default:
          break;
      }
    },
    [
      handleClick,
      handleContextmenu,
      handlePointercancel,
      handlePointerdown,
      handlePointerenter,
      handlePointerleave,
      handlePointerup,
    ],
  );

  useEffect(() => {
    const host = hostRef.current;
    if (!host || disabled) return;
    for (const event of RIPPLE_EVENTS) {
      host.addEventListener(event, handleEvent);
    }
    return () => {
      for (const event of RIPPLE_EVENTS) {
        host.removeEventListener(event, handleEvent);
      }
    };
  }, [disabled, handleEvent]);

  useEffect(() => {
    if (disabled) {
      setHovered(false);
      setPressed(false);
      stateRef.current = State.INACTIVE;
      growAnimationRef.current?.cancel();
    }
  }, [disabled]);

  const rippleColor = color ?? 'currentColor';

  return (
    <div
      ref={hostRef}
      className={['m3-ripple-host', className].filter(Boolean).join(' ')}
      style={style}
      data-disabled={disabled || undefined}
    >
      {children}
      {!disabled && (
        <div
          ref={surfaceRef}
          aria-hidden
          className="m3-ripple-surface"
          data-hovered={hovered || undefined}
          data-pressed={pressed || undefined}
          style={
            {
              '--m3-ripple-hover-color': rippleColor,
              '--m3-ripple-pressed-color': rippleColor,
            } as CSSProperties
          }
        />
      )}
    </div>
  );
}
