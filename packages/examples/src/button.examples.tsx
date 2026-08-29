import { Button } from '@m3ui/react';
import type { ComponentExampleDefinition } from './types';

function ButtonVariantsExample() {
  return (
    <div style={{ display: 'flex', flexWrap: 'wrap', gap: 12 }}>
      <Button variant="filled">Filled</Button>
      <Button variant="elevated">Elevated</Button>
      <Button variant="filled-tonal">Tonal</Button>
      <Button variant="outlined">Outlined</Button>
      <Button variant="text">Text</Button>
    </div>
  );
}

function ButtonSizesExample() {
  return (
    <div style={{ display: 'flex', flexWrap: 'wrap', gap: 8 }}>
      {(['xs', 'sm', 'md', 'lg', 'xl'] as const).map((size) => (
        <Button key={size} size={size}>{size}</Button>
      ))}
    </div>
  );
}

export const buttonExamples: ComponentExampleDefinition[] = [
  {
    id: 'button-variants',
    componentSlug: 'button',
    title: 'Variants',
    description: 'Filled, elevated, tonal, outlined, and text button styles.',
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
];
