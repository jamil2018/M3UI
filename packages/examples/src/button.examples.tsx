import { Button, Icon } from '@m3ui/react';
import { demoCaption, demoColumn, demoRow } from './demo-chrome';
import type { ComponentExampleDefinition } from './types';

const VARIANTS = ['filled', 'elevated', 'filled-tonal', 'outlined', 'text'] as const;
const SIZES = ['xs', 'sm', 'md', 'lg', 'xl'] as const;

function ButtonVariantsExample() {
  return (
    <div style={demoColumn}>
      <p style={demoCaption}>Hover, focus, or press to preview state layers and ripple.</p>
      <div style={demoRow}>
        {VARIANTS.map((variant) => (
          <Button key={variant} variant={variant} size="md">
            {variant}
          </Button>
        ))}
      </div>
    </div>
  );
}

function ButtonSizesExample() {
  return (
    <div style={demoColumn}>
      <p style={demoCaption}>Expressive size scale (xs–xl) mapped to md-comp button tokens.</p>
      <div style={demoRow}>
        {SIZES.map((size) => (
          <Button key={size} size={size}>
            {size}
          </Button>
        ))}
      </div>
    </div>
  );
}

function ButtonStatesExample() {
  return (
    <div style={demoColumn}>
      <p style={demoCaption}>Disabled buttons use container and label tokens with reduced opacity.</p>
      <div style={demoRow}>
        {VARIANTS.map((variant) => (
          <Button key={variant} variant={variant} disabled>
            {variant}
          </Button>
        ))}
      </div>
    </div>
  );
}

function ButtonIconsExample() {
  return (
    <div style={demoRow}>
      <Button startIcon={<Icon name="add" />}>Create</Button>
      <Button variant="outlined" endIcon={<Icon name="open_in_new" />}>
        Open
      </Button>
      <Button variant="filled-tonal" size="lg" startIcon={<Icon name="download" />}>
        Download
      </Button>
    </div>
  );
}

export const buttonExamples: ComponentExampleDefinition[] = [
  {
    id: 'button-variants',
    componentSlug: 'button',
    title: 'Variants',
    description: 'Filled, elevated, tonal, outlined, and text styles with interactive state layers.',
    source: `<div style={{ display: 'flex', flexWrap: 'wrap', gap: 12 }}>
  <Button variant="filled">Filled</Button>
  <Button variant="elevated">Elevated</Button>
  <Button variant="filled-tonal">Tonal</Button>
  <Button variant="outlined">Outlined</Button>
  <Button variant="text">Text</Button>
</div>`,
    Component: ButtonVariantsExample,
  },
  {
    id: 'button-sizes',
    componentSlug: 'button',
    title: 'Sizes',
    description: 'Expressive size scale from xs through xl.',
    source: `<div style={{ display: 'flex', flexWrap: 'wrap', gap: 8 }}>
  <Button size="xs">xs</Button>
  <Button size="sm">sm</Button>
  <Button size="md">md</Button>
  <Button size="lg">lg</Button>
  <Button size="xl">xl</Button>
</div>`,
    Component: ButtonSizesExample,
  },
  {
    id: 'button-states',
    componentSlug: 'button',
    title: 'Disabled',
    description: 'Disabled state across all variants using semantic disabled tokens.',
    source: `<Button variant="filled" disabled>Filled</Button>
<Button variant="elevated" disabled>Elevated</Button>
<Button variant="outlined" disabled>Outlined</Button>`,
    Component: ButtonStatesExample,
  },
  {
    id: 'button-icons',
    componentSlug: 'button',
    title: 'With icons',
    description: 'Leading and trailing icons at expressive sizes.',
    source: `<Button startIcon={<Icon name="add" />}>Create</Button>
<Button variant="outlined" endIcon={<Icon name="open_in_new" />}>Open</Button>`,
    Component: ButtonIconsExample,
  },
];
