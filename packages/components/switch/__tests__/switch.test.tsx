import React from 'react';
import log from '@tdesign/common-js/log/index';
import { fireEvent, render, vi } from '@test/utils';

import noop from '../../_util/noop';
import Switch from '../Switch';

describe('Switch', () => {
  describe('props', () => {
    test('loading', async () => {
      const { container } = render(<Switch loading />);
      expect(container.children[0].classList.contains('t-is-loading')).toBeTruthy();
    });

    (['small', 'medium', 'large'] as const).forEach((item) => {
      test(`size[${item}]`, async () => {
        const { container } = render(<Switch size={item} />);
        const classMap = {
          small: 't-size-s',
          medium: 't-size-m',
          large: 't-size-l',
        } as const;
        expect(container.children[0].classList.contains(classMap[item])).toBeTruthy();
      });
    });

    test('label[array<string>]', async () => {
      const { queryByText } = render(<Switch label={['开', '关']} />);
      expect(queryByText('关')).toBeInTheDocument();
    });

    test('label[function]', async () => {
      const { queryByText } = render(<Switch value={false} label={({ value }) => (value ? '开' : '关')} />);
      expect(queryByText('关')).toBeInTheDocument();
    });

    test('disabled', async () => {
      const { container } = render(<Switch disabled />);
      expect(container.firstChild).toBeDisabled();
    });

    test('customValue[array<number>]', async () => {
      const logSpy = vi.spyOn(log, 'error').mockImplementation(noop);
      render(<Switch customValue={[0, 1]} value={false} />);
      expect(logSpy).toHaveBeenCalledTimes(1);
      logSpy.mockRestore();
    });
  });

  describe('events', () => {
    test('onChange', async () => {
      const clickFn = vi.fn();
      const { container } = render(<Switch onChange={clickFn} />);
      fireEvent.click(container.firstChild);
      expect(clickFn).toHaveBeenCalledTimes(1);
    });

    test('disabled prevents onChange', async () => {
      const clickFn = vi.fn();
      const { container } = render(<Switch disabled onChange={clickFn} />);
      fireEvent.click(container.firstChild);
      expect(clickFn).toHaveBeenCalledTimes(0);
    });

    test('beforeChange[function]: resolve', async () => {
      const onChange = vi.fn();
      const beforeChangeResolve = (): Promise<boolean> =>
        new Promise((resolve) => {
          setTimeout(() => {
            resolve(true);
          }, 80);
        });
      const { container } = render(<Switch onChange={onChange} beforeChange={beforeChangeResolve} />);
      fireEvent.click(container.firstChild);
      // eslint-disable-next-line no-promise-executor-return
      await new Promise((resolve) => setTimeout(resolve, 100));
      expect(container.children[0].classList.contains('t-is-checked')).toBeTruthy();
    });

    test('beforeChange[function]: reject', async () => {
      const onChange = vi.fn();
      const beforeChangeReject = (): Promise<boolean> =>
        new Promise((_resolve, reject) => {
          setTimeout(() => {
            reject();
          }, 80);
        });
      const { container } = render(<Switch onChange={onChange} beforeChange={beforeChangeReject} />);
      fireEvent.click(container.firstChild);
      // eslint-disable-next-line no-promise-executor-return
      await new Promise((resolve) => setTimeout(resolve, 100));
      expect(container.children[0].classList.contains('t-is-checked')).toBeFalsy();
    });
  });
});
