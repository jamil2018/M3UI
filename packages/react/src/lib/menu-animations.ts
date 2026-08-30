import { EASING } from '@m3ui/motion';

function supportsWaapi(element: Element | null | undefined): element is Element {
  return !!element && typeof element.animate === 'function';
}

export const MENU_OPEN_DURATION = 500;
export const MENU_CLOSE_DURATION = 150;
export const MENU_END_HEIGHT_RATIO = 0.35;

export interface MenuAnimationElements {
  surface: HTMLElement;
  slot: HTMLElement;
  items: HTMLElement[];
  openingUpwards: boolean;
}

export function createMenuOpenAnimations(
  { surface, slot, items, openingUpwards }: MenuAnimationElements,
  signal: AbortSignal,
): Animation[] {
  if (!supportsWaapi(surface) || !supportsWaapi(slot)) {
    return [];
  }

  const height = surface.offsetHeight;
  const FULL_DURATION = MENU_OPEN_DURATION;
  const SURFACE_OPACITY_DURATION = 50;
  const ITEM_OPACITY_DURATION = 250;
  const count = Math.max(items.length, 1);
  const DELAY_BETWEEN_ITEMS = (FULL_DURATION - ITEM_OPACITY_DURATION) / count;

  const animations: Animation[] = [];

  animations.push(
    surface.animate([{ height: '0px' }, { height: `${height}px` }], {
      duration: FULL_DURATION,
      easing: EASING.EMPHASIZED,
    }),
  );

  animations.push(
    slot.animate(
      [
        { transform: openingUpwards ? `translateY(-${height}px)` : '' },
        { transform: '' },
      ],
      { duration: FULL_DURATION, easing: EASING.EMPHASIZED },
    ),
  );

  animations.push(surface.animate([{ opacity: 0 }, { opacity: 1 }], SURFACE_OPACITY_DURATION));

  for (let i = 0; i < items.length; i++) {
    const directionalIndex = openingUpwards ? items.length - 1 - i : i;
    const child = items[directionalIndex];
    if (!child) continue;
    child.classList.add('m3-menu-item-hidden');
    const animation = child.animate([{ opacity: 0 }, { opacity: 1 }], {
      duration: ITEM_OPACITY_DURATION,
      delay: DELAY_BETWEEN_ITEMS * i,
    });
    animation.addEventListener('finish', () => {
      child.classList.remove('m3-menu-item-hidden');
    });
    animations.push(animation);
  }

  for (const animation of animations) {
    signal.addEventListener('abort', () => {
      animation.cancel();
      for (const item of items) {
        item.classList.remove('m3-menu-item-hidden');
      }
    });
  }

  return animations;
}

export function createMenuCloseAnimations(
  { surface, slot, items, openingUpwards }: MenuAnimationElements,
  signal: AbortSignal,
): Animation[] {
  if (!supportsWaapi(surface) || !supportsWaapi(slot)) {
    return [];
  }

  const height = surface.offsetHeight;
  const closingDownwards = openingUpwards;
  const FULL_DURATION = MENU_CLOSE_DURATION;
  const SURFACE_OPACITY_DURATION = 50;
  const SURFACE_OPACITY_DELAY = FULL_DURATION - SURFACE_OPACITY_DURATION;
  const ITEM_OPACITY_DURATION = 50;
  const ITEM_OPACITY_INITIAL_DELAY = 50;
  const count = Math.max(items.length, 1);
  const DELAY_BETWEEN_ITEMS =
    (FULL_DURATION - ITEM_OPACITY_INITIAL_DELAY - ITEM_OPACITY_DURATION) / count;

  const animations: Animation[] = [];

  animations.push(
    surface.animate(
      [{ height: `${height}px` }, { height: `${height * MENU_END_HEIGHT_RATIO}px` }],
      {
        duration: FULL_DURATION,
        easing: EASING.EMPHASIZED_ACCELERATE,
      },
    ),
  );

  animations.push(
    slot.animate(
      [
        { transform: '' },
        {
          transform: closingDownwards
            ? `translateY(-${height * (1 - MENU_END_HEIGHT_RATIO)}px)`
            : '',
        },
      ],
      { duration: FULL_DURATION, easing: EASING.EMPHASIZED_ACCELERATE },
    ),
  );

  animations.push(
    surface.animate(
      [{ opacity: 1 }, { opacity: 0 }],
      { duration: SURFACE_OPACITY_DURATION, delay: SURFACE_OPACITY_DELAY },
    ),
  );

  for (let i = 0; i < items.length; i++) {
    const directionalIndex = closingDownwards ? i : items.length - 1 - i;
    const child = items[directionalIndex];
    if (!child) continue;
    const animation = child.animate([{ opacity: 1 }, { opacity: 0 }], {
      duration: ITEM_OPACITY_DURATION,
      delay: ITEM_OPACITY_INITIAL_DELAY + DELAY_BETWEEN_ITEMS * i,
    });
    animation.addEventListener('finish', () => {
      child.classList.add('m3-menu-item-hidden');
    });
    animations.push(animation);
  }

  for (const animation of animations) {
    signal.addEventListener('abort', () => {
      animation.cancel();
      for (const item of items) {
        item.classList.remove('m3-menu-item-hidden');
      }
    });
  }

  return animations;
}
