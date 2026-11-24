import React from 'react';
import { describe, it, expect, render, vi, fireEvent, waitFor, act, beforeEach, afterEach } from '@test/utils';
import { AddIcon } from 'tdesign-icons-react';
import Fab from '../index';

const prefix = 't';
const name = `.${prefix}-fab`;

// Mock 屏幕尺寸
const mockScreenWidth = 375;
const mockScreenHeight = 667;

beforeEach(() => {
  Object.defineProperty(window, 'innerWidth', {
    writable: true,
    configurable: true,
    value: mockScreenWidth,
  });
  Object.defineProperty(window, 'innerHeight', {
    writable: true,
    configurable: true,
    value: mockScreenHeight,
  });
  Object.defineProperty(screen, 'width', {
    writable: true,
    configurable: true,
    value: mockScreenWidth,
  });
  Object.defineProperty(screen, 'height', {
    writable: true,
    configurable: true,
    value: mockScreenHeight,
  });
  Object.defineProperty(document.documentElement, 'clientWidth', {
    writable: true,
    configurable: true,
    value: mockScreenWidth,
  });
  Object.defineProperty(document.documentElement, 'clientHeight', {
    writable: true,
    configurable: true,
    value: mockScreenHeight,
  });
});

afterEach(() => {
  vi.restoreAllMocks();
});

describe('Fab', () => {
  const createTouchEvent = (type: string, touches: any[], changedTouches?: any[]) => {
    const event = new TouchEvent(type, {
      touches: touches.map(
        (t) =>
          new Touch({
            identifier: 0,
            target: document.body,
            clientX: t.clientX,
            clientY: t.clientY,
            screenX: t.clientX,
            screenY: t.clientY,
            pageX: t.clientX,
            pageY: t.clientY,
          }),
      ),
      changedTouches:
        changedTouches?.map(
          (t) =>
            new Touch({
              identifier: 0,
              target: document.body,
              clientX: t.clientX,
              clientY: t.clientY,
              screenX: t.clientX,
              screenY: t.clientY,
              pageX: t.clientX,
              pageY: t.clientY,
            }),
        ) || [],
      bubbles: true,
      cancelable: true,
    });
    return event;
  };

  describe('props', () => {
    it(': buttonProps', () => {
      const { container } = render(<Fab buttonProps={{ theme: 'danger', size: 'medium', disabled: true }} />);
      const buttonElement = container.querySelector(`.${prefix}-button`);
      expect(buttonElement?.classList.contains(`${prefix}-button--danger`)).toBeTruthy();
      expect(buttonElement?.classList.contains(`${prefix}-button--disabled`)).toBeTruthy();
    });

    it(': icon', () => {
      const { container } = render(<Fab icon={<AddIcon />} />);
      const iconElement = container.querySelector('.t-icon-add');
      expect(iconElement).toBeTruthy();
    });

    it(': text', () => {
      const { queryByText } = render(<Fab text="添加" />);
      expect(queryByText('添加')).toBeTruthy();
    });

    it(': yBounds', () => {
      const yBounds = [48, 48];
      const { container } = render(<Fab yBounds={yBounds} />);
      const fabElement = container.querySelector(name) as HTMLElement;
      expect(fabElement).toBeTruthy();
      expect(fabElement.style.right).toBe('16px');
      expect(fabElement.style.bottom).toBe('32px');
    });

    it(': xBounds', async () => {
      const xBounds = [100, 16];
      const { container } = render(<Fab draggable="horizontal" xBounds={xBounds} />);
      const fabElement = container.querySelector(name) as HTMLElement;

      act(() => {
        const touchStart = createTouchEvent('touchstart', [{ clientX: 200, clientY: 100 }]);
        fabElement!.dispatchEvent(touchStart);
      });

      act(() => {
        const touchMove = createTouchEvent('touchmove', [{ clientX: 50, clientY: 100 }]);
        fabElement!.dispatchEvent(touchMove);
      });

      act(() => {
        const touchEnd = createTouchEvent('touchend', [], [{ clientX: 50, clientY: 100 }]);
        fabElement!.dispatchEvent(touchEnd);
      });

      const rightVal = parseFloat(fabElement.style.right);
      expect(rightVal).toBeLessThanOrEqual(375 - 48 - 100);
    });

    it(': draggable', async () => {
      const onDragEnd = vi.fn();
      // draggable=true
      const { container, rerender } = render(<Fab draggable onDragEnd={onDragEnd} />);
      const fabElement = container.querySelector(name);
      const fabElementWithStyle = fabElement as HTMLElement;

      act(() => {
        const touchStart = createTouchEvent('touchstart', [{ clientX: 100, clientY: 100 }]);
        fabElement!.dispatchEvent(touchStart);
      });

      act(() => {
        const touchEnd = createTouchEvent('touchend', [], [{ clientX: 100, clientY: 100 }]);
        fabElement!.dispatchEvent(touchEnd);
      });

      await waitFor(() => {
        expect(onDragEnd).not.toHaveBeenCalled();
      });

      // draggable=all
      rerender(<Fab draggable="all" />);

      act(() => {
        const touchStart = createTouchEvent('touchstart', [{ clientX: 100, clientY: 100 }]);
        fabElement!.dispatchEvent(touchStart);
      });

      act(() => {
        const touchMove = createTouchEvent('touchmove', []);
        fabElement!.dispatchEvent(touchMove);
      });
      expect(fabElementWithStyle.style.right).toBe('16px');
      expect(fabElementWithStyle.style.bottom).toBe('32px');

      // draggable=false
      rerender(<Fab />);

      act(() => {
        const touchStart = createTouchEvent('touchstart', [{ clientX: 100, clientY: 100 }]);
        fabElement!.dispatchEvent(touchStart);
      });

      act(() => {
        const touchMove = createTouchEvent('touchmove', [{ clientX: 150, clientY: 150 }]);
        fabElement!.dispatchEvent(touchMove);
      });
      expect(fabElementWithStyle.style.right).toBe('16px');
      expect(fabElementWithStyle.style.bottom).toBe('32px');

      // draggable=vertical
      rerender(<Fab draggable="vertical" />);

      act(() => {
        const touchStart = createTouchEvent('touchstart', [{ clientX: 100, clientY: 100 }]);
        fabElement!.dispatchEvent(touchStart);
      });

      act(() => {
        const touchMove = createTouchEvent('touchmove', [{ clientX: 200, clientY: 200 }]);
        fabElement!.dispatchEvent(touchMove);
      });

      act(() => {
        const touchEnd = createTouchEvent('touchend', [], [{ clientX: 200, clientY: 200 }]);
        fabElement!.dispatchEvent(touchEnd);
      });

      await waitFor(() => {
        expect(fabElementWithStyle.style.bottom).not.toBe('32px');
      });

      // draggable=horizontal
      rerender(<Fab draggable="horizontal" />);

      act(() => {
        const touchStart = createTouchEvent('touchstart', [{ clientX: 100, clientY: 100 }]);
        fabElement!.dispatchEvent(touchStart);
      });

      act(() => {
        const touchMove = createTouchEvent('touchmove', [{ clientX: 200, clientY: 200 }]);
        fabElement!.dispatchEvent(touchMove);
      });

      act(() => {
        const touchEnd = createTouchEvent('touchend', [], [{ clientX: 200, clientY: 200 }]);
        fabElement!.dispatchEvent(touchEnd);
      });

      await waitFor(() => {
        expect(fabElementWithStyle.style.right).not.toBe('16px');
      });
    });
  });

  describe('events', () => {
    it(': onClick', async () => {
      const onClick = vi.fn();
      const { container } = render(<Fab onClick={onClick} icon={<AddIcon />} />);
      const fabElement = container.querySelector(name);

      fireEvent.click(fabElement!);

      await waitFor(() => {
        expect(onClick).toHaveBeenCalledTimes(1);
      });
    });

    it(': onDragStart', async () => {
      const onDragStart = vi.fn();
      const { container } = render(<Fab draggable onDragStart={onDragStart} />);

      const fabElement = container.querySelector(name);

      act(() => {
        fireEvent.touchStart(fabElement!, {
          touches: [{ clientX: 100, clientY: 100 }],
        });
      });

      await waitFor(() => {
        expect(onDragStart).toHaveBeenCalledTimes(1);
        expect(onDragStart).toHaveBeenCalledWith(expect.objectContaining({ e: expect.any(Object) }));
      });
    });

    it(': onDragEnd', async () => {
      const onDragEnd = vi.fn();
      const { container } = render(<Fab draggable onDragEnd={onDragEnd} />);
      const fabElement = container.querySelector(name);

      // 模拟完整拖拽序列
      act(() => {
        const touchStart = createTouchEvent('touchstart', [{ clientX: 100, clientY: 100 }]);
        fabElement!.dispatchEvent(touchStart);
      });

      act(() => {
        const touchMove = createTouchEvent('touchmove', [{ clientX: 150, clientY: 150 }]);
        fabElement!.dispatchEvent(touchMove);
      });

      act(() => {
        const touchEnd = createTouchEvent('touchend', [], [{ clientX: 150, clientY: 150 }]);
        fabElement!.dispatchEvent(touchEnd);
      });

      await waitFor(() => {
        expect(onDragEnd).toHaveBeenCalledTimes(1);
      });
    });

    it(': magnet - left', async () => {
      const { container } = render(<Fab draggable="horizontal" magnet="left" />);

      act(() => {
        const touchStart = createTouchEvent('touchstart', [{ clientX: 200, clientY: 100 }]);
        container.querySelector(name)!.dispatchEvent(touchStart);
      });

      act(() => {
        const touchMove = createTouchEvent('touchmove', [{ clientX: 100, clientY: 100 }]);
        container.querySelector(name)!.dispatchEvent(touchMove);
      });

      act(() => {
        const touchEnd = createTouchEvent('touchend', [], [{ clientX: 100, clientY: 100 }]);
        container.querySelector(name)!.dispatchEvent(touchEnd);
      });

      await waitFor(() => {
        const fabElement = container.querySelector(name) as HTMLElement;
        const rightVal = parseFloat(fabElement.style.right);
        expect(rightVal).toBeGreaterThan(16);
      });
    });

    it(': magnet - right', async () => {
      const { container } = render(<Fab draggable="horizontal" magnet="right" />);

      act(() => {
        const touchStart = createTouchEvent('touchstart', [{ clientX: 200, clientY: 100 }]);
        container.querySelector(name)!.dispatchEvent(touchStart);
      });

      act(() => {
        const touchMove = createTouchEvent('touchmove', [{ clientX: 100, clientY: 100 }]);
        container.querySelector(name)!.dispatchEvent(touchMove);
      });

      act(() => {
        const touchEnd = createTouchEvent('touchend', [], [{ clientX: 100, clientY: 100 }]);
        container.querySelector(name)!.dispatchEvent(touchEnd);
      });

      await waitFor(() => {
        const fabElement = container.querySelector(name) as HTMLElement;
        const rightVal = parseFloat(fabElement.style.right);
        expect(rightVal).toBeLessThanOrEqual(16);
      });
    });

    it(': magnet - true (auto)', async () => {
      const { container } = render(<Fab draggable="horizontal" magnet={true} />);

      act(() => {
        const touchStart = createTouchEvent('touchstart', [{ clientX: 200, clientY: 100 }]);
        container.querySelector(name)!.dispatchEvent(touchStart);
      });

      act(() => {
        const touchMove = createTouchEvent('touchmove', [{ clientX: 100, clientY: 100 }]);
        container.querySelector(name)!.dispatchEvent(touchMove);
      });

      act(() => {
        const touchEnd = createTouchEvent('touchend', [], [{ clientX: 100, clientY: 100 }]);
        container.querySelector(name)!.dispatchEvent(touchEnd);
      });

      await waitFor(() => {
        const fabElement = container.querySelector(name) as HTMLElement;
        const rightVal = parseFloat(fabElement.style.right);
        expect(rightVal).toBeLessThanOrEqual(16);
      });
    });

    it(': magnet animation class', async () => {
      const { container } = render(<Fab draggable="horizontal" magnet={true} />);
      const fabElement = container.querySelector(name) as HTMLElement;

      expect(fabElement.classList.contains(`${prefix}-fab--animation`)).toBeTruthy();

      act(() => {
        const touchStart = createTouchEvent('touchstart', [{ clientX: 200, clientY: 100 }]);
        fabElement!.dispatchEvent(touchStart);
      });

      act(() => {
        const touchMove = createTouchEvent('touchmove', [{ clientX: 100, clientY: 100 }]);
        fabElement!.dispatchEvent(touchMove);
      });

      await waitFor(() => {
        const updatedFab = container.querySelector(name) as HTMLElement;
        expect(updatedFab.classList.contains(`${prefix}-fab--animation`)).toBeFalsy();
      });
      act(() => {
        const touchEnd = createTouchEvent('touchend', [], [{ clientX: 100, clientY: 100 }]);
        fabElement!.dispatchEvent(touchEnd);
      });

      await waitFor(() => {
        const updatedFab = container.querySelector(name) as HTMLElement;
        expect(updatedFab.classList.contains(`${prefix}-fab--animation`)).toBeTruthy();
      });
    });
  });

  describe('slots', () => {
    it(': custom', () => {
      const { container } = render(
        <Fab>
          <div className="custom-content">Custom Content</div>
        </Fab>,
      );
      const buttonElement = container.querySelector(`.${prefix}-fab__button`);
      expect(buttonElement).toBeFalsy();
    });
  });
});
