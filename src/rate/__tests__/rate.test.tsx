import React from 'react';
import { render, fireEvent, vi } from '@test/utils';
import Rate from '../Rate';

describe('Rate 组件测试', () => {
  // 测试渲染
  test('create', async () => {
    const { container } = render(<Rate />);
    expect(container.firstChild.classList.contains('t-rate')).toBeTruthy();
    expect(document.querySelectorAll('.t-rate__item')).toHaveLength(5);
  });
  // 点击测试
  test('onChange', async () => {
    const clickFn = vi.fn();
    render(<Rate onChange={clickFn} />);
    fireEvent.click(document.querySelector('.t-rate__item'));
    expect(clickFn).toBeCalledTimes(1);
    expect(clickFn).toBeCalledWith(1);
  });
  // disable测试
  test('disable', async () => {
    const clickFn = vi.fn();
    render(<Rate disabled onChange={clickFn} />);
    fireEvent.click(document.querySelector('.t-rate__item'));
    expect(clickFn).toBeCalledTimes(0);
  });
  // 数量测试
  test('count', async () => {
    render(<Rate count={10} />);
    expect(document.querySelectorAll('.t-rate__item')).toHaveLength(10);
  });
});
