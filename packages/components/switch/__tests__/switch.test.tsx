import React from 'react';
import log from '@tdesign/common-js/log/index';
import { fireEvent, render, vi } from '@test/utils';

import noop from '../../_util/noop';
import Switch from '../Switch';

describe('Switch 组件测试', () => {
  test('create', async () => {
    const { container } = render(<Switch />);
    expect(container.children[0].classList.contains('t-switch')).toBeTruthy();
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
    expect(container.children[0].classList.contains('t-is-loading')).toBeTruthy();
  });
  test('size', async () => {
    const { container } = render(<Switch size="small" />);
    expect(container.children[0].classList.contains('t-size-s')).toBeTruthy();
  });

  test('shape', async () => {
    const { container, rerender, queryByText } = render(<Switch label={['开', '关']} />);
    expect(container.children[0].classList.contains('t-switch--shape-circle')).toBeTruthy();
    expect(queryByText('关')).toBeInTheDocument();

    rerender(<Switch shape="round" />);
    expect(container.children[0].classList.contains('t-switch--shape-round')).toBeTruthy();

    rerender(<Switch shape="line" label={['开', '关']} size="small" loading />);
    expect(container.children[0].classList.contains('t-switch--shape-line')).toBeTruthy();
    expect(container.children[0].classList.contains('t-size-s')).toBeTruthy();
    expect(container.children[0].classList.contains('t-is-loading')).toBeTruthy();
    expect(queryByText('关')).not.toBeInTheDocument();
    expect(container.querySelector('.t-switch__content')).toBeFalsy();

    const label = vi.fn(() => '关');
    rerender(<Switch shape="line" label={label} />);
    expect(label).not.toBeCalled();
  });

  test('line shape aria-label', async () => {
    const { container, rerender } = render(<Switch shape="line" label={['开启', '关闭']} />);
    expect(container.firstChild).toHaveAttribute('aria-label', '关闭');

    fireEvent.click(container.firstChild);
    expect(container.firstChild).toHaveAttribute('aria-label', '开启');

    // 独立 render，innerChecked 默认 false
    const { container: container2 } = render(<Switch shape="line" />);
    expect(container2.firstChild).toHaveAttribute('aria-label', '已关闭');

    rerender(<Switch shape="line" label={['开', '关']} aria-label="自定义开关" />);
    expect(container.firstChild).toHaveAttribute('aria-label', '自定义开关');

    rerender(<Switch shape="circle" label={['开', '关']} />);
    expect(container.firstChild).not.toHaveAttribute('aria-label');
  });

  test('aria-disabled', async () => {
    const { container } = render(<Switch disabled />);
    expect(container.firstChild).toHaveAttribute('aria-disabled', 'true');

    const { container: container2 } = render(<Switch loading />);
    expect(container2.firstChild).toHaveAttribute('aria-disabled', 'true');

    const { container: container3 } = render(<Switch />);
    expect(container3.firstChild).toHaveAttribute('aria-disabled', 'false');
  });

  test('disabled', async () => {
    const clickFn = vi.fn();
    const { container } = render(<Switch disabled />);
    expect(container.firstChild).toBeDisabled();
    fireEvent.click(container.firstChild);
    expect(clickFn).toHaveBeenCalledTimes(0);
  });
  test('onChange', async () => {
    const clickFn = vi.fn();
    const { container } = render(<Switch onChange={clickFn} />);
    expect(container.firstChild).toHaveAttribute('aria-checked', 'false');
    fireEvent.click(container.firstChild);
    expect(container.firstChild).toHaveAttribute('aria-checked', 'true');
    expect(clickFn).toHaveBeenCalledTimes(1);
  });

  test('should log error if value is not in customValue', async () => {
    const logSpy = vi.spyOn(log, 'error').mockImplementation(noop);
    render(<Switch customValue={[0, 1]} value={false} />);
    expect(logSpy).toHaveBeenCalledTimes(1);
    logSpy.mockRestore();
  });
  test('beforeChange resolve', async () => {
    const clickFn = vi.fn();
    const beforeChangeResolve = (): Promise<boolean> =>
      new Promise((resolve) => {
        setTimeout(() => {
          resolve(true);
        }, 80);
      });
    const { container } = render(<Switch onChange={clickFn} beforeChange={beforeChangeResolve} />);
    fireEvent.click(container.firstChild);
    await new Promise((resolve) => setTimeout(resolve, 100));
    expect(container.children[0].classList.contains('t-is-checked')).toBeTruthy();
  });
  test('beforeChange reject', async () => {
    const clickFn = vi.fn();
    const beforeChangeResolve = (): Promise<boolean> =>
      new Promise((resolve, reject) => {
        setTimeout(() => {
          reject();
        }, 80);
      });
    const { container } = render(<Switch onChange={clickFn} beforeChange={beforeChangeResolve} />);
    fireEvent.click(container.firstChild);
    await new Promise((resolve) => setTimeout(resolve, 100));
    expect(container.children[0].classList.contains('t-is-checked')).toBeFalsy();
  });
});
