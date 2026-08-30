import { FoundationPage } from '@/components/foundation-page';

export default function MotionPage() {
  return <FoundationPage title="Motion" description="Semantic Expressive transitions that communicate hierarchy, selection, and spatial change." sections={[
    { title: 'Semantic presets', body: <p>Enter, exit, emphasized, selection, press, and container-transform presets map intent to the appropriate spatial and effects springs.</p> },
    { title: 'Web adaptation', body: <p>Android spring behavior is translated to Motion spring parameters and CSS easing fallbacks suitable for browsers.</p> },
    { title: 'Reduced motion', body: <p>Every transition has a stable reduced-motion outcome. Content and focus never depend on animation.</p> },
  ]} />;
}
