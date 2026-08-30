import { FoundationPage } from '@/components/foundation-page';

export default function TypographyPage() {
  return <FoundationPage title="Typography" description="A readable Material type scale with emphasized weights for expressive hierarchy." sections={[
    { title: 'Scale', body: <p>Display, headline, title, body, and label roles carry size, line height, tracking, and weight together. Components consume a role rather than assembling font values.</p> },
    { title: 'Emphasis', body: <p>Emphasized weights add hierarchy without changing type families or reducing readability.</p> },
    { title: 'Content guidance', body: <p>Use display roles sparingly. Documentation prose uses body roles and a constrained reading width.</p> },
  ]} />;
}
