import { useState } from 'react';
import type { Meta, StoryObj } from '@storybook/react';
import { LinearProgress, CircularProgress, Meter } from '@m3ui/react';

const meta = {
  title: 'Foundations/Progress geometry',
  parameters: { layout: 'padded' },
} satisfies Meta;
export default meta;
type Story = StoryObj<typeof meta>;

function GeometryFixture() {
  const [value, setValue] = useState(50);
  const [width, setWidth] = useState(320);
  return (
    <div style={{ display: 'grid', gap: 24 }}>
      <label>Value {value}% <input aria-label="Progress value" type="range" min={0} max={100} value={value} onChange={(event) => setValue(Number(event.target.value))} /></label>
      <label>Width {width}px <input aria-label="Track width" type="range" min={80} max={600} value={width} onChange={(event) => setWidth(Number(event.target.value))} /></label>
      <div style={{ width, maxWidth: '100%', display: 'grid', gap: 24 }}>
        <LinearProgress value={value} data-testid="flat-progress" />
        <LinearProgress value={value} variant="wavy" data-testid="wavy-progress" />
        <Meter value={value} label="Meter" data-testid="meter" />
        <LinearProgress value={100} />
        <LinearProgress />
        <LinearProgress variant="wavy" />
      </div>
      <div style={{ display: 'flex', alignItems: 'center', gap: 24 }}>
        <CircularProgress value={value} data-testid="flat-circle" />
        <CircularProgress value={value} variant="wavy" />
        <CircularProgress size={24} data-testid="small-indeterminate-circle" />
        <CircularProgress size={80} data-testid="large-indeterminate-circle" />
      </div>
    </div>
  );
}

export const Geometry: Story = { render: () => <GeometryFixture /> };
