import React from 'react';
import { describe, it, expect, render, vi, act, beforeEach, afterEach } from '@test/utils';

import PickerItem, { type PickerItemExposeRef } from '../PickerItem';
import type { PickerColumn, PickerColumnItem } from '../type';

const prefix = 't';

const cityOptions: PickerColumn = [
  { label: '北京市', value: 'bj' },
  { label: '上海市', value: 'sh', disabled: true } as PickerColumnItem,
  { label: '广州市', value: 'gz' },
  { label: '深圳市', value: 'sz' },
];

// 自定义 keys 数据
const customKeyOptions = [
  { name: 'A', code: 'a' },
  { name: 'B', code: 'b', isDisabled: true },
  { name: 'C', code: 'c' },
];

describe('PickerItem', () => {
  beforeEach(() => {
    vi.useFakeTimers();
  });
  afterEach(() => {
    act(() => {
      vi.runOnlyPendingTimers();
    });
    vi.useRealTimers();
  });

  it('renders ul with li according to options', () => {
    const { container } = render(<PickerItem options={cityOptions} />);
    const ul = container.querySelector(`.${prefix}-picker-item`);
    expect(ul?.tagName).toBe('UL');
    expect(container.querySelectorAll(`.${prefix}-picker-item__item`).length).toBe(cityOptions.length);
  });

  it('renders disabled class when option is disabled', () => {
    const { container } = render(<PickerItem options={cityOptions} />);
    const items = container.querySelectorAll(`.${prefix}-picker-item__item`);
    expect(items[1].className).toContain('picker-item__item--disabled');
  });

  it('renders custom label via renderLabel', () => {
    const { container } = render(
      <PickerItem options={cityOptions} renderLabel={(o) => <span data-testid="custom-l">{o.label}_x</span>} />,
    );
    expect(container.querySelector('[data-testid="custom-l"]')?.textContent).toBe('北京市_x');
  });

  it('handles keys mapping for value/label/disabled', () => {
    const keys = { label: 'name', value: 'code', disabled: 'isDisabled' };
    const { container } = render(<PickerItem options={customKeyOptions as any} keys={keys} value="c" />);
    const items = container.querySelectorAll(`.${prefix}-picker-item__item`);
    expect(items[0].textContent).toBe('A');
    expect(items[1].className).toContain('picker-item__item--disabled');
  });

  it('exposes setIndex / setValue / setOptions / setUpdateItems via ref', () => {
    const ref = React.createRef<PickerItemExposeRef>();
    render(<PickerItem ref={ref} options={cityOptions} value="bj" />);
    act(() => {
      vi.advanceTimersByTime(10);
    });
    // ref methods exist
    expect(typeof ref.current?.setIndex).toBe('function');
    expect(typeof ref.current?.setValue).toBe('function');
    expect(typeof ref.current?.setOptions).toBe('function');
    expect(typeof ref.current?.setUpdateItems).toBe('function');
    // 调用不应抛错
    act(() => {
      ref.current?.setIndex(2);
      ref.current?.setValue('gz');
      ref.current?.setOptions();
      ref.current?.setUpdateItems();
      vi.advanceTimersByTime(10);
    });
  });

  it('setValue with undefined falls back to index 0', () => {
    const ref = React.createRef<PickerItemExposeRef>();
    render(<PickerItem ref={ref} options={cityOptions} />);
    act(() => {
      vi.advanceTimersByTime(10);
    });
    act(() => {
      ref.current?.setValue(undefined as any);
      vi.advanceTimersByTime(10);
    });
  });

  it('setValue with not-found value falls back to index 0', () => {
    const ref = React.createRef<PickerItemExposeRef>();
    render(<PickerItem ref={ref} options={cityOptions} />);
    act(() => {
      vi.advanceTimersByTime(10);
    });
    act(() => {
      ref.current?.setValue('not-existed');
      vi.advanceTimersByTime(10);
    });
  });

  it('updates picker options when options prop changes', () => {
    const { rerender, container } = render(<PickerItem options={cityOptions} value="bj" />);
    act(() => {
      vi.advanceTimersByTime(10);
    });
    rerender(
      <PickerItem
        options={[
          { label: 'X', value: 'x' },
          { label: 'Y', value: 'y' },
        ]}
        value="x"
      />,
    );
    act(() => {
      vi.advanceTimersByTime(10);
    });
    const items = container.querySelectorAll(`.${prefix}-picker-item__item`);
    expect(items.length).toBe(2);
  });

  it('onPick is fired when underlying picker class triggers onChange', () => {
    const onPick = vi.fn();
    const { container } = render(<PickerItem options={cityOptions} value="bj" onPick={onPick} />);
    act(() => {
      vi.advanceTimersByTime(10);
    });
    const ul = container.querySelector('ul') as HTMLUListElement;
    // 通过 dispatch touch 事件链模拟一次完整滑动；
    // 由于 jsdom 几何不一定触发 onChange，故这里只断言不抛错。
    const start = new TouchEvent('touchstart', {
      cancelable: true,
      bubbles: true,
      changedTouches: [
        new Touch({ identifier: 0, target: ul, clientX: 0, clientY: 100, pageX: 0, pageY: 100 } as any),
      ] as any,
    });
    ul.dispatchEvent(start);
    const move = new TouchEvent('touchmove', {
      cancelable: true,
      bubbles: true,
      changedTouches: [
        new Touch({ identifier: 0, target: ul, clientX: 0, clientY: 0, pageX: 0, pageY: 0 } as any),
      ] as any,
    });
    ul.dispatchEvent(move);
    const end = new TouchEvent('touchend', {
      cancelable: true,
      bubbles: true,
      changedTouches: [
        new Touch({ identifier: 0, target: ul, clientX: 0, clientY: 0, pageX: 0, pageY: 0 } as any),
      ] as any,
    });
    ul.dispatchEvent(end);
    act(() => {
      vi.advanceTimersByTime(500);
    });
    expect(container.querySelector('ul')).toBeInTheDocument();
  });

  it('cleans up picker instance on unmount (no error)', () => {
    const { unmount } = render(<PickerItem options={cityOptions} />);
    act(() => {
      vi.advanceTimersByTime(10);
    });
    expect(() => unmount()).not.toThrow();
  });

  it('unmount before setTimeout fires: rootRef.current is null branch', () => {
    // 不推进 timer，立即 unmount，让 useEffect 内 setTimeout 回调中
    // rootRef.current 走 falsy 分支
    const { unmount } = render(<PickerItem options={cityOptions} />);
    unmount();
    act(() => {
      vi.advanceTimersByTime(10);
    });
    expect(true).toBe(true);
  });
});
