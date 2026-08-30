'use client';

import {
  Scaffold,
  TopAppBar,
  Fab,
  FabAnchor,
  PaneScaffold,
  PaneScaffoldRoot,
  List,
  ListItem,
  Icon,
} from '@m3ui/react';
import { frame } from '../shared';

export function ScaffoldDemo() {
  return (
    <div style={{ ...frame, height: 240 }}>
      <Scaffold
        topAppBar={<TopAppBar title="Inbox" size="small" />}
        fab={
          <FabAnchor>
            <Fab aria-label="Compose" icon={<Icon name="edit" />} size="standard" />
          </FabAnchor>
        }
      >
        <p style={{ padding: 16, margin: 0, color: 'var(--md-sys-color-on-surface)' }}>
          Main content area with inset-aware padding.
        </p>
      </Scaffold>
    </div>
  );
}

export function PaneScaffoldDemo() {
  return (
    <PaneScaffoldRoot defaultSizeClass="expanded" style={{ ...frame, minHeight: 240 }}>
      <PaneScaffold
        list={
          <List>
            <ListItem headline="Inbox" supportingText="New message" lines={2} selected />
            <ListItem headline="Drafts" lines={1} />
          </List>
        }
        detail={<p style={{ padding: 16, color: 'var(--md-sys-color-on-surface)' }}>Message detail pane with reply actions.</p>}
      />
    </PaneScaffoldRoot>
  );
}
