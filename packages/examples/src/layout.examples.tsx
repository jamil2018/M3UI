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
import { demoFrame } from './demo-chrome';
import type { ComponentExampleDefinition } from './types';

function ScaffoldExample() {
  return (
    <div style={{ ...demoFrame, height: 200 }}>
      <Scaffold
        topAppBar={<TopAppBar title="Inbox" size="small" />}
        fab={
          <FabAnchor>
            <Fab aria-label="Compose" icon={<Icon name="edit" />} size="standard" />
          </FabAnchor>
        }
      >
        <p style={{ padding: 16, margin: 0, color: 'var(--md-sys-color-on-surface)' }}>Content</p>
      </Scaffold>
    </div>
  );
}

function PaneScaffoldExample() {
  return (
    <PaneScaffoldRoot defaultSizeClass="expanded" style={{ ...demoFrame, minHeight: 200 }}>
      <PaneScaffold
        list={
          <List>
            <ListItem headline="Inbox" />
          </List>
        }
        detail={<p style={{ padding: 16, color: 'var(--md-sys-color-on-surface)' }}>Detail</p>}
      />
    </PaneScaffoldRoot>
  );
}

export const scaffoldExamples: ComponentExampleDefinition[] = [
  {
    id: 'scaffold-chrome',
    componentSlug: 'scaffold',
    title: 'App chrome',
    description: 'Top bar, FAB anchor, and content insets.',
    source: `<Scaffold topAppBar={...} fab={...}>{children}</Scaffold>`,
    Component: ScaffoldExample,
  },
];

export const paneScaffoldExamples: ComponentExampleDefinition[] = [
  {
    id: 'pane-list-detail',
    componentSlug: 'pane-scaffold',
    title: 'List-detail',
    source: `<PaneScaffold list={...} detail={...} />`,
    Component: PaneScaffoldExample,
  },
];
