import { StateLayer } from '../primitives/state-layer.js';
import { Ripple } from '../primitives/ripple.js';

export interface PlaceholderButtonProps {
  children: React.ReactNode;
  onClick?: () => void;
  disabled?: boolean;
}

/** Registry placeholder component for end-to-end install testing */
export function PlaceholderButton({ children, onClick, disabled }: PlaceholderButtonProps) {
  return (
    <Ripple disabled={disabled}>
      <StateLayer disabled={disabled}>
        <button
          type="button"
          onClick={onClick}
          disabled={disabled}
          style={{
            position: 'relative',
            display: 'inline-flex',
            alignItems: 'center',
            justifyContent: 'center',
            padding: '10px 24px',
            border: 'none',
            borderRadius: 'var(--md-sys-shape-corner-full, 9999px)',
            background: 'var(--md-sys-color-primary)',
            color: 'var(--md-sys-color-on-primary)',
            font: 'var(--md-sys-typescale-label-large-weight, 500) var(--md-sys-typescale-label-large-size, 14px)/var(--md-sys-typescale-label-large-line-height, 20px) system-ui',
            cursor: disabled ? 'not-allowed' : 'pointer',
            opacity: disabled ? 0.38 : 1,
          }}
        >
          {children}
        </button>
      </StateLayer>
    </Ripple>
  );
}
