import React, { useState } from 'react';
import { render, fireEvent } from '@test/utils';
import ColorPickerPanel from '../ColorPickerPanel';
import ColorPicker from '../ColorPicker';

describe('ColorPicker 组件测试', () => {
  test('ColorPicker Trigger 测试', () => {
    const { container } = render(<ColorPicker defaultValue="#0052d9" />);
    expect(container.querySelector('.t-input__inner')).toHaveValue('#0052d9');
  });

  test('ColorPicker 线性渐变 测试', () => {
    const { container } = render(
      <ColorPicker
        defaultValue="linear-gradient(45deg, #4facfe 0%, #00f2fe 100%)"
        format="CSS"
        colorModes={['linear-gradient']}
      />,
    );
    fireEvent.click(container.querySelector('.t-input '));

    expect(document.querySelector('.t-color-picker__gradient')).toBeInTheDocument();
  });
});

describe('ColorPickerPanel 组件测试', () => {
  test('ColorPickerPanel 测试', () => {
    const { queryByText } = render(<ColorPickerPanel defaultValue={'#0052d9'} />);
    expect(queryByText('最近使用颜色')).toBeInTheDocument();
  });

  test('enableAlpha 开启透明通道', () => {
    const btnText = 'changeAlpha';
    const [defaultValue, changeValue] = ['rgba(0, 82, 217, 1)', 'rgba(0, 82, 217, 0.32)'];
    const TestComponent = () => {
      const [value, setValue] = useState(defaultValue);
      const onClick = () => {
        setValue(changeValue);
      };
      return (
        <>
          <button onClick={onClick}>{btnText}</button>
          <ColorPickerPanel enableAlpha value={value} />
        </>
      );
    };
    const { container, getByText } = render(<TestComponent />);
    expect(container.querySelector('.t-color-picker__alpha')).toBeInTheDocument();
    expect(container.querySelector('.t-color-picker__sliders-preview-inner')).toHaveStyle({ background: defaultValue });
    fireEvent.click(getByText(btnText));
    expect(container.querySelector('.t-color-picker__sliders-preview-inner')).toHaveStyle({ background: changeValue });
  });
});
