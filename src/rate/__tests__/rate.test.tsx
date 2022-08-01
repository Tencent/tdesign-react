import React from 'react';
import { testExamples, render, fireEvent } from '@test/utils';
import Rate from '../Rate';

// 测试组件代码 Example 快照
testExamples(__dirname);

describe('Rate 组件测试', () => {
  // 测试渲染
  test('create', async () => {
    const { container } = render(<Rate />);
    expect(container.firstChild.classList.contains('t-rate')).toBeTruthy();
    expect(document.querySelectorAll('.t-rate__item')).toHaveLength(5);
    expect(container).toMatchSnapshot();
  });
  // 点击测试
  test('onChange', async () => {
    const clickFn = jest.fn();
    render(<Rate onChange={clickFn} />);
    fireEvent.click(document.querySelector('.t-rate__item'));
    expect(clickFn).toBeCalledTimes(1);
    expect(clickFn).toBeCalledWith(1);
  });
  // disable测试
  test('disable', async () => {
    const clickFn = jest.fn();
    render(<Rate disabled onChange={clickFn} />);
    fireEvent.click(document.querySelector('.t-rate__item'));
    expect(clickFn).toBeCalledTimes(0);
  });
  // 数量测试
  test('count', async () => {
    const { container } = render(<Rate count={10} />);
    expect(document.querySelectorAll('.t-rate__item')).toHaveLength(10);
    expect(container).toMatchSnapshot();
  });
});
