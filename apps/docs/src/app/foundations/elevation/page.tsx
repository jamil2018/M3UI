import { FoundationPage } from '@/components/foundation-page';

export default function ElevationPage() {
  return <FoundationPage title="Elevation" description="Surface hierarchy expressed with semantic levels, tint, and theme-aware shadow color." sections={[
    { title: 'Levels', body: <p>Use elevation only when one surface must appear above another. Levels zero through five are available through system tokens.</p> },
    { title: 'Color accuracy', body: <p>Shadows derive from the scheme shadow role. Surface tint remains available for components whose official tokens require it.</p> },
  ]} />;
}
