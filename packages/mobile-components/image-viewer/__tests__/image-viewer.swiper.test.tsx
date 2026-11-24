import React from 'react';
import { describe, it, expect, render, fireEvent, act } from '@test/utils';
import { vi } from 'vitest';
import { ImageViewer } from '../index';

let mockNextIndex = 1;

// Mock Swiper/SwiperItem to directly trigger onChange
vi.mock('../../swiper', () => ({
  Swiper: React.forwardRef(({ onChange, children, current, disabled }: any, ref: any) => (
    <div
      data-testid="mock-swiper"
      data-current={current}
      data-disabled={disabled}
      ref={ref}
      onClick={() => onChange?.(mockNextIndex)}
    >
      {children}
    </div>
  )),
  default: {},
}));

vi.mock('../../swiper/SwiperItem', () => ({
  default: ({ children }: any) => <div data-testid="mock-swiper-item">{children}</div>,
}));

const images = [
  'https://tdesign.gtimg.com/mobile/demos/swiper1.png',
  'https://tdesign.gtimg.com/mobile/demos/swiper2.png',
  'https://tdesign.gtimg.com/mobile/demos/swiper3.png',
];

describe('ImageViewer onSwiperChange', () => {
  describe('events', () => {
    it(': onIndexChange trigger next when index increases', () => {
      mockNextIndex = 1;
      const onIndexChange = vi.fn();
      const { getByTestId } = render(
        <ImageViewer images={images} visible defaultIndex={0} onIndexChange={onIndexChange} />,
      );
      act(() => {
        fireEvent.click(getByTestId('mock-swiper'));
      });
      expect(onIndexChange).toHaveBeenCalled();
      expect(onIndexChange.mock.calls[0][0]).toBe(1);
      expect(onIndexChange.mock.calls[0][1]).toMatchObject({ trigger: 'next' });
    });

    it(': onIndexChange trigger prev when index decreases', () => {
      mockNextIndex = 0;
      const onIndexChange = vi.fn();
      const { getByTestId } = render(
        <ImageViewer images={images} visible defaultIndex={1} onIndexChange={onIndexChange} />,
      );
      act(() => {
        fireEvent.click(getByTestId('mock-swiper'));
      });
      expect(onIndexChange).toHaveBeenCalled();
      expect(onIndexChange.mock.calls[0][0]).toBe(0);
      expect(onIndexChange.mock.calls[0][1]).toMatchObject({ trigger: 'prev' });
    });

    it(': onIndexChange not triggered when index unchanged', () => {
      mockNextIndex = 0;
      const onIndexChange = vi.fn();
      const { getByTestId } = render(
        <ImageViewer images={images} visible defaultIndex={0} onIndexChange={onIndexChange} />,
      );
      act(() => {
        fireEvent.click(getByTestId('mock-swiper'));
      });
      expect(onIndexChange).not.toHaveBeenCalled();
    });

    it(': onIndexChange not triggered when scale !== 1 (early return)', () => {
      vi.useFakeTimers();
      mockNextIndex = 1;
      const onIndexChange = vi.fn();
      const { container, getByTestId } = render(
        <ImageViewer images={images} visible defaultIndex={0} onIndexChange={onIndexChange} />,
      );
      const img = container.querySelector('.t-image-viewer__img') as HTMLImageElement;

      // Double click to zoom scale != 1
      act(() => {
        fireEvent.doubleClick(img);
        vi.advanceTimersByTime(20);
      });

      act(() => {
        fireEvent.click(getByTestId('mock-swiper'));
      });
      expect(onIndexChange).not.toHaveBeenCalled();
      vi.useRealTimers();
    });

    it(': onIndexChange not triggered when show is false (early return)', () => {
      const onIndexChange = vi.fn();
      // Render as not visible - component won't mount due to CSSTransition unmountOnExit
      const { container } = render(<ImageViewer images={images} visible={false} onIndexChange={onIndexChange} />);
      expect(container.querySelector('.t-image-viewer')).toBeNull();
      expect(onIndexChange).not.toHaveBeenCalled();
    });
  });

  describe('props', () => {
    it(': swiper disabled prop when scale !== 1', () => {
      vi.useFakeTimers();
      const { container, getByTestId } = render(<ImageViewer images={images} visible defaultIndex={0} />);
      const img = container.querySelector('.t-image-viewer__img') as HTMLImageElement;

      // Initially disabled should be false (scale=1, isTouching=false)
      expect(getByTestId('mock-swiper').getAttribute('data-disabled')).toBe('false');

      // Double click to zoom
      act(() => {
        fireEvent.doubleClick(img);
        vi.advanceTimersByTime(20);
      });

      // After zoom, disabled should be true (scale !== 1)
      expect(getByTestId('mock-swiper').getAttribute('data-disabled')).toBe('true');
      vi.useRealTimers();
    });

    it(': currentIndex undefined fallback in showIndex display', () => {
      // When index is not provided and defaultIndex is not set, currentIndex should fallback
      const { container } = render(<ImageViewer images={images} visible showIndex />);
      const indexEl = container.querySelector('.t-image-viewer__nav-index');
      expect(indexEl?.textContent).toBe('1/3');
    });

    it(': pinch zoom returns early when swiperRootRef has transform', () => {
      vi.useFakeTimers();
      const { container, getByTestId } = render(<ImageViewer images={images} visible defaultIndex={0} />);
      const img = container.querySelector('.t-image-viewer__img') as HTMLImageElement;
      const swiperEl = getByTestId('mock-swiper');

      // Set swiperRootRef style.transform to a non-'none' value to simulate animation
      Object.defineProperty(swiperEl, 'style', {
        value: { transform: 'translateX(-100px)' },
        configurable: true,
      });

      // Start with two fingers for pinch zoom
      act(() => {
        fireEvent.touchStart(img, {
          touches: [
            { clientX: 0, clientY: 0 },
            { clientX: 100, clientY: 0 },
          ],
        } as any);
      });
      // Move to trigger pinch zoom - should be blocked by swiperRoot transform check
      act(() => {
        fireEvent.touchMove(img, {
          touches: [
            { clientX: 0, clientY: 0 },
            { clientX: 200, clientY: 0 },
          ],
        } as any);
        vi.advanceTimersByTime(20);
      });

      // Scale should remain 1 because the pinch zoom was blocked
      const style = img.getAttribute('style') || '';
      expect(style).toContain('matrix(1, 0, 0, 1');
      vi.useRealTimers();
    });

    it(': single finger drag when zoomed in triggers move branch', () => {
      vi.useFakeTimers();
      const { container } = render(<ImageViewer images={images} visible defaultIndex={0} />);
      const img = container.querySelector('.t-image-viewer__img') as HTMLImageElement;

      // Zoom in via double click
      act(() => {
        fireEvent.doubleClick(img);
        vi.advanceTimersByTime(20);
      });

      // Single finger drag - eventType becomes 'move' in useTouchEvent
      act(() => {
        fireEvent.touchStart(img, {
          touches: [{ clientX: 50, clientY: 50 }],
        } as any);
      });
      act(() => {
        fireEvent.touchMove(img, {
          touches: [{ clientX: 80, clientY: 80 }],
        } as any);
        vi.advanceTimersByTime(20);
      });

      // Transform should have moved
      const style = img.getAttribute('style') || '';
      expect(style).toContain('matrix(1.5');

      // Touch end
      act(() => {
        fireEvent.touchEnd(img);
        vi.advanceTimersByTime(20);
      });
      vi.useRealTimers();
    });

    it(': touchEnd with scale < minScale resets transform', () => {
      vi.useFakeTimers();
      const { container } = render(<ImageViewer images={images} visible defaultIndex={0} />);
      const img = container.querySelector('.t-image-viewer__img') as HTMLImageElement;

      // Pinch to shrink below minScale
      act(() => {
        fireEvent.touchStart(img, {
          touches: [
            { clientX: 0, clientY: 0 },
            { clientX: 200, clientY: 0 },
          ],
        } as any);
      });
      act(() => {
        fireEvent.touchMove(img, {
          touches: [
            { clientX: 0, clientY: 0 },
            { clientX: 100, clientY: 0 },
          ],
        } as any);
        vi.advanceTimersByTime(20);
      });

      // scale is 0.5 (< minScale=1)
      expect(img.getAttribute('style')).toContain('matrix(0.5');

      // Touch end should reset to minScale
      act(() => {
        fireEvent.touchEnd(img);
        vi.advanceTimersByTime(20);
      });
      expect(img.getAttribute('style')).toContain('matrix(1, 0, 0, 1, 0, 0');
      vi.useRealTimers();
    });

    it(': touchEnd with scale >= minScale calls getFixScaleEleTransPosition', () => {
      vi.useFakeTimers();
      const { container } = render(<ImageViewer images={images} visible defaultIndex={0} />);
      const img = container.querySelector('.t-image-viewer__img') as HTMLImageElement;

      // Zoom in via double click (scale becomes 1.5)
      act(() => {
        fireEvent.doubleClick(img);
        vi.advanceTimersByTime(20);
      });

      // Drag to some position
      act(() => {
        fireEvent.touchStart(img, {
          touches: [{ clientX: 100, clientY: 100 }],
        } as any);
      });
      act(() => {
        fireEvent.touchMove(img, {
          touches: [{ clientX: 150, clientY: 150 }],
        } as any);
        vi.advanceTimersByTime(20);
      });

      // Touch end should invoke getFixScaleEleTransPosition for rebound
      act(() => {
        fireEvent.touchEnd(img);
        vi.advanceTimersByTime(20);
      });

      // Should have rebounded
      const style = img.getAttribute('style') || '';
      expect(style).toContain('matrix(1.5');
      vi.useRealTimers();
    });
  });
});
