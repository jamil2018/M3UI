import { Switch } from '@m3ui/react';
import type { ComponentExampleDefinition } from './types';

function SwitchStatesExample() {
  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
      <Switch label="Dark mode" defaultChecked />
      <Switch label="Wi-Fi only downloads" />
    </div>
  );
}

export const switchExamples: ComponentExampleDefinition[] = [
  {
    id: 'switch-states',
    componentSlug: 'switch',
    title: 'States',
    description: 'On, off, and labeled switch settings.',
    source: `<div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
  <Switch label="Dark mode" defaultChecked />
  <Switch label="Wi-Fi only downloads" />
</div>`,
    Component: SwitchStatesExample,
  },
];
