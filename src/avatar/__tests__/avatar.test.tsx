import React from 'react';
import { testExamples, render, waitFor, fireEvent } from '@test/utils';
import Avatar from '../Avatar';

// 测试组件代码 Example 快照
testExamples(__dirname);
// Mock ResizeObserver
jest.mock('use-resize-observer', () => jest.requireActual('use-resize-observer/polyfilled'));

describe('Avatar 组件测试', () => {
  test('默认 DOM 结构', async () => {
    const imageSrc = 'https://tdesign.gtimg.com/site/avatar.jpg';
    const wrapper = render(
      <Avatar image={imageSrc} alt="test-avatar">
        avatar
      </Avatar>,
    );
    const image = wrapper.getByAltText('test-avatar');
    expect(image.src).toBe(imageSrc);
  });

  test('初始化Size', async () => {
    const imageSrc = 'https://tdesign.gtimg.com/site/avatar.jpg';
    const wrapper = render(
      <Avatar image={imageSrc} alt="test-avatar" size={'50px'}>
        avatar
      </Avatar>,
    );
    const image = wrapper.getByAltText('test-avatar');
    expect(image).toHaveStyle('width: 50px');
  });

  test('初始化Shape', async () => {
    const { container } = render(
      <Avatar shape="round" size="28px">
        U
      </Avatar>,
    );
    expect(container.firstChild).toHaveClass('t-avatar--round');
  });

  test('初始化Dom', async () => {
    const { container } = render(
      <Avatar shape="round" size="28px">
        U
      </Avatar>,
    );
    expect(container.firstChild).toBeInTheDocument();
  });

  test('onError回调', async () => {
    const mockOnErrorFn = jest.fn();
    const wrapper = render(<Avatar image="http://error/" alt="test-avatar" onError={mockOnErrorFn}></Avatar>);
    const image = wrapper.getByAltText('test-avatar');
    fireEvent(image, new Event('error'));
    await waitFor(() => {
      expect(mockOnErrorFn).toHaveBeenCalledTimes(1);
    });
  });
});
