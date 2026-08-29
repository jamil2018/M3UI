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
import type { ComponentExampleDefinition } from './types';

function ScaffoldExample() {
  return (
    <div style={{ height: 200, overflow: 'hidden' }}>
      <Scaffold
        topAppBar={<TopAppBar title="Inbox" size="small" />}
        fab={<FabAnchor><Fab aria-label="Compose" icon="+" size="small" /></FabAnchor>}
      >
        <p style={{ padding: 16, margin: 0 }}>Content</p>
      </Scaffold>
    </div>
  );
}

function PaneScaffoldExample() {
  return (
    <PaneScaffoldRoot defaultSizeClass="expanded" style={{ minHeight: 200 }}>
      <PaneScaffold
        list={<List><ListItem headline="Inbox" /></List>}
        detail={<p style={{ padding: 16 }}>Detail</p>}
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
