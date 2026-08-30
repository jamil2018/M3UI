import { EASING } from './easing.js';

/** WAAPI keyframe args — `Element.prototype.animate` parameters. */
export type WaapiAnimationArgs = Parameters<Element['animate']>;

export interface DialogAnimation {
  dialog?: WaapiAnimationArgs[];
  scrim?: WaapiAnimationArgs[];
  container?: WaapiAnimationArgs[];
  headline?: WaapiAnimationArgs[];
  content?: WaapiAnimationArgs[];
  actions?: WaapiAnimationArgs[];
}

/** Material Web DIALOG_DEFAULT_OPEN_ANIMATION using token-aligned easing. */
export const DIALOG_OPEN_ANIMATION: DialogAnimation = {
  dialog: [
    [
      [{ transform: 'translateY(-50px)' }, { transform: 'translateY(0)' }],
      { duration: 500, easing: EASING.EMPHASIZED },
    ],
  ],
  scrim: [
    [
      [{ opacity: 0 }, { opacity: 0.32 }],
      { duration: 500, easing: 'linear' },
    ],
  ],
  container: [
    [
      [{ opacity: 0 }, { opacity: 1 }],
      { duration: 50, easing: 'linear', pseudoElement: '::before' },
    ],
    [
      [{ height: '35%' }, { height: '100%' }],
      { duration: 500, easing: EASING.EMPHASIZED, pseudoElement: '::before' },
    ],
  ],
  headline: [
    [
      [{ opacity: 0 }, { opacity: 0, offset: 0.2 }, { opacity: 1 }],
      { duration: 250, easing: 'linear', fill: 'forwards' },
    ],
  ],
  content: [
    [
      [{ opacity: 0 }, { opacity: 0, offset: 0.2 }, { opacity: 1 }],
      { duration: 250, easing: 'linear', fill: 'forwards' },
    ],
  ],
  actions: [
    [
      [{ opacity: 0 }, { opacity: 0, offset: 0.5 }, { opacity: 1 }],
      { duration: 300, easing: 'linear', fill: 'forwards' },
    ],
  ],
};

/** Material Web DIALOG_DEFAULT_CLOSE_ANIMATION using token-aligned easing. */
export const DIALOG_CLOSE_ANIMATION: DialogAnimation = {
  dialog: [
    [
      [{ transform: 'translateY(0)' }, { transform: 'translateY(-50px)' }],
      { duration: 150, easing: EASING.EMPHASIZED_ACCELERATE },
    ],
  ],
  scrim: [
    [
      [{ opacity: 0.32 }, { opacity: 0 }],
      { duration: 150, easing: 'linear' },
    ],
  ],
  container: [
    [
      [{ height: '100%' }, { height: '35%' }],
      {
        duration: 150,
        easing: EASING.EMPHASIZED_ACCELERATE,
        pseudoElement: '::before',
      },
    ],
    [
      [{ opacity: '1' }, { opacity: '0' }],
      { delay: 100, duration: 50, easing: 'linear', pseudoElement: '::before' },
    ],
  ],
  headline: [
    [
      [{ opacity: 1 }, { opacity: 0 }],
      { duration: 100, easing: 'linear', fill: 'forwards' },
    ],
  ],
  content: [
    [
      [{ opacity: 1 }, { opacity: 0 }],
      { duration: 100, easing: 'linear', fill: 'forwards' },
    ],
  ],
  actions: [
    [
      [{ opacity: 1 }, { opacity: 0 }],
      { duration: 100, easing: 'linear', fill: 'forwards' },
    ],
  ],
};
