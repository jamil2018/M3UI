import {

  useCallback,

  useEffect,

  useMemo,

  useRef,

  useState,

  type Ref,

  type RefCallback,

} from 'react';

import { prefersReducedMotion } from '@m3ui/motion';

import { createAnimationSignal } from './animation-signal.js';



export interface PopupWaapiOptions {

  onOpen: (signal: AbortSignal) => Animation[];

  onClose: (signal: AbortSignal) => Animation[];

}



function supportsWaapi(element: Element | null | undefined): element is Element {

  return !!element && typeof element.animate === 'function';

}



function assignRef<T>(ref: Ref<T> | undefined, value: T | null) {

  if (typeof ref === 'function') {

    ref(value);

  } else if (ref && 'current' in ref) {

    (ref as { current: T | null }).current = value;

  }

}



/**

 * Wires Material Web-style open/close WAAPI to Base UI popup lifecycle attributes.

 * Base UI waits for element.getAnimations() before unmounting.

 */

export function usePopupWaapiAnimation(options: PopupWaapiOptions): RefCallback<HTMLElement> {

  const animationSignal = useMemo(() => createAnimationSignal(), []);

  const nodeRef = useRef<HTMLElement | null>(null);

  const phaseRef = useRef<'opening' | 'open' | 'closing' | 'idle'>('idle');

  const optionsRef = useRef(options);

  optionsRef.current = options;

  const [mountedNode, setMountedNode] = useState<HTMLElement | null>(null);



  const playOpen = useCallback(async () => {

    const node = nodeRef.current;

    if (prefersReducedMotion() || !supportsWaapi(node)) {

      phaseRef.current = 'open';

      return;

    }



    phaseRef.current = 'opening';

    const signal = animationSignal.start();

    const animations = optionsRef.current.onOpen(signal);



    try {

      await Promise.all(animations.map((a) => a.finished));

    } catch {

      /* aborted */

    }



    if (!signal.aborted) {

      animationSignal.finish();

      phaseRef.current = 'open';

    }

  }, [animationSignal]);



  const playClose = useCallback(async () => {

    const node = nodeRef.current;

    if (prefersReducedMotion() || !supportsWaapi(node)) {

      phaseRef.current = 'idle';

      return;

    }



    phaseRef.current = 'closing';

    const signal = animationSignal.start();

    const animations = optionsRef.current.onClose(signal);



    try {

      await Promise.all(animations.map((a) => a.finished));

    } catch {

      /* aborted */

    }



    if (!signal.aborted) {

      animationSignal.finish();

    }

    phaseRef.current = 'idle';

  }, [animationSignal]);



  useEffect(() => {

    const node = mountedNode;

    if (!node) return;



    nodeRef.current = node;

    phaseRef.current = 'idle';



    const observer = new MutationObserver(() => {

      const isClosing =

        node.hasAttribute('data-closed') || node.hasAttribute('data-ending-style');



      if (isClosing && (phaseRef.current === 'open' || phaseRef.current === 'opening')) {

        void playClose();

        return;

      }



      if (node.hasAttribute('data-open') && phaseRef.current === 'idle') {

        void playOpen();

      }

    });



    observer.observe(node, {

      attributes: true,

      attributeFilter: ['data-open', 'data-closed', 'data-ending-style'],

    });



    void playOpen();



    return () => {

      observer.disconnect();

    };

  }, [mountedNode, playClose, playOpen]);



  return useCallback((node: HTMLElement | null) => {

    nodeRef.current = node;

    setMountedNode(node);

  }, []);

}



export function composeRefs<T>(...refs: Array<Ref<T> | undefined>): RefCallback<T> {

  return (value) => {

    for (const ref of refs) {

      assignRef(ref, value);

    }

  };

}


