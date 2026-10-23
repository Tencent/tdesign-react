import React from 'react';
import { fireEvent, mockDelay, render, vi } from '@test/utils';

import Tree from '../Tree';

import type { TdTreeProps, TreeInstanceFunctions } from '../type';

// 懒加载的取数函数
function createLoadFunc() {
  return (node: any) =>
    new Promise<any[]>((resolve) => {
      setTimeout(() => {
        let nodes: any[] = [];
        if (node.level < 2) {
          nodes = [{ value: `${node.value}.1`, children: true }];
        }
        resolve(nodes);
      }, 10);
    });
}

async function renderTree(props?: TdTreeProps) {
  const ref = { current: null as TreeInstanceFunctions | null };
  const result = render(
    <Tree ref={ref} data={[{ value: 't1', children: true }]} load={createLoadFunc()} transition={false} {...props} />,
  );
  await mockDelay();
  return { ...result, ref: ref as { current: TreeInstanceFunctions } };
}

describe('Tree:lazy-load', () => {
  test('lazy 属性为 true 时，点击展开节点时加载数据', async () => {
    const onLoad = vi.fn();
    const { container } = await renderTree({ lazy: true, onLoad });

    expect(container.querySelector('[data-value="t1.1"]')).toBeNull();

    fireEvent.click(container.querySelector('[data-value="t1"] .t-tree__icon'));
    await mockDelay(100);

    expect(onLoad).toHaveBeenCalled();
    expect(container.querySelector('[data-value="t1.1"]')).not.toBeNull();

    // 二级节点继续懒加载
    fireEvent.click(container.querySelector('[data-value="t1.1"] .t-tree__icon'));
    await mockDelay(100);
    expect(container.querySelector('[data-value="t1.1.1"]')).not.toBeNull();
  });

  test('延迟加载的可选节点，默认继承父节点选中态', async () => {
    const { container, ref } = await renderTree({
      lazy: true,
      checkable: true,
      valueMode: 'all',
    });

    ref.current.setItem('t1', { checked: true });
    await mockDelay();
    expect(container.querySelector('[data-value="t1"] .t-checkbox').classList.contains('t-is-checked')).toBe(true);

    fireEvent.click(container.querySelector('[data-value="t1"] .t-tree__icon'));
    await mockDelay(100);
    expect(container.querySelector('[data-value="t1.1"]')).not.toBeNull();
    expect(container.querySelector('[data-value="t1.1"] .t-checkbox').classList.contains('t-is-checked')).toBe(true);
  });

  test('checkStrictly 为 true 时，延迟加载的节点不继承父节点选中态', async () => {
    const { container, ref } = await renderTree({
      lazy: true,
      checkable: true,
      checkStrictly: true,
      valueMode: 'all',
    });

    ref.current.setItem('t1', { checked: true });
    await mockDelay();
    expect(container.querySelector('[data-value="t1"] .t-checkbox').classList.contains('t-is-checked')).toBe(true);

    fireEvent.click(container.querySelector('[data-value="t1"] .t-tree__icon'));
    await mockDelay(100);
    expect(container.querySelector('[data-value="t1.1"]')).not.toBeNull();
    expect(container.querySelector('[data-value="t1.1"] .t-checkbox').classList.contains('t-is-checked')).toBe(false);
  });
});
