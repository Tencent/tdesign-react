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
      fireEvent.click(container.querySelector('.t-tree__item'));
      expect(onActive.mock.calls[0][0]).toEqual([0n]);
    });
  });
});
