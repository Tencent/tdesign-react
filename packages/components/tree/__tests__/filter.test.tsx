import React from 'react';
import { mockDelay, render, waitFor } from '@test/utils';

import Tree from '../Tree';

import type { TdTreeProps } from '../type';

const data = [
  {
    value: 't1',
    children: [{ value: 't1.1' }, { value: 't1.2' }],
  },
];

describe('Tree:filter', () => {
  test('过滤命中的节点可见，路径父节点被锁定，其余节点隐藏', async () => {
    const { container, rerender } = render(
      <Tree data={data} expandAll transition={false} filter={(node) => String(node.value).indexOf('2') >= 0} />,
    );
    await mockDelay();

    // t1.2 被命中，t1 作为路径节点被锁定，t1.1 隐藏（React 实现中在离场动画后移除）
    expect(container.querySelector('[data-value="t1"]')).not.toBeNull();
    expect(container.querySelector('[data-value="t1"]').classList.contains('t-is-disabled')).toBe(true);
    await waitFor(() => expect(container.querySelector('[data-value="t1.1"]')).toBeNull());
    expect(container.querySelector('[data-value="t1.2"]')).not.toBeNull();

    rerender(
      <Tree data={data} expandAll transition={false} filter={(node) => String(node.value).indexOf('1.1') >= 0} />,
    );
    await mockDelay();
    expect(container.querySelector('[data-value="t1.1"]')).not.toBeNull();
    await waitFor(() => expect(container.querySelector('[data-value="t1.2"]')).toBeNull());
  });

  test('无命中节点时，展示空数据', async () => {
    const { container } = render(
      <Tree data={data} expandAll transition={false} filter={(node) => String(node.value).indexOf('1.3') >= 0} />,
    );
    await mockDelay();
    expect(container.querySelector('.t-tree')).toHaveTextContent('暂无数据');
  });

  test('清除过滤器，恢复全部节点', async () => {
    const props: TdTreeProps = {
      filter: (node) => String(node.value).indexOf('2') >= 0,
    };
    const { container, rerender } = render(<Tree data={data} expandAll transition={false} {...props} />);
    await mockDelay();
    expect(container.querySelector('[data-value="t1.1"]')).toBeNull();

    rerender(<Tree data={data} expandAll transition={false} filter={null} />);
    await mockDelay();
    expect(container.querySelector('[data-value="t1"]')).not.toBeNull();
    expect(container.querySelector('[data-value="t1.1"]')).not.toBeNull();
    expect(container.querySelector('[data-value="t1.2"]')).not.toBeNull();
  });
});
