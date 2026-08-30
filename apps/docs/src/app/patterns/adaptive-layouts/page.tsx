import { FoundationPage } from '@/components/foundation-page';

export default function AdaptiveLayoutsPage() {
  return <FoundationPage title="Adaptive layouts" description="Compose navigation and panes around available space instead of device labels." sections={[
    { title: 'Window size classes', body: <p>Compact, medium, expanded, large, and extra-large classes drive navigation and pane composition.</p> },
    { title: 'Stable state', body: <p>Changing layout mode must preserve selection, focus intent, reading order, and application state.</p> },
  ]} />;
}
