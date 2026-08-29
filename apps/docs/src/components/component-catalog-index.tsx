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

  const filtered = useMemo(
    () => entries.filter((entry) => matchesQuery(entry, query)),
    [entries, query],
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
      <label className="docs-catalog-search">
        <span className="docs-catalog-search-label">Search components</span>
        <input
          type="search"
          value={query}
          onChange={(event) => setQuery(event.target.value)}
          placeholder="Search by name, slug, or export…"
          aria-label="Search components"
          className="docs-catalog-search-input"
        />
      </label>

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
      <div className="docs-catalog-card-header">
        <strong className="docs-catalog-card-title">{entry.title}</strong>
        {entry.status !== 'stable' ? (
          <span className="docs-catalog-card-badge">{entry.status}</span>
        ) : null}
      </div>
      <p className="docs-catalog-card-description">{entry.description}</p>
    </Link>
  );
}
