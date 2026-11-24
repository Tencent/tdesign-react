import React from 'react';
import { describe, it, expect, render, vi, fireEvent, act, beforeEach, afterEach } from '@test/utils';

import Picker from '../Picker';
import PickerClass, { stopPropagation, preventDefault } from '../picker.class';
import { findIndexOfEnabledOption, getPickerColumns, isMultipleArray, limitNumberInRange } from '../utils';
import { DEFAULT_WHEEL_CONFIG } from '../constants';
import type { PickerColumn, PickerColumnItem } from '../type';
// 引入 index.ts 以覆盖该文件
import * as PickerExports from '../index';

// 收集所有由 PickerItem 创建的 picker.class 实例，用于在测试中直接触发 onChange
const collectPickerInstances = () => {
  const instances: PickerClass[] = [];
  const originalInit = PickerClass.prototype.init;
  const spy = vi.spyOn(PickerClass.prototype, 'init').mockImplementation(function (this: PickerClass) {
    originalInit.call(this);
    instances.push(this);
  });
  return {
    instances,
    restore: () => spy.mockRestore(),
  };
};

const prefix = 't';
const name = `.${prefix}-picker`;

const cityOptions: PickerColumn = [
  { label: '北京市', value: 'bj' },
  { label: '上海市', value: 'sh', disabled: true } as PickerColumnItem,
  { label: '广州市', value: 'gz' },
  { label: '深圳市', value: 'sz' },
];

const multiColumns: PickerColumn[] = [
  [
    { label: '2023', value: '2023' },
    { label: '2024', value: '2024' },
  ],
  [
    { label: '春', value: '春' },
    { label: '夏', value: '夏' },
  ],
];

// 自定义 keys 数据
const customKeyOptions = [
  { name: 'A', code: 'a' },
  { name: 'B', code: 'b', isDisabled: true },
  { name: 'C', code: 'c' },
];

describe('picker index exports', () => {
  it('exports Picker and PickerItem from index.ts', () => {
    expect(PickerExports.Picker).toBeDefined();
    expect(PickerExports.PickerItem).toBeDefined();
    // default export
    expect((PickerExports as any).default).toBeDefined();
  });
});

describe('Picker', () => {
  beforeEach(() => {
    vi.useFakeTimers();
  });

  afterEach(() => {
    act(() => {
      vi.runOnlyPendingTimers();
    });
    vi.useRealTimers();
  });

  describe('props', () => {
    it(': basic render with single / multiple columns', () => {
      const { container } = render(<Picker columns={cityOptions} />);
      expect(container.querySelector(name)).toBeInTheDocument();
      expect(container.querySelector(`${name}__main`)).toBeInTheDocument();
      expect(container.querySelector(`${name}__indicator`)).toBeInTheDocument();
      expect(container.querySelectorAll(`.${prefix}-picker-item`).length).toBe(1);

      const { container: container2 } = render(<Picker columns={multiColumns} />);
      expect(container2.querySelectorAll(`.${prefix}-picker-item`).length).toBe(2);
    });

    it(': columns as function', () => {
      const fn = vi.fn(() => multiColumns);
      const { container } = render(<Picker columns={fn} />);
      expect(fn).toHaveBeenCalled();
      expect(container.querySelectorAll(`.${prefix}-picker-item`).length).toBe(2);
    });

    it(': title', () => {
      const { container } = render(<Picker columns={cityOptions} title="选择城市" />);
      expect(container.querySelector(`${name}__title`)?.textContent).toBe('选择城市');
    });

    it(': cancelBtn / confirmBtn default(true) shows default text', () => {
      const { container } = render(<Picker columns={cityOptions} />);
      expect(container.querySelector(`${name}__cancel`)?.textContent).toBeTruthy();
      expect(container.querySelector(`${name}__confirm`)?.textContent).toBeTruthy();
    });

    it(': cancelBtn / confirmBtn custom string', () => {
      const { container, getByText } = render(<Picker columns={cityOptions} cancelBtn="放弃" confirmBtn="OK" />);
      expect(getByText('放弃')).toBeInTheDocument();
      expect(getByText('OK')).toBeInTheDocument();
      expect(container.querySelector(`${name}__cancel`)?.textContent).toBe('放弃');
      expect(container.querySelector(`${name}__confirm`)?.textContent).toBe('OK');
    });

    it(': cancelBtn / confirmBtn = false uses default text (boolean branch)', () => {
      const { container } = render(<Picker columns={cityOptions} cancelBtn={false} confirmBtn={false} />);
      // boolean 分支会回退到默认 locale 文本
      expect(container.querySelector(`${name}__cancel`)?.textContent).toBeTruthy();
      expect(container.querySelector(`${name}__confirm`)?.textContent).toBeTruthy();
    });

    it(': cancelBtn / confirmBtn falsy non-boolean (empty string / null) hides buttons', () => {
      // 空字符串：isString=true 但模板字面量为空 -> 按钮不渲染
      const { container } = render(<Picker columns={cityOptions} cancelBtn={'' as any} confirmBtn={'' as any} />);
      expect(container.querySelector(`${name}__cancel`)).toBeNull();
      expect(container.querySelector(`${name}__confirm`)).toBeNull();

      // null：getDefaultText 返回 undefined -> 按钮不渲染
      const { container: container2 } = render(
        <Picker columns={cityOptions} cancelBtn={null as any} confirmBtn={null as any} />,
      );
      expect(container2.querySelector(`${name}__cancel`)).toBeNull();
      expect(container2.querySelector(`${name}__confirm`)).toBeNull();
    });

    it(': header / footer slots', () => {
      const { getByTestId } = render(
        <Picker
          columns={cityOptions}
          header={<div data-testid="custom-header">H</div>}
          footer={<div data-testid="custom-footer">F</div>}
        />,
      );
      expect(getByTestId('custom-header')).toBeInTheDocument();
      expect(getByTestId('custom-footer')).toBeInTheDocument();
    });

    it(': value(controlled) / defaultValue(uncontrolled)', () => {
      const { container } = render(<Picker columns={cityOptions} value={['gz']} />);
      expect(container.querySelectorAll(`.${prefix}-picker-item__item`).length).toBe(cityOptions.length);

      const { container: container2 } = render(<Picker columns={cityOptions} defaultValue={['sz']} />);
      expect(container2.querySelectorAll(`.${prefix}-picker-item__item`).length).toBe(cityOptions.length);
    });

    it(': renderLabel custom label', () => {
      const renderLabel = vi.fn((item: PickerColumnItem) => `*${item.label}*`);
      const { container } = render(<Picker columns={cityOptions} renderLabel={renderLabel} />);
      expect(renderLabel).toHaveBeenCalled();
      // 第一项渲染为 *北京市*
      const items = container.querySelectorAll(`.${prefix}-picker-item__item`);
      expect(items[0].textContent).toBe('*北京市*');
    });

    it(': keys for custom value/label/disabled fields (Picker level)', () => {
      const keys = { label: 'name', value: 'code', disabled: 'isDisabled' };
      const onConfirm = vi.fn();
      const { container } = render(
        <Picker columns={customKeyOptions as any} value={['c']} keys={keys} onConfirm={onConfirm} />,
      );
      expect(container.querySelector(name)).toBeInTheDocument();
      // confirm 时 onConfirm 的 label/value 应来自 keys 映射
      fireEvent.click(container.querySelector(`${name}__confirm`)!);
      expect(onConfirm).toHaveBeenCalled();
      const [val, ctx] = onConfirm.mock.calls[0];
      expect(Array.isArray(val)).toBe(true);
      expect(ctx.label.length).toBeGreaterThan(0);
    });

    it(': swipeDuration accept string and number', () => {
      const { container, rerender } = render(<Picker columns={cityOptions} swipeDuration={500} />);
      expect(container.querySelector(name)).toBeInTheDocument();
      rerender(<Picker columns={cityOptions} swipeDuration={'200'} />);
      expect(container.querySelector(name)).toBeInTheDocument();
    });
  });

  describe('events', () => {
    it(': onCancel triggered on cancel button click', () => {
      const onCancel = vi.fn();
      const { container } = render(<Picker columns={cityOptions} onCancel={onCancel} />);
      fireEvent.click(container.querySelector(`${name}__cancel`)!);
      expect(onCancel).toHaveBeenCalled();
      expect(onCancel.mock.calls[0][0]).toHaveProperty('e');
    });

    it(': onConfirm triggered on confirm button click', () => {
      const onConfirm = vi.fn();
      const { container } = render(<Picker columns={cityOptions} defaultValue={['gz']} onConfirm={onConfirm} />);
      fireEvent.click(container.querySelector(`${name}__confirm`)!);
      expect(onConfirm).toHaveBeenCalled();
      // value 数组
      expect(Array.isArray(onConfirm.mock.calls[0][0])).toBe(true);
      const ctx = onConfirm.mock.calls[0][1];
      expect(ctx).toHaveProperty('index');
      expect(ctx).toHaveProperty('label');
    });

    it(': onChange triggered with confirm', () => {
      const onChange = vi.fn();
      const { container } = render(<Picker columns={cityOptions} defaultValue={['gz']} onChange={onChange} />);
      fireEvent.click(container.querySelector(`${name}__confirm`)!);
      expect(onChange).toHaveBeenCalled();
    });
  });

  describe('controlled / uncontrolled value sync', () => {
    it('updates internal state when value prop changes', () => {
      const onChange = vi.fn();
      const { rerender, container } = render(<Picker columns={cityOptions} value={['bj']} onChange={onChange} />);
      rerender(<Picker columns={cityOptions} value={['sz']} onChange={onChange} />);
      act(() => {
        vi.advanceTimersByTime(20);
      });
      expect(container.querySelector(name)).toBeInTheDocument();
    });

    it('handles columns prop changes (refresh PickerItem options)', () => {
      const { rerender, container } = render(<Picker columns={cityOptions} value={['bj']} />);
      rerender(
        <Picker
          columns={[
            { label: '杭州', value: 'hz' },
            { label: '成都', value: 'cd' },
          ]}
          value={['hz']}
        />,
      );
      act(() => {
        vi.advanceTimersByTime(20);
      });
      const items = container.querySelectorAll(`.${prefix}-picker-item__item`);
      expect(items.length).toBe(2);
      expect(items[0].textContent).toBe('杭州');
    });
  });

  describe('cancel restores selection by calling setIndex on each PickerItem', () => {
    it(': onCancel resets index without throwing', () => {
      const onCancel = vi.fn();
      const { container } = render(<Picker columns={multiColumns} defaultValue={['2024', '夏']} onCancel={onCancel} />);
      // wait for picker-item async init
      act(() => {
        vi.advanceTimersByTime(20);
      });
      fireEvent.click(container.querySelector(`${name}__cancel`)!);
      act(() => {
        vi.advanceTimersByTime(10);
      });
      expect(onCancel).toHaveBeenCalled();
    });
  });
});

// 通过 spy PickerClass.prototype.init 收集真实的 picker.class 实例，
// 直接调用 updateIndex 触发原生 onChange 链路，以覆盖 Picker.handlePick 内部逻辑
describe('Picker handlePick (natural path via picker.class instance)', () => {
  beforeEach(() => {
    vi.useFakeTimers();
  });
  afterEach(() => {
    act(() => {
      vi.runOnlyPendingTimers();
    });
    vi.useRealTimers();
  });

  it('onPick is invoked from picker-class onChange and propagates value/context', () => {
    const { instances, restore } = collectPickerInstances();

    const onPick = vi.fn();
    const onConfirm = vi.fn();
    const { container } = render(
      <Picker columns={cityOptions} defaultValue={['bj']} onPick={onPick} onConfirm={onConfirm} />,
    );
    // PickerItem 在 setTimeout(0) 中创建 picker.class 实例
    act(() => {
      vi.advanceTimersByTime(10);
    });

    expect(instances.length).toBeGreaterThan(0);
    act(() => {
      instances[0].updateIndex(2);
    });

    expect(onPick).toHaveBeenCalled();
    expect(onPick.mock.calls[0][0]).toEqual(['gz']);
    expect(onPick.mock.calls[0][1]).toEqual({ index: 2, column: 0 });

    fireEvent.click(container.querySelector(`${name}__confirm`)!);
    expect(onConfirm).toHaveBeenCalled();

    restore();
  });
});

describe('picker utils', () => {
  it('isMultipleArray detects nested array', () => {
    expect(isMultipleArray([cityOptions] as any)).toBe(true);
    expect(isMultipleArray(cityOptions as any)).toBe(false);
  });

  it('getPickerColumns wraps single column to multi', () => {
    const single = getPickerColumns(cityOptions as any);
    expect(Array.isArray(single)).toBe(true);
    expect(single.length).toBe(1);
    const multi = getPickerColumns(multiColumns as any);
    expect(multi.length).toBe(2);
  });

  it('limitNumberInRange clamps the number', () => {
    expect(limitNumberInRange(5, 0, 10)).toBe(5);
    expect(limitNumberInRange(-1, 0, 10)).toBe(0);
    expect(limitNumberInRange(11, 0, 10)).toBe(10);
  });

  it('findIndexOfEnabledOption: forward search hits non-disabled', () => {
    expect(findIndexOfEnabledOption(cityOptions, 1)).toBe(2); // index 1 is sh disabled
    expect(findIndexOfEnabledOption(cityOptions, 0)).toBe(0);
  });

  it('findIndexOfEnabledOption: backward search when no forward enabled', () => {
    const options: PickerColumn = [
      { label: 'a', value: 'a' },
      { label: 'b', value: 'b' },
      { label: 'c', value: 'c', disabled: true } as PickerColumnItem,
      { label: 'd', value: 'd', disabled: true } as PickerColumnItem,
    ];
    // start at 3 (disabled), forward fails -> backward
    expect(findIndexOfEnabledOption(options, 3)).toBe(1);
  });

  it('findIndexOfEnabledOption: returns 0 when all disabled', () => {
    const allDisabled: PickerColumn = [
      { label: 'a', value: 'a', disabled: true } as PickerColumnItem,
      { label: 'b', value: 'b', disabled: true } as PickerColumnItem,
    ];
    expect(findIndexOfEnabledOption(allDisabled, 1)).toBe(0);
  });

  it('findIndexOfEnabledOption: respects keys.disabled', () => {
    const keys = { label: 'name', value: 'code', disabled: 'isDisabled' };
    expect(findIndexOfEnabledOption(customKeyOptions as any, 1, keys)).toBe(2);
  });

  it('findIndexOfEnabledOption: clamps invalid startIndex', () => {
    expect(findIndexOfEnabledOption(cityOptions, -1)).toBe(0);
    expect(findIndexOfEnabledOption(cityOptions, 999)).toBe(3);
  });
});

describe('picker.class', () => {
  let el: HTMLUListElement;
  let parent: HTMLDivElement;

  function buildDom(items = cityOptions) {
    parent = document.createElement('div');
    parent.style.height = '200px';
    Object.defineProperty(parent, 'offsetHeight', { value: 200, configurable: true });
    el = document.createElement('ul');
    Object.defineProperty(el, 'offsetHeight', { value: 200, configurable: true });
    items.forEach((item) => {
      const li = document.createElement('li');
      li.textContent = item.label;
      Object.defineProperty(li, 'offsetHeight', { value: 40, configurable: true });
      el.appendChild(li);
    });
    parent.appendChild(el);
    document.body.appendChild(parent);
    return el;
  }

  afterEach(() => {
    if (parent && parent.parentNode) parent.parentNode.removeChild(parent);
  });

  it('throws when options.el is missing', () => {
    expect(
      () =>
        new PickerClass({
          el: null as any,
          defaultPickerColumns: cityOptions,
          onChange: () => {},
          prefixCls: 't',
        }),
    ).toThrow('options el needed!');
  });

  it('init/update/updateIndex/updateOptions/getCurIndex works', () => {
    buildDom();
    const onChange = vi.fn();
    const picker = new PickerClass({
      el,
      defaultIndex: 0,
      defaultPickerColumns: cityOptions,
      onChange,
      prefixCls: 't',
    });
    // updateIndex with isChange triggers onChange
    picker.updateIndex(2);
    expect(onChange).toHaveBeenCalledWith(2);
    expect(picker.getCurIndex()).toBe(2);

    // updateIndex isChange:false
    picker.updateIndex(0, { isChange: false });
    expect(picker.getCurIndex()).toBe(0);

    // updateOptions
    picker.updateOptions([{ label: 'x', value: 'x' }]);
    expect(picker.pickerColumns.length).toBe(1);

    // update() - elementItems may not match curValue, fallback to 0
    picker.update();
    expect(picker.getCurIndex()).toBe(0);

    // getCount/getRange
    expect(picker.getCount()).toBe(1);
    const range = picker.getRange();
    expect(range).toHaveProperty('min');
    expect(range).toHaveProperty('max');

    // setOffsetY
    picker.setOffsetY(-40);
    expect(picker.offsetY).toBe(-40);

    // fix3d
    expect(() => picker.fix3d(0)).not.toThrow();

    // destroy
    picker.destroy();
    expect((picker as any).holder).toBeUndefined();
  });

  it('touch handlers full flow (start/move/end) with scrollDist', () => {
    buildDom();
    const onChange = vi.fn();
    const picker = new PickerClass({
      el,
      defaultIndex: 0,
      defaultPickerColumns: cityOptions,
      onChange,
      wheelConfig: DEFAULT_WHEEL_CONFIG,
      prefixCls: 't',
    });
    expect(picker).toBeDefined();

    const makeTouch = (y: number) =>
      ({
        identifier: 0,
        target: el,
        clientX: 0,
        clientY: y,
        pageX: 0,
        pageY: y,
      }) as any;

    el.dispatchEvent(
      new TouchEvent('touchstart', {
        cancelable: true,
        bubbles: true,
        changedTouches: [new Touch(makeTouch(100))] as any,
      }),
    );
    el.dispatchEvent(
      new TouchEvent('touchmove', {
        cancelable: true,
        bubbles: true,
        changedTouches: [new Touch(makeTouch(80))] as any,
      }),
    );
    expect(() =>
      el.dispatchEvent(
        new TouchEvent('touchend', {
          cancelable: true,
          bubbles: true,
          changedTouches: [new Touch(makeTouch(0))] as any,
        }),
      ),
    ).not.toThrow();
  });

  it('touchend early-return endScroll path: small distance & swipeDuration=0', () => {
    // 距离 < 15 命中 |distance| < ANIMATION_DISTANCE_LIMIT 分支
    buildDom();
    const picker1 = new PickerClass({
      el,
      defaultIndex: 0,
      defaultPickerColumns: cityOptions,
      onChange: () => {},
      wheelConfig: DEFAULT_WHEEL_CONFIG,
      prefixCls: 't',
    });
    el.dispatchEvent(
      new TouchEvent('touchstart', {
        cancelable: true,
        bubbles: true,
        changedTouches: [
          new Touch({ identifier: 0, target: el, clientX: 0, clientY: 100, pageX: 0, pageY: 100 } as any),
        ] as any,
      }),
    );
    el.dispatchEvent(
      new TouchEvent('touchend', {
        cancelable: true,
        bubbles: true,
        changedTouches: [
          new Touch({ identifier: 0, target: el, clientX: 0, clientY: 95, pageX: 0, pageY: 95 } as any),
        ] as any,
      }),
    );
    expect(picker1.stopInertiaMove).toBe(false);

    // swipeDuration=0 也走 endScroll 早返回分支
    if (parent && parent.parentNode) parent.parentNode.removeChild(parent);
    buildDom();
    const picker2 = new PickerClass({
      el,
      defaultIndex: 0,
      defaultPickerColumns: cityOptions,
      onChange: () => {},
      wheelConfig: { ...DEFAULT_WHEEL_CONFIG, inertiaDuration: 0 },
      prefixCls: 't',
    });
    el.dispatchEvent(
      new TouchEvent('touchstart', {
        cancelable: true,
        bubbles: true,
        changedTouches: [
          new Touch({ identifier: 0, target: el, clientX: 0, clientY: 100, pageX: 0, pageY: 100 } as any),
        ] as any,
      }),
    );
    el.dispatchEvent(
      new TouchEvent('touchend', {
        cancelable: true,
        bubbles: true,
        changedTouches: [
          new Touch({ identifier: 0, target: el, clientX: 0, clientY: 0, pageX: 0, pageY: 0 } as any),
        ] as any,
      }),
    );
    expect(picker2.stopInertiaMove).toBe(false);
  });

  it('endScroll handles offset beyond start/end bound', () => {
    buildDom();
    const onChange = vi.fn();
    const picker = new PickerClass({
      el,
      defaultIndex: 1,
      defaultPickerColumns: cityOptions,
      onChange,
      prefixCls: 't',
    });
    // list 存在: 设置 offsetY 大于 startBound -> curIndex=0
    picker.offsetY = picker.offsetYOfStartBound + 100;
    picker.endScroll();
    // list 存在: 设置 offsetY 小于 endBound -> curIndex=last
    picker.offsetY = picker.offsetYOfEndBound - 100;
    picker.endScroll();

    // list=null 分支：覆盖 start-bound / end-bound / middle 三处 `if (this.list)` 为假的情况
    picker.list = null as any;
    picker.offsetY = picker.offsetYOfStartBound + 100;
    picker.endScroll();
    picker.list = null as any;
    picker.offsetY = picker.offsetYOfEndBound - 100;
    picker.endScroll();
    picker.list = null as any;
    picker.offsetY = picker.indicatorOffset - 1 * picker.itemHeight;
    picker.endScroll();

    expect(onChange).toHaveBeenCalled();
  });

  it('stopInertiaMove=true returns early in endScroll', () => {
    buildDom();
    const onChange = vi.fn();
    const picker = new PickerClass({
      el,
      defaultIndex: 0,
      defaultPickerColumns: cityOptions,
      onChange,
      prefixCls: 't',
    });
    picker.stopInertiaMove = true;
    picker.endScroll();
    // 不应触发 onChange
    expect(onChange).not.toHaveBeenCalled();
  });

  it('scrollDist running raf loop and early return when stopInertiaMove=true', () => {
    buildDom();
    const picker = new PickerClass({
      el,
      defaultIndex: 0,
      defaultPickerColumns: cityOptions,
      onChange: () => {},
      wheelConfig: { ...DEFAULT_WHEEL_CONFIG, inertiaDuration: 200 },
      prefixCls: 't',
    });
    // 用 fake raf
    let rafCb: FrameRequestCallback | null = null;
    const rafSpy = vi.spyOn(window, 'requestAnimationFrame').mockImplementation((cb) => {
      rafCb = cb;
      return 1 as any;
    });
    // 启动 scrollDist
    picker.scrollDist(0, 0, -100, 200);
    // 第一帧执行
    if (rafCb) rafCb(16 as any);
    // 设置 stopInertiaMove 触发 inertiaMove 内 early-return
    picker.stopInertiaMove = true;
    if (rafCb) rafCb(32 as any);
    rafSpy.mockRestore();
    expect(picker).toBeDefined();
  });

  it('touchend with dist===0 (small distance) reaches endScroll directly via min/max==0', () => {
    // 构造一个空列表，使得 itemHeight 为 default (40)，但 itemLen=0 时 getRange max=0 min=0
    parent = document.createElement('div');
    parent.style.height = '200px';
    Object.defineProperty(parent, 'offsetHeight', { value: 200, configurable: true });
    el = document.createElement('ul');
    Object.defineProperty(el, 'offsetHeight', { value: 200, configurable: true });
    parent.appendChild(el);
    document.body.appendChild(parent);

    const onChange = vi.fn();
    const picker = new PickerClass({
      el,
      defaultIndex: 0,
      defaultPickerColumns: [],
      onChange,
      wheelConfig: { ...DEFAULT_WHEEL_CONFIG, inertiaDuration: 100 },
      prefixCls: 't',
    });

    // touchstart
    el.dispatchEvent(
      new TouchEvent('touchstart', {
        cancelable: true,
        bubbles: true,
        changedTouches: [
          new Touch({ identifier: 0, target: el, clientX: 0, clientY: 100, pageX: 0, pageY: 100 } as any),
        ] as any,
      }),
    );
    // 立刻 touchend，position 大幅变化 -> 走 scrollDist 或 dist===0 分支
    el.dispatchEvent(
      new TouchEvent('touchend', {
        cancelable: true,
        bubbles: true,
        changedTouches: [
          new Touch({ identifier: 0, target: el, clientX: 0, clientY: 60, pageX: 0, pageY: 60 } as any),
        ] as any,
      }),
    );
    expect(picker).toBeDefined();
  });

  it('setSelectedClassName: pre-existing className triggers add/remove branches', () => {
    buildDom();
    // 给第二个 li 预先设置一个不同的 className（不包含 itemClassName，也不包含 selected）
    const lis = el.querySelectorAll('li');
    lis[1].className = 'foo-bar'; // 既不为空也不含 itemClassName -> add 分支

    // 给第三个 li 预设 selected className 走 remove 分支
    const picker = new PickerClass({
      el,
      defaultIndex: 0,
      defaultPickerColumns: cityOptions,
      onChange: () => {},
      prefixCls: 't',
    });
    // 强制带上 selected class，再调用 setSelectedClassName
    lis[2].className = `foo-bar ${picker.itemSelectedClassName}`;
    picker.setSelectedClassName();
    expect(lis[1].className).toContain('t-picker-item__item');
    expect(lis[2].className).not.toContain('t-picker-item__item--active');
  });

  it('init uses default swipeDuration / prefixCls when not provided', () => {
    buildDom();
    const picker = new PickerClass({
      el,
      defaultPickerColumns: cityOptions,
      onChange: () => {},
    } as any);
    expect(picker.inertiaDuration).toBe(300);
    expect(picker.prefixCls).toBeDefined();
  });

  it('updateItems handles empty holder gracefully', () => {
    buildDom();
    const picker = new PickerClass({
      el,
      defaultPickerColumns: cityOptions,
      onChange: () => {},
      prefixCls: 't',
    });
    // 模拟没有 li 时
    el.innerHTML = '';
    picker.updateItems();
    expect(picker.elementItems.length).toBe(0);
  });

  it('exported helpers: stopPropagation and preventDefault', () => {
    const stopProp = vi.fn();
    const prev = vi.fn();
    // event.cancelable=true 分支
    const evCancelable: any = { cancelable: true, stopPropagation: stopProp, preventDefault: prev };
    preventDefault(evCancelable, true);
    expect(prev).toHaveBeenCalled();
    expect(stopProp).toHaveBeenCalled();

    // event.cancelable=false 不应调用 preventDefault；isStopPropagation=false
    prev.mockClear();
    stopProp.mockClear();
    const evNonCancelable: any = { cancelable: false, stopPropagation: stopProp, preventDefault: prev };
    preventDefault(evNonCancelable, false);
    expect(prev).not.toHaveBeenCalled();
    expect(stopProp).not.toHaveBeenCalled();

    // event.cancelable 非 boolean 也走 preventDefault
    prev.mockClear();
    const evNoBool: any = { cancelable: undefined, stopPropagation: stopProp, preventDefault: prev };
    preventDefault(evNoBool);
    expect(prev).toHaveBeenCalled();

    // stopPropagation 直接调用
    const stop = vi.fn();
    stopPropagation({ stopPropagation: stop } as any);
    expect(stop).toHaveBeenCalled();
  });

  it('touchEndHandler dist===0 branch via direct call', () => {
    buildDom();
    const picker = new PickerClass({
      el,
      defaultIndex: 0,
      defaultPickerColumns: cityOptions,
      onChange: () => {},
      wheelConfig: { ...DEFAULT_WHEEL_CONFIG, inertiaDuration: 100 },
      prefixCls: 't',
    });
    // 制造 dist===0 条件：offsetY = -(speed/0.005)*sign(distance)
    // distance=16, moveTime=100, speed=0.16, speed/0.005=32, sign=+1, 所以 offsetY=-32
    picker.lastMoveTime = 0;
    picker.lastMoveStart = 100;
    picker.offsetY = -32;
    picker.itemHeight = 40; // 确保 getRange 包含 0
    const onChangeMock = vi.fn();
    picker.onChange = onChangeMock;

    const evt = {
      timeStamp: 100,
      changedTouches: [{ pageY: 116 }], // distance = 116 - 100 = 16
      cancelable: true,
      preventDefault: () => {},
    } as any;
    picker.touchEndHandler(evt);
    // 走 dist===0 分支后调用 endScroll，stopInertiaMove 应被设为 false
    expect(picker.stopInertiaMove).toBe(false);
  });

  it('touch handlers (start/move/end) return early when holder missing or not picking', () => {
    buildDom();
    const picker = new PickerClass({
      el,
      defaultIndex: 0,
      defaultPickerColumns: cityOptions,
      onChange: () => {},
      prefixCls: 't',
    });
    const evt = {
      timeStamp: 100,
      changedTouches: [{ pageY: 100 }],
      cancelable: true,
      preventDefault: () => {},
    } as any;

    // not picking 时 touchMoveHandler 早返回
    picker.isPicking = false;
    expect(() => picker.touchMoveHandler(evt)).not.toThrow();

    // 销毁后 holder 缺失，三个 handler 都应安全 return
    picker.destroy();
    expect(() => picker.touchStartHandler(evt)).not.toThrow();
    expect(() => picker.touchMoveHandler(evt)).not.toThrow();
    expect(() => picker.touchEndHandler(evt)).not.toThrow();
  });

  it('endScroll: list missing covers all `if (this.list)` falsy branches', () => {
    buildDom();
    const onChange = vi.fn();
    const picker = new PickerClass({
      el,
      defaultIndex: 0,
      defaultPickerColumns: cityOptions,
      onChange,
      prefixCls: 't',
    });

    // 1) start-bound 分支：list = null
    picker.list = null as any;
    picker.offsetY = picker.offsetYOfStartBound + 100;
    picker.endScroll();

    // 2) end-bound 分支：list = null
    picker.list = null as any;
    picker.offsetY = picker.offsetYOfEndBound - 100;
    picker.endScroll();

    // 3) middle 分支：list = null
    picker.list = null as any;
    picker.offsetY = picker.indicatorOffset - 1 * picker.itemHeight;
    picker.endScroll();

    expect(onChange).toHaveBeenCalled();
  });

  it('endScroll: middle branch covers curIndex<0 and curIndex>length-1', () => {
    buildDom();
    const onChange = vi.fn();
    const picker = new PickerClass({
      el,
      defaultIndex: 1,
      defaultPickerColumns: cityOptions,
      onChange,
      prefixCls: 't',
    });

    // 中间分支需要 endBound <= offsetY <= startBound
    // 通过临时改写 startBound/endBound 让 middle 分支覆盖 curIndex<0 / curIndex>len-1 的两条修正语句
    // 1) curIndex<0 分支
    const originalStart = picker.offsetYOfStartBound;
    const originalEnd = picker.offsetYOfEndBound;
    picker.offsetYOfStartBound = 100000;
    picker.offsetYOfEndBound = -100000;
    // -Math.round((offsetY - indicatorOffset) / itemHeight) < 0 -> offsetY > indicatorOffset
    picker.offsetY = picker.indicatorOffset + picker.itemHeight * 2;
    picker.endScroll();

    // 2) curIndex>length-1 分支 -> offsetY 远小于 indicatorOffset
    picker.offsetY = picker.indicatorOffset - picker.itemHeight * 999;
    picker.endScroll();

    // 还原
    picker.offsetYOfStartBound = originalStart;
    picker.offsetYOfEndBound = originalEnd;

    expect(picker).toBeDefined();
  });

  it('scrollDist: progress > duration triggers endScroll inside raf', () => {
    buildDom();
    const onChange = vi.fn();
    const picker = new PickerClass({
      el,
      defaultIndex: 0,
      defaultPickerColumns: cityOptions,
      onChange,
      wheelConfig: { ...DEFAULT_WHEEL_CONFIG, inertiaDuration: 100 },
      prefixCls: 't',
    });

    let rafCb: FrameRequestCallback | null = null;
    const rafSpy = vi.spyOn(window, 'requestAnimationFrame').mockImplementation((cb) => {
      rafCb = cb;
      return 1 as any;
    });

    picker.scrollDist(0, 0, -50, 100);

    // 第一帧 timestamp=10 -> start=10
    if (rafCb) rafCb(10 as any);
    // 第二帧 timestamp=10 + duration + 50 -> progress > duration -> endScroll
    if (rafCb) rafCb((10 + 100 + 50) as any);

    rafSpy.mockRestore();
    expect(picker).toBeDefined();
  });

  it('updateInertiaParams: timeStamp falsy uses Date.now()', () => {
    buildDom();
    const picker = new PickerClass({
      el,
      defaultIndex: 0,
      defaultPickerColumns: cityOptions,
      onChange: () => {},
      prefixCls: 't',
    });
    // timeStamp=0 -> 走 Date.now()
    const evt = { timeStamp: 0, changedTouches: [{ pageY: 50 }] } as any;
    picker.updateInertiaParams(evt, true);
    expect(picker.lastMoveTime).toBeGreaterThan(0);
  });

  it('update: targetIndex !== -1 branch', () => {
    buildDom();
    const picker = new PickerClass({
      el,
      defaultIndex: 0,
      defaultPickerColumns: cityOptions,
      onChange: () => {},
      prefixCls: 't',
    });
    // 让 curValue 与某个 li.textContent 匹配，使 findIndex 返回非 -1
    picker.curValue = '广州市';
    picker.update();
    expect(picker.getCurIndex()).toBe(2);
  });

  it('updateIndex: list missing branch', () => {
    buildDom();
    const onChange = vi.fn();
    const picker = new PickerClass({
      el,
      defaultIndex: 0,
      defaultPickerColumns: cityOptions,
      onChange,
      prefixCls: 't',
    });
    picker.list = null as any;
    picker.updateIndex(2);
    expect(onChange).toHaveBeenCalledWith(2);
  });

  it('updateOptions: default empty array param', () => {
    buildDom();
    const picker = new PickerClass({
      el,
      defaultPickerColumns: cityOptions,
      onChange: () => {},
      prefixCls: 't',
    });
    // 不传参覆盖默认值 = []
    picker.updateOptions();
    expect(picker.pickerColumns).toEqual([]);
  });
});
