import { Card, Surface } from '@m3ui/react';
import { demoCaption, demoColumn, demoRow } from './demo-chrome';
import type { ComponentExampleDefinition } from './types';

const ELEVATION_LEVELS = ['level0', 'level1', 'level2', 'level3', 'level4', 'level5'] as const;

function CardVariantsExample() {
  return (
    <div style={demoRow}>
      <Card variant="elevated" style={{ padding: 16, minWidth: 120 }}>
        Elevated
      </Card>
      <Card variant="filled" style={{ padding: 16, minWidth: 120 }}>
        Filled
      </Card>
      <Card variant="outlined" style={{ padding: 16, minWidth: 120 }}>
        Outlined
      </Card>
    </div>
  );
}

function CardElevationExample() {
  return (
    <div style={demoColumn}>
      <p style={demoCaption}>Surface elevation levels use md-sys-elevation shadow tokens and surface tint.</p>
      <div style={{ ...demoRow, alignItems: 'stretch' }}>
        {ELEVATION_LEVELS.map((level) => (
          <Surface key={level} elevation={level} style={{ padding: 16, minWidth: 88, textAlign: 'center' }}>
            {level}
          </Surface>
        ))}
      </div>
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
  {
    id: 'card-elevation',
    componentSlug: 'card',
    title: 'Elevation levels',
    description: 'Semantic elevation from level0 through level5 on Surface.',
    source: `<Surface elevation="level1" style={{ padding: 16 }}>level1</Surface>
<Surface elevation="level2" style={{ padding: 16 }}>level2</Surface>
<Surface elevation="level3" style={{ padding: 16 }}>level3</Surface>`,
    Component: CardElevationExample,
  },
];
