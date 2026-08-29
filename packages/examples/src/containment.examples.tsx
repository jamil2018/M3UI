import {
  List,
  ListItem,
  Divider,
  Carousel,
  Card,
  BottomSheet,
  SideSheet,
  Button,
} from '@m3ui/react';
import type { ComponentExampleDefinition } from './types';

function ListExample() {
  return (
    <List>
      <ListItem headline="Inbox" supportingText="12 new" lines={2} divider />
      <ListItem headline="Sent" selected />
    </List>
  );
}

function DividerExample() {
  return (
    <div style={{ maxWidth: 320 }}>
      <Divider />
      <Divider variant="inset" />
    </div>
  );
}

function CarouselExample() {
  return (
    <Carousel
      items={[
        { key: '1', content: <Card variant="elevated" style={{ padding: 24 }}>One</Card> },
        { key: '2', content: <Card variant="elevated" style={{ padding: 24 }}>Two</Card> },
      ]}
      layout="multi-browse"
    />
  );
}

function BottomSheetExample() {
  return (
    <BottomSheet trigger={<Button variant="filled-tonal">Share</Button>}>
      <p style={{ padding: 16 }}>Share options</p>
    </BottomSheet>
  );
}

function SideSheetExample() {
  return (
    <SideSheet trigger={<Button variant="text">Filters</Button>} headline="Filters">
      <p style={{ padding: 16 }}>Filter content</p>
    </SideSheet>
  );
}

export const listExamples: ComponentExampleDefinition[] = [
  {
    id: 'list-items',
    componentSlug: 'list',
    title: 'List items',
    description: 'One- and two-line items with selection.',
    source: `<List>\n  <ListItem headline="Inbox" lines={2} />\n</List>`,
    Component: ListExample,
  },
];

export const dividerExamples: ComponentExampleDefinition[] = [
  {
    id: 'divider-variants',
    componentSlug: 'divider',
    title: 'Full-width and inset',
    source: `<Divider />\n<Divider variant="inset" />`,
    Component: DividerExample,
  },
];

export const carouselExamples: ComponentExampleDefinition[] = [
  {
    id: 'carousel-multi',
    componentSlug: 'carousel',
    title: 'Multi-browse',
    description: 'Horizontal carousel with adjacent item peek.',
    source: `<Carousel layout="multi-browse" items={items} />`,
    Component: CarouselExample,
  },
];

export const bottomSheetExamples: ComponentExampleDefinition[] = [
  {
    id: 'bottom-sheet-basic',
    componentSlug: 'bottom-sheet',
    title: 'Modal sheet',
    source: `<BottomSheet trigger={<Button>Open</Button>}>Content</BottomSheet>`,
    Component: BottomSheetExample,
  },
];

export const sideSheetExamples: ComponentExampleDefinition[] = [
  {
    id: 'side-sheet-basic',
    componentSlug: 'side-sheet',
    title: 'Side panel',
    source: `<SideSheet trigger={<Button>Filters</Button>} headline="Filters" />`,
    Component: SideSheetExample,
  },
];
