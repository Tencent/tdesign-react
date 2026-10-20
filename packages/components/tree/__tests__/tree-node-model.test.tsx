import React from 'react';
import { mockDelay, render, waitFor } from '@test/utils';

import Tree from '../Tree';

import type { TreeInstanceFunctions } from '../type';

function getData() {
  return [
    {
      value: 't1',
      label: 'node.t1',
      children: [
        {
          value: 't1.1',
          children: [{ value: 't1.1.1' }],
        },
        { value: 't1.2' },
        { value: 't1.3' },
      ],
    },
    {
      value: 't2',
      children: [{ value: 't2.1' }],
    },
  ];
}

async function renderTree() {
  const ref = { current: null as TreeInstanceFunctions | null };
  const result = render(<Tree ref={ref} data={getData()} expandAll transition={false} />);
  await mockDelay();
  return { ...result, ref: ref as { current: TreeInstanceFunctions } };
}

describe('Tree:treeNodeModel', () => {
  test('getModel 暴露的属性可实时反映节点状态', async () => {
    const { ref } = await renderTree();
    const node = ref.current.getItem('t1');
    expect(node.label).toBe('node.t1');
    expect(node.checked).toBe(false);

    // model 属性是 getter，状态变化后取值实时更新（新版特性）
    ref.current.setItem('t1', { label: 'node.t1.new' });
    expect(node.label).toBe('node.t1.new');
  });

  test('getLevel', async () => {
    const { ref } = await renderTree();
    expect(ref.current.getItem('t1').getLevel()).toBe(0);
    expect(ref.current.getItem('t1.1').getLevel()).toBe(1);
    expect(ref.current.getItem('t1.1.1').getLevel()).toBe(2);
  });

  test('getIndex', async () => {
    const { ref } = await renderTree();
    expect(ref.current.getItem('t1').getIndex()).toBe(0);
    expect(ref.current.getItem('t1.1').getIndex()).toBe(0);
    expect(ref.current.getItem('t1.2').getIndex()).toBe(1);
    expect(ref.current.getItem('t2').getIndex()).toBe(1);
  });

  test('isFirst / isLast', async () => {
    const { ref } = await renderTree();
    expect(ref.current.getItem('t1').isFirst()).toBe(true);
    expect(ref.current.getItem('t1').isLast()).toBe(false);
    expect(ref.current.getItem('t1.1').isFirst()).toBe(true);
    expect(ref.current.getItem('t1.3').isLast()).toBe(true);
  });

  test('isLeaf', async () => {
    const { ref } = await renderTree();
    expect(ref.current.getItem('t1').isLeaf()).toBe(false);
    expect(ref.current.getItem('t1.1.1').isLeaf()).toBe(true);
    expect(ref.current.getItem('t1.2').isLeaf()).toBe(true);
  });

  test('getPath', async () => {
    const { ref } = await renderTree();
    const path = ref.current.getItem('t1.1.1').getPath();
    expect(path.length).toBe(3);
    expect(path.map((node) => node.value)).toEqual(['t1', 't1.1', 't1.1.1']);
  });

  test('getParent', async () => {
    const { ref } = await renderTree();
    expect(ref.current.getItem('t1.1.1').getParent().value).toBe('t1.1');
    expect(ref.current.getItem('t1').getParent()).toBeUndefined();
  });

  test('getParents', async () => {
    const { ref } = await renderTree();
    expect(
      ref.current
        .getItem('t1.1.1')
        .getParents()
        .map((node) => node.value),
    ).toEqual(['t1.1', 't1']);
  });

  test('getRoot', async () => {
    const { ref } = await renderTree();
    expect(ref.current.getItem('t1.1.1').getRoot().value).toBe('t1');
  });

  test('getSiblings', async () => {
    const { ref } = await renderTree();
    expect(
      ref.current
        .getItem('t1.1')
        .getSiblings()
        .map((node) => node.value),
    ).toEqual(['t1.1', 't1.2', 't1.3']);
  });

  test('getChildren', async () => {
    const { ref } = await renderTree();
    const children = ref.current.getItem('t1').getChildren(false);
    expect(Array.isArray(children)).toBe(true);
    expect((children as any[]).map((node) => node.value)).toEqual(['t1.1', 't1.2', 't1.3']);

    // 深度获取全部子孙节点
    const deepChildren = ref.current.getItem('t1').getChildren(true);
    expect((deepChildren as any[]).map((node) => node.value)).toEqual(['t1.1', 't1.1.1', 't1.2', 't1.3']);

    // 叶子节点无子节点
    expect(ref.current.getItem('t1.2').getChildren(false)).toBe(false);
  });

  test('appendData', async () => {
    const { container, ref } = await renderTree();
    const node = ref.current.getItem('t1');
    node.appendData([{ value: 't1.4' }, { value: 't1.5' }]);
    await mockDelay();
    expect(container.querySelector('[data-value="t1.4"]')).not.toBeNull();
    expect(container.querySelector('[data-value="t1.5"]')).not.toBeNull();
  });

  test('insertBefore / insertAfter', async () => {
    const { container, ref } = await renderTree();
    const t12 = ref.current.getItem('t1.2');

    t12.insertBefore({ value: 't1.i1' });
    t12.insertAfter({ value: 't1.i2' });
    await mockDelay();

    expect(container.querySelector('[data-value="t1.i1"]')).not.toBeNull();
    expect(container.querySelector('[data-value="t1.i2"]')).not.toBeNull();
    expect(ref.current.getIndex('t1.i1')).toBe(1);
    expect(ref.current.getIndex('t1.2')).toBe(2);
    expect(ref.current.getIndex('t1.i2')).toBe(3);
  });

  test('setData 可更新节点数据并触发视图更新', async () => {
    const { container, ref } = await renderTree();
    const node = ref.current.getItem('t1.2');
    node.setData({ ...node.data, label: 'node.t2.new', disabled: true });
    await mockDelay();
    expect(ref.current.getItem('t1.2').label).toBe('node.t2.new');
    expect(container.querySelector('[data-value="t1.2"]')).toHaveTextContent('node.t2.new');
    expect(container.querySelector('[data-value="t1.2"]').classList.contains('t-is-disabled')).toBe(true);
  });

  test('remove 可移除节点，移除非子节点时给出警告', async () => {
    const { container, ref } = await renderTree();
    const node = ref.current.getItem('t1');

    // 移除非当前节点的子节点，仅产生警告，不影响其他节点
    node.remove('t2.1');
    await mockDelay();
    expect(container.querySelector('[data-value="t1.1"]')).not.toBeNull();
    expect(container.querySelector('[data-value="t2.1"]')).not.toBeNull();

    // 传入自身 value，移除对应的子节点
    node.remove('t1.2');
    await waitFor(() => expect(container.querySelector('[data-value="t1.2"]')).toBeNull());
  });
});
