import { modalPopupLayout } from '../lib/modal-layout.js';
import { M3PortalScope } from '../provider/m3-provider.js';

import { Autocomplete as BaseAutocomplete } from '@base-ui/react/autocomplete';
import { Dialog as BaseDialog } from '@base-ui/react/dialog';
import {
  type CSSProperties,
  type KeyboardEvent,
  type ReactNode,
  useId,
  useEffect,
  useMemo,
  useState,
} from 'react';
import { Icon } from '@m3ui/icons';
import { StateLayer } from '../lib/state-layer.js';
import { OverlayMotion, ScrimMotion } from '../lib/overlay-motion.js';
import { compVar, elevationShadow, typeStyle } from '../lib/token-utils.js';
import { IconButton } from './icon-button.js';
import { PopupMotion } from '../lib/popup-motion.js';
import { Ripple } from '../primitives/ripple.js';

export interface SearchSuggestion {
  value: string;
  label: ReactNode;
  supportingText?: ReactNode;
}

export interface SearchBarProps {
  value?: string;
  defaultValue?: string;
  onValueChange?: (value: string) => void;
  placeholder?: string;
  suggestions?: SearchSuggestion[];
  onSearch?: (query: string) => void;
  avatar?: ReactNode;
  disabled?: boolean;
  className?: string;
  'data-testid'?: string;
}

export function SearchBar({
  value,
  defaultValue = '',
  onValueChange,
  placeholder = 'Search',
  suggestions = [],
  onSearch,
  avatar,
  disabled = false,
  className,
  'data-testid': testId,
}: SearchBarProps) {
  const [internalValue, setInternalValue] = useState(defaultValue);
  const query = value ?? internalValue;
  const barStyle: CSSProperties = {
    display: 'flex',
    alignItems: 'center',
    gap: compVar('list', 'item-between-space'),
    height: compVar('search-bar', 'container-height'),
    paddingInline: compVar('list', 'divider-leading-space'),
    background: compVar('search-bar', 'container-color'),
    borderRadius: compVar('search-bar', 'container-shape'),
    boxShadow: elevationShadow('level3'),
    opacity: disabled ? 'var(--md-sys-state-disabled-content-opacity)' : 1,
    width: '100%',
  };

  const inputStyle: CSSProperties = {
    flex: 1,
    minWidth: 0,
    border: 'none',
    background: 'transparent',
    outline: 'none',
    ...typeStyle('body-large'),
    color: compVar('search-bar', 'input-text-color'),
  };

  return (
    <div className={className} data-testid={testId} style={{ width: '100%' }}>
      <BaseAutocomplete.Root
        value={query}
        onValueChange={(next) => {
          const text = next ?? '';
          if (value === undefined) setInternalValue(text);
          onValueChange?.(text);
        }}
        disabled={disabled}
      >
        <StateLayer
          states={['hover', 'pressed']}
          disabled={disabled}
          style={{ ...barStyle, overflow: 'hidden' }}
        >
          {avatar}
          <span style={{ color: compVar('search-bar', 'leading-icon-color') }} aria-hidden>
            <Icon name="search" />
          </span>
          <BaseAutocomplete.Input
            aria-label={placeholder}
            placeholder={placeholder}
            style={inputStyle}
            onKeyDown={(e) => e.key === 'Enter' && onSearch?.((e.target as HTMLInputElement).value)}
          />
          <IconButton
            aria-label="Search"
            icon={<Icon name="arrow_forward" />}
            variant="standard"
            size="sm"
            disabled={disabled}
            onClick={() => onSearch?.(query)}
          />
        </StateLayer>
        {suggestions.length > 0 && (
          <BaseAutocomplete.Portal>
            <M3PortalScope>
              <BaseAutocomplete.Positioner
                style={{ zIndex: 'var(--m3-overlay-layer, 1100)' }}
                sideOffset={4}
              >
                <PopupMotion>
                  <BaseAutocomplete.Popup
                    style={{
                      background: compVar('menu', 'container-color'),
                      borderRadius: compVar('menu', 'container-shape'),
                      boxShadow: elevationShadow('level2'),
                      padding: compVar('list', 'item-top-space'),
                      maxHeight: '320px',
                      overflow: 'auto',
                      minWidth: compVar('search-bar', 'container-height'),
                    }}
                  >
                    {suggestions.map((s) => (
                      <BaseAutocomplete.Item
                        key={s.value}
                        value={s.value}
                        style={{
                          padding: 0,
                          ...typeStyle('body-large'),
                          cursor: 'pointer',
                          borderRadius: compVar('list', 'item-container-shape'),
                        }}
                      >
                        <StateLayer
                          states={['hover', 'pressed']}
                          style={{
                            padding: compVar('list', 'divider-leading-space'),
                            borderRadius: 'inherit',
                          }}
                        >
                          <div>{s.label}</div>
                          {s.supportingText && (
                            <div
                              style={{
                                ...typeStyle('body-medium'),
                                color: compVar('search-bar', 'supporting-text-color'),
                              }}
                            >
                              {s.supportingText}
                            </div>
                          )}
                        </StateLayer>
                      </BaseAutocomplete.Item>
                    ))}
                  </BaseAutocomplete.Popup>
                </PopupMotion>
              </BaseAutocomplete.Positioner>
            </M3PortalScope>
          </BaseAutocomplete.Portal>
        )}
      </BaseAutocomplete.Root>
    </div>
  );
}

export interface SearchViewProps {
  open?: boolean;
  defaultOpen?: boolean;
  onOpenChange?: (open: boolean) => void;
  trigger: ReactNode;
  suggestions?: SearchSuggestion[];
  fullScreen?: boolean;
  onSelectSuggestion?: (value: string) => void;
  className?: string;
  'data-testid'?: string;
}

export function SearchView({
  open,
  defaultOpen,
  onOpenChange,
  trigger,
  suggestions = [],
  fullScreen = false,
  onSelectSuggestion,
  className,
  'data-testid': testId,
}: SearchViewProps) {
  const listboxId = useId();
  const [query, setQuery] = useState('');
  const [activeIndex, setActiveIndex] = useState(-1);

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    if (!q) return suggestions;
    return suggestions.filter((s) => {
      const label = typeof s.label === 'string' ? s.label : s.value;
      return label.toLowerCase().includes(q) || s.value.toLowerCase().includes(q);
    });
  }, [query, suggestions]);

  const headerHeight = fullScreen
    ? compVar('search-view', 'full-screen-header-container-height')
    : compVar('search-view', 'docked-header-container-height');

  const popupStyle: CSSProperties = {
    background: compVar('search-view', 'container-color'),
    borderRadius: fullScreen
      ? compVar('search-view', 'full-screen-container-shape')
      : compVar('search-view', 'docked-container-shape'),
    boxShadow: elevationShadow('level3'),
    width: '100%',
    maxWidth: fullScreen ? '100vw' : '720px',
    maxHeight: fullScreen ? '100dvh' : '80dvh',
    height: fullScreen ? '100dvh' : undefined,
    display: 'flex',
    flexDirection: 'column',
    overflow: 'hidden',
  };

  const selectSuggestion = (value: string) => {
    setQuery(value);
    onSelectSuggestion?.(value);
  };

  useEffect(() => {
    if (activeIndex >= 0)
      document
        .getElementById(`${listboxId}-option-${activeIndex}`)
        ?.scrollIntoView?.({ block: 'nearest' });
  }, [activeIndex, listboxId]);

  const onKeyDown = (e: KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'ArrowDown') {
      e.preventDefault();
      setActiveIndex((i) => Math.min(i + 1, filtered.length - 1));
    } else if (e.key === 'ArrowUp') {
      e.preventDefault();
      setActiveIndex((i) => Math.max(i - 1, -1));
    } else if (e.key === 'Enter' && activeIndex >= 0 && filtered[activeIndex]) {
      e.preventDefault();
      selectSuggestion(filtered[activeIndex].value);
    }
  };

  return (
    <BaseDialog.Root open={open} defaultOpen={defaultOpen} onOpenChange={onOpenChange}>
      <BaseDialog.Trigger render={trigger as React.ReactElement} />
      <BaseDialog.Portal>
        <M3PortalScope>
          <BaseDialog.Backdrop
            render={(props) => (
              <ScrimMotion
                {...props}
                style={{
                  ...props.style,
                  position: 'fixed',
                  zIndex: 'var(--m3-overlay-layer, 1100)',
                  inset: 0,
                  background: compVar('scrim', 'container-color'),
                  opacity: 0.32,
                }}
              />
            )}
          />
          <BaseDialog.Popup
            aria-label="Search"
            className={className}
            data-testid={testId}
            style={{
              ...modalPopupLayout,
              width: fullScreen ? '100vw' : '720px',
              ...(fullScreen ? { maxWidth: '100vw', maxHeight: '100dvh' } : {}),
            }}
          >
            <OverlayMotion style={popupStyle} fullScreen={fullScreen}>
              <div
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: compVar('list', 'item-between-space'),
                  height: headerHeight,
                  paddingInline: compVar('list', 'divider-leading-space'),
                  borderBottom: `1px solid ${compVar('search-view', 'divider-color')}`,
                }}
              >
                <BaseDialog.Close
                  aria-label="Close search"
                  style={{
                    background: 'none',
                    border: 'none',
                    cursor: 'pointer',
                    color: compVar('search-view', 'header-leading-icon-color'),
                  }}
                >
                  <Icon name="arrow_back" />
                </BaseDialog.Close>
                <input
                  value={query}
                  onChange={(e) => {
                    setQuery(e.target.value);
                    setActiveIndex(-1);
                  }}
                  onKeyDown={onKeyDown}
                  placeholder="Search"
                  autoFocus
                  role="combobox"
                  aria-expanded
                  aria-label="Search"
                  aria-controls={listboxId}
                  aria-activedescendant={
                    activeIndex >= 0 && filtered[activeIndex]
                      ? `${listboxId}-option-${activeIndex}`
                      : undefined
                  }
                  style={{
                    flex: 1,
                    minWidth: 0,
                    border: 'none',
                    background: 'transparent',
                    outline: 'none',
                    ...typeStyle('body-large'),
                    color: compVar('search-view', 'header-input-text-color'),
                  }}
                />
              </div>
              <div
                id={listboxId}
                aria-label="Search results"
                role="listbox"
                style={{ flex: 1, overflow: 'auto', padding: compVar('list', 'item-top-space') }}
              >
                {filtered.length === 0 && (
                  <div role="status" style={{ padding: 16 }}>
                    No results found
                  </div>
                )}
                {filtered.map((s, index) => (
                  <Ripple
                    key={s.value}
                    style={{ borderRadius: compVar('list', 'item-container-shape') }}
                  >
                    <StateLayer
                      states={['hover', 'pressed']}
                      data-hovered={index === activeIndex || undefined}
                      style={{
                        borderRadius: 'inherit',
                        background:
                          index === activeIndex
                            ? compVar('list', 'item-selected-container-color')
                            : undefined,
                      }}
                    >
                      <div
                        id={`${listboxId}-option-${index}`}
                        role="option"
                        aria-selected={index === activeIndex}
                        tabIndex={-1}
                        onMouseEnter={() => {
                          setActiveIndex(index);
                        }}
                        onClick={() => {
                          selectSuggestion(s.value);
                        }}
                        style={{
                          padding: compVar('list', 'divider-leading-space'),
                          ...typeStyle('body-large'),
                          cursor: 'pointer',
                        }}
                      >
                        {s.label}
                      </div>
                    </StateLayer>
                  </Ripple>
                ))}
              </div>
            </OverlayMotion>
          </BaseDialog.Popup>
        </M3PortalScope>
      </BaseDialog.Portal>
    </BaseDialog.Root>
  );
}
