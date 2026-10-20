import React from 'react';
import { mockDelay, render, waitFor } from '@test/utils';

import Tree from '../Tree';

import type { TdTreeProps, TreeInstanceFunctions } from '../type';

// 每个用例独立的树结构，避免用例间相互影响
function getData() {
  return [
    {
      value: 't1',
      children: [{ value: 't1.1' }, { value: 't1.2' }, { value: 't1.3' }],
    },
    { value: 't2' },
  ];
}

async function renderTree(props?: TdTreeProps) {
  const ref = { current: null as TreeInstanceFunctions | null };
  const result = render(<Tree ref={ref} data={getData()} transition={false} expandAll {...props} />);
  await mockDelay();
  return { ...result, ref: ref as { current: TreeInstanceFunctions } };
}

describe('Tree:api', () => {
  describe('remove', () => {
    test('删除指定节点后，应当移除 dom 节点', async () => {
      const { container, ref } = await renderTree();
      expect(container.querySelector('[data-value="t1.1"]')).not.toBeNull();
      expect(container.querySelector('[data-value="t2"]')).not.toBeNull();

      ref.current.remove('t2');
      await waitFor(() => expect(container.querySelector('[data-value="t2"]')).toBeNull());
    });
  });

  describe('getItem', () => {
    test('可以获取目标节点，得到 treeNodeModel', async () => {
      const { ref } = await renderTree();
      const t1d1 = ref.current.getItem('t1.1');
      expect(t1d1.value).toBe('t1.1');
    });

    test('获取不存在的节点返回空值', async () => {
      const { ref } = await renderTree();
      expect(ref.current.getItem('t-not-exist')).toBeUndefined();
    });
  });

  describe('getItems', () => {
    test('无参数时获取全部节点，传值时获取目标节点下的所有节点', async () => {
      const { ref } = await renderTree();
      const all = ref.current.getItems();
      expect(Array.isArray(all)).toBe(true);
      expect(all.length).toBe(5);

      const items = ref.current.getItems('t1');
      expect(Array.isArray(items)).toBe(true);
      expect(items.length).toBe(4);
      expect(items[0].value).toBe('t1');
    });
  });

  describe('setItem', () => {
    test('可以设置节点属性 label，触发视图更新', async () => {
      const { container, ref } = await renderTree({
        data: [{ label: 't1', value: 't1' }],
      });
      expect(container.querySelector('[data-value="t1"]')).toHaveTextContent('t1');

      ref.current.setItem('t1', { label: '节点1' });
      await mockDelay();
      expect(ref.current.getItem('t1').label).toBe('节点1');
      expect(container.querySelector('[data-value="t1"]')).toHaveTextContent('节点1');
    });

    test('可以设置节点属性 checked，父子节点联动更新', async () => {
      const { container, ref } = await renderTree({ checkable: true });
      ref.current.setItem('t1', { checked: true });
      await mockDelay();
      expect(container.querySelector('[data-value="t1"] .t-checkbox').classList.contains('t-is-checked')).toBe(true);
      expect(container.querySelector('[data-value="t1.1"] .t-checkbox').classList.contains('t-is-checked')).toBe(true);
      expect(container.querySelector('[data-value="t1.2"] .t-checkbox').classList.contains('t-is-checked')).toBe(true);
    });

    test('可以设置节点属性 expanded，触发视图更新', async () => {
      const { container, ref } = await renderTree({
        data: [
          {
            value: 't1',
            children: [{ value: 't1.1' }],
          },
          {
            value: 't2',
            children: [{ value: 't2.1' }],
          },
        ],
        expandAll: false,
      });
      expect(container.querySelector('[data-value="t1.1"]')).toBeNull();

      ref.current.setItem('t1', { expanded: true });
      await mockDelay();
      expect(container.querySelector('[data-value="t1.1"]')).not.toBeNull();
    });
  });

  describe('appendTo', () => {
    test('为一个节点追加子节点，支持批量追加', async () => {
      const { container, ref } = await renderTree();

      ref.current.appendTo('t1', { value: 't1.4' });
      await mockDelay();
      expect(container.querySelector('[data-value="t1.4"]')).not.toBeNull();

      ref.current.appendTo('t1', [{ value: 't1.5' }, { value: 't1.6' }]);
      await mockDelay();
      expect(container.querySelector('[data-value="t1.5"]')).not.toBeNull();
      expect(container.querySelector('[data-value="t1.6"]')).not.toBeNull();
    });

    test('为根节点追加子节点', async () => {
      const { container, ref } = await renderTree();

      ref.current.appendTo('', { value: 't3' });
      await mockDelay();
      expect(container.querySelector('[data-value="t3"]')).not.toBeNull();
    });

    test('空数据初始化后，允许插入根节点', async () => {
      const ref = { current: null as TreeInstanceFunctions | null };
      const { container } = render(<Tree ref={ref} data={null} transition={false} />);
      await mockDelay();
      expect(container.querySelector('.t-tree')).toHaveTextContent('暂无数据');

      ref.current.appendTo('', { value: 'insert1' });
      await mockDelay();
      expect(container.querySelector('[data-value="insert1"]')).not.toBeNull();
    });

    test('追加的数据值已存在时，视为移动该节点而非新增重复节点', async () => {
      const { container, ref } = await renderTree();

      // t2 已存在于树上，appendTo 到 t1 下应当移动 t2，而不是新增重复节点
      ref.current.appendTo('t1', { value: 't2' });
      await mockDelay();

      // 移动后 t2 成为 t1 的子节点
      expect(ref.current.getParent('t2').value).toBe('t1');
      // 不产生重复节点
      expect(container.querySelectorAll('[data-value="t2"]').length).toBe(1);
    });
  });

  describe('insertBefore', () => {
    test('新节点插入到目标节点之前', async () => {
      const { container, ref } = await renderTree();

      ref.current.insertBefore('t1.2', { value: 't1.i' });
      await mockDelay();

      expect(container.querySelector('[data-value="t1.i"]')).not.toBeNull();
      expect(ref.current.getIndex('t1.1')).toBe(0);
      expect(ref.current.getIndex('t1.i')).toBe(1);
      expect(ref.current.getIndex('t1.2')).toBe(2);
    });

    test('已存节点可被移动到目标节点之前', async () => {
      const { ref } = await renderTree();

      // t1.3 移动到 t1.1 之前
      ref.current.insertBefore('t1.1', ref.current.getItem('t1.3'));
      expect(ref.current.getIndex('t1.3')).toBe(0);
      expect(ref.current.getIndex('t1.1')).toBe(1);
      expect(ref.current.getIndex('t1.2')).toBe(2);
    });
  });

  describe('insertAfter', () => {
    test('新节点插入到目标节点之后', async () => {
      const { container, ref } = await renderTree();

      ref.current.insertAfter('t1.2', { value: 't1.i' });
      await mockDelay();

      expect(container.querySelector('[data-value="t1.i"]')).not.toBeNull();
      expect(ref.current.getIndex('t1.1')).toBe(0);
      expect(ref.current.getIndex('t1.2')).toBe(1);
      expect(ref.current.getIndex('t1.i')).toBe(2);
    });

    test('已存节点可被移动到目标节点之后', async () => {
      const { ref } = await renderTree();

      // t1.1 移动到 t1.2 之后
      ref.current.insertAfter('t1.2', ref.current.getItem('t1.1'));
      expect(ref.current.getIndex('t1.2')).toBe(0);
      expect(ref.current.getIndex('t1.1')).toBe(1);
      expect(ref.current.getIndex('t1.3')).toBe(2);
    });
  });

  describe('getIndex', () => {
    test('获取节点在同级节点中的序号', async () => {
      const { ref } = await renderTree();
      expect(ref.current.getIndex('t1')).toBe(0);
      expect(ref.current.getIndex('t2')).toBe(1);
      expect(ref.current.getIndex('t1.2')).toBe(1);
    });
  });

  describe('getParent', () => {
    test('获取节点的父节点', async () => {
      const { ref } = await renderTree({
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
      const pnode = ref.current.getParent('t1.1.1');
      expect(pnode.value).toBe('t1.1');

      // 顶层节点没有父节点
      expect(ref.current.getParent('t1')).toBeUndefined();
    });

    test('获取不存在的节点的父节点', async () => {
      const { ref } = await renderTree();
      expect(ref.current.getParent('t-not-exist')).toBeUndefined();
    });
  });

  describe('getParents', () => {
    test('获取所有父级节点', async () => {
      const { ref } = await renderTree({
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
      const pnodes = ref.current.getParents('t1.1.1');
      expect(Array.isArray(pnodes)).toBe(true);
      expect(pnodes.length).toBe(2);
      expect(pnodes[0].value).toBe('t1.1');
      expect(pnodes[1].value).toBe('t1');

      // 顶层节点没有父节点
      expect(ref.current.getParents('t1').length).toBe(0);
    });
  });

  describe('getPath', () => {
    test('获取节点全路径', async () => {
      const { ref } = await renderTree({
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
      const path = ref.current.getPath('t1.1.1');
      expect(Array.isArray(path)).toBe(true);
      expect(path.length).toBe(3);
      expect(path[0].value).toBe('t1');
      expect(path[1].value).toBe('t1.1');
      expect(path[2].value).toBe('t1.1.1');
    });
  });
});
