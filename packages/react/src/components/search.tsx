
import { Autocomplete as BaseAutocomplete } from '@base-ui/react/autocomplete';
import { Dialog as BaseDialog } from '@base-ui/react/dialog';
import { type CSSProperties, type ReactNode, useState } from 'react';
import { Icon } from '@m3ui/icons';
import { compVar, elevationShadow, typeStyle } from '../lib/token-utils.js';
import { IconButton } from './icon-button.js';
import { PopupMotion } from '../lib/popup-motion.js';

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
    border: 'none',
    background: 'transparent',
    outline: 'none',
    ...typeStyle('body-large'),
    color: compVar('search-bar', 'input-text-color'),
  };

  return (
    <div className={className} data-testid={testId} style={{ width: '100%' }}>
    <BaseAutocomplete.Root
      value={value}
      defaultValue={defaultValue}
      onValueChange={onValueChange ? (value) => { if (value != null) onValueChange(value); } : undefined}
      disabled={disabled}
    >
      <div style={barStyle}>
        {avatar}
        <span style={{ color: compVar('search-bar', 'leading-icon-color') }} aria-hidden>
          <Icon name="search" />
        </span>
        <BaseAutocomplete.Input placeholder={placeholder} style={inputStyle} onKeyDown={(e) => e.key === 'Enter' && onSearch?.((e.target as HTMLInputElement).value)} />
        <IconButton aria-label="Search" icon={<Icon name="arrow_forward" />} variant="standard" size="sm" onClick={() => onSearch?.(value ?? defaultValue)} />
      </div>
      {suggestions.length > 0 && (
        <BaseAutocomplete.Portal>
          <BaseAutocomplete.Positioner sideOffset={4}>
            <PopupMotion>
              <BaseAutocomplete.Popup
                style={{
                  background: compVar('menu', 'container-color'),
                  borderRadius: compVar('menu', 'container-shape'),
                  boxShadow: elevationShadow('level2'),
                  padding: compVar('list', 'item-top-space'),
                  maxHeight: compVar('search-bar', 'container-height'),
                  overflow: 'auto',
                  minWidth: compVar('search-bar', 'container-height'),
                }}
              >
                {suggestions.map((s) => (
                  <BaseAutocomplete.Item
                    key={s.value}
                    value={s.value}
                    style={{
                      padding: compVar('list', 'divider-leading-space'),
                      ...typeStyle('body-large'),
                      cursor: 'pointer',
                    }}
                  >
                    <div>{s.label}</div>
                    {s.supportingText && (
                      <div style={{ ...typeStyle('body-medium'), color: compVar('search-bar', 'supporting-text-color') }}>
                        {s.supportingText}
                      </div>
                    )}
                  </BaseAutocomplete.Item>
                ))}
              </BaseAutocomplete.Popup>
            </PopupMotion>
          </BaseAutocomplete.Positioner>
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
  className,
  'data-testid': testId,
}: SearchViewProps) {
  const [query, setQuery] = useState('');

  const headerHeight = fullScreen
    ? compVar('search-view', 'full-screen-header-container-height')
    : compVar('search-view', 'docked-header-container-height');

  const popupStyle: CSSProperties = {
    background: compVar('search-view', 'container-color'),
    borderRadius: fullScreen ? compVar('search-view', 'full-screen-container-shape') : compVar('search-view', 'docked-container-shape'),
    boxShadow: elevationShadow('level3'),
    width: fullScreen ? '100vw' : '100%',
    maxWidth: fullScreen ? '100vw' : compVar('search-view', 'docked-header-container-height'),
    maxHeight: fullScreen ? '100vh' : '80vh',
    display: 'flex',
    flexDirection: 'column',
    overflow: 'hidden',
  };

  return (
    <BaseDialog.Root open={open} defaultOpen={defaultOpen} onOpenChange={onOpenChange}>
      <BaseDialog.Trigger render={trigger as React.ReactElement} />
      <BaseDialog.Portal>
        <BaseDialog.Backdrop style={{ background: compVar('scrim', 'container-color'), opacity: 0.32 }} />
        <BaseDialog.Popup className={className} data-testid={testId} style={popupStyle}>
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
            <BaseDialog.Close aria-label="Close search" style={{ background: 'none', border: 'none', cursor: 'pointer', color: compVar('search-view', 'header-leading-icon-color') }}>
              <Icon name="arrow_back" />
            </BaseDialog.Close>
            <input
              value={query}
              onChange={(e) => { setQuery(e.target.value); }}
              placeholder="Search"
              autoFocus
              style={{
                flex: 1,
                border: 'none',
                background: 'transparent',
                outline: 'none',
                ...typeStyle('body-large'),
                color: compVar('search-view', 'header-input-text-color'),
              }}
            />
          </div>
          <div role="listbox" style={{ flex: 1, overflow: 'auto', padding: compVar('list', 'item-top-space') }}>
            {suggestions.map((s) => (
              <div
                key={s.value}
                role="option"
                style={{
                  padding: compVar('list', 'divider-leading-space'),
                  ...typeStyle('body-large'),
                  cursor: 'pointer',
                }}
              >
                {s.label}
              </div>
            ))}
          </div>
        </BaseDialog.Popup>
      </BaseDialog.Portal>
    </BaseDialog.Root>
  );
}
