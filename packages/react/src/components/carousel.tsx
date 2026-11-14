import { useRef, type CSSProperties, type ReactNode } from 'react';
import { Icon } from '@m3ui/icons';
import { IconButton } from './icon-button.js';
import { usePrefersReducedMotion } from '../lib/use-reduced-motion.js';
import { compVar, sysShape, elevationShadow } from '../lib/token-utils.js';

export type CarouselLayout = 'multi-browse' | 'uncontained' | 'hero' | 'full-screen';

export interface CarouselItem {
  key: string;
  content: ReactNode;
}

export interface CarouselProps {
  items: CarouselItem[];
  layout?: CarouselLayout;
  className?: string;
  'data-testid'?: string;
}

const LAYOUT_ITEM_WIDTH: Record<CarouselLayout, string> = {
  'multi-browse': '72%',
  uncontained: '85%',
  hero: '88%',
  'full-screen': '100%',
};

const LAYOUT_GAP: Record<CarouselLayout, string> = {
  'multi-browse': compVar('list', 'divider-leading-space'),
  uncontained: compVar('list', 'item-between-space'),
  hero: compVar('list', 'item-top-space'),
  'full-screen': '0px',
};

export function Carousel({
  items,
  layout = 'multi-browse',
  className,
  'data-testid': testId,
}: CarouselProps) {
  const scrollRef = useRef<HTMLDivElement>(null);
  const reducedMotion = usePrefersReducedMotion();
  const browse = (direction: number) => {
    const viewport = scrollRef.current;
    if (!viewport) return;
    const rtl = getComputedStyle(viewport).direction === 'rtl';
    viewport.scrollBy({
      left: direction * (rtl ? -1 : 1) * viewport.clientWidth * 0.85,
      behavior: reducedMotion ? 'instant' : 'smooth',
    });
  };
  const trackStyle: CSSProperties = {
    display: 'flex',
    gap: LAYOUT_GAP[layout],
    overflowX: 'auto',
    scrollSnapType: 'x mandatory',
    minWidth: 0,
    height: layout === 'full-screen' ? '100dvh' : undefined,
  };
  return (
    <section
      aria-label="Carousel"
      aria-roledescription="carousel"
      className={className}
      data-testid={testId}
      data-layout={layout}
      style={{ width: '100%', minWidth: 0 }}
    >
      <div ref={scrollRef} tabIndex={0} aria-label="Slides" style={trackStyle}>
        {items.map((item, index) => (
          <div
            key={item.key}
            role="group"
            aria-roledescription="slide"
            aria-label={`${index + 1} of ${items.length}`}
            style={{
              flex: `0 0 ${items.length === 1 ? '100%' : LAYOUT_ITEM_WIDTH[layout]}`,
              minWidth: 0,
              scrollSnapAlign: 'start',
              borderRadius: layout === 'full-screen' ? 0 : sysShape('corner-extra-large'),
              overflow: 'hidden',
              background: compVar('elevated-card', 'container-color'),
              boxShadow: layout === 'hero' ? elevationShadow('level2') : undefined,
            }}
          >
            {item.content}
          </div>
        ))}
      </div>
      {items.length > 1 && (
        <div style={{ display: 'flex', justifyContent: 'flex-end', gap: 8, marginTop: 8 }}>
          <IconButton
            aria-label="Previous slides"
            icon={<Icon name="arrow_back" />}
            onClick={() => browse(-1)}
          />
          <IconButton
            aria-label="Next slides"
            icon={<Icon name="arrow_forward" />}
            onClick={() => browse(1)}
          />
        </div>
      )}
    </section>
  );
}
