import { Card } from '@m3ui/react';
import type { ComponentExampleDefinition } from './types';

function CardVariantsExample() {
  return (
    <div style={{ display: 'flex', gap: 16, flexWrap: 'wrap' }}>
      <Card variant="elevated" style={{ padding: 16 }}>
        Elevated
      </Card>
      <Card variant="filled" style={{ padding: 16 }}>
        Filled
      </Card>
      <Card variant="outlined" style={{ padding: 16 }}>
        Outlined
      </Card>
    </div>
  );
}

export const cardExamples: ComponentExampleDefinition[] = [
  {
    id: 'card-variants',
    componentSlug: 'card',
    title: 'Variants',
    description: 'Elevated, filled, and outlined card surfaces.',
    source: `<div style={{ display: 'flex', gap: 16, flexWrap: 'wrap' }}>
  <Card variant="elevated" style={{ padding: 16 }}>Elevated</Card>
  <Card variant="filled" style={{ padding: 16 }}>Filled</Card>
  <Card variant="outlined" style={{ padding: 16 }}>Outlined</Card>
</div>`,
    Component: CardVariantsExample,
  },
];
