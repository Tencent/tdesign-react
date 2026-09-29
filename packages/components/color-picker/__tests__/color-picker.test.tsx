import React from 'react';
import { fireEvent, mockTimeout, render, userEvent } from '@test/utils';

import ColorPicker from '../ColorPicker';

describe('ColorPicker', () => {
  const user = userEvent.setup();

  describe('props', () => {
    test(':disabled 测试', () => {
      const { container } = render(<ColorPicker disabled />);
      expect(container.querySelector('.t-input__inner')).toBeDisabled();
    });
  });

  describe('scenarios', () => {
    test('ColorPicker Trigger 测试', async () => {
      const { container } = render(<ColorPicker defaultValue="#0052d9" />);
      expect(container.querySelector('.t-input__inner')).toHaveValue('#0052d9');
      // 测试 input 改变值失焦时触发 onChange 改变颜色值
      fireEvent.focus(container.querySelector('.t-input__inner'));
      await user.type(container.querySelector('.t-input__inner'), '{end}{backspace}8');
      fireEvent.blur(container.querySelector('.t-input__inner'));
      await mockTimeout(() => expect(container.querySelector('.t-input__inner')).toHaveValue('#0052d8'));
      // 测试颜色格式正确展示（不传入 format 时默认为 RGB）
      fireEvent.click(container);
      fireEvent.click(document.querySelector('.t-color-picker__swatches--item'));
      expect(container.querySelector('.t-input__inner')).toHaveValue('rgb(236, 242, 254)');
    });

    test('ColorPicker 预设颜色切换 测试', () => {
      const { container } = render(
        <ColorPicker defaultValue="linear-gradient(45deg, #4facfe 0%, #00f2fe 100%)" format="CSS" />,
      );
      fireEvent.click(container.querySelector('.t-input'));
      expect(document.querySelector('.t-color-picker__gradient')).toBeInTheDocument();
      // 点击系统预设颜色的第一个
      fireEvent.click(document.querySelector('.t-color-picker__swatches--item'));
      // 渐变模式下切换为对应的纯色
      expect(container.querySelector('.t-input__inner')).toHaveValue('rgba(236, 242, 254, 1)');
    });

    test('饱和度选择测试', () => {
      const defaultValue = '#fff';
      const { container } = render(<ColorPicker defaultValue={defaultValue} />);
      fireEvent.click(container.querySelector('.t-input__inner'));
      expect(container.querySelector('.t-input__inner')).toHaveValue(defaultValue);
      const wrapper = document.querySelector('.t-color-picker__saturation');
      fireEvent.mouseDown(wrapper);
      fireEvent.mouseMove(wrapper, { deltaX: 232, deltaY: 160 });
      expect(container.querySelector('.t-input__inner')).toHaveValue('rgb(0, 0, 0)');
      fireEvent.mouseMove(wrapper, { deltaX: -232, deltaY: -160 });
      expect(container.querySelector('.t-input__inner')).toHaveValue('rgb(255, 255, 255)');
    });
  });
});
