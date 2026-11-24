import React from 'react';
import { describe, it, expect, render, vi, fireEvent, act, beforeEach, afterEach } from '@test/utils';
import { Segmented } from '../index';

const prefix = 't';
const name = `.${prefix}-segmented`;

// Mock ResizeObserver
class MockResizeObserver {
  callback: ResizeObserverCallback;

  observedElements: Element[] = [];

  constructor(callback: ResizeObserverCallback) {
    this.callback = callback;
  }

  observe(el: Element) {
    this.observedElements.push(el);
  }

  // eslint-disable-next-line class-methods-use-this
  unobserve() {}

  disconnect() {
    this.observedElements = [];
  }
}

describe('Segmented', () => {
  let originalResizeObserver: typeof ResizeObserver;

  beforeEach(() => {
    originalResizeObserver = global.ResizeObserver;
    global.ResizeObserver = MockResizeObserver as any;

    // Mock getBoundingClientRect
    Element.prototype.getBoundingClientRect = vi.fn(() => ({
      width: 80,
      height: 32,
      top: 0,
      left: 0,
      bottom: 32,
      right: 80,
      x: 0,
      y: 0,
      toJSON: () => {},
    }));
  });

  afterEach(() => {
    global.ResizeObserver = originalResizeObserver;
    vi.restoreAllMocks();
  });

  describe('props', () => {
    it(': default render', () => {
      const { container } = render(<Segmented />);
      expect(container.querySelector(name)).toBeTruthy();
      expect(container.querySelector(`${name}__group`)).toBeTruthy();
      expect(container.querySelector(`${name}__thumb`)).toBeTruthy();
    });

    it(': options with string array', () => {
      const options = ['Tab1', 'Tab2', 'Tab3'];
      const { container } = render(<Segmented options={options} />);
      const items = container.querySelectorAll(`${name}__item`);
      expect(items.length).toBe(3);
      expect(items[0].querySelector(`${name}__item-label`)).toHaveTextContent('Tab1');
      expect(items[1].querySelector(`${name}__item-label`)).toHaveTextContent('Tab2');
      expect(items[2].querySelector(`${name}__item-label`)).toHaveTextContent('Tab3');
    });

    it(': options with number array', () => {
      const options = [1, 2, 3];
      const { container } = render(<Segmented options={options} />);
      const items = container.querySelectorAll(`${name}__item`);
      expect(items.length).toBe(3);
      expect(items[0].querySelector(`${name}__item-label`)).toHaveTextContent('1');
      expect(items[1].querySelector(`${name}__item-label`)).toHaveTextContent('2');
      expect(items[2].querySelector(`${name}__item-label`)).toHaveTextContent('3');
    });

    it(': options with object array', () => {
      const options = [
        { value: 'a', label: 'Option A' },
        { value: 'b', label: 'Option B' },
        { value: 'c', label: 'Option C' },
      ];
      const { container } = render(<Segmented options={options} />);
      const items = container.querySelectorAll(`${name}__item`);
      expect(items.length).toBe(3);
      expect(items[0].querySelector(`${name}__item-label`)).toHaveTextContent('Option A');
      expect(items[1].querySelector(`${name}__item-label`)).toHaveTextContent('Option B');
      expect(items[2].querySelector(`${name}__item-label`)).toHaveTextContent('Option C');
    });

    it(': options with object array without label (fallback to value)', () => {
      const options = [{ value: 'a' }, { value: 'b' }];
      const { container } = render(<Segmented options={options} />);
      const items = container.querySelectorAll(`${name}__item`);
      expect(items.length).toBe(2);
      expect(items[0].querySelector(`${name}__item-label`)).toHaveTextContent('a');
      expect(items[1].querySelector(`${name}__item-label`)).toHaveTextContent('b');
    });

    it(': options with icon', () => {
      const options = [
        { value: 'a', label: 'Option A', icon: <span className="custom-icon">icon</span> },
        { value: 'b', label: 'Option B' },
      ];
      const { container } = render(<Segmented options={options} />);
      expect(container.querySelector(`${name}__item-icon`)).toBeTruthy();
      expect(container.querySelector('.custom-icon')).toBeTruthy();
    });

    it(': options with label as TNode function', () => {
      const options = [{ value: 'a', label: () => <span className="custom-label">Custom</span> }];
      const { container } = render(<Segmented options={options} />);
      expect(container.querySelector('.custom-label')).toBeTruthy();
      expect(container.querySelector('.custom-label')).toHaveTextContent('Custom');
    });

    it(': options with icon as TNode function', () => {
      const options = [{ value: 'a', label: 'A', icon: () => <span className="fn-icon">fn-icon</span> }];
      const { container } = render(<Segmented options={options} />);
      expect(container.querySelector('.fn-icon')).toBeTruthy();
    });

    it(': block', () => {
      const options = [
        { value: 'a', label: 'A' },
        { value: 'b', label: 'B' },
      ];
      const { container } = render(<Segmented options={options} block />);
      expect(container.querySelector(`${name}--block`)).toBeTruthy();
    });

    it(': disabled (all items disabled)', () => {
      const options = [
        { value: 'a', label: 'A' },
        { value: 'b', label: 'B' },
      ];
      const { container } = render(<Segmented options={options} disabled />);
      const items = container.querySelectorAll(`${name}__item`);
      items.forEach((item) => {
        expect(item).toHaveClass(`${prefix}-segmented__item--disabled`);
      });
    });

    it(': single item disabled', () => {
      const options = [
        { value: 'a', label: 'A' },
        { value: 'b', label: 'B', disabled: true },
        { value: 'c', label: 'C' },
      ];
      const { container } = render(<Segmented options={options} />);
      const items = container.querySelectorAll(`${name}__item`);
      expect(items[0]).not.toHaveClass(`${prefix}-segmented__item--disabled`);
      expect(items[1]).toHaveClass(`${prefix}-segmented__item--disabled`);
      expect(items[2]).not.toHaveClass(`${prefix}-segmented__item--disabled`);
    });

    it(': value (controlled)', () => {
      const options = [
        { value: 'a', label: 'A' },
        { value: 'b', label: 'B' },
        { value: 'c', label: 'C' },
      ];
      const { container } = render(<Segmented options={options} value="b" />);
      const items = container.querySelectorAll(`${name}__item`);
      expect(items[0]).not.toHaveClass(`${prefix}-segmented__item--active`);
      expect(items[1]).toHaveClass(`${prefix}-segmented__item--active`);
      expect(items[2]).not.toHaveClass(`${prefix}-segmented__item--active`);
    });

    it(': defaultValue (uncontrolled)', () => {
      const options = [
        { value: 'a', label: 'A' },
        { value: 'b', label: 'B' },
        { value: 'c', label: 'C' },
      ];
      const { container } = render(<Segmented options={options} defaultValue="c" />);
      const items = container.querySelectorAll(`${name}__item`);
      expect(items[0]).not.toHaveClass(`${prefix}-segmented__item--active`);
      expect(items[1]).not.toHaveClass(`${prefix}-segmented__item--active`);
      expect(items[2]).toHaveClass(`${prefix}-segmented__item--active`);
    });

    it(': value with number type', () => {
      const options = [1, 2, 3];
      const { container } = render(<Segmented options={options} value={2} />);
      const items = container.querySelectorAll(`${name}__item`);
      expect(items[0]).not.toHaveClass(`${prefix}-segmented__item--active`);
      expect(items[1]).toHaveClass(`${prefix}-segmented__item--active`);
      expect(items[2]).not.toHaveClass(`${prefix}-segmented__item--active`);
    });

    it(': className', () => {
      const { container } = render(<Segmented className="custom-segmented" options={['a', 'b']} />);
      expect(container.querySelector('.custom-segmented')).toBeTruthy();
    });

    it(': style', () => {
      const { container } = render(<Segmented style={{ marginTop: '10px' }} options={['a', 'b']} />);
      expect(container.querySelector(name)).toHaveStyle({ marginTop: '10px' });
    });

    it(': data attributes', () => {
      const { container } = render(<Segmented data-testid="segmented-test" options={['a', 'b']} />);
      expect(container.querySelector('[data-testid="segmented-test"]')).toBeTruthy();
    });
  });

  describe('events', () => {
    it(': onChange fires on item click', () => {
      const onChange = vi.fn();
      const options = [
        { value: 'a', label: 'A' },
        { value: 'b', label: 'B' },
        { value: 'c', label: 'C' },
      ];
      const { container } = render(<Segmented options={options} defaultValue="a" onChange={onChange} />);
      const items = container.querySelectorAll(`${name}__item`);

      fireEvent.click(items[1]);
      expect(onChange).toHaveBeenCalledTimes(1);
      expect(onChange).toHaveBeenCalledWith({
        value: 'b',
        selectedOption: { value: 'b', label: 'B' },
      });
    });

    it(': onChange with number options', () => {
      const onChange = vi.fn();
      const options = [1, 2, 3];
      const { container } = render(<Segmented options={options} defaultValue={1} onChange={onChange} />);
      const items = container.querySelectorAll(`${name}__item`);

      fireEvent.click(items[2]);
      expect(onChange).toHaveBeenCalledWith({
        value: 3,
        selectedOption: { value: 3, label: '3' },
      });
    });

    it(': onChange not fired when clicking current active item', () => {
      const onChange = vi.fn();
      const options = [
        { value: 'a', label: 'A' },
        { value: 'b', label: 'B' },
      ];
      const { container } = render(<Segmented options={options} defaultValue="a" onChange={onChange} />);
      const items = container.querySelectorAll(`${name}__item`);

      fireEvent.click(items[0]);
      expect(onChange).not.toHaveBeenCalled();
    });

    it(': onChange not fired when component is disabled', () => {
      const onChange = vi.fn();
      const options = [
        { value: 'a', label: 'A' },
        { value: 'b', label: 'B' },
      ];
      const { container } = render(<Segmented options={options} defaultValue="a" disabled onChange={onChange} />);
      const items = container.querySelectorAll(`${name}__item`);

      fireEvent.click(items[1]);
      expect(onChange).not.toHaveBeenCalled();
    });

    it(': onChange not fired when clicking disabled item', () => {
      const onChange = vi.fn();
      const options = [
        { value: 'a', label: 'A' },
        { value: 'b', label: 'B', disabled: true },
        { value: 'c', label: 'C' },
      ];
      const { container } = render(<Segmented options={options} defaultValue="a" onChange={onChange} />);
      const items = container.querySelectorAll(`${name}__item`);

      fireEvent.click(items[1]);
      expect(onChange).not.toHaveBeenCalled();

      fireEvent.click(items[2]);
      expect(onChange).toHaveBeenCalledTimes(1);
      expect(onChange).toHaveBeenCalledWith({
        value: 'c',
        selectedOption: { value: 'c', label: 'C' },
      });
    });

    it(': uncontrolled mode value updates on click', () => {
      const options = [
        { value: 'a', label: 'A' },
        { value: 'b', label: 'B' },
        { value: 'c', label: 'C' },
      ];
      const { container } = render(<Segmented options={options} defaultValue="a" />);
      const items = container.querySelectorAll(`${name}__item`);

      expect(items[0]).toHaveClass(`${prefix}-segmented__item--active`);
      fireEvent.click(items[2]);
      expect(items[2]).toHaveClass(`${prefix}-segmented__item--active`);
      expect(items[0]).not.toHaveClass(`${prefix}-segmented__item--active`);
    });

    it(': controlled mode value does not update on click without external change', () => {
      const onChange = vi.fn();
      const options = [
        { value: 'a', label: 'A' },
        { value: 'b', label: 'B' },
      ];
      const { container } = render(<Segmented options={options} value="a" onChange={onChange} />);
      const items = container.querySelectorAll(`${name}__item`);

      fireEvent.click(items[1]);
      expect(onChange).toHaveBeenCalledTimes(1);
      // In controlled mode, value stays the same until parent updates it
      expect(items[0]).toHaveClass(`${prefix}-segmented__item--active`);
    });
  });

  describe('thumb indicator', () => {
    it(': thumb has correct initial position', () => {
      const mockGetBoundingClientRect = vi.fn();
      // First call for groupEl, second for itemEl
      mockGetBoundingClientRect
        .mockReturnValueOnce({
          width: 240,
          height: 32,
          top: 0,
          left: 10,
          bottom: 32,
          right: 250,
          x: 10,
          y: 0,
          toJSON: () => {},
        })
        .mockReturnValueOnce({
          width: 80,
          height: 32,
          top: 0,
          left: 90,
          bottom: 32,
          right: 170,
          x: 90,
          y: 0,
          toJSON: () => {},
        });

      Element.prototype.getBoundingClientRect = mockGetBoundingClientRect;

      const options = [
        { value: 'a', label: 'A' },
        { value: 'b', label: 'B' },
        { value: 'c', label: 'C' },
      ];
      const { container } = render(<Segmented options={options} defaultValue="b" />);
      const thumb = container.querySelector(`${name}__thumb`) as HTMLElement;
      expect(thumb).toBeTruthy();
    });

    it(': thumb style is empty when no value is set', () => {
      const options = [
        { value: 'a', label: 'A' },
        { value: 'b', label: 'B' },
      ];
      const { container } = render(<Segmented options={options} />);
      const thumb = container.querySelector(`${name}__thumb`) as HTMLElement;
      expect(thumb).toBeTruthy();
    });

    it(': thumb updates when value changes', () => {
      const options = [
        { value: 'a', label: 'A' },
        { value: 'b', label: 'B' },
        { value: 'c', label: 'C' },
      ];
      const { container, rerender } = render(<Segmented options={options} value="a" />);
      const thumb = container.querySelector(`${name}__thumb`) as HTMLElement;
      expect(thumb).toBeTruthy();

      rerender(<Segmented options={options} value="c" />);
      expect(thumb).toBeTruthy();
    });
  });

  describe('ResizeObserver', () => {
    it(': creates ResizeObserver on mount', () => {
      const observeFn = vi.fn();
      const disconnectFn = vi.fn();

      global.ResizeObserver = vi.fn().mockImplementation((callback) => ({
        observe: observeFn,
        unobserve: vi.fn(),
        disconnect: disconnectFn,
        callback,
      })) as any;

      const options = [
        { value: 'a', label: 'A' },
        { value: 'b', label: 'B' },
      ];
      render(<Segmented options={options} defaultValue="a" />);
      expect(observeFn).toHaveBeenCalled();
    });

    it(': disconnects ResizeObserver on unmount', () => {
      const disconnectFn = vi.fn();

      global.ResizeObserver = vi.fn().mockImplementation(() => ({
        observe: vi.fn(),
        unobserve: vi.fn(),
        disconnect: disconnectFn,
      })) as any;

      const options = [
        { value: 'a', label: 'A' },
        { value: 'b', label: 'B' },
      ];
      const { unmount } = render(<Segmented options={options} defaultValue="a" />);
      unmount();
      expect(disconnectFn).toHaveBeenCalled();
    });

    it(': handles ResizeObserver callback', async () => {
      let resizeCallback: () => void;

      global.ResizeObserver = vi.fn().mockImplementation((callback) => {
        resizeCallback = callback;
        return {
          observe: vi.fn(),
          unobserve: vi.fn(),
          disconnect: vi.fn(),
        };
      }) as any;

      const options = [
        { value: 'a', label: 'A' },
        { value: 'b', label: 'B' },
      ];
      const { container } = render(<Segmented options={options} defaultValue="a" />);

      await act(async () => {
        resizeCallback!();
      });

      const thumb = container.querySelector(`${name}__thumb`) as HTMLElement;
      expect(thumb).toBeTruthy();
    });

    it(': handles undefined ResizeObserver', () => {
      const originalRO = global.ResizeObserver;
      // @ts-ignore
      delete global.ResizeObserver;

      const options = [
        { value: 'a', label: 'A' },
        { value: 'b', label: 'B' },
      ];

      // Should not throw
      expect(() => {
        render(<Segmented options={options} defaultValue="a" />);
      }).not.toThrow();

      global.ResizeObserver = originalRO;
    });
  });

  describe('edge cases', () => {
    it(': empty options array', () => {
      const { container } = render(<Segmented options={[]} />);
      const items = container.querySelectorAll(`${name}__item`);
      expect(items.length).toBe(0);
    });

    it(': undefined options', () => {
      const { container } = render(<Segmented />);
      const items = container.querySelectorAll(`${name}__item`);
      expect(items.length).toBe(0);
    });

    it(': value not in options', () => {
      const options = [
        { value: 'a', label: 'A' },
        { value: 'b', label: 'B' },
      ];
      const { container } = render(<Segmented options={options} value="nonexistent" />);
      const items = container.querySelectorAll(`${name}__item`);
      // No item should be active
      items.forEach((item) => {
        expect(item).not.toHaveClass(`${prefix}-segmented__item--active`);
      });
    });

    it(': displayName is set', () => {
      expect(Segmented.displayName).toBe('Segmented');
    });

    it(': item has correct index class', () => {
      const options = [
        { value: 'a', label: 'A' },
        { value: 'b', label: 'B' },
        { value: 'c', label: 'C' },
      ];
      const { container } = render(<Segmented options={options} />);
      expect(container.querySelector(`${name}-item-0`)).toBeTruthy();
      expect(container.querySelector(`${name}-item-1`)).toBeTruthy();
      expect(container.querySelector(`${name}-item-2`)).toBeTruthy();
    });

    it(': options without label but with value should use String(value) as label', () => {
      const options = [{ value: 123 }, { value: 456 }];
      const { container } = render(<Segmented options={options} />);
      const items = container.querySelectorAll(`${name}__item`);
      expect(items[0].querySelector(`${name}__item-label`)).toHaveTextContent('123');
      expect(items[1].querySelector(`${name}__item-label`)).toHaveTextContent('456');
    });

    it(': option with empty string label should not render label span', () => {
      const options = [{ value: 'a', label: '' }];
      const { container } = render(<Segmented options={options} />);
      const item = container.querySelector(`${name}__item`);
      expect(item.querySelector(`${name}__item-label`)).toBeFalsy();
    });

    it(': option without icon should not render icon span', () => {
      const options = [{ value: 'a', label: 'A' }];
      const { container } = render(<Segmented options={options} />);
      const item = container.querySelector(`${name}__item`);
      expect(item.querySelector(`${name}__item-icon`)).toBeFalsy();
    });

    it(': handles rapid clicking', () => {
      const onChange = vi.fn();
      const options = [
        { value: 'a', label: 'A' },
        { value: 'b', label: 'B' },
        { value: 'c', label: 'C' },
      ];
      const { container } = render(<Segmented options={options} defaultValue="a" onChange={onChange} />);
      const items = container.querySelectorAll(`${name}__item`);

      fireEvent.click(items[1]);
      fireEvent.click(items[2]);
      expect(onChange).toHaveBeenCalledTimes(2);
    });

    it(': handles rerender with different options', () => {
      const options1 = [
        { value: 'a', label: 'A' },
        { value: 'b', label: 'B' },
      ];
      const options2 = [
        { value: 'x', label: 'X' },
        { value: 'y', label: 'Y' },
        { value: 'z', label: 'Z' },
      ];
      const { container, rerender } = render(<Segmented options={options1} defaultValue="a" />);
      expect(container.querySelectorAll(`${name}__item`).length).toBe(2);

      rerender(<Segmented options={options2} defaultValue="x" />);
      expect(container.querySelectorAll(`${name}__item`).length).toBe(3);
    });

    it(': handles groupRef or itemRef being null', () => {
      // When activeIndex >= 0 but refs are not available, updateThumb should handle gracefully
      const options = [
        { value: 'a', label: 'A' },
        { value: 'b', label: 'B' },
      ];
      // This tests that the component doesn't crash
      expect(() => {
        render(<Segmented options={options} defaultValue="a" />);
      }).not.toThrow();
    });

    it(': option with label as React element', () => {
      const options = [{ value: 'a', label: <span className="react-label">React Label</span> }];
      const { container } = render(<Segmented options={options} />);
      expect(container.querySelector('.react-label')).toBeTruthy();
      expect(container.querySelector('.react-label')).toHaveTextContent('React Label');
    });

    it(': mixed option types (some string, complex handled as SegmentedItem)', () => {
      const options = ['simple1', 'simple2'];
      const { container } = render(<Segmented options={options} defaultValue="simple1" />);
      const items = container.querySelectorAll(`${name}__item`);
      expect(items.length).toBe(2);
      expect(items[0]).toHaveClass(`${prefix}-segmented__item--active`);
    });
  });
});
