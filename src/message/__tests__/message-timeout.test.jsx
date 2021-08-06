import React from 'react';
import { render, unmountComponentAtNode } from 'react-dom';
import { act } from 'react-dom/test-utils';
import { Message } from '@tencent/tdesign-react';
jest.useFakeTimers();

let containerOut = null;
const defaultMessage = '默认的message';

beforeEach(() => {
  // 创建一个 DOM 元素作为渲染目标
  containerOut = document.createElement('div');
  document.body.appendChild(containerOut);
});

afterEach(() => {
  // 退出时进行清理
  unmountComponentAtNode(containerOut);
  containerOut.remove();
  containerOut = null;
});

it('onDurationEnd works', () => {
  const onDurationEnd = jest.fn();
  act(() => {
    render(
      <Message duration={3000} onDurationEnd={onDurationEnd}>
        {defaultMessage}
      </Message>,
      containerOut,
    );
  });
  expect(onDurationEnd).not.toHaveBeenCalled();
  act(() => {
    jest.advanceTimersByTime(5000);
  });
  expect(onDurationEnd).toHaveBeenCalled();
});
