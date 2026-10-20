import React from 'react';
import { fireEvent, mockDelay, render, vi } from '@test/utils';

import Tree from '../Tree';

import type { TdTreeProps, TreeInstanceFunctions } from '../type';

const data = [
  {
    value: 't1',
    children: [{ value: 't1.1' }, { value: 't1.2' }],
  },
];

async function renderActivableTree(props?: TdTreeProps) {
  const ref = { current: null as TreeInstanceFunctions | null };
  const result = render(<Tree ref={ref} data={data} activable expandAll transition={false} {...props} />);
  await mockDelay();
  return { ...result, ref: ref as { current: TreeInstanceFunctions } };
}

describe('Tree:activable', () => {
  test('设置 activable 为 true, 节点可以具有激活态', async () => {
    const { container, ref } = await renderActivableTree();
    ref.current.setItem('t1.1', { actived: true });
    await mockDelay();
    expect(container.querySelector('[data-value="t1"]').classList.contains('t-is-active')).toBe(false);
    expect(container.querySelector('[data-value="t1.1"]').classList.contains('t-is-active')).toBe(true);
    expect(container.querySelector('[data-value="t1.2"]').classList.contains('t-is-active')).toBe(false);

    ref.current.setItem('t1.1', { actived: false });
    await mockDelay();
    expect(container.querySelector('[data-value="t1.1"]').classList.contains('t-is-active')).toBe(false);
  });

  test('在 data 中可以预先设置激活态', async () => {
    const { container } = await renderActivableTree({
      data: [
        {
          value: 't1',
          children: [
            { value: 't1.1', actived: true },
            { value: 't1.2', actived: true },
          ],
        },
      ],
    });
    expect(container.querySelector('[data-value="t1"]').classList.contains('t-is-active')).toBe(false);
    expect(container.querySelector('[data-value="t1.1"]').classList.contains('t-is-active')).toBe(true);
    expect(container.querySelector('[data-value="t1.2"]').classList.contains('t-is-active')).toBe(true);
  });

  test('defaultActived 可以用来设置默认激活状态', async () => {
    const { container } = await renderActivableTree({
      defaultActived: ['t1.1'],
    });
    expect(container.querySelector('[data-value="t1.1"]').classList.contains('t-is-active')).toBe(true);
    expect(container.querySelector('[data-value="t1.2"]').classList.contains('t-is-active')).toBe(false);
  });

  test('设置 actived 可指定激活节点', async () => {
    const { container } = await renderActivableTree({ actived: ['t1.1'] });
    expect(container.querySelector('[data-value="t1.1"]').classList.contains('t-is-active')).toBe(true);
    expect(container.querySelector('[data-value="t1.2"]').classList.contains('t-is-active')).toBe(false);
  });

  test('设置 actived 可变更激活节点', async () => {
    const { container, rerender } = await renderActivableTree({
      actived: ['t1.1'],
    });
    expect(container.querySelector('[data-value="t1.1"]').classList.contains('t-is-active')).toBe(true);

    rerender(<Tree data={data} activable expandAll transition={false} actived={['t1.2']} />);
    await mockDelay();
    expect(container.querySelector('[data-value="t1.1"]').classList.contains('t-is-active')).toBe(false);
    expect(container.querySelector('[data-value="t1.2"]').classList.contains('t-is-active')).toBe(true);

    rerender(<Tree data={data} activable expandAll transition={false} actived={['t1']} />);
    await mockDelay();
    expect(container.querySelector('[data-value="t1"]').classList.contains('t-is-active')).toBe(true);
    expect(container.querySelector('[data-value="t1.2"]').classList.contains('t-is-active')).toBe(false);
  });

  test('actived 受控模式下，点击节点是否激活由外部决定', async () => {
    const onActive = vi.fn();
    const { container } = await renderActivableTree({ actived: [], onActive });
    fireEvent.click(container.querySelector('[data-value="t1.1"]'));
    await mockDelay();
    // 受控属性存在时，未回写 actived 前视图不发生变化
    expect(onActive).toHaveBeenCalled();
    expect(container.querySelector('[data-value="t1.1"]').classList.contains('t-is-active')).toBe(false);
  });

  test('默认激活其他节点，原激活节点要取消激活状态', async () => {
    const { container, ref } = await renderActivableTree({
      data: [
        {
          value: 't1',
          actived: true,
          children: [{ value: 't1.1' }, { value: 't1.2' }],
        },
      ],
    });
    expect(container.querySelector('[data-value="t1"]').classList.contains('t-is-active')).toBe(true);

    ref.current.setItem('t1.1', { actived: true });
    await mockDelay();
    expect(container.querySelector('[data-value="t1"]').classList.contains('t-is-active')).toBe(false);
    expect(container.querySelector('[data-value="t1.1"]').classList.contains('t-is-active')).toBe(true);

    ref.current.setItem('t1.2', { actived: true });
    await mockDelay();
    expect(container.querySelector('[data-value="t1.1"]').classList.contains('t-is-active')).toBe(false);
    expect(container.querySelector('[data-value="t1.2"]').classList.contains('t-is-active')).toBe(true);
  });

  test('设置 activeMultiple 为 true，节点激活状态互不关联', async () => {
    const { container, ref } = await renderActivableTree({
      activeMultiple: true,
      data: [
        {
          value: 't1',
          actived: true,
          children: [{ value: 't1.1' }, { value: 't1.2' }],
        },
      ],
    });
    ref.current.setItem('t1.1', { actived: true });
    await mockDelay();
    expect(container.querySelector('[data-value="t1"]').classList.contains('t-is-active')).toBe(true);
    expect(container.querySelector('[data-value="t1.1"]').classList.contains('t-is-active')).toBe(true);

    ref.current.setItem('t1.2', { actived: true });
    await mockDelay();
    expect(container.querySelector('[data-value="t1"]').classList.contains('t-is-active')).toBe(true);
    expect(container.querySelector('[data-value="t1.1"]').classList.contains('t-is-active')).toBe(true);
    expect(container.querySelector('[data-value="t1.2"]').classList.contains('t-is-active')).toBe(true);
  });
});
