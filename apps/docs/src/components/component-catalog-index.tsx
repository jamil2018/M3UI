'use client';

import Link from 'next/link';
import { useMemo, useState } from 'react';
import type { CatalogCategory, ComponentCatalogEntry } from '@/lib/catalog';
import { CATEGORY_LABELS, CATALOG_CATEGORIES } from '@/lib/catalog';

interface ComponentCatalogIndexProps {
  entries: ComponentCatalogEntry[];
}

function matchesQuery(entry: ComponentCatalogEntry, query: string): boolean {
  const normalized = query.trim().toLowerCase();
  if (!normalized) return true;
  return (
    entry.slug.includes(normalized) ||
    entry.title.toLowerCase().includes(normalized) ||
    entry.description.toLowerCase().includes(normalized) ||
    entry.exports.some((name) => name.toLowerCase().includes(normalized))
  );
}

export function ComponentCatalogIndex({ entries }: ComponentCatalogIndexProps) {
  const [query, setQuery] = useState('');
  const [categoryFilter, setCategoryFilter] = useState<'all' | CatalogCategory>('all');

  const filtered = useMemo(
    () => entries.filter((entry) =>
      matchesQuery(entry, query) && (categoryFilter === 'all' || entry.category === categoryFilter)),
    [entries, query, categoryFilter],
  );

  const grouped = useMemo(() => {
    const map = new Map<CatalogCategory, ComponentCatalogEntry[]>();
    for (const category of CATALOG_CATEGORIES) {
      map.set(category, []);
    }
    for (const entry of filtered) {
      map.get(entry.category)?.push(entry);
    }
    for (const [category, items] of map) {
      map.set(
        category,
        items.sort((a, b) => a.title.localeCompare(b.title)),
      );
    }
    return map;
  }, [filtered]);

  return (
    <div>
      <div className="docs-catalog-toolbar" role="search">
        <label className="docs-catalog-search">
          <span className="docs-catalog-search-label">Find a component</span>
          <input
            type="search"
            value={query}
            onChange={(event) => setQuery(event.target.value)}
            placeholder="Search name, capability, or export"
            aria-label="Search components"
            className="docs-catalog-search-input"
          />
        </label>
        <label className="docs-catalog-filter">
          <span className="docs-catalog-search-label">Category</span>
          <select
            value={categoryFilter}
            onChange={(event) => setCategoryFilter(event.target.value as 'all' | CatalogCategory)}
          >
            <option value="all">All components</option>
            {CATALOG_CATEGORIES.filter((category) => category !== 'foundations').map((category) => (
              <option key={category} value={category}>{CATEGORY_LABELS[category]}</option>
            ))}
          </select>
        </label>
        <p className="docs-catalog-count" aria-live="polite">{filtered.length} results</p>
      </div>

      {filtered.length === 0 ? (
        <p className="docs-catalog-empty">No components match your search.</p>
      ) : (
        CATALOG_CATEGORIES.map((category) => {
          const items = grouped.get(category) ?? [];
          if (items.length === 0) return null;
          return (
            <section key={category} className="docs-catalog-category">
              <h2 className="docs-catalog-category-title">{CATEGORY_LABELS[category]}</h2>
              <div className="docs-catalog-grid">
                {items.map((entry) => (
                  <CatalogCard key={entry.slug} entry={entry} />
                ))}
              </div>
            </section>
          );
        })
      )}
    </div>
  );
}

function CatalogCard({ entry }: { entry: ComponentCatalogEntry }) {
  return (
    <Link href={`/components/${entry.slug}`} className="docs-catalog-card">
      <span className="docs-catalog-card-mark" aria-hidden>{entry.title.slice(0, 1)}</span>
      <div className="docs-catalog-card-header">
        <strong className="docs-catalog-card-title">{entry.title}</strong>
        <span className="docs-catalog-card-badge" data-status={entry.conformance.status}>
          {entry.conformance.status === 'adapted' ? 'Expressive web adaptation' : entry.conformance.status}
        </span>
      </div>
      <p className="docs-catalog-card-description">{entry.description}</p>
      <span className="docs-catalog-card-meta">
        {entry.conformance.states.length} states · {entry.conformance.sources.length} sources
      </span>
    </Link>
  );
}
