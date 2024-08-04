import React from 'react';
import { render, fireEvent, vi } from '@test/utils';
import Switch from '../Switch';
import log from '../../_common/js/log';
import noop from '../../_util/noop';

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
    const clickFn = vi.fn();
    const { container } = render(<Switch disabled />);
    expect(container.firstChild).toBeDisabled();
    fireEvent.click(container.firstChild);
    expect(clickFn).toBeCalledTimes(0);
  });
  test('onChange', async () => {
    const clickFn = vi.fn();
    const { container } = render(<Switch onChange={clickFn} />);
    fireEvent.click(container.firstChild);
    expect(clickFn).toBeCalledTimes(1);
  });

  test('should log error if value is not in customValue', async () => {
    const logSpy = vi.spyOn(log, 'error').mockImplementation(noop);
    render(<Switch customValue={[0, 1]} value={false} />);
    expect(logSpy).toBeCalledTimes(1);
    logSpy.mockRestore();
  });
});
