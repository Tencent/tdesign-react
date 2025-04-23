import React, { useState } from 'react';
import { render, fireEvent, userEvent, mockTimeout, vi } from '@test/utils';
import ColorPickerPanel from '../ColorPickerPanel';
import ColorPicker from '../ColorPicker';

describe('ColorPicker 组件测试', () => {
  const user = userEvent.setup();
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

  test(':disabled 测试', () => {
    const { container } = render(<ColorPicker disabled />);
    expect(container.querySelector('.t-input__inner')).toBeDisabled();
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

describe('ColorPickerPanel 组件测试', () => {
  test('ColorPickerPanel 测试', () => {
    const { queryByText } = render(<ColorPickerPanel defaultValue={'#0052d9'} />);
    expect(queryByText('最近使用颜色')).toBeInTheDocument();
  });

  test('渐变颜色更新 测试', async () => {
    const { container } = render(
      <ColorPickerPanel defaultValue="linear-gradient(45deg,rgb(79, 172, 255) 0%,rgb(0, 242, 251) 100%)" />,
    );

    // 点击第二个渐变点
    fireEvent.click(container.querySelectorAll('li.t-color-picker__thumb')[1]);

    // 点击 Saturation 板上的点，并模拟鼠标移动
    const thumb = container.querySelector('span.t-color-picker__thumb');
    fireEvent.mouseDown(thumb);
    fireEvent.mouseMove(thumb, { clientX: 50, clientY: 50 });
    fireEvent.mouseUp(thumb);

    // 获取移动后的色值
    const { color } = getComputedStyle(thumb);

    // 检查 CSS Input 生成的新渐变色
    expect(container.querySelectorAll('.t-input__inner')[2]).toHaveValue(
      `linear-gradient(45deg,rgb(79, 172, 255) 0%,${color} 100%)`,
    );
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

  test('最近使用颜色 recentColors 测试', async () => {
    const onRecentColorsChange = vi.fn();
    const TestComponent = () => {
      const value = '#0052d9';
      return <ColorPickerPanel value={value} onRecentColorsChange={onRecentColorsChange} />;
    };
    const { container } = render(<TestComponent />);

    // 点击添加，当前颜色成功加入且为激活状态，且删除按钮出现
    fireEvent.click(container.querySelector('.t-icon-add'));
    expect(container.querySelector('.t-is-active')).toBeInTheDocument();
    expect(container.querySelector('.t-color-picker__swatches--item__inner')).toHaveStyle({
      background: 'rgb(0, 82, 217)',
    });
    // 不能重复添加同个颜色值
    fireEvent.click(container.querySelector('.t-icon-add'));
    expect(
      container.querySelector('.t-color-picker__swatches--items').querySelectorAll('.t-color-picker__swatches--item')
        .length,
    ).toBe(1);
    expect(container.querySelector('.t-icon-delete')).toBeInTheDocument();
    // 删除当前激活的颜色
    fireEvent.click(container.querySelector('.t-icon-delete'));
    expect(container.querySelector('.t-icon-delete')).toBeNull();
    expect(container.querySelector('.t-is-active')).toBeNull();
    expect(onRecentColorsChange).toBeCalled();
  });
});
