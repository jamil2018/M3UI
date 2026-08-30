import { FoundationPage } from '@/components/foundation-page';

export default function AccessibilityPage() {
  return <FoundationPage title="Accessibility" description="Keyboard, screen-reader, contrast, motion, direction, and forced-color behavior are part of component conformance." sections={[
    { title: 'Interaction', body: <p>Visible focus, semantic controls, predictable keyboard order, and touch targets are required across every public component.</p> },
    { title: 'Display preferences', body: <p>Components support reduced motion, forced colors, increased contrast, zoom, and right-to-left direction.</p> },
    { title: 'Testing', body: <p>Automated accessibility checks complement keyboard and assistive-technology review. A passing scanner alone does not establish conformance.</p> },
  ]} />;
}
