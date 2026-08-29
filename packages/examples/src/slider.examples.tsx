import { Slider } from '@m3ui/react';
import type { ComponentExampleDefinition } from './types';

function SliderVariantsExample() {
  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 24, maxWidth: 400 }}>
      <Slider defaultValue={50} label="Volume" showValueIndicator min={0} max={100} />
      <Slider defaultValue={[25, 75]} label="Range" showValueIndicator min={0} max={100} />
    </div>
  );
}

export const sliderExamples: ComponentExampleDefinition[] = [
  {
    id: 'slider-variants',
    componentSlug: 'slider',
    title: 'Single and range',
    description: 'Continuous slider with value indicator and dual-thumb range.',
    source: `<div style={{ display: 'flex', flexDirection: 'column', gap: 24, maxWidth: 400 }}>
  <Slider defaultValue={50} label="Volume" showValueIndicator min={0} max={100} />
  <Slider defaultValue={[25, 75]} label="Range" showValueIndicator min={0} max={100} />
</div>`,
    Component: SliderVariantsExample,
  },
];
