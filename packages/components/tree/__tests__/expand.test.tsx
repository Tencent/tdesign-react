import React from 'react';
import { fireEvent, mockDelay, render, waitFor } from '@test/utils';

import Tree from '../Tree';

import type { TdTreeProps, TreeInstanceFunctions } from '../type';

const data = [
  {
    value: 't1',
    children: [
      {
        value: 't1.1',
        children: [{ value: 't1.1.1' }],
      },
      {
        value: 't1.2',
        children: [{ value: 't1.2.1' }],
      },
    ],
  },
  {
    value: 't2',
    children: [{ value: 't2.1' }],
  },
];

async function renderTree(props?: TdTreeProps) {
  const ref = { current: null as TreeInstanceFunctions | null };
  const result = render(<Tree ref={ref} data={data} transition={false} {...props} />);
  await mockDelay();
  return { ...result, ref: ref as { current: TreeInstanceFunctions } };
}

describe('Tree:expand', () => {
  test('expandAll 设为 true，全部节点展开', async () => {
    const { container } = await renderTree({ expandAll: true });
    expect(container.querySelector('[data-value="t1.1"]')).not.toBeNull();
    expect(container.querySelector('[data-value="t1.1.1"]')).not.toBeNull();
    expect(container.querySelector('[data-value="t2.1"]')).not.toBeNull();
  });

  test('默认节点收起', async () => {
    const { container } = await renderTree();
    expect(container.querySelector('[data-value="t1.1"]')).toBeNull();
    expect(container.querySelector('[data-value="t2.1"]')).toBeNull();
  });

  test('defaultExpanded 设置默认展开节点', async () => {
    const { container } = await renderTree({ defaultExpanded: ['t2'] });
    expect(container.querySelector('[data-value="t1.1"]')).toBeNull();
    expect(container.querySelector('[data-value="t2.1"]')).not.toBeNull();
  });

  test('expanded 可受控指定展开节点', async () => {
    const { container } = await renderTree({ expanded: ['t2'] });
    expect(container.querySelector('[data-value="t1.1"]')).toBeNull();
    expect(container.querySelector('[data-value="t2.1"]')).not.toBeNull();
  });

  test('设置 expanded 可变更展开节点', async () => {
    const { container, rerender } = await renderTree({ expanded: ['t2'] });
    expect(container.querySelector('[data-value="t1.1"]')).toBeNull();
    expect(container.querySelector('[data-value="t2.1"]')).not.toBeNull();

    rerender(<Tree data={data} transition={false} expanded={['t1']} />);
    await mockDelay();
    expect(container.querySelector('[data-value="t1.1"]')).not.toBeNull();
    // React 实现中收起节点在离场动画结束后移除
    await waitFor(() => expect(container.querySelector('[data-value="t2.1"]')).toBeNull());
  });

  test('expandLevel 设置初始展开层级', async () => {
    const fourLevelData = [
      {
        value: 't1',
        children: [
          {
            value: 't1.1',
            children: [
              {
                value: 't1.1.1',
                children: [{ value: 't1.1.1.1' }],
              },
            ],
          },
        ],
      },
    ];
    const { container } = await renderTree({
      data: fourLevelData,
      expandLevel: 2,
    });
    // level < 2 的节点展开，因此前三层节点可见
    expect(container.querySelector('[data-value="t1.1"]')).not.toBeNull();
    expect(container.querySelector('[data-value="t1.1.1"]')).not.toBeNull();
    // 第四层节点依旧收起
    expect(container.querySelector('[data-value="t1.1.1.1"]')).toBeNull();
  });

  test('设置 expandMutex 为 true，同级节点展开为互斥动作', async () => {
    const { container } = await renderTree({ expandMutex: true });

    fireEvent.click(container.querySelector('[data-value="t2"] .t-tree__icon'));
    await mockDelay();
    expect(container.querySelector('[data-value="t2.1"]')).not.toBeNull();

    fireEvent.click(container.querySelector('[data-value="t1"] .t-tree__icon'));
    await mockDelay();
    // t2 被收起
    await waitFor(() => expect(container.querySelector('[data-value="t2.1"]')).toBeNull());
    // t1.1 展开
    expect(container.querySelector('[data-value="t1.1"]')).not.toBeNull();

    // 同级互斥：展开 t1.2 收起 t1.1
    fireEvent.click(container.querySelector('[data-value="t1.2"] .t-tree__icon'));
    await mockDelay();
    expect(container.querySelector('[data-value="t1.1"]')).not.toBeNull();
    expect(container.querySelector('[data-value="t1.2.1"]')).not.toBeNull();
    expect(container.querySelector('[data-value="t1.1.1"]')).toBeNull();
  });

  test('点击父节点图标可触发展开子节点', async () => {
    const { container } = await renderTree();
    fireEvent.click(container.querySelector('[data-value="t1"] .t-tree__icon'));
    await mockDelay();
    expect(container.querySelector('[data-value="t1.1"]')).not.toBeNull();
  });

  test('点击已展开的父节点图标，可触发收起子节点', async () => {
    const { container } = await renderTree({ expandAll: true });
    expect(container.querySelector('[data-value="t1.1"]')).not.toBeNull();

    fireEvent.click(container.querySelector('[data-value="t1"] .t-tree__icon'));
    // React 实现中收起节点在离场动画结束后移除
    await waitFor(() => expect(container.querySelector('[data-value="t1.1"]')).toBeNull());
  });

  test('默认点击父节点本身不会触发展开子节点', async () => {
    const { container } = await renderTree();
    fireEvent.click(container.querySelector('[data-value="t1"]'));
    await mockDelay();
    expect(container.querySelector('[data-value="t1.1"]')).toBeNull();
  });

  test('设置 expandOnClickNode，点击节点本身可触发展开子节点', async () => {
    const { container } = await renderTree({ expandOnClickNode: true });
    fireEvent.click(container.querySelector('[data-value="t1"]'));
    await mockDelay();
    expect(container.querySelector('[data-value="t1.1"]')).not.toBeNull();
  });

  test('默认展开子节点，不影响父节点展开状态', async () => {
    const { container, ref } = await renderTree({
      data: [
        {
          value: 't1',
          children: [
            {
              value: 't1.1',
              children: [{ value: 't1.1.1' }],
            },
          ],
        },
      ],
    });
    ref.current.setItem('t1.1', { expanded: true });
    await mockDelay();
    // 父节点未展开，子节点不可见
    expect(container.querySelector('[data-value="t1.1"]')).toBeNull();
    expect(ref.current.getItem('t1.1').expanded).toBe(true);
    expect(ref.current.getItem('t1').expanded).toBe(false);
  });

  test('expandParent 设为 true 时，子节点展开会使父节点展开', async () => {
    const { container, ref } = await renderTree({
      expandParent: true,
      data: [
        {
          value: 't1',
          children: [
            {
              value: 't1.1',
              children: [{ value: 't1.1.1' }],
            },
          ],
        },
      ],
    });
    ref.current.setItem('t1.1', { expanded: true });
    await mockDelay();
    expect(container.querySelector('[data-value="t1.1"]')).not.toBeNull();
    expect(container.querySelector('[data-value="t1.1.1"]')).not.toBeNull();
    expect(ref.current.getItem('t1.1').expanded).toBe(true);
    expect(ref.current.getItem('t1').expanded).toBe(true);
  });
});
