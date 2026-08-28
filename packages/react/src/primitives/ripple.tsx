import { useCallback, useRef, type MouseEvent, type ReactNode } from 'react';
import { STATE_LAYER_OPACITIES } from '@m3ui/tokens';

export interface RippleProps {
  children: ReactNode;
  color?: string;
  disabled?: boolean;
  className?: string;
}

interface RippleCircle {
  x: number;
  y: number;
  size: number;
  key: number;
}

export function Ripple({ children, color, disabled = false, className }: RippleProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const ripplesRef = useRef<RippleCircle[]>([]);
  const keyRef = useRef(0);

  const addRipple = useCallback(
    (event: MouseEvent<HTMLDivElement>) => {
      if (disabled || !containerRef.current) return;

      const rect = containerRef.current.getBoundingClientRect();
      const size = Math.max(rect.width, rect.height) * 2;
      const x = event.clientX - rect.left - size / 2;
      const y = event.clientY - rect.top - size / 2;

      const ripple: RippleCircle = { x, y, size, key: keyRef.current++ };
      ripplesRef.current.push(ripple);

      const el = document.createElement('span');
      el.className = 'm3-ripple-circle';
      el.style.cssText = `
        position: absolute;
        border-radius: 50%;
        transform: scale(0);
        animation: m3-ripple 600ms var(--md-sys-motion-easing-standard, cubic-bezier(0.2, 0, 0, 1));
        background: ${color ?? 'currentColor'};
        opacity: ${STATE_LAYER_OPACITIES.pressed};
        left: ${String(x)}px;
        top: ${String(y)}px;
        width: ${String(size)}px;
        height: ${String(size)}px;
        pointer-events: none;
      `;

      containerRef.current.appendChild(el);
      requestAnimationFrame(() => {
        el.style.transform = 'scale(1)';
        el.style.opacity = '0';
      });
      setTimeout(() => el.remove(), 600);
    },
    [disabled, color],
  );

  return (
    <div
      ref={containerRef}
      className={className}
      style={{ position: 'relative', overflow: 'hidden' }}
      onPointerDown={addRipple}
      data-disabled={disabled || undefined}
    >
      {children}
      <style>{`
        @keyframes m3-ripple {
          to { transform: scale(1); opacity: 0; }
        }
        [data-disabled="true"] { pointer-events: none; }
      `}</style>
    </div>
  );
}
