import {
  type DialogAnimation,
  prefersReducedMotion,
} from '@m3ui/motion';

function supportsWaapi(element: Element | null | undefined): element is Element {
  return !!element && typeof element.animate === 'function';
}

export interface DialogAnimationElements {
  dialog?: Element | null;
  scrim?: Element | null;
  container?: Element | null;
  headline?: Element | null;
  content?: Element | null;
  actions?: Element | null;
}

const ELEMENT_KEYS = [
  'dialog',
  'scrim',
  'container',
  'headline',
  'content',
  'actions',
] as const;

type ElementKey = (typeof ELEMENT_KEYS)[number];

export function runDialogAnimation(
  elements: DialogAnimationElements,
  animation: DialogAnimation,
  signal: AbortSignal,
): Animation[] {
  const animations: Animation[] = [];

  for (const key of ELEMENT_KEYS) {
    const element = elements[key as ElementKey];
    const argsList = animation[key as ElementKey];
    if (!element || !argsList || !supportsWaapi(element)) continue;

    for (const args of argsList) {
      const anim = element.animate(...args);
      signal.addEventListener('abort', () => {
        anim.cancel();
      });
      animations.push(anim);
    }
  }

  return animations;
}

export function runWaapiAnimations(
  createAnimations: (signal: AbortSignal) => Animation[],
  signal: AbortSignal,
): Promise<void> {
  if (prefersReducedMotion()) {
    return Promise.resolve();
  }

  const animations = createAnimations(signal);
  if (animations.length === 0) {
    return Promise.resolve();
  }

  return Promise.all(animations.map((a) => a.finished)).then(() => undefined).catch(() => undefined);
}
