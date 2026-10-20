import React from 'react';
import { mockDelay, render } from '@test/utils';

import Tree from '../Tree';

describe('Tree:keys', () => {
  test('可指定树结构解析的字段属性', async () => {
    const data = [
      {
        id: 't1',
        name: 'node.t1',
        subnodes: [
          { id: 't1.1', name: 'node.t1.1' },
          { id: 't1.2', name: 'node.t1.2' },
        ],
      },
    ];
    const keys = {
      value: 'id',
      label: 'name',
      children: 'subnodes',
    };

    const { container } = render(<Tree keys={keys} data={data} expandAll transition={false} />);
    await mockDelay();

    const t1 = container.querySelector('[data-value="t1"]');
    const t1d1 = container.querySelector('[data-value="t1.1"]');
    const t1d2 = container.querySelector('[data-value="t1.2"]');

    expect(t1).not.toBeNull();
    expect(t1d1).not.toBeNull();
    expect(t1d2).not.toBeNull();

    expect(t1).toHaveTextContent('node.t1');
    expect(t1d1).toHaveTextContent('node.t1.1');
    expect(t1d2).toHaveTextContent('node.t1.2');
  });
});
