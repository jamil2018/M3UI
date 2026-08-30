import {
  DIALOG_CLOSE_ANIMATION,
  DIALOG_OPEN_ANIMATION,
  type DialogAnimation,
} from '@m3ui/motion';
import { useCallback, useRef, type CSSProperties, type ReactNode, type Ref } from 'react';
import { runDialogAnimation, type DialogAnimationElements } from './waapi.js';
import { composeRefs, usePopupWaapiAnimation } from './use-popup-waapi.js';

export const dialogContainerStyle: CSSProperties = {
  position: 'relative',
  overflow: 'hidden',
};

export const dialogMotionStyles = `
.m3-dialog-container::before {
  content: '';
  position: absolute;
  inset: 0;
  border-radius: inherit;
  background: inherit;
  pointer-events: none;
}
.m3-menu-item-hidden {
  opacity: 0;
}
@media (prefers-reduced-motion: reduce) {
  .m3-menu-item-hidden {
    opacity: 1;
  }
}
`;

export interface DialogMotionRefs {
  popup?: Ref<HTMLElement>;
  scrim?: Ref<HTMLElement>;
  container?: Ref<HTMLDivElement>;
  headline?: Ref<HTMLElement>;
  content?: Ref<HTMLElement>;
  actions?: Ref<HTMLDivElement>;
}

export function useDialogMotionRefs() {
  const popupRef = useRef<HTMLElement | null>(null);
  const scrimRef = useRef<HTMLElement | null>(null);
  const containerRef = useRef<HTMLDivElement | null>(null);
  const headlineRef = useRef<HTMLElement | null>(null);
  const contentRef = useRef<HTMLElement | null>(null);
  const actionsRef = useRef<HTMLDivElement | null>(null);

  const getElements = useCallback(
    (): DialogAnimationElements => ({
      dialog: popupRef.current,
      scrim: scrimRef.current,
      container: containerRef.current,
      headline: headlineRef.current,
      content: contentRef.current,
      actions: actionsRef.current,
    }),
    [],
  );

  return {
    popupRef,
    scrimRef,
    containerRef,
    headlineRef,
    contentRef,
    actionsRef,
    getElements,
  };
}

export function useDialogWaapi(
  getElements: () => DialogAnimationElements,
  openAnimation: DialogAnimation = DIALOG_OPEN_ANIMATION,
  closeAnimation: DialogAnimation = DIALOG_CLOSE_ANIMATION,
) {
  return usePopupWaapiAnimation({
    onOpen: (signal) => runDialogAnimation(getElements(), openAnimation, signal),
    onClose: (signal) => runDialogAnimation(getElements(), closeAnimation, signal),
  });
}

export function DialogMotionStyles() {
  return <style>{dialogMotionStyles}</style>;
}

export interface DialogMotionContainerProps {
  children: ReactNode;
  containerRef: Ref<HTMLDivElement>;
  style?: CSSProperties;
}

export function DialogMotionContainer({ children, containerRef, style }: DialogMotionContainerProps) {
  return (
    <div ref={containerRef} className="m3-dialog-container" style={{ ...dialogContainerStyle, ...style }}>
      {children}
    </div>
  );
}
