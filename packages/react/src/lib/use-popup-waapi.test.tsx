import { act, render, waitFor } from '@testing-library/react';
import { describe, expect, it, vi } from 'vitest';
import { usePopupWaapiAnimation, type PopupWaapiOptions } from './use-popup-waapi.js';

function Popup(options: PopupWaapiOptions) {
  return <div data-open ref={usePopupWaapiAnimation(options)} />;
}
function animation() {
  let finish!: () => void;
  const finished = new Promise<void>((resolve) => {
    finish = resolve;
  });
  return { finished, cancel: vi.fn(), finish };
}

describe('popup WAAPI lifecycle', () => {
  it('cancels a running animation when reduced motion becomes active', async () => {
    const media = { matches: false, addEventListener: vi.fn(), removeEventListener: vi.fn() };
    const originalMatchMedia = window.matchMedia;
    window.matchMedia = vi.fn().mockReturnValue(media);
    const running = animation();
    const originalAnimate = Element.prototype.animate;
    Element.prototype.animate = vi.fn();
    const open = vi.fn().mockReturnValue([running]);
    const { unmount } = render(<Popup onOpen={open} onClose={() => []} />);
    await waitFor(() => expect(open).toHaveBeenCalledOnce());
    media.matches = true;
    act(() => {
      media.addEventListener.mock.calls[0]![1]();
    });
    expect(running.cancel).toHaveBeenCalled();
    expect(open.mock.calls[0]![0].aborted).toBe(true);
    unmount();
    expect(media.removeEventListener).toHaveBeenCalled();
    window.matchMedia = originalMatchMedia;
    Element.prototype.animate = originalAnimate;
  });

  it('cancels interrupted transitions and ignores stale close completion after reopening', async () => {
    const opening = animation();
    const closing = animation();
    const reopened = animation();
    const finalClose = animation();
    const open = vi.fn().mockReturnValueOnce([opening]).mockReturnValueOnce([reopened]);
    const close = vi.fn().mockReturnValueOnce([closing]).mockReturnValueOnce([finalClose]);
    if (!Element.prototype.animate) Element.prototype.animate = vi.fn();
    vi.spyOn(Element.prototype, 'animate').mockImplementation(
      () => opening as unknown as Animation,
    );
    const { container, unmount } = render(<Popup onOpen={open} onClose={close} />);
    const node = container.firstElementChild!;
    await waitFor(() => expect(open).toHaveBeenCalledTimes(1));
    act(() => {
      node.setAttribute('data-closed', '');
    });
    await waitFor(() => expect(close).toHaveBeenCalledTimes(1));
    expect(opening.cancel).toHaveBeenCalled();
    act(() => {
      node.removeAttribute('data-closed');
    });
    await waitFor(() => expect(open).toHaveBeenCalledTimes(2));
    expect(closing.cancel).toHaveBeenCalled();
    await act(async () => {
      closing.finish();
      reopened.finish();
    });
    act(() => {
      node.setAttribute('data-closed', '');
    });
    await waitFor(() => expect(close).toHaveBeenCalledTimes(2));
    unmount();
    expect(finalClose.cancel).toHaveBeenCalled();
    expect(close.mock.calls[1]![0].aborted).toBe(true);
    vi.restoreAllMocks();
  });
});
