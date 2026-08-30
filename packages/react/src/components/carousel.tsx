
import { ScrollArea as BaseScrollArea } from '@base-ui/react/scroll-area';
import { motion, useScroll, useTransform } from 'motion/react';
import { useRef, type CSSProperties, type ReactNode } from 'react';
import { compVar, sysShape } from '../lib/token-utils.js';

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

export function Carousel({ items, layout = 'multi-browse', className, 'data-testid': testId }: CarouselProps) {
  const scrollRef = useRef<HTMLDivElement>(null);
  const { scrollXProgress } = useScroll({ container: scrollRef });

  const trackStyle: CSSProperties = {
    display: 'flex',
    gap: LAYOUT_GAP[layout],
    overflowX: 'auto',
    scrollSnapType: 'x mandatory',
    scrollBehavior: 'smooth',
    WebkitOverflowScrolling: 'touch',
    paddingInline: layout === 'uncontained' ? compVar('list', 'divider-leading-space') : 0,
    height: layout === 'full-screen' ? '100vh' : undefined,
  };

  return (
    <BaseScrollArea.Root className={className} data-testid={testId} data-layout={layout} style={{ width: '100%' }}>
      <BaseScrollArea.Viewport ref={scrollRef} style={trackStyle}>
        {items.map((item, index) => (
          <CarouselSlide key={item.key} item={item} layout={layout} index={index} count={items.length} scrollProgress={scrollXProgress} />
        ))}
      </BaseScrollArea.Viewport>
    </BaseScrollArea.Root>
  );
}

interface CarouselSlideProps {
  item: CarouselItem;
  layout: CarouselLayout;
  index: number;
  count: number;
  scrollProgress: ReturnType<typeof useScroll>['scrollXProgress'];
}

function CarouselSlide({ item, layout, index, count, scrollProgress }: CarouselSlideProps) {
  const itemCenter = count > 1 ? index / (count - 1) : 0;
  const scale = useTransform(scrollProgress, [Math.max(0, itemCenter - 0.2), itemCenter, Math.min(1, itemCenter + 0.2)], [0.92, 1, 0.92]);

  const slideStyle: CSSProperties = {
    flex: layout === 'full-screen' ? '0 0 100%' : `0 0 ${LAYOUT_ITEM_WIDTH[layout]}`,
    scrollSnapAlign: layout === 'uncontained' ? 'center' : 'start',
    borderRadius: layout === 'full-screen' ? 0 : sysShape('corner-large'),
    overflow: 'hidden',
    background: compVar('elevated-card', 'container-color'),
    boxShadow: layout === 'hero' ? `0 var(--md-sys-elevation-level2) calc(var(--md-sys-elevation-level2) * 2) color-mix(in srgb, var(--md-sys-color-shadow) calc(var(--md-sys-elevation-level2-shadow-opacity) * 100%), transparent)` : undefined,
  };

  return (
    <motion.div style={{ ...slideStyle, scale: layout !== 'full-screen' ? scale : 1 }}>
      {item.content}
    </motion.div>
  );
}
