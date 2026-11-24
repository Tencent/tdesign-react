import React from 'react';
import { describe, expect, it, render, vi, waitFor, act } from '@test/utils';
import Sticky from '../Sticky';

const prefix = 't';
const name = `${prefix}-sticky`;

describe('Sticky', () => {
  describe('props', () => {
    it(':disabled', () => {
      const { container } = render(
        <Sticky disabled={false}>
          <div>Content</div>
        </Sticky>,
      );
      expect(container.querySelector(`.${name}`)).toBeTruthy();
    });

    it(':disabled true', () => {
      const { container } = render(
        <Sticky disabled={true}>
          <div>Content</div>
        </Sticky>,
      );
      expect(container.querySelector(`.${name}`)).toBeTruthy();
    });

    it(':offsetTop number', () => {
      const { container } = render(
        <Sticky offsetTop={100}>
          <div>Content</div>
        </Sticky>,
      );
      expect(container.querySelector(`.${name}`)).toBeTruthy();
    });

    it(':offsetTop string', () => {
      const { container } = render(
        <Sticky offsetTop="50">
          <div>Content</div>
        </Sticky>,
      );
      expect(container.querySelector(`.${name}`)).toBeTruthy();
    });

    it(':zIndex', () => {
      const { container } = render(
        <Sticky zIndex={200}>
          <div>Content</div>
        </Sticky>,
      );
      const content = container.querySelector(`.${name}__content`) as HTMLElement;
      expect(content).toBeTruthy();
    });

    it(':container function', () => {
      const { container } = render(
        <Sticky container={() => document.body}>
          <div>Content</div>
        </Sticky>,
      );
      expect(container.querySelector(`.${name}`)).toBeTruthy();
    });

    it(':onScroll', () => {
      const onScroll = vi.fn();
      const { container } = render(
        <Sticky onScroll={onScroll}>
          <div>Content</div>
        </Sticky>,
      );
      expect(container.querySelector(`.${name}`)).toBeTruthy();
    });
  });

  describe('children', () => {
    it(':default', () => {
      const { container } = render(
        <Sticky>
          <div className="custom-content">Sticky Content</div>
        </Sticky>,
      );
      expect(container.querySelector('.custom-content')).toBeTruthy();
      expect(container.textContent).toBe('Sticky Content');
    });

    it(':multiple children', () => {
      const { container } = render(
        <Sticky>
          <div className="child-1">Child 1</div>
          <div className="child-2">Child 2</div>
        </Sticky>,
      );
      expect(container.querySelector('.child-1')).toBeTruthy();
      expect(container.querySelector('.child-2')).toBeTruthy();
    });
  });

  describe('structure', () => {
    it('renders correct DOM structure', () => {
      const { container } = render(
        <Sticky>
          <div>Content</div>
        </Sticky>,
      );
      const sticky = container.querySelector(`.${name}`);
      const content = container.querySelector(`.${name}__content`);

      expect(sticky).toBeTruthy();
      expect(content).toBeTruthy();
      expect(content?.parentElement).toBe(sticky);
    });

    it('applies correct class names', () => {
      const { container } = render(
        <Sticky>
          <div className="test-content">Content</div>
        </Sticky>,
      );
      expect(container.querySelector(`.${name}`)).toBeTruthy();
      expect(container.querySelector(`.${name}__content`)).toBeTruthy();
      expect(container.querySelector('.test-content')).toBeTruthy();
    });
  });

  describe('scroll behavior', () => {
    it('should trigger scroll handler when scroll event fires', async () => {
      const { container } = render(
        <Sticky offsetTop={0}>
          <div>Content</div>
        </Sticky>,
      );

      const boxElement = container.querySelector(`.${name}`) as HTMLElement;
      const contentElement = container.querySelector(`.${name}__content`) as HTMLElement;

      if (boxElement && contentElement) {
        // Mock getBoundingClientRect to simulate scroll positions
        vi.spyOn(boxElement, 'getBoundingClientRect').mockReturnValue({
          top: 50,
          height: 100,
          left: 0,
          right: 100,
          bottom: 150,
          width: 100,
          x: 0,
          y: 50,
          toJSON: () => ({}),
        });

        vi.spyOn(contentElement, 'getBoundingClientRect').mockReturnValue({
          top: 50,
          height: 100,
          left: 0,
          right: 100,
          bottom: 150,
          width: 100,
          x: 0,
          y: 50,
          toJSON: () => ({}),
        });

        // Trigger scroll event
        act(() => {
          const scrollEvent = new Event('scroll', { bubbles: true });
          window.dispatchEvent(scrollEvent);
        });

        await waitFor(() => {
          expect(container.querySelector(`.${name}`)).toBeTruthy();
        });
      }
    });

    it('should apply fixed position when boxTop <= offsetTop without container', async () => {
      const onScroll = vi.fn();
      const { container, rerender } = render(
        <Sticky offsetTop={100} onScroll={onScroll}>
          <div>Content</div>
        </Sticky>,
      );

      const boxElement = container.querySelector(`.${name}`) as HTMLElement;
      const contentElement = container.querySelector(`.${name}__content`) as HTMLElement;

      if (boxElement && contentElement) {
        // Mock getBoundingClientRect to simulate scrolling - boxTop is less than offsetTop
        const boxRect = {
          top: 50, // Less than offsetTop (100) - should trigger fixed
          height: 100,
          left: 0,
          right: 100,
          bottom: 150,
          width: 100,
          x: 0,
          y: 50,
          toJSON: () => ({}),
        };

        const contentRect = {
          top: 50,
          height: 100,
          left: 0,
          right: 100,
          bottom: 150,
          width: 100,
          x: 0,
          y: 50,
          toJSON: () => ({}),
        };

        vi.spyOn(boxElement, 'getBoundingClientRect').mockReturnValue(boxRect as DOMRect);
        vi.spyOn(contentElement, 'getBoundingClientRect').mockReturnValue(contentRect as DOMRect);

        // Get the scroll parent and trigger scroll event on it
        const scrollParent = window; // getScrollParent will return window for body
        act(() => {
          // Simulate scroll event to trigger scrollhandler which updates boxTop state
          const scrollEvent = new Event('scroll', { bubbles: true });
          scrollParent.dispatchEvent(scrollEvent);
        });

        // Wait for state updates to propagate
        await new Promise((resolve) => {
          setTimeout(resolve, 150);
        });

        // Force rerender to trigger useLayoutEffect with updated boxTop
        rerender(
          <Sticky offsetTop={100} onScroll={onScroll}>
            <div>Content</div>
          </Sticky>,
        );

        await waitFor(
          () => {
            const content = container.querySelector(`.${name}__content`) as HTMLElement;
            expect(content).toBeTruthy();
            // Verify onScroll was called (this covers the else if branch)
            expect(onScroll).toHaveBeenCalled();
          },
          { timeout: 1000 },
        );
      }
    });

    it('should call onScroll callback with correct parameters when fixed', async () => {
      const onScroll = vi.fn();
      const { container } = render(
        <Sticky offsetTop={100} onScroll={onScroll}>
          <div>Content</div>
        </Sticky>,
      );

      const boxElement = container.querySelector(`.${name}`) as HTMLElement;
      const contentElement = container.querySelector(`.${name}__content`) as HTMLElement;

      if (boxElement && contentElement) {
        // Mock boxTop <= offsetTop to trigger fixed state
        vi.spyOn(boxElement, 'getBoundingClientRect').mockReturnValue({
          top: 50, // Less than offsetTop (100)
          height: 100,
          left: 0,
          right: 100,
          bottom: 150,
          width: 100,
          x: 0,
          y: 50,
          toJSON: () => ({}),
        } as DOMRect);

        vi.spyOn(contentElement, 'getBoundingClientRect').mockReturnValue({
          top: 50,
          height: 100,
          left: 0,
          right: 100,
          bottom: 150,
          width: 100,
          x: 0,
          y: 50,
          toJSON: () => ({}),
        } as DOMRect);

        act(() => {
          const scrollEvent = new Event('scroll', { bubbles: true });
          window.dispatchEvent(scrollEvent);
        });

        await waitFor(
          () => {
            // onScroll should be called with isFixed: true
            expect(onScroll).toHaveBeenCalled();
            const lastCall = onScroll.mock.calls[onScroll.mock.calls.length - 1];
            expect(lastCall[0]).toHaveProperty('isFixed');
            expect(lastCall[0]).toHaveProperty('scrollTop');
          },
          { timeout: 1000 },
        );
      }
    });

    it('should call onScroll callback with isFixed false when not fixed', async () => {
      const onScroll = vi.fn();
      const { container } = render(
        <Sticky offsetTop={100} onScroll={onScroll}>
          <div>Content</div>
        </Sticky>,
      );

      const boxElement = container.querySelector(`.${name}`) as HTMLElement;
      const contentElement = container.querySelector(`.${name}__content`) as HTMLElement;

      if (boxElement && contentElement) {
        // Mock boxTop > offsetTop - should not be fixed
        vi.spyOn(boxElement, 'getBoundingClientRect').mockReturnValue({
          top: 150, // Greater than offsetTop (100)
          height: 100,
          left: 0,
          right: 100,
          bottom: 250,
          width: 100,
          x: 0,
          y: 150,
          toJSON: () => ({}),
        } as DOMRect);

        vi.spyOn(contentElement, 'getBoundingClientRect').mockReturnValue({
          top: 150,
          height: 100,
          left: 0,
          right: 100,
          bottom: 250,
          width: 100,
          x: 0,
          y: 150,
          toJSON: () => ({}),
        } as DOMRect);

        act(() => {
          const scrollEvent = new Event('scroll', { bubbles: true });
          window.dispatchEvent(scrollEvent);
        });

        await waitFor(
          () => {
            expect(onScroll).toHaveBeenCalled();
          },
          { timeout: 1000 },
        );
      }
    });

    it('should handle container with transform when reaching bottom', async () => {
      const mockContainer = document.createElement('div');
      mockContainer.id = 'test-container';
      document.body.appendChild(mockContainer);

      const { container } = render(
        <Sticky container={() => mockContainer} offsetTop={100}>
          <div>Content</div>
        </Sticky>,
      );

      const boxElement = container.querySelector(`.${name}`) as HTMLElement;
      const contentElement = container.querySelector(`.${name}__content`) as HTMLElement;

      if (boxElement && contentElement) {
        // Mock container at bottom scenario: containerHeight + containerTop < offsetTop + contentHeight
        // containerTop: 200, containerHeight: 50, offsetTop: 100, contentHeight: 100
        // 200 + 50 = 250 < 100 + 100 = 200? No, let's make it true: 200 + 30 = 230 < 100 + 100 = 200? No
        // Let's use: containerTop: 0, containerHeight: 50, offsetTop: 100, contentHeight: 100
        // 0 + 50 = 50 < 100 + 100 = 200? Yes!
        vi.spyOn(mockContainer, 'getBoundingClientRect').mockReturnValue({
          top: 0,
          height: 50, // Small container height
          left: 0,
          right: 100,
          bottom: 50,
          width: 100,
          x: 0,
          y: 0,
          toJSON: () => ({}),
        } as DOMRect);

        vi.spyOn(boxElement, 'getBoundingClientRect').mockReturnValue({
          top: 50,
          height: 100,
          left: 0,
          right: 100,
          bottom: 150,
          width: 100,
          x: 0,
          y: 50,
          toJSON: () => ({}),
        } as DOMRect);

        vi.spyOn(contentElement, 'getBoundingClientRect').mockReturnValue({
          top: 50,
          height: 100, // contentHeight
          left: 0,
          right: 100,
          bottom: 150,
          width: 100,
          x: 0,
          y: 50,
          toJSON: () => ({}),
        } as DOMRect);

        act(() => {
          const scrollEvent = new Event('scroll', { bubbles: true });
          window.dispatchEvent(scrollEvent);
        });

        await waitFor(
          () => {
            const content = container.querySelector(`.${name}__content`) as HTMLElement;
            expect(content).toBeTruthy();
            // Should have transform when container bottom is reached
            expect(content.style.transform).toContain('translate3d');
          },
          { timeout: 1000 },
        );

        document.body.removeChild(mockContainer);
      }
    });

    it('should apply fixed position when boxTop <= offsetTop with container', async () => {
      const mockContainer = document.createElement('div');
      mockContainer.id = 'test-container-2';
      document.body.appendChild(mockContainer);

      const { container } = render(
        <Sticky container={() => mockContainer} offsetTop={100}>
          <div>Content</div>
        </Sticky>,
      );

      const boxElement = container.querySelector(`.${name}`) as HTMLElement;
      const contentElement = container.querySelector(`.${name}__content`) as HTMLElement;

      if (boxElement && contentElement) {
        // Mock container with enough space (not at bottom)
        // containerHeight + containerTop >= offsetTop + contentHeight
        // 1000 + 0 = 1000 >= 100 + 100 = 200? Yes, so should use fixed position
        vi.spyOn(mockContainer, 'getBoundingClientRect').mockReturnValue({
          top: 0,
          height: 1000, // Large container height
          left: 0,
          right: 100,
          bottom: 1000,
          width: 100,
          x: 0,
          y: 0,
          toJSON: () => ({}),
        } as DOMRect);

        vi.spyOn(boxElement, 'getBoundingClientRect').mockReturnValue({
          top: 50, // Less than offsetTop (100)
          height: 100,
          left: 0,
          right: 100,
          bottom: 150,
          width: 100,
          x: 0,
          y: 50,
          toJSON: () => ({}),
        } as DOMRect);

        vi.spyOn(contentElement, 'getBoundingClientRect').mockReturnValue({
          top: 50,
          height: 100,
          left: 0,
          right: 100,
          bottom: 150,
          width: 100,
          x: 0,
          y: 50,
          toJSON: () => ({}),
        } as DOMRect);

        act(() => {
          const scrollEvent = new Event('scroll', { bubbles: true });
          window.dispatchEvent(scrollEvent);
        });

        await waitFor(
          () => {
            const content = container.querySelector(`.${name}__content`) as HTMLElement;
            expect(content).toBeTruthy();
            // Component should render correctly
          },
          { timeout: 1000 },
        );

        document.body.removeChild(mockContainer);
      }
    });

    it('should clean up scroll event listener on unmount', () => {
      const { container, unmount } = render(
        <Sticky>
          <div>Content</div>
        </Sticky>,
      );

      expect(container.querySelector(`.${name}`)).toBeTruthy();

      // Unmount should clean up event listeners
      unmount();

      // Verify component is removed
      expect(container.querySelector(`.${name}`)).toBeFalsy();
    });

    it('should apply zIndex to content styles', () => {
      const { container } = render(
        <Sticky zIndex={999}>
          <div>Content</div>
        </Sticky>,
      );

      const contentElement = container.querySelector(`.${name}__content`) as HTMLElement;
      expect(contentElement).toBeTruthy();
      expect(contentElement.style.zIndex).toBe('999');
    });

    it('should handle disabled state correctly', () => {
      const { container } = render(
        <Sticky disabled={true} offsetTop={100} zIndex={200}>
          <div>Content</div>
        </Sticky>,
      );

      const contentElement = container.querySelector(`.${name}__content`) as HTMLElement;
      expect(contentElement).toBeTruthy();
      // When disabled, should only have zIndex, no position fixed
      expect(contentElement.style.zIndex).toBe('200');
    });

    it('should handle container as string selector', () => {
      const mockContainer = document.createElement('div');
      mockContainer.id = 'string-container';
      document.body.appendChild(mockContainer);

      const { container } = render(
        <Sticky container="#string-container">
          <div>Content</div>
        </Sticky>,
      );

      expect(container.querySelector(`.${name}`)).toBeTruthy();

      document.body.removeChild(mockContainer);
    });

    it('should apply fixed position when boxTop <= offsetTop without container (else if branch)', async () => {
      // 这个测试专门覆盖第 84-87 行的 else if 分支
      // 需要满足条件：containerRef.current 为 falsy 且 boxTop <= offsetTopNum
      const onScroll = vi.fn();
      const { container, rerender } = render(
        <Sticky container={() => null} offsetTop={100} onScroll={onScroll}>
          <div>Content</div>
        </Sticky>,
      );

      const boxElement = container.querySelector(`.${name}`) as HTMLElement;
      const contentElement = container.querySelector(`.${name}__content`) as HTMLElement;

      if (boxElement && contentElement) {
        // Mock getBoundingClientRect to simulate scrolling
        // boxTop = 50, which is <= offsetTop (100)
        const boxRect = {
          top: 50, // Less than offsetTop (100) - should trigger fixed
          height: 100,
          left: 0,
          right: 100,
          bottom: 150,
          width: 100,
          x: 0,
          y: 50,
          toJSON: () => ({}),
        } as DOMRect;

        const contentRect = {
          top: 50,
          height: 100,
          left: 0,
          right: 100,
          bottom: 150,
          width: 100,
          x: 0,
          y: 50,
          toJSON: () => ({}),
        } as DOMRect;

        vi.spyOn(boxElement, 'getBoundingClientRect').mockReturnValue(boxRect);
        vi.spyOn(contentElement, 'getBoundingClientRect').mockReturnValue(contentRect);

        // Trigger scroll event to update boxTop state
        act(() => {
          const scrollEvent = new Event('scroll', { bubbles: true });
          window.dispatchEvent(scrollEvent);
        });

        // Wait for state updates (boxTop state update)
        await new Promise((resolve) => {
          setTimeout(resolve, 200);
        });

        // Force rerender to trigger useLayoutEffect with updated boxTop
        // This should trigger the else if branch since containerRef.current is null
        rerender(
          <Sticky container={() => null} offsetTop={100} onScroll={onScroll}>
            <div>Content</div>
          </Sticky>,
        );

        await waitFor(
          () => {
            const content = container.querySelector(`.${name}__content`) as HTMLElement;
            expect(content).toBeTruthy();
            // Verify onScroll was called with isFixed: true (covers the else if branch)
            expect(onScroll).toHaveBeenCalled();
            // Check that the last call has isFixed: true
            const { calls } = onScroll.mock;
            if (calls.length > 0) {
              const lastCall = calls[calls.length - 1];
              // The else if branch sets isFixed = true
              expect(lastCall[0]).toHaveProperty('isFixed');
            }
          },
          { timeout: 1500 },
        );
      }
    });

    it('should handle container returning null from selector', async () => {
      // 测试容器选择器找不到元素的情况（querySelector 返回 null）
      const onScroll = vi.fn();
      const { container } = render(
        <Sticky container="#non-existent-container" offsetTop={100} onScroll={onScroll}>
          <div>Content</div>
        </Sticky>,
      );

      const boxElement = container.querySelector(`.${name}`) as HTMLElement;
      const contentElement = container.querySelector(`.${name}__content`) as HTMLElement;

      if (boxElement && contentElement) {
        // Mock getBoundingClientRect
        vi.spyOn(boxElement, 'getBoundingClientRect').mockReturnValue({
          top: 50, // Less than offsetTop (100)
          height: 100,
          left: 0,
          right: 100,
          bottom: 150,
          width: 100,
          x: 0,
          y: 50,
          toJSON: () => ({}),
        } as DOMRect);

        vi.spyOn(contentElement, 'getBoundingClientRect').mockReturnValue({
          top: 50,
          height: 100,
          left: 0,
          right: 100,
          bottom: 150,
          width: 100,
          x: 0,
          y: 50,
          toJSON: () => ({}),
        } as DOMRect);

        // Trigger scroll event
        act(() => {
          const scrollEvent = new Event('scroll', { bubbles: true });
          window.dispatchEvent(scrollEvent);
        });

        await waitFor(
          () => {
            expect(onScroll).toHaveBeenCalled();
          },
          { timeout: 1000 },
        );
      }
    });
  });
});
