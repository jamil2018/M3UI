'use client';

import {
  Card,
  List,
  ListItem,
  Divider,
  Tabs,
  Dialog,
  DialogAction,
  BottomSheet,
  SideSheet,
  Carousel,
  Button,
  Surface,
} from '@m3ui/react';
import { caption, column, row } from '../shared';

const ELEVATION_LEVELS = ['level0', 'level1', 'level2', 'level3', 'level4', 'level5'] as const;

export function CardDemo() {
  return (
    <div style={column}>
      <div style={row}>
        <Card variant="elevated" style={{ padding: 16, minWidth: 140 }}>
          Elevated
        </Card>
        <Card variant="filled" style={{ padding: 16, minWidth: 140 }}>
          Filled
        </Card>
        <Card variant="outlined" style={{ padding: 16, minWidth: 140 }}>
          Outlined
        </Card>
      </div>
      <p style={caption}>Surface elevation levels (md-sys-elevation tokens)</p>
      <div style={{ ...row, alignItems: 'stretch' }}>
        {ELEVATION_LEVELS.map((level) => (
          <Surface key={level} elevation={level} style={{ padding: 12, minWidth: 72, textAlign: 'center' }}>
            {level}
          </Surface>
        ))}
      </div>
    </div>
  );
}

export function ListDemo() {
  return (
    <div style={{ maxWidth: 360 }}>
      <List>
        <ListItem headline="Inbox" supportingText="12 new messages" lines={2} divider />
        <ListItem headline="Drafts" supportingText="3 items" lines={2} />
        <ListItem headline="Sent" selected />
      </List>
    </div>
  );
}

export function DividerDemo() {
  return (
    <div style={{ ...column, maxWidth: 360 }}>
      <span>Above</span>
      <Divider />
      <span>Below</span>
      <Divider variant="inset" />
      <div style={{ display: 'flex', height: 48, alignItems: 'center', gap: 8 }}>
        <span>Left</span>
        <Divider vertical />
        <span>Right</span>
      </div>
    </div>
  );
}

export function TabsDemo() {
  return (
    <Tabs
      items={[
        { value: 'a', label: 'Photos', panel: <p style={{ padding: 16 }}>Your photo library.</p> },
        { value: 'b', label: 'Albums', panel: <p style={{ padding: 16 }}>Shared albums.</p> },
        { value: 'c', label: 'Explore', panel: <p style={{ padding: 16 }}>Discover new content.</p> },
      ]}
    />
  );
}

export function DialogDemo() {
  return (
    <Dialog
      trigger={<Button variant="outlined">Open dialog</Button>}
      headline="Delete photo?"
      body="This action cannot be undone."
      actions={
        <>
          <DialogAction>Cancel</DialogAction>
          <DialogAction>Delete</DialogAction>
        </>
      }
    />
  );
}

export function BottomSheetDemo() {
  return (
    <BottomSheet trigger={<Button variant="filled-tonal">Open sheet</Button>}>
      <p style={{ padding: 16 }}>Share to your contacts or copy a link.</p>
    </BottomSheet>
  );
}

export function SideSheetDemo() {
  return (
    <SideSheet trigger={<Button variant="text">Filters</Button>} headline="Filters">
      <p style={{ padding: 16 }}>Filter by date, album, or tag.</p>
    </SideSheet>
  );
}

export function CarouselDemo() {
  return (
    <Carousel
      items={[
        { key: '1', content: <Card variant="elevated" style={{ padding: 24 }}>Slide one</Card> },
        { key: '2', content: <Card variant="elevated" style={{ padding: 24 }}>Slide two</Card> },
        { key: '3', content: <Card variant="elevated" style={{ padding: 24 }}>Slide three</Card> },
      ]}
      layout="multi-browse"
    />
  );
}
