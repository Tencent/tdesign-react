import React, { useState } from 'react';
import { fireEvent, render } from '@test/utils';

import { CascaderPanel } from '../index';

const options = [
  {
    children: [
      {
        label: '子选项一',
        value: '1.1',
      },
      {
        label: '子选项二',
        value: '1.2',
      },
    ],
    label: '选项一',
    value: '1',
  },
  {
    children: [
      {
        label: '子选项一',
        value: '2.1',
      },
      {
        label: '子选项二',
        value: '2.2',
      },
    ],
    label: '选项二',
    value: '2',
  },
];

describe('CascaderPanel', () => {
  describe('props', () => {
    test('Panel组件 trigger 为 hover 时，应该正确展开下一层级', () => {
      const { container, getByText } = render(<CascaderPanel options={options} trigger="hover" />);
      expect(container.querySelectorAll('.t-cascader__menu').length).toBe(1);
      fireEvent.mouseEnter(getByText('选项一'));
      expect(getByText('子选项一')).toBeInTheDocument();
      expect(container.querySelectorAll('.t-cascader__menu').length).toBe(2);
    });

    test('Panel组件 multiple 测试', () => {
      const { getByText, getByTitle } = render(<CascaderPanel options={options} multiple />);
      fireEvent.click(getByText('选项一'));
      expect(getByTitle('子选项一')).not.toHaveClass('t-is-checked');
      // 选中一个子选项，父级应为 indeterminate 状态
      fireEvent.click(getByText('子选项一'));
      expect(getByTitle('选项一')).toHaveClass('t-is-indeterminate');
      expect(getByTitle('子选项一')).toHaveClass('t-is-checked');
      // 选中全部子选项，父级应该为 checked 状态
      fireEvent.click(getByText('子选项二'));
      expect(getByTitle('选项一')).toHaveClass('t-is-checked');
      expect(getByTitle('子选项二')).toHaveClass('t-is-checked');
    });
  });

  describe('scenarios', () => {
    test('CascaderPanel 基础测试', () => {
      const btnText = 'change';
      const TestComponent = () => {
        const [value, setValue] = useState();
        const [multiple, setMultiple] = useState(false);
        const onChange = (nextValue) => {
          setValue(nextValue);
        };
        const onClick = () => {
          setMultiple(!multiple);
        };
        return (
          <>
            <button onClick={onClick}>{btnText}</button>
            <CascaderPanel options={options} value={value} onChange={onChange} multiple={multiple} />
          </>
        );
      };

      const { container, getByText } = render(<TestComponent />);
      expect(getByText('选项一')).toBeInTheDocument();
      expect(container.querySelectorAll('.t-cascader__menu').length).toBe(1);
      // 首次展开子选项会插入新的 ul
      fireEvent.click(getByText('选项一'));
      expect(getByText('子选项一')).toBeInTheDocument();
      expect(container.querySelectorAll('.t-cascader__menu').length).toBe(2);
      // multiple 测试，存在 checkbox
      expect(container.querySelector('input')).toBeNull();
      fireEvent.click(getByText(btnText));
      expect(container.querySelector('input')).toBeInTheDocument();
    });

    test('Panel组件 multiple 时设置 max 测试', async () => {
      const btnText = 'set max 1';
      const TestComponent = () => {
        const [max, setMax] = useState(3);
        return (
          <>
            <button onClick={() => setMax(1)}>{btnText}</button>
            <CascaderPanel options={options} multiple max={max} />
          </>
        );
      };
      const { getByText, getByTitle } = render(<TestComponent />);
      // 所选内容不超过 max ，都可选中
      fireEvent.click(getByTitle('选项一').querySelector('input'));
      expect(getByTitle('选项一')).toHaveClass('t-is-checked');
      expect(getByTitle('子选项一')).toHaveClass('t-is-checked');
      expect(getByTitle('子选项二')).toHaveClass('t-is-checked');
      // 清空所有选中
      fireEvent.click(getByTitle('选项一').querySelector('input'));
      // 设置 max 为 1，点击父级无法选中任何节点
      fireEvent.click(getByText(btnText));
      fireEvent.click(getByTitle('选项一'));
      fireEvent.click(getByTitle('选项一').querySelector('input'));
      expect(getByTitle('选项一')).not.toHaveClass('t-is-checked');
      expect(getByTitle('子选项一')).not.toHaveClass('t-is-checked');
      // 选中一个子节点后所有节点为 disabled
      fireEvent.click(getByTitle('子选项一'));
      expect(getByTitle('子选项一')).toHaveClass('t-is-checked');
      expect(getByTitle('选项二')).toHaveClass('t-is-disabled');
    });
  });
});
