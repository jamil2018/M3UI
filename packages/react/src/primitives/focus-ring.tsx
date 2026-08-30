import {
  useCallback,
  useEffect,
  useRef,
  useState,
  type CSSProperties,
  type ReactNode,
} from 'react';
import { sysColor } from '../lib/token-utils.js';

export interface FocusRingProps {
  children: ReactNode;
  /** Animate ring inwards (border) instead of outwards (outline) */
  inward?: boolean;
  className?: string;
  style?: CSSProperties;
}

const FOCUS_RING_STYLE_ID = 'm3-focus-ring-styles';

const FOCUS_RING_STYLES = `
.m3-focus-ring-host {
  position: relative;
  display: inline-flex;
}
.m3-focus-ring {
  animation-delay: 0s, calc(var(--md-focus-ring-duration, 600ms) * 0.25);
  animation-duration: calc(var(--md-focus-ring-duration, 600ms) * 0.25),
    calc(var(--md-focus-ring-duration, 600ms) * 0.75);
  animation-timing-function: var(--md-sys-motion-easing-emphasized, cubic-bezier(0.2, 0, 0, 1));
  box-sizing: border-box;
  color: var(--md-focus-ring-color, var(--md-sys-color-secondary));
  display: none;
  pointer-events: none;
  position: absolute;
  border-radius: inherit;
}
.m3-focus-ring[data-visible="true"] {
  display: flex;
}
.m3-focus-ring:not([data-inward="true"]) {
  animation-name: m3-focus-ring-outward-grow, m3-focus-ring-outward-shrink;
  border-end-end-radius: calc(var(--md-focus-ring-shape-end-end, inherit) + var(--md-focus-ring-outward-offset, 2px));
  border-end-start-radius: calc(var(--md-focus-ring-shape-end-start, inherit) + var(--md-focus-ring-outward-offset, 2px));
  border-start-end-radius: calc(var(--md-focus-ring-shape-start-end, inherit) + var(--md-focus-ring-outward-offset, 2px));
  border-start-start-radius: calc(var(--md-focus-ring-shape-start-start, inherit) + var(--md-focus-ring-outward-offset, 2px));
  inset: calc(-1 * var(--md-focus-ring-outward-offset, 2px));
  outline: var(--md-focus-ring-width, 3px) solid currentColor;
}
.m3-focus-ring[data-inward="true"] {
  animation-name: m3-focus-ring-inward-grow, m3-focus-ring-inward-shrink;
  border-end-end-radius: calc(var(--md-focus-ring-shape-end-end, inherit) - var(--md-focus-ring-inward-offset, 0px));
  border-end-start-radius: calc(var(--md-focus-ring-shape-end-start, inherit) - var(--md-focus-ring-inward-offset, 0px));
  border-start-end-radius: calc(var(--md-focus-ring-shape-start-end, inherit) - var(--md-focus-ring-inward-offset, 0px));
  border-start-start-radius: calc(var(--md-focus-ring-shape-start-start, inherit) - var(--md-focus-ring-inward-offset, 0px));
  border: var(--md-focus-ring-width, 3px) solid currentColor;
  inset: var(--md-focus-ring-inward-offset, 0px);
}
@keyframes m3-focus-ring-outward-grow {
  from { outline-width: 0; }
  to { outline-width: var(--md-focus-ring-active-width, 8px); }
}
@keyframes m3-focus-ring-outward-shrink {
  from { outline-width: var(--md-focus-ring-active-width, 8px); }
}
@keyframes m3-focus-ring-inward-grow {
  from { border-width: 0; }
  to { border-width: var(--md-focus-ring-active-width, 8px); }
}
@keyframes m3-focus-ring-inward-shrink {
  from { border-width: var(--md-focus-ring-active-width, 8px); }
}
@media (prefers-reduced-motion: reduce) {
  .m3-focus-ring {
    animation: none;
  }
}
`;

function ensureFocusRingStyles() {
  if (typeof document === 'undefined') return;
  if (document.getElementById(FOCUS_RING_STYLE_ID)) return;
  const style = document.createElement('style');
  style.id = FOCUS_RING_STYLE_ID;
  style.textContent = FOCUS_RING_STYLES;
  document.head.appendChild(style);
}

const HANDLED_BY_FOCUS_RING = Symbol('handledByFocusRing');

interface FocusRingEvent extends Event {
  [HANDLED_BY_FOCUS_RING]?: boolean;
}

export function FocusRing({ children, inward = false, className, style }: FocusRingProps) {
  const hostRef = useRef<HTMLDivElement>(null);
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    ensureFocusRingStyles();
  }, []);

  const handleEvent = useCallback((event: FocusRingEvent) => {
    if (event[HANDLED_BY_FOCUS_RING]) return;
    switch (event.type) {
      case 'focusin': {
        const target = event.target;
        if (target instanceof HTMLElement && target.matches(':focus-visible')) {
          setVisible(true);
        }
        break;
      }
      case 'focusout':
      case 'pointerdown':
        setVisible(false);
        break;
      default:
        return;
    }
    event[HANDLED_BY_FOCUS_RING] = true;
  }, []);

  useEffect(() => {
    const host = hostRef.current;
    if (!host) return;
    const events = ['focusin', 'focusout', 'pointerdown'] as const;
    for (const event of events) {
      host.addEventListener(event, handleEvent);
    }
    return () => {
      for (const event of events) {
        host.removeEventListener(event, handleEvent);
      }
    };
  }, [handleEvent]);

  const tokenStyle = {
    '--md-focus-ring-color': sysColor('secondary'),
    '--md-focus-ring-duration': 'var(--md-sys-motion-duration-long4)',
  } as CSSProperties;

  return (
    <div
      ref={hostRef}
      className={['m3-focus-ring-host', className].filter(Boolean).join(' ')}
      style={{ ...tokenStyle, ...style }}
    >
      {children}
      <span
        aria-hidden
        className="m3-focus-ring"
        data-visible={visible || undefined}
        data-inward={inward || undefined}
      />
    </div>
  );
}
