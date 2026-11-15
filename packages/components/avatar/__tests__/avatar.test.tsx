import React from 'react';
import { mockDelay, render, simulateImageEvent, vi } from '@test/utils';

import { Avatar } from '..';

import type { TdAvatarProps } from '../type';

const imageSrc = 'https://tdesign.gtimg.com/site/avatar.jpg';

describe('Avatar', () => {
  describe('props', () => {
    test('alt[string]', () => {
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

    test('image[string]', () => {
      const { container } = render(<Avatar image={'https://tdesign.tencent.com/'}></Avatar>);
      const domWrapper = container.querySelector('img');
      expect(domWrapper.getAttribute('src')).toBe('https://tdesign.tencent.com/');
    });

    ['circle', 'round'].forEach((item) => {
      test(`shape[${item}]`, () => {
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
      test(`size[${enumValue}]`, () => {
        const { container } = render(<Avatar size={enumValue as TdAvatarProps['size']}></Avatar>);
        expect(container.firstChild).toHaveClass(expectedClassName);
      });
    });

    test('size[string]', () => {
      const { container } = render(<Avatar size={'120px'}></Avatar>);
      const domWrapper = container.firstChild as HTMLElement;
      expect(domWrapper.style.width).toBe('120px');
      expect(domWrapper.style.height).toBe('120px');
      expect(domWrapper.style.fontSize).toBe('60px');

      const imageWrapper = render(<Avatar image={imageSrc} alt="test-avatar" size={'50px'}></Avatar>);
      expect(imageWrapper.container.querySelector('.t-image__wrapper')).toHaveStyle('width: 50px');
    });

    test('shape[round]', () => {
      const { container } = render(<Avatar shape="round" size="28px"></Avatar>);
      expect(container.firstChild).toHaveClass('t-avatar--round');
    });

    test('content and children', () => {
      const node = <span className="custom-node">TNode</span>;
      const contentWrapper = render(<Avatar content={node} />);
      const childrenWrapper = render(<Avatar>{node}</Avatar>);

      [contentWrapper, childrenWrapper].forEach(({ container }) => {
        expect(container.querySelector('.custom-node')).toBeTruthy();
        expect(container).toMatchSnapshot();
      });
    });

    test('icon[TNode]', () => {
      const { container } = render(<Avatar icon={<span className="custom-node">TNode</span>}></Avatar>);
      expect(container.querySelector('.custom-node')).toBeTruthy();
      expect(container.querySelector('.t-avatar__icon')).toBeTruthy();
    });

    test('image[string] and alt[string]', () => {
      const wrapper = render(<Avatar image={imageSrc} alt="test-avatar"></Avatar>);
      const image = wrapper.getByAltText('test-avatar') as HTMLImageElement;
      expect(image.src).toBe(imageSrc);
    });
  });

  describe('events', () => {
    test('onError', async () => {
      const onErrorFn = vi.fn();
      const { container } = render(<Avatar image={'https://this.is.an.error.path.jpg'} onError={onErrorFn}></Avatar>);
      const imgDom = container.querySelector('img');
      simulateImageEvent(imgDom, 'error');
      await mockDelay(300);
      expect(onErrorFn).toHaveBeenCalled();
      expect(onErrorFn.mock.calls[0][0].e.type).toBe('error');

      const mockOnErrorFn = vi.fn();
      const { container: altContainer } = render(
        <Avatar image="http://error/" alt="test-avatar" onError={mockOnErrorFn}></Avatar>,
      );
      const imageDom = altContainer.querySelector('img');
      simulateImageEvent(imageDom, 'error');
      await mockDelay(300);
      expect(mockOnErrorFn).toHaveBeenCalled();
      expect(mockOnErrorFn.mock.calls[0][0].e.type).toBe('error');
    });
  });
});
