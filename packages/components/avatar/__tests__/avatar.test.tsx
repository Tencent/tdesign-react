import React from 'react';
import { mockDelay, render, simulateImageEvent, vi } from '@test/utils';

import { Avatar } from '..';

import type { TdAvatarProps } from '../type';

const imageSrc = 'https://tdesign.gtimg.com/site/avatar.jpg';

describe('Avatar', () => {
  describe('props', () => {
    test('alt', () => {
      const wrapper = render(<Avatar alt={'Avatar'} image={'https://tdesign.gtimg.com/site/avatar.jpg'}></Avatar>);
      const container = wrapper.container.querySelector('img');
      expect(container.getAttribute('alt')).toBe('Avatar');
    });

    test('hideOnLoadFailed', async () => {
      const { container } = render(
        <Avatar image={'https://this.is.an.error.path.jpg'} hideOnLoadFailed={true}></Avatar>,
      );
      const imgDom = container.querySelector('img');
      simulateImageEvent(imgDom, 'error');
      await mockDelay(300);
      expect(container.querySelector('.t-image')).toBeFalsy();
    });

    test(`image is equal to https://tdesign.tencent.com/`, () => {
      const { container } = render(<Avatar image={'https://tdesign.tencent.com/'}></Avatar>);
      const domWrapper = container.querySelector('img');
      expect(domWrapper.getAttribute('src')).toBe('https://tdesign.tencent.com/');
    });

    ['circle', 'round'].forEach((item) => {
      test(`shape is equal to ${item}`, () => {
        const { container } = render(<Avatar shape={item as TdAvatarProps['shape']}></Avatar>);
        expect(container.firstChild).toHaveClass(`t-avatar--${item}`);
        expect(container).toMatchSnapshot();
      });
    });

    const sizeClassNameMap = {
      small: 't-size-s',
      medium: 't-size-m',
      large: 't-size-l',
    };
    Object.entries(sizeClassNameMap).forEach(([enumValue, expectedClassName]) => {
      test(`size is equal to ${enumValue}`, () => {
        let propValue: any = { true: true, false: false }[enumValue];
        propValue = propValue === undefined ? enumValue : propValue;
        const { container } = render(<Avatar size={propValue}></Avatar>);
        expect(container.firstChild).toHaveClass(expectedClassName);
      });
    });

    test(`size is equal to 120px`, () => {
      const { container } = render(<Avatar size={'120px'}></Avatar>);
      const domWrapper = container.firstChild as HTMLElement;
      expect(domWrapper.style.width).toBe('120px');
      expect(domWrapper.style.height).toBe('120px');
      expect(domWrapper.style.fontSize).toBe('60px');
    });

    test('Avatar 初始化 Size', async () => {
      const wrapper = render(<Avatar image={imageSrc} alt="test-avatar" size={'50px'}></Avatar>);
      const image = wrapper.container.querySelector('.t-image__wrapper');
      expect(image).toHaveStyle('width: 50px');
    });

    test('Avatar 初始化 Shape', async () => {
      const { container } = render(<Avatar shape="round" size="28px"></Avatar>);
      expect(container.firstChild).toHaveClass('t-avatar--round');
    });
  });

  describe('slots', () => {
    test('children', () => {
      const { container } = render(
        <Avatar>
          <span className="custom-node">TNode</span>
        </Avatar>,
      );
      expect(container.querySelector('.custom-node')).toBeTruthy();
      expect(container).toMatchSnapshot();
    });

    test('content', () => {
      const { container } = render(<Avatar content={<span className="custom-node">TNode</span>}></Avatar>);
      expect(container.querySelector('.custom-node')).toBeTruthy();
      expect(container).toMatchSnapshot();
    });

    test('icon', () => {
      const { container } = render(<Avatar icon={<span className="custom-node">TNode</span>}></Avatar>);
      expect(container.querySelector('.custom-node')).toBeTruthy();
      expect(container.querySelector('.t-avatar__icon')).toBeTruthy();
    });
  });

  describe('events', () => {
    test('error', async () => {
      const onErrorFn = vi.fn();
      const { container } = render(<Avatar image={'https://this.is.an.error.path.jpg'} onError={onErrorFn}></Avatar>);
      const imgDom = container.querySelector('img');
      simulateImageEvent(imgDom, 'error');
      await mockDelay(300);
      expect(onErrorFn).toHaveBeenCalled();
      expect(onErrorFn.mock.calls[0][0].e.type).toBe('error');
    });

    test('Avatar onError 回调', async () => {
      const mockOnErrorFn = vi.fn();
      const { container } = render(<Avatar image="http://error/" alt="test-avatar" onError={mockOnErrorFn}></Avatar>);
      const imageDom = container.querySelector('img');
      simulateImageEvent(imageDom, 'error');
      await mockDelay(300);
      expect(mockOnErrorFn).toHaveBeenCalled();
      expect(mockOnErrorFn.mock.calls[0][0].e.type).toBe('error');
    });
  });

  describe('scenarios', () => {
    test('Avatar 默认 DOM 结构', async () => {
      const wrapper = render(<Avatar image={imageSrc} alt="test-avatar"></Avatar>);
      const image: any = wrapper.getByAltText('test-avatar');
      expect(image.src).toBe(imageSrc);
    });

    test('Avatar 初始化 Dom', async () => {
      const { container } = render(<Avatar shape="round" size="28px"></Avatar>);
      expect(container.firstChild).toBeInTheDocument();
    });
  });
});
