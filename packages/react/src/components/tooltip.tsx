import { DURATION_MS, EASING } from '@m3ui/motion';
import { M3PortalScope } from '../provider/m3-provider.js';
import { Tooltip as BaseTooltip } from '@base-ui/react/tooltip';
import { PreviewCard as BasePreviewCard } from '@base-ui/react/preview-card';
import { usePopupWaapiAnimation, composeRefs } from '../lib/use-popup-waapi.js';
import {
  type CSSProperties,
  type ReactElement,
  type ReactNode,
  useRef,
  useId,
  isValidElement,
} from 'react';
import { compVar, compElevation, elevationShadow, typeStyle } from '../lib/token-utils.js';

/** Animate the actual Base UI popup so its lifecycle waits for the exit. */
function useTooltipMotion(offset: number) {
  const node = useRef<HTMLElement | null>(null);
  const interruptedFrame = useRef<{ opacity: string; transform: string } | null>(null);
  const animate = (opening: boolean, signal: AbortSignal) => {
    const popup = node.current;
    if (!popup) return [];
    const hidden = { opacity: 0, transform: `translateY(${offset}px) scale(0.95)` };
    const visible = { opacity: 1, transform: 'translateY(0px) scale(1)' };
    const from = interruptedFrame.current ?? (opening ? hidden : visible);
    interruptedFrame.current = null;
    const animation = popup.animate([from, opening ? visible : hidden], {
      duration: opening ? DURATION_MS.short3 : DURATION_MS.short2,
      easing: EASING.STANDARD_DECELERATE,
      fill: 'both',
    });
    signal.addEventListener(
      'abort',
      () => {
        const computed = getComputedStyle(popup);
        interruptedFrame.current = { opacity: computed.opacity, transform: computed.transform };
        animation.cancel();
      },
      { once: true },
    );
    return [animation];
  };
  const motionRef = usePopupWaapiAnimation({
    onOpen: (signal) => animate(true, signal),
    onClose: (signal) => animate(false, signal),
  });
  return composeRefs(node, motionRef);
}

export interface TooltipProps {
  trigger: ReactNode;
  content: ReactNode;
  className?: string;
  'data-testid'?: string;
}

export function Tooltip({ trigger, content, className, 'data-testid': testId }: TooltipProps) {
  const popupRef = useTooltipMotion(4);
  const tooltipId = useId();
  const popupStyle: CSSProperties = {
    ...typeStyle('body-small'),
    background: compVar('plain-tooltip', 'container-color'),
    color: compVar('plain-tooltip', 'supporting-text-color'),
    paddingInline: compVar('plain-tooltip', 'leading-space'),
    paddingBlock: compVar('plain-tooltip', 'top-space'),
    borderRadius: compVar('plain-tooltip', 'container-shape'),
    boxShadow: elevationShadow('level1'),
    maxWidth: compVar('plain-tooltip', 'container-width'),
  };

  const triggerElement = isValidElement(trigger) ? (
    (trigger as ReactElement)
  ) : (
    <span>{trigger}</span>
  );

  return (
    <BaseTooltip.Provider>
      <BaseTooltip.Root>
        <BaseTooltip.Trigger render={triggerElement} aria-describedby={tooltipId} />
        <BaseTooltip.Portal>
          <M3PortalScope>
            <BaseTooltip.Positioner sideOffset={4} style={{ zIndex: 'calc(var(--m3-overlay-layer, 1100) + 1)' }}>
              <BaseTooltip.Popup
                id={tooltipId}
                role="tooltip"
                ref={popupRef}
                className={className}
                data-testid={testId}
                style={popupStyle}
              >
                {content}
              </BaseTooltip.Popup>
            </BaseTooltip.Positioner>
          </M3PortalScope>
        </BaseTooltip.Portal>
      </BaseTooltip.Root>
    </BaseTooltip.Provider>
  );
}

export interface RichTooltipProps {
  trigger: ReactNode;
  title: ReactNode;
  description?: ReactNode;
  image?: ReactNode;
  /** Optional action row rendered at the bottom of the rich tooltip */
  actions?: ReactNode;
  className?: string;
  'data-testid'?: string;
}

export function RichTooltip({
  trigger,
  title,
  description,
  image,
  actions,
  className,
  'data-testid': testId,
}: RichTooltipProps) {
  const popupRef = useTooltipMotion(8);
  const popupStyle: CSSProperties = {
    background: compVar('rich-tooltip', 'container-color'),
    color: compVar('rich-tooltip', 'subhead-color'),
    borderRadius: compVar('rich-tooltip', 'container-shape'),
    boxShadow: compElevation('rich-tooltip'),
    overflow: 'hidden',
    maxWidth: compVar('plain-tooltip', 'container-width'),
  };

  const titleStyle: CSSProperties = {
    ...typeStyle('title-small'),
    color: compVar('rich-tooltip', 'subhead-color'),
    padding: compVar('list', 'divider-leading-space'),
  };

  const descStyle: CSSProperties = {
    ...typeStyle('body-medium'),
    color: compVar('rich-tooltip', 'supporting-text-color'),
    padding: compVar('list', 'divider-leading-space'),
    paddingTop: 0,
  };

  const actionsStyle: CSSProperties = {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'flex-end',
    gap: compVar('list', 'item-between-space'),
    padding: compVar('list', 'divider-leading-space'),
    paddingTop: 0,
  };

  const triggerElement = isValidElement(trigger) ? (
    (trigger as ReactElement)
  ) : (
    <span>{trigger}</span>
  );

  return (
    <BasePreviewCard.Root>
      <BasePreviewCard.Trigger render={triggerElement} />
      <BasePreviewCard.Portal>
        <M3PortalScope>
          <BasePreviewCard.Positioner sideOffset={8} style={{ zIndex: 'calc(var(--m3-overlay-layer, 1100) + 1)' }}>
            <BasePreviewCard.Popup
              ref={popupRef}
              className={className}
              data-testid={testId}
              style={popupStyle}
            >
              {image}
              <div style={titleStyle}>{title}</div>
              {description && <div style={descStyle}>{description}</div>}
              {actions != null && <div style={actionsStyle}>{actions}</div>}
            </BasePreviewCard.Popup>
          </BasePreviewCard.Positioner>
        </M3PortalScope>
      </BasePreviewCard.Portal>
    </BasePreviewCard.Root>
  );
}
