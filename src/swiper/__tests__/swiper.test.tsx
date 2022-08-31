import React from 'react';
import { testExamples, render, act, waitFor, fireEvent } from '@test/utils';
import { Swiper } from '..';

const { SwiperItem } = Swiper;

// 测试组件代码 Example 快照
testExamples(__dirname);

describe('Swiper 组件测试', () => {
  // 测试渲染
  test('create', async () => {
    const { container } = render(<Swiper></Swiper>);
    expect(container.querySelectorAll('.t-swiper')).toHaveLength(1);
    expect(container).toMatchSnapshot();
  });

  // 测试事件
  test('arrows event', async () => {
    const TestView = () => (
      <>
        <Swiper
          autoplay={false}
          loop
          navigation={{
            showSlideBtn: 'hover',
          }}
        >
          <SwiperItem>
            <div className="demo-item">1</div>
          </SwiperItem>
          <SwiperItem>
            <div className="demo-item">2</div>
          </SwiperItem>
          <SwiperItem>
            <div className="demo-item">3</div>
          </SwiperItem>
        </Swiper>
      </>
    );

    await act(async () => {
      render(<TestView />);
      // 获取 element
      const element = await waitFor(() => document.querySelector('.t-swiper__container'));
      const arrows = await waitFor(() => document.querySelectorAll('.t-swiper__navigation-item'));
      expect(element).not.toBeNull();
      expect(arrows.length).toBe(3);

      fireEvent.click(arrows[1]);
      fireEvent.mouseEnter(arrows[1]);
      fireEvent.mouseLeave(arrows[1]);
      expect(arrows[1].classList.contains('t-is-active')).toBeTruthy();
    });
  });

  // 测试事件
  test('event', async () => {
    const TestView = () => (
      <>
        <Swiper loop>
          <SwiperItem>
            <div className="demo-item">1</div>
          </SwiperItem>
          <SwiperItem>
            <div className="demo-item">2</div>
          </SwiperItem>
          <SwiperItem>
            <div className="demo-item">3</div>
          </SwiperItem>
        </Swiper>
      </>
    );

    await act(async () => {
      render(<TestView />);
      // 获取 element
      const arrowLeft = await waitFor(() => document.querySelector('.t-swiper__arrow-left'));
      const arrowRight = await waitFor(() => document.querySelector('.t-swiper__arrow-right'));
      const element = await waitFor(() => document.querySelector('.t-swiper__container'));
      expect(arrowLeft).not.toBeNull();
      expect(arrowRight).not.toBeNull();
      expect(element).not.toBeNull();

      fireEvent.click(arrowRight);
      expect(element.getAttribute('style')).toBe(
        'transform: translate3d(-100%, 0px, 0px); transition: transform 0.3s ease;',
      );
      fireEvent.click(arrowLeft);
    });
  });
});
