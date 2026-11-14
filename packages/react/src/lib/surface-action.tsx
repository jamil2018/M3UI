import { useId, type ReactNode } from 'react';

/** A native primary action beside its content, so secondary controls never nest in a button. */
export function SurfaceAction({
  children,
  onClick,
}: {
  children: ReactNode;
  onClick?: () => void;
}) {
  const contentId = useId();
  return (
    <>
      <style>{`.m3-surface-content { pointer-events: none; }
.m3-surface-content :is(button,a,input,select,textarea,[role="button"],[role="checkbox"],[role="switch"],[tabindex]) { pointer-events: auto; }
.m3-surface-action:focus-visible { outline: 3px solid var(--md-sys-color-primary); outline-offset: -3px; }`}</style>
      <button
        type="button"
        className="m3-surface-action"
        aria-labelledby={contentId}
        onClick={onClick}
        style={{
          position: 'absolute',
          inset: 0,
          width: '100%',
          height: '100%',
          border: 0,
          borderRadius: 'inherit',
          background: 'transparent',
          cursor: 'pointer',
        }}
      />
      <div
        id={contentId}
        className="m3-surface-content"
        style={{ position: 'relative', display: 'contents' }}
      >
        {children}
      </div>
    </>
  );
}
