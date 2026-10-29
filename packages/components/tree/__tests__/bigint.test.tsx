import React from 'react';
import { fireEvent, mockDelay, render, vi } from '@test/utils';

import Tree from '../Tree';

describe('Tree bigint', () => {
  describe('events', () => {
    test('activates zero bigint without confusing it with number or string values', async () => {
      const onActive = vi.fn();
      const { container } = render(
        <Tree
          activable
          onActive={onActive}
          data={[
            { value: 0n, label: 'bigint zero' },
            { value: 0, label: 'number zero' },
            { value: '0', label: 'string zero' },
          ]}
        />,
      );
      await mockDelay(100);
      const items = container.querySelectorAll('.t-tree__item');
      [0n, 0, '0'].forEach((value, index) => {
        fireEvent.click(items[index]);
        expect(onActive.mock.calls[index][0]).toEqual([value]);
      });
    });
  });
});
