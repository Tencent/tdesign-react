import React from 'react';
import { fireEvent, render, mockIntersectionObserver } from '@test/utils';
import { Image } from '..';
import Space from '../../space';

describe('Image Component', () => {
  beforeAll(() => {
    // 用于判断是否已经触发回调
    window.observeCallbackhasCalled = false;
    const observe = (element, callback) => {
      // 监控图片容器的滚动事件，后面会触发容器的滚动。
      element.parentNode.parentNode.addEventListener('scroll', () => {
        if (window.observeCallbackhasCalled) {
          callback([{ isIntersecting: false }]);
        } else {
          window.observeCallbackhasCalled = true;
          callback([{ isIntersecting: true }]);
        }
      });
    }
    mockIntersectionObserver({}, { observe });
  });

  it('props.lazy works fine', () => {
    document.body.height = 250;

    const { container } = render(
      <Space style={{ height: 240, width: 240, overflow: 'hidden', overflowY: 'scroll', paddingTop: 500 }}>
        {
          Array.from({ length: 16 }).map((_, index) => (
            <Image
              key={index}
              src="https://tdesign.gtimg.com/demo/demo-image-1.png"
              style={{ width: 230, height: 120 }}
              lazy
            />
          ))
        }
      </Space>
    );

    const spaceElement = container.querySelector('.t-space');
    fireEvent.scroll(spaceElement, { target: { scrollY: 400 } });
    // 滚动后，第一张图片会加载，但后面的图片不会加载
    expect(spaceElement.firstChild.querySelector('img')).not.toBeNull()
    expect(spaceElement.lastChild.querySelector('img')).toBeNull()

  });
});
