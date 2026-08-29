import Link from 'next/link';
import { getComponentNavFromOrder } from '@/lib/component-nav';

export interface PageNavProps {
  slug: string;
}

export function PageNav({ slug }: PageNavProps) {
  const { prev, next } = getComponentNavFromOrder(slug);

  if (!prev && !next) {
    return null;
  }

  return (
    <nav className="doc-page-nav" aria-label="Component documentation">
      {prev ? (
        <Link href={prev.href} className="doc-page-nav-link doc-page-nav-prev">
          <span className="doc-page-nav-label">Previous</span>
          <span className="doc-page-nav-title">{prev.title}</span>
        </Link>
      ) : (
        <span />
      )}
      {next ? (
        <Link href={next.href} className="doc-page-nav-link doc-page-nav-next">
          <span className="doc-page-nav-label">Next</span>
          <span className="doc-page-nav-title">{next.title}</span>
        </Link>
      ) : null}
    </nav>
  );
}
