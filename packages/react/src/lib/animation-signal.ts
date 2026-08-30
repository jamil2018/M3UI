/**
 * Abortable animation task signal — ported from material-web internal/motion/animation.ts.
 */
export interface AnimationSignal {
  /** Starts a task; aborts any previous task. Returns an AbortSignal for the current task. */
  start(): AbortSignal;
  /** Marks the current task as finished. */
  finish(): void;
}

export function createAnimationSignal(): AnimationSignal {
  let animationAbortController: AbortController | null = null;

  return {
    start() {
      animationAbortController?.abort();
      animationAbortController = new AbortController();
      return animationAbortController.signal;
    },
    finish() {
      animationAbortController = null;
    },
  };
}
