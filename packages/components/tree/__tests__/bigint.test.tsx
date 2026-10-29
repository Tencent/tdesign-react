import React, { useState } from 'react';
import { fireEvent, mockDelay, render, vi, waitFor } from '@test/utils';

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

  describe('scenarios', () => {
    test.each(['normal', 'transition', 'virtual'] as const)(
      'preserves custom node content when data is replaced in %s mode',
      async (mode) => {
        function NodeLabel({ text }: { text: string }) {
          const [count, setCount] = useState(0);
          return (
            <button onClick={() => setCount(count + 1)}>
              {text}:{count}
            </button>
          );
        }
        const label = (node: { label: string }) => <NodeLabel text={node.label} />;
        const scroll =
          mode === 'virtual'
            ? {
                type: 'virtual' as const,
                threshold: 1,
                rowHeight: 34,
                bufferSize: 3,
              }
            : undefined;
        const getData = (text: string) => [
          { value: 'same', label: text },
          { value: 'other', label: 'other' },
        ];
        const { findByText, getByText, rerender } = render(
          <Tree data={getData('old')} label={label} transition={mode === 'transition'} scroll={scroll} />,
        );
        fireEvent.click(await findByText('old:0'));
        rerender(<Tree data={getData('new')} label={label} transition={mode === 'transition'} scroll={scroll} />);
        await waitFor(() => expect(getByText('new:1')).toBeTruthy());
      },
    );
  });
});
