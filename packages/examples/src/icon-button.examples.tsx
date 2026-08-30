import { Icon, IconButton } from '@m3ui/react';
import { demoCaption, demoColumn, demoRow } from './demo-chrome';
import type { ComponentExampleDefinition } from './types';

const SIZES = ['xs', 'sm', 'md', 'lg', 'xl'] as const;

function IconButtonVariantsExample() {
  return (
    <div style={demoColumn}>
      <p style={demoCaption}>Hover, focus, or press to preview state layers.</p>
      <div style={demoRow}>
        <IconButton aria-label="Standard" icon={<Icon name="favorite" />} variant="standard" />
        <IconButton aria-label="Filled" icon={<Icon name="favorite" fill={1} />} variant="filled" />
        <IconButton aria-label="Tonal" icon={<Icon name="favorite" />} variant="filled-tonal" />
        <IconButton
          aria-label="Outlined toggle"
          icon={<Icon name="favorite" fill={1} />}
          variant="outlined"
          toggle
          selected
        />
      </div>
    </div>
  );
}

function IconButtonSizesExample() {
  return (
    <div style={demoColumn}>
      <p style={demoCaption}>Expressive icon-button size scale (xs–xl).</p>
      <div style={demoRow}>
        {SIZES.map((size) => (
          <IconButton
            key={size}
            aria-label={`Favorite ${size}`}
            icon={<Icon name="favorite" />}
            variant="filled-tonal"
            size={size}
          />
        ))}
      </div>
    </div>
  );
}

export const iconButtonExamples: ComponentExampleDefinition[] = [
  {
    id: 'icon-button-variants',
    componentSlug: 'icon-button',
    title: 'Variants',
    description: 'Standard, filled, tonal, and outlined icon buttons with state layers.',
    source: `<div style={{ display: 'flex', gap: 12 }}>
  <IconButton aria-label="Standard" icon={<Icon name="favorite" />} variant="standard" />
  <IconButton aria-label="Filled" icon={<Icon name="favorite" fill={1} />} variant="filled" />
  <IconButton aria-label="Tonal" icon={<Icon name="favorite" />} variant="filled-tonal" />
  <IconButton aria-label="Outlined" icon={<Icon name="favorite" />} variant="outlined" toggle selected />
</div>`,
    Component: IconButtonVariantsExample,
  },
  {
    id: 'icon-button-sizes',
    componentSlug: 'icon-button',
    title: 'Sizes',
    description: 'Expressive size scale from xs through xl.',
    source: `<IconButton aria-label="Favorite xs" icon={<Icon name="favorite" />} size="xs" />
<IconButton aria-label="Favorite sm" icon={<Icon name="favorite" />} size="sm" />
<IconButton aria-label="Favorite md" icon={<Icon name="favorite" />} size="md" />
<IconButton aria-label="Favorite lg" icon={<Icon name="favorite" />} size="lg" />
<IconButton aria-label="Favorite xl" icon={<Icon name="favorite" />} size="xl" />`,
    Component: IconButtonSizesExample,
  },
];
