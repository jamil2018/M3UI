import type { Metadata } from 'next';
import { notFound } from 'next/navigation';
import { DynamicComponentDoc } from '@/components/dynamic-component-doc';
import { PlaceholderButtonDocPage } from '@/content/placeholder-button-doc';
import { ShapesDocPage } from '@/content/shapes-doc';
import { getComponentContent } from '@/content/components';
import { getCatalogEntry, getRoutableCatalogSlugs } from '@/lib/catalog';
import { buildDocPageConfig } from '@/lib/content-config';

interface ComponentPageProps {
  params: Promise<{ slug: string }>;
}

export function generateStaticParams() {
  return getRoutableCatalogSlugs().map((slug) => ({ slug }));
}

export async function generateMetadata({ params }: ComponentPageProps): Promise<Metadata> {
  const { slug } = await params;
  const entry = getCatalogEntry(slug);
  if (!entry) {
    return { title: 'Component not found' };
  }
  return {
    title: entry.title,
    description: entry.description,
  };
}

export default async function ComponentPage({ params }: ComponentPageProps) {
  const { slug } = await params;
  const entry = getCatalogEntry(slug);

  if (!entry?.docs.route) {
    notFound();
  }

  if (slug === 'shapes') {
    return <ShapesDocPage />;
  }

  if (slug === 'placeholder-button') {
    return <PlaceholderButtonDocPage />;
  }

  const content = getComponentContent(slug);
  if (!content) {
    notFound();
  }

  const config = buildDocPageConfig(slug, content);
  return <DynamicComponentDoc slug={slug} config={config} />;
}
