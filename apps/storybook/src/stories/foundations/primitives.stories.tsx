/* eslint-disable -- manual foundations story for VRT prep; updates when primitives land */
import type { Meta, StoryObj } from '@storybook/react';
import { within } from '@storybook/test';
import { Button, Surface } from '@m3ui/react';

const meta = {
  title: 'Foundations/Primitives',
  tags: ['foundations', 'parity-tier-A', 'vrt-prep'],
  parameters: {
    docs: {
      description: {
        component:
          'Ripple, focus ring, and elevation primitive states for visual regression after Phase 2 lands.',
      },
    },
  },
} satisfies Meta;

export default meta;

type Story = StoryObj<typeof meta>;

export const RippleStates: Story = {
  name: 'Ripple (press states)',
  render: () => (
    <div className="demo-row" data-testid="primitive-ripple">
      <Button variant="filled">Rest</Button>
      <Button variant="filled" disabled>
        Disabled
      </Button>
    </div>
  ),
};

export const FocusRingStates: Story = {
  name: 'Focus ring (:focus-visible)',
  render: () => (
    <div className="demo-row" data-testid="primitive-focus">
      <Button variant="outlined">Focused</Button>
      <Button variant="text">Tab to focus</Button>
    </div>
  ),
  play: async ({ canvasElement }) => {
    within(canvasElement).getByRole('button', { name: 'Focused' }).focus();
  },
};

export const ElevationLevels: Story = {
  name: 'Elevation (surface levels)',
  render: () => (
    <div className="demo-row" data-testid="primitive-elevation" style={{ gap: '1rem' }}>
      {(['level0', 'level1', 'level2', 'level3', 'level4', 'level5'] as const).map((level) => (
        <Surface key={level} elevation={level} style={{ padding: '1.5rem', minWidth: '6rem' }}>
          {level}
        </Surface>
      ))}
    </div>
  ),
};

export const ReducedMotion: Story = {
  globals: { reducedMotion: true },
  render: () => (
    <div data-testid="primitive-reduced-motion">
      <Button variant="filled">Reduced motion ripple</Button>
    </div>
  ),
};
