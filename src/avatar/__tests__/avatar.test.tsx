import React from 'react';
import { vi, render, fireEvent } from '@test/utils';
import Avatar from '../Avatar';

describe('Avatar 组件测试', () => {
  test('Avatar 默认 DOM 结构', async () => {
    const imageSrc = 'https://tdesign.gtimg.com/site/avatar.jpg';
    const wrapper = render(<Avatar image={imageSrc} alt="test-avatar"></Avatar>);
    const image: any = wrapper.getByAltText('test-avatar');
    expect(image.src).toBe(imageSrc);
  });

  test('Avatar 初始化 Size', async () => {
    const imageSrc = 'https://tdesign.gtimg.com/site/avatar.jpg';
    const wrapper = render(<Avatar image={imageSrc} alt="test-avatar" size={'50px'}></Avatar>);
    const image = wrapper.container.querySelector('.t-image__wrapper');
    expect(image).toHaveStyle('width: 50px');
  });

  test('Avatar 初始化 Shape', async () => {
    const { container } = render(<Avatar shape="round" size="28px"></Avatar>);
    expect(container.firstChild).toHaveClass('t-avatar--round');
  });

  test('Avatar 初始化 Dom', async () => {
    const { container } = render(<Avatar shape="round" size="28px"></Avatar>);
    expect(container.firstChild).toBeInTheDocument();
  });

  test('Avatar onError 回调', async () => {
    const mockOnErrorFn = vi.fn();
    const wrapper = render(<Avatar image="http://error/" alt="test-avatar" onError={mockOnErrorFn}></Avatar>);
    const image = wrapper.getByAltText('test-avatar');
    fireEvent(image, new Event('error'));
    expect(mockOnErrorFn).toHaveBeenCalledTimes(1);
  });
});
