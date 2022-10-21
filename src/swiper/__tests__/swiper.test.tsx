import React from 'react';
import { render, fireEvent } from '@test/utils';
import Swiper from '../index';

const { SwiperItem } = Swiper;

describe('Swiper 组件测试', () => {
  // 测试渲染
  test('create', async () => {
    const { container } = render(<Swiper></Swiper>);
    expect(container.querySelectorAll('.t-swiper')).toHaveLength(1);
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

    render(<TestView />);
    // 获取 element

    expect(document.querySelector('.t-swiper__container')).not.toBeNull();
    expect(document.querySelectorAll('.t-swiper__navigation-item').length).toBe(3);

    fireEvent.click(document.querySelectorAll('.t-swiper__navigation-item')[1]);
    fireEvent.mouseEnter(document.querySelectorAll('.t-swiper__navigation-item')[1]);
    fireEvent.mouseLeave(document.querySelectorAll('.t-swiper__navigation-item')[1]);
    expect(document.querySelectorAll('.t-swiper__navigation-item')[1].classList.contains('t-is-active')).toBeTruthy();
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

    render(<TestView />);
    // 获取 element
    expect(document.querySelector('.t-swiper__arrow-left')).not.toBeNull();
    expect(document.querySelector('.t-swiper__arrow-right')).not.toBeNull();
    expect(document.querySelector('.t-swiper__container')).not.toBeNull();

    fireEvent.click(document.querySelector('.t-swiper__arrow-right'));
    expect(document.querySelector('.t-swiper__container').getAttribute('style')).toBe(
      'transform: translate3d(-100%, 0px, 0px); transition: transform 0.3s ease;',
    );
    fireEvent.click(document.querySelector('.t-swiper__arrow-left'));
  });
});
