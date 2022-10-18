import React from 'react';

import { render, fireEvent, mockTimeout } from '@test/utils';
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

    render(<SliderButton />);
    // 获取 input
    expect(document.querySelector('.t-slider__button-wrapper')).not.toBeNull();

    // 模拟鼠标进入
    fireEvent.mouseEnter(document.querySelector('.t-slider__button-wrapper'));
    expect(document.querySelector('.t-popup__content')).not.toBeNull();

    // 模拟鼠标按下
    fireEvent.mouseDown(document.querySelector('.t-slider__button-wrapper'));
    expect(document.querySelector('.t-popup__content')).not.toBeNull();

    // 模拟鼠标放开
    fireEvent.mouseUp(document.querySelector('.t-slider__button-wrapper'));
    expect(document.querySelector('.t-popup__content')).not.toBeNull();

    // 模拟鼠标离开
    fireEvent.mouseLeave(document.querySelector('.t-slider__button-wrapper'));
    await mockTimeout(() => expect(document.querySelector('.t-popup__content')).toBeNull());
  });
});
