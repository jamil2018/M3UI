import { forwardRef, useCallback, useRef, type ComponentPropsWithoutRef } from 'react';
import { createMenuCloseAnimations, createMenuOpenAnimations } from './menu-animations.js';
import { composeRefs, usePopupWaapiAnimation } from './use-popup-waapi.js';

export type MenuMotionPopupProps = ComponentPropsWithoutRef<'div'> & {
  openingUpwards?: boolean;
};

/** Menu popup with Material Web WAAPI height/stagger choreography.
 *  Skips animation when prefers-reduced-motion is active (see use-popup-waapi). */
export const MenuMotionPopup = forwardRef<HTMLDivElement, MenuMotionPopupProps>(
  function MenuMotionPopup(
    { children, style, className, openingUpwards: openingUpwardsProp = false, ...rest },
    forwardedRef,
  ) {
    const surfaceRef = useRef<HTMLDivElement | null>(null);
    const slotRef = useRef<HTMLDivElement | null>(null);
    const side = (rest as { 'data-side'?: string })['data-side'];
    const openingUpwards = openingUpwardsProp || side === 'top';

    const getMenuElements = useCallback(() => {
      const surface = surfaceRef.current;
      const slot = slotRef.current;
      if (!surface || !slot) {
        return null;
      }

      const items = Array.from(
        surface.querySelectorAll<HTMLElement>(
          '[role="menuitem"], [role="menuitemradio"], [role="menuitemcheckbox"]',
        ),
      );

      return {
        surface,
        slot,
        items,
        openingUpwards,
      };
    }, [openingUpwards]);

    const waapiRef = usePopupWaapiAnimation({
      onOpen: (signal) => {
        const elements = getMenuElements();
        return elements ? createMenuOpenAnimations(elements, signal) : [];
      },
      onClose: (signal) => {
        const elements = getMenuElements();
        return elements ? createMenuCloseAnimations(elements, signal) : [];
      },
    });

    return (
      <div
        {...rest}
        ref={composeRefs(surfaceRef, waapiRef, forwardedRef)}
        className={className}
        style={{ overflow: 'hidden', ...style }}
      >
        <div ref={slotRef}>{children}</div>
      </div>
    );
  },
);
