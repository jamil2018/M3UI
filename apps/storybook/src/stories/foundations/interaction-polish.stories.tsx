import type { Meta, StoryObj } from '@storybook/react';
import {
  M3Provider,
  Button,
  IconButton,
  StateLayer,
  Tabs,
  LoadingIndicator,
  Switch,
  ButtonGroup,
  ButtonGroupItem,
  BottomSheet,
  SideSheet,
} from '@m3ui/react';

const meta = {
  title: 'Foundations/Interaction polish',
  parameters: { layout: 'padded' },
} satisfies Meta;
export default meta;
type Story = StoryObj<typeof meta>;

export const States: Story = {
  render: () => (
    <div style={{ display: 'flex', flexWrap: 'wrap', alignItems: 'center', gap: 24 }}>
      <StateLayer data-testid="state-layer" color="var(--md-sys-color-primary)">
        <button type="button" style={{ padding: 16 }}>
          State layer
        </button>
      </StateLayer>
      <Button data-testid="pressable">Pressable</Button>
      <IconButton toggle aria-label="Favorite" icon="★" variant="filled-tonal" />
      {(['narrow', 'default', 'wide'] as const).map((width) => (
        <IconButton key={width} aria-label={width} icon="+" width={width} variant="outlined" />
      ))}
      <StateLayer disabled data-testid="disabled-layer">
        <button type="button" disabled>
          Disabled
        </button>
      </StateLayer>
      <div style={{ zoom: 2 }} data-testid="zoomed">
        <Button>Zoomed ripple</Button>
      </div>
    </div>
  ),
};

export const Motion: Story = {
  render: () => (
    <div style={{ display: 'grid', gap: 32, maxWidth: 640 }}>
      <Tabs
        data-testid="motion-tabs"
        items={[
          { value: 'music', label: 'Music', panel: 'Your music' },
          { value: 'podcasts', label: 'Podcasts', panel: 'Your podcasts' },
          { value: 'audiobooks', label: 'Audiobooks', panel: 'Your audiobooks' },
        ]}
      />
      <div style={{ display: 'flex', gap: 32, alignItems: 'center' }}>
        <LoadingIndicator data-testid="motion-loader" />
        <IconButton toggle expressiveMorph aria-label="Morph shape" icon="★" variant="filled" />
        <Switch label="Notifications" />
      </div>
      <ButtonGroup data-testid="motion-group" variant="connected">
        <ButtonGroupItem>First</ButtonGroupItem>
        <ButtonGroupItem>Middle</ButtonGroupItem>
        <ButtonGroupItem>Last</ButtonGroupItem>
      </ButtonGroup>
      <BottomSheet trigger={<button>Open bottom sheet</button>} data-testid="motion-bottom-sheet">
        <h2>Queue</h2>
        <p>Music you have added to play next.</p>
      </BottomSheet>
      <SideSheet
        trigger={<button>Open side sheet</button>}
        headline="Details"
        data-testid="motion-side-sheet"
      >
        <p>Track details and listening history.</p>
      </SideSheet>
    </div>
  ),
};

export const Theming: Story = {
  render: () => (
    <div style={{ display: 'flex', gap: 24 }}>
      <M3Provider seed="#6750A4" scheme="dark">
        <Button>Dark purple</Button>
      </M3Provider>
      <M3Provider seed="#006A6A" scheme="light">
        <Button>Light teal</Button>
      </M3Provider>
    </div>
  ),
};
