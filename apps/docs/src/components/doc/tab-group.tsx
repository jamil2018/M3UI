'use client';

import { useId, useRef, useState, type KeyboardEvent, type ReactNode } from 'react';

export interface TabItem {
  id: string;
  label: string;
  content: ReactNode;
}

export interface TabGroupProps {
  items: TabItem[];
  defaultTabId?: string;
  /** Prefix for aria-labelledby wiring */
  label?: string;
}

export function TabGroup({ items, defaultTabId, label = 'Tabs' }: TabGroupProps) {
  const baseId = useId();
  const [activeId, setActiveId] = useState(defaultTabId ?? items[0]?.id ?? '');
  const tabRefs = useRef<Array<HTMLButtonElement | null>>([]);

  if (items.length === 0) {
    return null;
  }

  return (
    <div className="doc-tabs">
      <div className="doc-tabs-list" role="tablist" aria-label={label}>
        {items.map((item, index) => {
          const selected = item.id === activeId;
          const selectAt = (nextIndex: number) => {
            const normalized = (nextIndex + items.length) % items.length;
            const nextItem = items[normalized];
            if (!nextItem) return;
            setActiveId(nextItem.id);
            tabRefs.current[normalized]?.focus();
          };
          const handleKeyDown = (event: KeyboardEvent<HTMLButtonElement>) => {
            if (event.key === 'ArrowRight') selectAt(index + 1);
            else if (event.key === 'ArrowLeft') selectAt(index - 1);
            else if (event.key === 'Home') selectAt(0);
            else if (event.key === 'End') selectAt(items.length - 1);
            else return;
            event.preventDefault();
          };
          return (
            <button
              ref={(node) => { tabRefs.current[index] = node; }}
              key={item.id}
              type="button"
              role="tab"
              id={`${baseId}-tab-${item.id}`}
              aria-selected={selected}
              aria-controls={`${baseId}-panel-${item.id}`}
              tabIndex={selected ? 0 : -1}
              className={`doc-tabs-trigger${selected ? ' doc-tabs-trigger-active' : ''}`}
              onClick={() => { setActiveId(item.id); }}
              onKeyDown={handleKeyDown}
            >
              {item.label}
            </button>
          );
        })}
      </div>
      {items.map((item) => {
        const selected = item.id === activeId;
        return (
          <div
            key={item.id}
            role="tabpanel"
            id={`${baseId}-panel-${item.id}`}
            aria-labelledby={`${baseId}-tab-${item.id}`}
            hidden={!selected}
            className="doc-tabs-panel"
          >
            {item.content}
          </div>
        );
      })}
    </div>
  );
}
