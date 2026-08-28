'use client';

import { Carousel } from '@m3ui/react';
import { componentPage } from '@/components/component-page';

const items = [
  { key: '1', content: <div style={{ padding: 48, textAlign: 'center' }}>Slide 1</div> },
  { key: '2', content: <div style={{ padding: 48, textAlign: 'center' }}>Slide 2</div> },
  { key: '3', content: <div style={{ padding: 48, textAlign: 'center' }}>Slide 3</div> },
];

export default componentPage('carousel', 'Carousel', <Carousel items={items} layout="hero" />);
