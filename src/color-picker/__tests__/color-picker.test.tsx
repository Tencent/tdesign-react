import React from 'react';
import { testExamples, render, fireEvent } from '@test/utils';
import ColorPickerPanel from '../ColorPickerPanel';
import ColorPicker from '../ColorPicker';

// 测试组件代码 Example 快照
testExamples(__dirname);

describe('ColorPicker 组件测试', () => {
  test('ColorPickerPanel 测试', () => {
    const { queryByText } = render(<ColorPickerPanel defaultValue={'#0052d9'} />);
    expect(queryByText('最近使用颜色')).toBeInTheDocument();
  });

  test('ColorPicker Trigger 测试', () => {
    const { container } = render(<ColorPicker defaultValue="#0052d9" />);
    expect(container.querySelector('.t-input__inner').value).toBe('#0052d9');
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
