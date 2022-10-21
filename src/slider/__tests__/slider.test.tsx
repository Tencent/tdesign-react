import React, { useState } from 'react';

import { render, fireEvent } from '@test/utils';
import Slider from '../Slider';

describe('Slider 组件测试', () => {
  // 测试渲染
  test('create', async () => {
    const { container } = render(<Slider />);
    expect(container.querySelectorAll('.t-slider')).toHaveLength(1);
  });

  // 测试标记
  test('marks', async () => {
    const View = (marks: any) => {
      const { container } = render(<Slider layout="vertical" marks={marks} />);
      return container;
    };

    // 测试 marks 是否正常
    const marks = { 10: '10°C', 20: '20°C' };
    expect(View(marks).querySelector('.t-slider__mark').firstElementChild.textContent).toBe(marks[10]);

    // 覆盖异常行为
    expect(View([1, 100]).querySelectorAll('.t-slider__mark')).toHaveLength(1);
    expect(View('err').querySelectorAll('.t-slider__mark')).toHaveLength(1);
    expect(View(['']).querySelectorAll('.t-slider__mark')).toHaveLength(1);
  });

  // 测试输入框输入值（单个值）
  test('input', async () => {
    const SliderView = () => {
      const [value, setValue] = useState(10);
      const onChange = (value) => {
        setValue(value);
      };

      return (
        <>
          <Slider
            value={value}
            onChange={onChange}
            min={10}
            max={100}
            layout="vertical"
            inputNumberProps={{ theme: 'row' }}
          />
          <p id="slider_value">{value}</p>
        </>
      );
    };

    const inputSelector = 'input';

    render(<SliderView />);
    // 获取 input
    expect(document.querySelector(inputSelector)).not.toBeNull();
    expect(document.querySelector('#slider_value')).not.toBeNull();

    let value = '80';
    fireEvent.change(document.querySelector(inputSelector), { target: { value } });
    fireEvent.click(document.querySelector(inputSelector)); // 触发 value change
    expect(document.querySelector('#slider_value').textContent).toBe(value);

    value = '10000';
    fireEvent.change(document.querySelector(inputSelector), { target: { value } });
    fireEvent.click(document.querySelector(inputSelector)); // 触发 value change
    expect(document.querySelector('#slider_value').textContent).not.toBe(value);

    value = '1';
    fireEvent.change(document.querySelector(inputSelector), { target: { value } });
    fireEvent.click(document.querySelector(inputSelector)); // 触发 value change
    expect(document.querySelector('#slider_value').textContent).not.toBe(value);
  });

  // 测试替换 label
  test('label', async () => {
    const SliderView = () => {
      const [value, setValue] = useState(10);
      const onChange = (value) => {
        setValue(value);
      };

      return (
        <>
          <Slider value={value} onChange={onChange} min={10} max={100} layout="vertical" label={`$\{value}°C`} />
        </>
      );
    };

    const buttonSelector = '.t-slider__button-wrapper';

    render(<SliderView />);
    // 获取 input
    expect(document.querySelector(buttonSelector)).not.toBeNull();

    // 模拟鼠标进入
    fireEvent.mouseEnter(document.querySelector(buttonSelector));
    expect(document.querySelector('.t-popup__content').textContent).toBe('10°C');
  });

  // 测试事件
  test('event', async () => {
    const marks = { 10: '10°C', 20: '20°C' };
    const SliderView = () => {
      const [value, setValue] = useState(1);
      const onChange = (value) => {
        setValue(value);
      };
      return (
        <>
          <Slider value={value} onChange={onChange} min={1} max={100} layout="vertical" marks={marks} />
          <p id="slider_value">{value}</p>
        </>
      );
    };

    const index = 0;
    const { getByText } = render(<SliderView />);
    // 获取 input
    expect(document.querySelector('#slider_value')).not.toBeNull();

    fireEvent.click(getByText(Object.values(marks)[index])); // 触发点击 mark 标签
    expect(document.querySelector('#slider_value').textContent).toBe(Object.keys(marks)[index]);

    fireEvent.click(document.querySelector('.t-slider__mark')); // 触发点击 mark 标签
    expect(document.querySelector('#slider_value').textContent).toBe('1'); // 复原进度默认值
  });
});
