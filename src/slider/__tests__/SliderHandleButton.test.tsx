/*
 * @Author: Bin
 * @Date: 2022-08-16
 * @FilePath: /tdesign-react-bin/src/slider/__tests__/SliderHandleButton.test.tsx
 */
import React from 'react';

import { render, fireEvent, act, waitFor } from '@test/utils';
import SliderHandleButton from '../SliderHandleButton';

describe('SliderHandleButton 组件测试', () => {
  // 测试 Dragging
  test('dragging', async () => {
    const SliderButton = () => (
      <SliderHandleButton
        classPrefix={'t'}
        style={{}}
        toolTipProps={{}}
        hideTips={false}
        onChange={() => {
          console.log('');
        }}
      />
    );

    await act(async () => {
      render(<SliderButton />);
      // 获取 input
      const buttonElement1 = await waitFor(() => document.querySelector('.t-slider__button-wrapper'));
      expect(buttonElement1).not.toBeNull();

      // 模拟鼠标进入
      act(() => {
        fireEvent.mouseEnter(buttonElement1);
        jest.runAllTimers();
      });

      const popupElement = await waitFor(() => document.querySelector('.t-popup__content'));
      expect(popupElement).not.toBeNull();

      // 模拟鼠标离开
      act(() => {
        fireEvent.mouseLeave(buttonElement1);
        jest.runAllTimers();
      });
      expect(document.querySelector('.t-popup__content')).toBeNull();

      // 模拟鼠标按下
      act(() => {
        fireEvent.mouseDown(buttonElement1);
        jest.runAllTimers();
      });
      expect(document.querySelector('.t-popup__content')).not.toBeNull();

      // 模拟鼠标放开
      act(() => {
        fireEvent.mouseUp(buttonElement1);
        jest.runAllTimers();
      });
      expect(document.querySelector('.t-popup__content')).not.toBeNull();
    });
  });
});
