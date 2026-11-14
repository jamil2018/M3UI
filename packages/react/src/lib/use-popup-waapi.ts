import { useCallback, useEffect, useRef, useState, type Ref, type RefCallback } from 'react';
import { prefersReducedMotion } from '@m3ui/motion';

export interface PopupWaapiOptions {
  onOpen: (signal: AbortSignal) => Animation[];
  onClose: (signal: AbortSignal) => Animation[];
}

function assignRef<T>(ref: Ref<T> | undefined, value: T | null) {
  if (typeof ref === 'function') ref(value);
  else if (ref && 'current' in ref) (ref as { current: T | null }).current = value;
}

/** Wires abortable WAAPI to Base UI lifecycle attributes without moving the portal. */
export function usePopupWaapiAnimation(options: PopupWaapiOptions): RefCallback<HTMLElement> {
  const optionsRef = useRef(options);
  optionsRef.current = options;
  const [node, setNode] = useState<HTMLElement | null>(null);

  useEffect(() => {
    if (!node) return;
    let phase: 'opening' | 'open' | 'closing' | 'idle' = 'idle';
    let controller: AbortController | undefined;
    let animations: Animation[] = [];
    const cancel = () => {
      controller?.abort();
      for (const animation of animations) animation.cancel();
      animations = [];
    };
    const play = async (opening: boolean) => {
      cancel();
      const task = new AbortController();
      controller = task;
      phase = opening ? 'opening' : 'closing';
      if (!prefersReducedMotion() && typeof node.animate === 'function') {
        animations = (opening ? optionsRef.current.onOpen : optionsRef.current.onClose)(
          task.signal,
        );
        try {
          await Promise.all(animations.map((animation) => animation.finished));
        } catch {
          // Cancellation rejects Animation.finished; only the current task may settle.
        }
      }
      if (!task.signal.aborted) {
        phase = opening ? 'open' : 'idle';
      }
    };
    const synchronize = () => {
      const closing = node.hasAttribute('data-closed') || node.hasAttribute('data-ending-style');
      if (closing) {
        if (phase === 'open' || phase === 'opening') void play(false);
      } else if (phase === 'idle' || phase === 'closing') {
        void play(true);
      }
    };
    const observer = new MutationObserver(synchronize);
    observer.observe(node, {
      attributes: true,
      attributeFilter: ['data-open', 'data-closed', 'data-ending-style'],
    });
    const media = window.matchMedia('(prefers-reduced-motion: reduce)');
    const onMotionChange = () => {
      if (!media.matches) return;
      cancel();
      phase =
        node.hasAttribute('data-closed') || node.hasAttribute('data-ending-style')
          ? 'idle'
          : 'open';
    };
    media.addEventListener('change', onMotionChange);
    synchronize();
    return () => {
      observer.disconnect();
      media.removeEventListener('change', onMotionChange);
      cancel();
    };
  }, [node]);

  return useCallback((element: HTMLElement | null) => {
    setNode(element);
  }, []);
}

export function composeRefs<T>(...refs: Array<Ref<T> | undefined>): RefCallback<T> {
  return (value) => {
    for (const ref of refs) assignRef(ref, value);
  };
}
