import React from 'react';
import { describe, it, expect, render, vi, fireEvent } from '@test/utils';

import TreeSelect from '../tree-select';

const prefix = 't';
const name = `.${prefix}-tree-select`;

const twoLevelOptions = [
  {
    label: '广东省',
    value: 'guangdong',
    children: [
      { label: '广州市', value: 'guangzhou' },
      { label: '深圳市', value: 'shenzhen' },
    ],
  },
  {
    label: '江苏省',
    value: 'jiangsu',
    children: [
      { label: '南京市', value: 'nanjing' },
      { label: '苏州市', value: 'suzhou', disabled: true },
    ],
  },
];

const threeLevelOptions = [
  {
    label: '广东省',
    value: 'guangdong',
    children: [
      {
        label: '广州市',
        value: 'guangzhou',
        children: [
          { label: '天河区', value: 'tianhe' },
          { label: '越秀区', value: 'yuexiu', disabled: true },
        ],
      },
      {
        label: '深圳市',
        value: 'shenzhen',
        disabled: true,
        children: [{ label: '南山区', value: 'nanshan' }],
      },
    ],
  },
];

describe('TreeSelect', () => {
  describe('props', () => {
    it(': className & style root', () => {
      const { container } = render(<TreeSelect options={twoLevelOptions} value={['guangdong']} />);
      expect(container.querySelector(name)).toBeTruthy();
    });

    it(': height (number)', () => {
      const { container } = render(<TreeSelect height={500} options={twoLevelOptions} value={['guangdong']} />);
      const root = container.querySelector(name) as HTMLElement;
      expect(root.style.height).toBe('500px');
    });

    it(': height (string)', () => {
      const { container } = render(<TreeSelect height="50vh" options={twoLevelOptions} value={['guangdong']} />);
      const root = container.querySelector(name) as HTMLElement;
      expect(root.style.height).toBe('50vh');
    });

    it(': default height when not provided', () => {
      const { container } = render(<TreeSelect options={twoLevelOptions} value={['guangdong']} />);
      const root = container.querySelector(name) as HTMLElement;
      expect(root.style.height).toBe('336px');
    });

    it(': options empty should render empty', () => {
      const { container } = render(<TreeSelect options={[]} />);
      expect(container.querySelector(name)).toBeTruthy();
      expect(container.querySelectorAll(`${name}__column`)).toHaveLength(0);
    });

    it(': options renders columns', () => {
      const { container } = render(<TreeSelect options={twoLevelOptions} value={['guangdong']} />);
      expect(container.querySelectorAll(`${name}__column`)).toHaveLength(2);
    });

    it(': keys (custom field alias)', () => {
      const customOptions = [
        {
          name: '广东省',
          key: 'guangdong',
          children: [
            { name: '广州市', key: 'guangzhou' },
            { name: '深圳市', key: 'shenzhen' },
          ],
        },
      ];
      const { container } = render(
        <TreeSelect options={customOptions} keys={{ label: 'name', value: 'key' }} value={['guangdong']} />,
      );
      expect(container.querySelector(name)).toBeTruthy();
      // 第一列的 SideBar 应渲染出 label
      expect(container.querySelector('.t-side-bar-item').textContent).toContain('广东省');
    });

    it(': defaultValue (uncontrolled)', () => {
      const { container } = render(<TreeSelect options={twoLevelOptions} defaultValue={['jiangsu']} />);
      // 应根据 defaultValue 渲染对应的子节点
      const radios = container.querySelectorAll('.t-radio');
      // 江苏省下面有 2 个城市
      expect(radios.length).toBe(2);
    });

    it(': value (controlled) renders matching second column', () => {
      const { container } = render(<TreeSelect options={twoLevelOptions} value={['guangdong', 'shenzhen']} />);
      // leaf 层为单选 Radio
      const radios = container.querySelectorAll('.t-radio');
      expect(radios.length).toBe(2);
    });

    it(': value as empty array renders nothing', () => {
      const { container } = render(<TreeSelect options={twoLevelOptions} value={[]} />);
      expect(container.querySelectorAll(`${name}__column`)).toHaveLength(0);
    });

    it(': multiple uses Checkbox at leaf level', () => {
      const { container } = render(<TreeSelect options={twoLevelOptions} multiple value={['guangdong', []]} />);
      expect(container.querySelector('.t-checkbox-group')).toBeTruthy();
      expect(container.querySelectorAll('.t-checkbox').length).toBe(2);
    });

    it(': non-multiple uses Radio at leaf level', () => {
      const { container } = render(<TreeSelect options={twoLevelOptions} value={['guangdong']} />);
      expect(container.querySelector('.t-radio-group')).toBeTruthy();
      expect(container.querySelectorAll('.t-radio').length).toBe(2);
    });

    it(': three-level options renders middle column', () => {
      const { container } = render(<TreeSelect options={threeLevelOptions} value={['guangdong', 'guangzhou']} />);
      expect(container.querySelectorAll(`${name}__column`)).toHaveLength(3);
      // 中间列存在
      expect(container.querySelectorAll(`${name}__item`).length).toBe(2);
    });

    it(': middle column highlights active item', () => {
      const { container } = render(<TreeSelect options={threeLevelOptions} value={['guangdong', 'guangzhou']} />);
      const activeItems = container.querySelectorAll(`${name}__item--active`);
      expect(activeItems.length).toBe(1);
      expect(activeItems[0].textContent).toContain('广州市');
    });

    it(': middle column shows disabled item', () => {
      const { container } = render(<TreeSelect options={threeLevelOptions} value={['guangdong', 'guangzhou']} />);
      expect(container.querySelector(`${name}__item--disabled`)).toBeTruthy();
    });

    it(': leaf level disabled radio', () => {
      const { container } = render(<TreeSelect options={twoLevelOptions} value={['jiangsu']} />);
      // 江苏省的苏州市 disabled，会渲染 disabled 输入框
      const disabledInputs = container.querySelectorAll('.t-radio input[disabled]');
      expect(disabledInputs.length).toBe(1);
    });

    it(': value not matching falls back to first child', () => {
      const { container } = render(<TreeSelect options={twoLevelOptions} value={['not-exist']} />);
      // 应正常渲染列
      expect(container.querySelectorAll(`${name}__column`)).toHaveLength(2);
    });
  });

  describe('events', () => {
    it(': onChange triggered when click side-bar item (level 0)', () => {
      const handleChange = vi.fn();
      const { container } = render(
        <TreeSelect options={twoLevelOptions} value={['guangdong']} onChange={handleChange} />,
      );
      const sideBarItems = container.querySelectorAll('.t-side-bar-item');
      // 点击第二个省份
      fireEvent.click(sideBarItems[1]);
      expect(handleChange).toHaveBeenCalled();
      const lastCall = handleChange.mock.calls[handleChange.mock.calls.length - 1];
      expect(lastCall[0]).toEqual(['jiangsu']);
      expect(lastCall[1]).toBe(0);
    });

    it(': onChange triggered when click middle-level item', () => {
      const handleChange = vi.fn();
      const { container } = render(
        <TreeSelect options={threeLevelOptions} value={['guangdong', 'guangzhou']} onChange={handleChange} />,
      );
      const items = container.querySelectorAll(`${name}__item`);
      // 点击 深圳市（disabled）
      fireEvent.click(items[1]);
      // 因为 disabled，不应触发 change（来自 middle item）
      // 但点击其它项会触发
      fireEvent.click(items[0]);
      expect(handleChange).toHaveBeenCalled();
    });

    it(': click disabled middle item does not trigger change', () => {
      const handleChange = vi.fn();
      const { container } = render(
        <TreeSelect options={threeLevelOptions} value={['guangdong', 'guangzhou']} onChange={handleChange} />,
      );
      handleChange.mockClear();
      const disabledItem = container.querySelector(`${name}__item--disabled`);
      fireEvent.click(disabledItem);
      expect(handleChange).not.toHaveBeenCalled();
    });

    it(': onChange triggered when click radio (leaf single select)', () => {
      const handleChange = vi.fn();
      const { container } = render(
        <TreeSelect options={twoLevelOptions} value={['guangdong']} onChange={handleChange} />,
      );
      const radios = container.querySelectorAll('.t-radio');
      fireEvent.click(radios[1]);
      expect(handleChange).toHaveBeenCalled();
      const lastCall = handleChange.mock.calls[handleChange.mock.calls.length - 1];
      expect(lastCall[0]).toEqual(['guangdong', 'shenzhen']);
      expect(lastCall[1]).toBe(1);
    });

    it(': onChange triggered when click checkbox (leaf multi select)', () => {
      const handleChange = vi.fn();
      const { container } = render(
        <TreeSelect options={twoLevelOptions} multiple value={['guangdong', []]} onChange={handleChange} />,
      );
      const checkboxes = container.querySelectorAll('.t-checkbox');
      fireEvent.click(checkboxes[0]);
      expect(handleChange).toHaveBeenCalled();
      const lastCall = handleChange.mock.calls[handleChange.mock.calls.length - 1];
      expect(lastCall[0][0]).toBe('guangdong');
      expect(Array.isArray(lastCall[0][1])).toBe(true);
      expect(lastCall[0][1]).toContain('guangzhou');
      expect(lastCall[1]).toBe(1);
    });

    it(': uncontrolled defaultValue + onChange', () => {
      const handleChange = vi.fn();
      const { container } = render(
        <TreeSelect options={twoLevelOptions} defaultValue={['guangdong']} onChange={handleChange} />,
      );
      const sideBarItems = container.querySelectorAll('.t-side-bar-item');
      fireEvent.click(sideBarItems[1]);
      expect(handleChange).toHaveBeenCalled();
      const lastCall = handleChange.mock.calls[handleChange.mock.calls.length - 1];
      expect(lastCall[0]).toEqual(['jiangsu']);
    });

    it(': without onChange callback should not throw', () => {
      const { container } = render(<TreeSelect options={twoLevelOptions} value={['guangdong']} />);
      const radios = container.querySelectorAll('.t-radio');
      expect(() => fireEvent.click(radios[0])).not.toThrow();
    });
  });

  describe('exception', () => {
    it(': multiple mode throws when leaf value is not array', () => {
      const errorSpy = vi.spyOn(console, 'error').mockImplementation(() => {});
      expect(() => {
        render(<TreeSelect options={twoLevelOptions} multiple value={['guangdong', 'guangzhou' as any]} />);
      }).toThrow(TypeError);
      errorSpy.mockRestore();
    });
  });
});
