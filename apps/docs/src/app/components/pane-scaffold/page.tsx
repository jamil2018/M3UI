'use client';

import { PaneScaffold, PaneScaffoldRoot, List, ListItem } from '@m3ui/react';
import { componentPage } from '@/components/component-page';

export default componentPage(
  'pane-scaffold',
  'Pane Scaffold',
  <PaneScaffoldRoot defaultSizeClass="expanded" style={{ minHeight: 320 }}>
    <PaneScaffold
      layout="list-detail"
      listTitle="Messages"
      detailTitle="Message"
      list={
        <List>
          <ListItem headline="Hello" supportingText="Preview text" />
          <ListItem headline="Meeting" supportingText="Tomorrow at 3pm" />
        </List>
      }
      detail={<p style={{ padding: 16 }}>Full message content appears here.</p>}
      data-testid="docs-pane-scaffold"
    />
  </PaneScaffoldRoot>,
);
