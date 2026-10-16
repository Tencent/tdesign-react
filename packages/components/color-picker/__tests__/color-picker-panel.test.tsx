import React, { useState } from 'react';
import { fireEvent, render, vi } from '@test/utils';

import ColorPickerPanel from '../ColorPickerPanel';

describe('ColorPickerPanel', () => {
  describe('props', () => {
    test('defaultValue[string]', () => {
      const { queryByText } = render(<ColorPickerPanel defaultValue={'#0052d9'} />);
      expect(queryByText('最近使用颜色')).toBeInTheDocument();
    });

    test('enableAlpha', () => {
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
      expect(container.querySelector('.t-color-picker__sliders-preview-inner')).toHaveStyle({
        background: defaultValue,
      });
      fireEvent.click(getByText(btnText));
      expect(container.querySelector('.t-color-picker__sliders-preview-inner')).toHaveStyle({
        background: changeValue,
      });
    });
  });

  describe('events', () => {
    test('onRecentColorsChange', async () => {
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
      expect(onRecentColorsChange).toHaveBeenCalled();
    });
  });

  describe('scenarios', () => {
    test('gradient point movement updates CSS value', async () => {
      const { container } = render(
        <ColorPickerPanel
          format="CSS"
          defaultValue="linear-gradient(45deg,rgb(79, 172, 255) 0%,rgb(0, 242, 251) 100%)"
        />,
      );

      fireEvent.click(container.querySelectorAll('li.t-color-picker__thumb')[1]);

      const thumb = container.querySelector('span.t-color-picker__thumb');
      fireEvent.mouseDown(thumb);
      fireEvent.mouseMove(thumb, { clientX: 50, clientY: 50 });
      fireEvent.mouseUp(thumb);

      const { color } = getComputedStyle(thumb);

      const rgb2Rgba = (rgb: string) => {
        const rgba = rgb.replace('rgb', 'rgba').replace(')', ', 1)');
        return rgba;
      };

      expect(container.querySelectorAll('.t-input__inner')[2]).toHaveValue(
        `linear-gradient(45deg,rgb(79, 172, 255) 0%,${rgb2Rgba(color)} 100%)`,
      );
    });
  });
});
