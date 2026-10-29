import React from 'react';
import { fireEvent, mockDelay, render, vi } from '@test/utils';

import Cascader from '../index';

describe('Cascader bigint', () => {
  describe('props', () => {
    test.each([0, 0n, 42n])('displays the label for %s', async (value) => {
      const { container } = render(<Cascader value={value} options={[{ value, label: 'target' }]} />);
      await mockDelay(100);
      expect(container.querySelector('input')).toHaveValue('target');
    });

    test('displays a full bigint path', async () => {
      const options = [{ value: 1n, label: 'parent', children: [{ value: 0n, label: 'child' }] }];
      const { container } = render(<Cascader valueType="full" value={[1n, 0n]} options={options} />);
      await mockDelay(100);
      expect(container.querySelector('input')).toHaveValue('parent / child');
    });

    test.each([
      [1n, 'bigint'],
      [1, 'number'],
      ['1', 'string'],
    ] as const)('distinguishes full path %s', async (value, label) => {
      const options = [
        { value: 1n, label: 'bigint' },
        { value: 1, label: 'number' },
        { value: '1', label: 'string' },
      ];
      const { container } = render(<Cascader valueType="full" value={[value]} options={options} />);
      await mockDelay(100);
      expect(container.querySelector('input')).toHaveValue(label);
    });
  });

  describe('events', () => {
    test('selects a zero bigint', async () => {
      const onChange = vi.fn();
      const { container, getByText } = render(
        <Cascader options={[{ value: 0n, label: 'target' }]} onChange={onChange} />,
      );
      fireEvent.click(container.querySelector('.t-input'));
      await mockDelay(100);
      fireEvent.click(getByText('target'));
      expect(onChange.mock.calls[0][0]).toBe(0n);
    });
  });
});
