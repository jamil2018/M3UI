import type { CSSProperties, HTMLAttributes } from 'react';

export interface IconProps extends HTMLAttributes<HTMLSpanElement> {
  /** Material Symbols icon name (snake_case) */
  name: string;
  /** Fill axis: 0 (outline) to 1 (filled) */
  fill?: 0 | 1;
  /** Weight axis: 100–700 */
  weight?: 100 | 200 | 300 | 400 | 500 | 600 | 700;
  /** Grade axis: -25 to 200 */
  grade?: -25 | 0 | 200;
  /** Optical size: 20–48 */
  opsz?: 20 | 24 | 40 | 48;
  /** Size in pixels */
  size?: number;
}

export function Icon({
  name,
  fill = 0,
  weight = 400,
  grade = 0,
  opsz = 24,
  size = 24,
  className,
  style,
  ...props
}: IconProps) {
  const iconStyle: CSSProperties = {
    fontFamily: 'Material Symbols Outlined',
    fontVariationSettings: `'FILL' ${fill}, 'wght' ${weight}, 'GRAD' ${grade}, 'opsz' ${opsz}`,
    fontSize: size,
    width: size,
    height: size,
    display: 'inline-flex',
    alignItems: 'center',
    justifyContent: 'center',
    lineHeight: 1,
    userSelect: 'none',
    ...style,
  };

  return (
    <span
      className={className}
      style={iconStyle}
      aria-hidden={props['aria-label'] ? undefined : true}
      {...props}
    >
      {name}
    </span>
  );
}

/** Load Material Symbols font — call once in app root */
export function loadMaterialSymbols(): void {
  if (typeof document === 'undefined') return;
  const id = 'm3ui-material-symbols';
  if (document.getElementById(id)) return;

  const link = document.createElement('link');
  link.id = id;
  link.rel = 'stylesheet';
  link.href =
    'https://fonts.googleapis.com/css2?family=Material+Symbols+Outlined:opsz,wght,FILL,GRAD@20..48,100..700,0..1,-50..200&display=swap';
  document.head.appendChild(link);
}
