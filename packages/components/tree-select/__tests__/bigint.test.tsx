import React from 'react';
import { fireEvent, mockDelay, render, vi } from '@test/utils';

import TreeSelect from '../index';

describe('TreeSelect bigint', () => {
  describe('events', () => {
    test.each([0, 0n, 42n])('selects %s as an object value', async (value) => {
      const onChange = vi.fn();
      const { container } = render(
        <TreeSelect data={[{ value, label: 'target' }]} valueType="object" onChange={onChange} />,
      );
      fireEvent.click(container.querySelector('.t-input'));
      await mockDelay(100);
      fireEvent.click(document.querySelector('.t-tree__item'));
      expect(onChange.mock.calls[0][0]).toEqual({ value, label: 'target' });
    });
  });
});
