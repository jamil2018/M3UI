import Link from 'next/link';
import { getRelatedComponentLinks } from '@/lib/component-nav';
import { DocSection } from './doc-section';

export interface RelatedComponentsProps {
  slugs: string[];
}

export function RelatedComponents({ slugs }: RelatedComponentsProps) {
  if (slugs.length === 0) {
    return null;
  }

  const links = getRelatedComponentLinks(slugs);

  return (
    <DocSection id="related" title="Related components">
      <ul className="doc-related-list">
        {links.map((link) => (
          <li key={link.slug}>
            <Link href={link.href} className="doc-related-link">
              {link.title}
            </Link>
          </li>
        ))}
      </ul>
    </DocSection>
  );
}
