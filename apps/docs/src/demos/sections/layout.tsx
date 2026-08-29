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
} from '@m3ui/react';

export function ScaffoldDemo() {
  return (
    <div style={{ height: 240, border: '1px solid var(--md-sys-color-outline-variant)', borderRadius: 12, overflow: 'hidden' }}>
      <Scaffold topAppBar={<TopAppBar title="Inbox" size="small" />} fab={<FabAnchor><Fab aria-label="Compose" icon="+" size="small" /></FabAnchor>}>
        <p style={{ padding: 16, margin: 0 }}>Main content area with inset-aware padding.</p>
      </Scaffold>
    </div>
  );
}

export function PaneScaffoldDemo() {
  return (
    <PaneScaffoldRoot defaultSizeClass="expanded" style={{ minHeight: 240, border: '1px solid var(--md-sys-color-outline-variant)', borderRadius: 12 }}>
      <PaneScaffold
        list={
          <List>
            <ListItem headline="Inbox" supportingText="New message" lines={2} selected />
            <ListItem headline="Drafts" lines={1} />
          </List>
        }
        detail={<p style={{ padding: 16 }}>Message detail pane with reply actions.</p>}
      />
    </PaneScaffoldRoot>
  );
}
