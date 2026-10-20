import React from 'react';
import { fireEvent, mockDelay, render, vi } from '@test/utils';

import Tree from '../Tree';

import type { TdTreeProps, TreeInstanceFunctions } from '../type';

// 每个用例独立的树结构，避免用例间相互影响
function getData() {
  return [
    {
      value: 't1',
      children: [{ value: 't1.1' }, { value: 't1.2' }],
    },
  ];
}

async function renderTree(props?: TdTreeProps) {
  const ref = { current: null as TreeInstanceFunctions | null };
  const result = render(<Tree ref={ref} data={getData()} transition={false} expandAll {...props} />);
  await mockDelay();
  return { ...result, ref: ref as { current: TreeInstanceFunctions } };
}

describe('Tree:checkable', () => {
  test('默认不可选择，checkable 设为 true 时渲染复选框', async () => {
    const { container } = await renderTree();
    expect(container.querySelector('[data-value="t1"] input[type=checkbox]')).toBeNull();

    const { container: checkableContainer } = await renderTree({
      checkable: true,
    });
    expect(checkableContainer.querySelector('[data-value="t1"] input[type=checkbox]')).not.toBeNull();
  });

  test('defaultValue 设置默认选中值', async () => {
    const { container } = await renderTree({
      checkable: true,
      defaultValue: ['t1.1'],
    });
    expect(container.querySelector('[data-value="t1.1"] .t-checkbox').classList.contains('t-is-checked')).toBe(true);
    expect(container.querySelector('[data-value="t1.2"] .t-checkbox').classList.contains('t-is-checked')).toBe(false);
  });

  test('value 可受控指定选中节点', async () => {
    const { container } = await renderTree({
      checkable: true,
      value: ['t1.1'],
    });
    expect(container.querySelector('[data-value="t1.1"] .t-checkbox').classList.contains('t-is-checked')).toBe(true);
  });

  test('设置 value 可变更选中节点', async () => {
    const { container, rerender } = await renderTree({
      checkable: true,
      value: ['t1.1'],
    });
    expect(container.querySelector('[data-value="t1.1"] .t-checkbox').classList.contains('t-is-checked')).toBe(true);

    rerender(<Tree data={getData()} transition={false} expandAll checkable value={['t1.2']} />);
    await mockDelay();
    expect(container.querySelector('[data-value="t1.1"] .t-checkbox').classList.contains('t-is-checked')).toBe(false);
    expect(container.querySelector('[data-value="t1.2"] .t-checkbox').classList.contains('t-is-checked')).toBe(true);
  });

  test('checkStrictly 设为 true，选中节点不会影响父节点状态', async () => {
    const { container, ref } = await renderTree({
      checkable: true,
      checkStrictly: true,
    });
    ref.current.setItem('t1.2', { checked: true });
    await mockDelay();
    expect(container.querySelector('[data-value="t1"] .t-checkbox').classList.contains('t-is-checked')).toBe(false);
    expect(container.querySelector('[data-value="t1"] .t-checkbox').classList.contains('t-is-indeterminate')).toBe(
      false,
    );
    expect(container.querySelector('[data-value="t1.2"] .t-checkbox').classList.contains('t-is-checked')).toBe(true);
  });

  test('选中部分子节点，父节点呈现半选状态', async () => {
    const { container, ref } = await renderTree({ checkable: true });
    ref.current.setItem('t1.2', { checked: true });
    await mockDelay();
    expect(container.querySelector('[data-value="t1"] .t-checkbox').classList.contains('t-is-indeterminate')).toBe(
      true,
    );
    expect(container.querySelector('[data-value="t1"] .t-checkbox').classList.contains('t-is-checked')).toBe(false);
  });

  test('valueMode="onlyLeaf" 时，选中值为叶子节点', async () => {
    const onChange = vi.fn();
    const { container } = await renderTree({
      checkable: true,
      valueMode: 'onlyLeaf',
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
      onChange,
    });
    fireEvent.click(container.querySelector('[data-value="t1"] input[type=checkbox]'));
    await mockDelay();
    expect(onChange).toHaveBeenCalled();
    const [checked, context] = onChange.mock.calls[0];
    expect(checked).toEqual(['t1.1.1']);
    expect(context.node.value).toEqual('t1');
  });

  test('valueMode="all" 时，选中值包含父节点和子节点', async () => {
    const onChange = vi.fn();
    const { container } = await renderTree({
      checkable: true,
      valueMode: 'all',
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
      onChange,
    });
    fireEvent.click(container.querySelector('[data-value="t1"] input[type=checkbox]'));
    await mockDelay();
    expect(onChange).toHaveBeenCalled();
    const [checked, context] = onChange.mock.calls[0];
    expect(checked).toEqual(['t1', 't1.1', 't1.1.1']);
    expect(context.node.value).toEqual('t1');
  });

  test('valueMode="parentFirst" 时，子节点全部选中时仅父节点在选中值里', async () => {
    const onChange = vi.fn();
    const { container } = await renderTree({
      checkable: true,
      valueMode: 'parentFirst',
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
      onChange,
    });
    fireEvent.click(container.querySelector('[data-value="t1"] input[type=checkbox]'));
    await mockDelay();
    expect(onChange).toHaveBeenCalled();
    const [checked, context] = onChange.mock.calls[0];
    expect(checked).toEqual(['t1']);
    expect(context.node.value).toEqual('t1');
  });

  test('setItem 可以设置节点半选状态', async () => {
    const { container, ref } = await renderTree({ checkable: true });
    ref.current.setItem('t1', { indeterminate: true });
    await mockDelay();
    expect(container.querySelector('[data-value="t1"] .t-checkbox').classList.contains('t-is-indeterminate')).toBe(
      true,
    );
    expect(container.querySelector('[data-value="t1"] .t-checkbox').classList.contains('t-is-checked')).toBe(false);
  });
});
