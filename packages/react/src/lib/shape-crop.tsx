import { type CSSProperties, type ReactNode } from 'react';
import { MaterialShapes, cubicsToClipPath, type MaterialShapeName } from '@m3ui/shapes';

export interface ShapeCropProps {
  children: ReactNode;
  shape?: MaterialShapeName;
  size?: number | string;
  className?: string;
  'data-testid'?: string;
}

/**
 * Crops child content (typically an image or avatar) to an Expressive Material shape.
 */
export function ShapeCrop({
  children,
  shape = 'circle',
  size = 48,
  className,
  'data-testid': testId,
}: ShapeCropProps) {
  const polygon = MaterialShapes[shape];
  const clipPath = cubicsToClipPath(polygon.cubics);

  const style: CSSProperties = {
    width: size,
    height: size,
    clipPath,
    overflow: 'hidden',
    display: 'inline-flex',
    alignItems: 'center',
    justifyContent: 'center',
  };

  return (
    <div className={className} data-testid={testId} style={style}>
      {children}
    </div>
  );
}

export { MaterialShapes, type MaterialShapeName };
