import type { ComponentContentConfig } from '@/components/doc/types';

const buttonPreviewCode = `import { Button } from '@m3ui/react';

export function ButtonVariants() {
  return (
    <div style={{ display: 'flex', flexWrap: 'wrap', gap: 12 }}>
      <Button variant="filled">Filled</Button>
      <Button variant="elevated">Elevated</Button>
      <Button variant="filled-tonal">Tonal</Button>
      <Button variant="outlined">Outlined</Button>
      <Button variant="text">Text</Button>
    </div>
  );
}`;

const buttonUsageCode = `import { Button, M3Provider } from '@m3ui/react';

export function App() {
  return (
    <M3Provider seed="#6750A4">
      <Button variant="filled" onClick={() => alert('Pressed')}>
        Continue
      </Button>
    </M3Provider>
  );
}`;

/** Serializable button docs content â€” consumed by the reference page and content agent */
export const buttonContent: ComponentContentConfig = {
  slug: 'button',
  title: 'Button',
  description:
    'M3 Expressive button with press shape morph, five variants, and token-driven sizing.',
  previewCode: buttonPreviewCode,
  usage: {
    code: buttonUsageCode,
    description: 'Wrap your app in M3Provider, then render Button with a variant.',
  },
  examples: [
    {
      id: 'sizes',
      title: 'Sizes',
      description: 'Five density sizes from xs through xl.',
      code: `<Button size="sm">Small</Button>
<Button size="md">Medium</Button>
<Button size="lg">Large</Button>`,
    },
    {
      id: 'disabled',
      title: 'Disabled',
      description: 'Disabled buttons use M3 disabled content opacity.',
      code: `<Button disabled>Unavailable</Button>`,
    },
  ],
  props: [
    {
      name: 'variant',
      type: "'elevated' | 'filled' | 'filled-tonal' | 'outlined' | 'text'",
      default: "'filled'",
      description: 'Visual style variant.',
    },
    {
      name: 'size',
      type: "'xs' | 'sm' | 'md' | 'lg' | 'xl'",
      default: "'md'",
      description: 'Height, padding, and icon sizing tokens.',
    },
    {
      name: 'shape',
      type: "'round' | 'square'",
      default: "'round'",
      description: 'Corner shape; press morph uses expressive Material shapes.',
    },
  ],
  accessibility: {
    summary: 'Button renders a native button via Base UI with an accessible name from children.',
    items: [
      'Renders a semantic `<button>` element through Base UI',
      'Disabled state exposed to assistive technology',
      'Visible label should be present; use IconButton for icon-only actions',
      'Focus ring follows system focus-visible behavior',
    ],
    metadata: {
      Role: 'button',
      Keyboard: 'Enter and Space activate when focused',
    },
  },
  related: ['icon-button', 'button-group', 'split-button', 'fab'],
};

export type { ComponentContentConfig };

