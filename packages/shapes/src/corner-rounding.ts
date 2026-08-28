export interface CornerRounding {
  radius: number;
  smoothing?: number;
}

export const CornerUnrounded: CornerRounding = { radius: 0, smoothing: 0 };

export function cornerRounding(radius: number, smoothing = 0): CornerRounding {
  return { radius, smoothing };
}
