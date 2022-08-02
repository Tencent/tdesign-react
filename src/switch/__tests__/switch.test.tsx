import React from 'react';
import { testExamples, render, fireEvent } from '@test/utils';
import Switch from '../Switch';

// 测试组件代码 Example 快照
testExamples(__dirname);

describe('Switch 组件测试', () => {
  test('create', async () => {
    const { container } = render(<Switch />);
    expect(container.firstChild.classList.contains('t-switch')).toBeTruthy();
  });
  test('label', async () => {
    const { queryByText } = render(<Switch label={['开', '关']} />);
    expect(queryByText('关')).toBeInTheDocument();
  });
  test('label function', async () => {
    const { queryByText } = render(<Switch value={false} label={({ value }) => (value ? '开' : '关')} />);
    expect(queryByText('关')).toBeInTheDocument();
  });
  test('loading', async () => {
    const { container } = render(<Switch loading />);
    expect(container.firstChild.classList.contains('t-is-loading')).toBeTruthy();
  });
  test('size', async () => {
    const { container } = render(<Switch size="small" />);
    expect(container.firstChild.classList.contains('t-size-s')).toBeTruthy();
  });

  test('disabled', async () => {
    const clickFn = jest.fn();
    const { container } = render(<Switch disabled />);
    expect(container.firstChild).toBeDisabled();
    fireEvent.click(container.firstChild);
    expect(clickFn).toBeCalledTimes(0);
  });
  test('onChange', async () => {
    const clickFn = jest.fn();
    const { container } = render(<Switch onChange={clickFn} />);
    fireEvent.click(container.firstChild);
    expect(clickFn).toBeCalledTimes(1);
  });
});
