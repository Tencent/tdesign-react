import React, { useState } from 'react';
import { render, fireEvent, userEvent, mockTimeout } from '@test/utils';
import ColorPickerPanel from '../ColorPickerPanel';
import ColorPicker from '../ColorPicker';

describe('ColorPicker 组件测试', () => {
  test('ColorPicker Trigger 测试', async () => {
    const { container } = render(<ColorPicker defaultValue="#0052d9" />);
    expect(container.querySelector('.t-input__inner')).toHaveValue('#0052d9');
    // 测试 input 改变值失焦时触发 onChange 改变颜色值
    fireEvent.focus(container.querySelector('.t-input__inner'));
    userEvent.type(container.querySelector('.t-input__inner'), '{end}{backspace}8');
    fireEvent.blur(container.querySelector('.t-input__inner'));
    await mockTimeout(() => expect(container.querySelector('.t-input__inner')).toHaveValue('#0052d8'));
    // 测试颜色格式正确展示（不传入 format 时默认为 RGB）
    fireEvent.click(container);
    fireEvent.click(document.querySelector('.t-color-picker__swatches--item'));
    expect(container.querySelector('.t-input__inner')).toHaveValue('rgb(236, 242, 254)');
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
    // 渐变直接输出对应的 css
    fireEvent.click(document.querySelector('.t-color-picker__swatches--item'));
    expect(container.querySelector('.t-input__inner')).toHaveValue(
      'linear-gradient(45deg,rgba(236, 242, 254, 1) 0%,rgb(0, 242, 254) 100%)',
    );
  });
});

describe('ColorPickerPanel 组件测试', () => {
  test('ColorPickerPanel 测试', () => {
    const { queryByText } = render(<ColorPickerPanel defaultValue={'#0052d9'} />);
    expect(queryByText('最近使用颜色')).toBeInTheDocument();
  });

  test('ColorMode 切换，应该正确缓存上次操作颜色值', () => {
    const TestComponent = () => {
      const [value, setValue] = useState('#0052d9');
      const handleChange = (value) => {
        setValue(value);
      };

      return <ColorPickerPanel value={value} onChange={handleChange} />;
    };
    const { container, getByText } = render(<TestComponent />);
    expect(container.querySelector('.t-color-picker__sliders-preview-inner')).toHaveStyle({
      background: 'rgb(0, 82, 217)',
    });
    // 选中第一个默认颜色值，期望面板切换回来时为该值
    fireEvent.click(container.querySelector('.t-color-picker__swatches--item'));
    expect(container.querySelector('.t-color-picker__sliders-preview-inner')).toHaveStyle({
      background: 'rgb(236, 242, 254)',
    });
    fireEvent.click(getByText('渐变'));
    fireEvent.click(getByText('单色'));
    expect(container.querySelector('.t-color-picker__sliders-preview-inner')).toHaveStyle({
      background: 'rgb(236, 242, 254)',
    });
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

  test('最近使用颜色测试', async () => {
    const TestComponent = () => {
      const value = '#0052d9';
      return <ColorPickerPanel value={value} />;
    };
    const { container } = render(<TestComponent />);

    // 点击添加，当前颜色成功加入且为激活状态，且删除按钮出现
    fireEvent.click(container.querySelector('.t-icon-add'));
    expect(container.querySelector('.t-is-active')).toBeInTheDocument();
    expect(container.querySelector('.t-color-picker__swatches--item__inner')).toHaveStyle({
      background: 'rgb(0, 82, 217)',
    });
    expect(container.querySelector('.t-icon-delete')).toBeInTheDocument();
    // 删除当前激活的颜色
    fireEvent.click(container.querySelector('.t-icon-delete'));
    expect(container.querySelector('.t-icon-delete')).toBeNull();
    expect(container.querySelector('.t-is-active')).toBeNull();
  });
});
