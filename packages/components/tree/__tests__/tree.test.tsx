import React from 'react';
import { fireEvent, mockDelay, mockTimeout, render, vi, waitFor } from '@test/utils';

import Button from '../../button';
import Tree from '../Tree';

import type { TdTreeProps, TreeInstanceFunctions } from '../type';

describe('Tree', () => {
  // label 类型定义有问题
  const items = [
    {
      label: '第 1 段',
      value: 1,
      children: [
        {
          label: '第 1-1 段',
          value: '1-1',
        },
        {
          label: '第 1-2 段',
          value: '1-2',
        },
      ],
    },
    {
      label: '第 2 段',
      value: 2,
    },
  ];
  async function renderTreeWithProps(props?: TdTreeProps) {
    const ref = {
      current: null as TreeInstanceFunctions | null,
    };
    const result = render(<Tree data={items} label={() => '自定义节点标签'} {...props} ref={ref} />);
    return {
      ...result,
      ref,
    };
  }

  function getTreeDefaultMount(
    TreeComponent: typeof Tree,
    props?: Partial<TdTreeProps>,
    events?: Record<string, unknown>,
  ) {
    return render(<TreeComponent data={items} {...props} {...events} />);
  }

  const lineData = [
    {
      label: '第 1 段',
      value: 1,
      children: [
        {
          label: '第 1-1 段',
          value: '1-1',
          children: [{ label: '第 1-1-1 段', value: '1-1-1' }],
        },
      ],
    },
    {
      label: '第 2 段',
      value: 2,
      children: [
        {
          label: '第 2-1 段',
          value: '2-1',
          children: [{ label: '第 2-1-1 段', value: '2-1-1' }],
        },
      ],
    },
  ];

  const instanceData = [
    {
      label: 't-1',
      value: 1,
      children: [
        {
          label: 't-1-1',
          value: '1-1',
        },
        {
          label: 't-1-2',
          value: '1-2',
          children: [
            {
              label: 't-1-2-1',
              value: '1-2-1',
            },
            {
              label: 't-1-2-2',
              value: '1-2-2',
            },
            {
              label: 't-1-2-3',
              value: '1-2-3',
            },
          ],
        },
      ],
    },
    {
      label: 't-2',
      value: 2,
    },
  ];

  describe('props', () => {
    test('expanded[array<TreeNodeValue>]', async () => {
      const { container } = await renderTreeWithProps({
        expanded: [1, '1-2', '1-2', 2],
      });

      await mockDelay(300);
      const allItems = container.querySelectorAll('.t-tree__item');
      expect(allItems.length).toBe(4);
      const nodeOpenItems = container.querySelectorAll('.t-tree__item--open');
      // only set expanded when node has children
      // or children is `true` when the tree is lazy
      expect(nodeOpenItems.length).toBe(1);
    });

    test('data[array<TreeOptionData>]', async () => {
      const data = [
        {
          label: '第 1 段',
          value: 1,
          loading: true,
          expanded: true,
          children: [
            {
              label: '第 1-1 段',
              value: '1-1',
            },
          ],
        },
        {
          label: '第 2 段',
          value: 2,
        },
      ];
      const { container } = await renderTreeWithProps({ data });
      await mockDelay(300);
      expect(container.querySelectorAll('.t-loading').length).toBe(1);
    });

    test('activeMultiple', async () => {
      const onActiveFn1 = vi.fn();
      const { container } = getTreeDefaultMount(
        Tree,
        { activable: true, defaultActived: [1], activeMultiple: true },
        { onActive: onActiveFn1 },
      );
      await mockDelay(300);
      expect(container.querySelectorAll('.t-tree__item').length).toBe(2);
      fireEvent.click(container.querySelector('.t-tree__item:nth-child(2)'));
      await mockDelay(300);
      expect(container.querySelectorAll('.t-tree__item.t-is-active').length).toBe(2);
      expect(onActiveFn1).toHaveBeenCalled();
      expect(onActiveFn1.mock.calls[0][0]).toEqual([1, 2]);
    });

    test('actived[array<TreeNodeValue>]', async () => {
      const onActiveFn1 = vi.fn();
      const { container } = getTreeDefaultMount(Tree, { activable: true, actived: [1] }, { onActive: onActiveFn1 });
      await mockDelay(300);
      expect(container.querySelectorAll('.t-tree__item').length).toBe(2);
      fireEvent.click(container.querySelector('.t-tree__item:nth-child(2)'));
      await mockDelay(300);
      expect(container.querySelectorAll('.t-tree__item.t-is-active').length).toBe(1);
      expect(onActiveFn1).toHaveBeenCalled();
      expect(onActiveFn1.mock.calls[0][0]).toEqual([2]);
    });

    test('disableCheck', async () => {
      const onChangeFn1 = vi.fn();
      const { container } = getTreeDefaultMount(
        Tree,
        { checkable: true, disableCheck: true },
        { onChange: onChangeFn1 },
      );
      await mockDelay(300);
      fireEvent.click(container.querySelector('.t-checkbox__input'));
      await mockDelay(300);
      expect(container.querySelectorAll('.t-is-checked').length).toBe(0);
      expect(onChangeFn1).not.toHaveBeenCalled();

      const onChangeFn2 = vi.fn();
      const { container: fnContainer } = await renderTreeWithProps({
        onChange: onChangeFn2,
        checkable: true,
        disableCheck: () => true,
      });
      await mockDelay(300);
      fireEvent.click(fnContainer.querySelector('.t-checkbox__input'));
      await mockDelay(300);
      expect(fnContainer.querySelectorAll('.t-is-checked').length).toBe(0);
      expect(onChangeFn2).not.toHaveBeenCalled();
    });

    test('disabled[boolean]', async () => {
      const { container } = getTreeDefaultMount(Tree, {
        checkable: true,
        data: [{ value: 1, label: 1, disabled: false }],
        disabled: false,
      });
      await mockDelay(300);
      expect(container.querySelectorAll('.t-checkbox__input').length).toBe(1);
      fireEvent.click(container.querySelector('.t-checkbox__input'));
      await mockDelay(300);
      expect(container.querySelectorAll('.t-is-checked').length).toBe(1);

      const { container: treeDisabledContainer } = getTreeDefaultMount(Tree, {
        checkable: true,
        data: [{ value: 1, label: 1, disabled: false }],
        disabled: true,
      });
      await mockDelay(300);
      fireEvent.click(treeDisabledContainer.querySelector('.t-checkbox__input'));
      await mockDelay(300);
      expect(treeDisabledContainer.querySelectorAll('.t-is-checked').length).toBe(0);

      const { container: bothDisabledContainer } = getTreeDefaultMount(Tree, {
        checkable: true,
        data: [{ value: 1, label: 1, disabled: true }],
        disabled: true,
      });
      await mockDelay(300);
      fireEvent.click(bothDisabledContainer.querySelector('.t-checkbox__input'));
      await mockDelay(300);
      expect(bothDisabledContainer.querySelectorAll('.t-is-checked').length).toBe(0);

      const { container: nodeDisabledContainer } = getTreeDefaultMount(Tree, {
        checkable: true,
        data: [{ value: 1, label: 1, disabled: true }],
        disabled: false,
      });
      await mockDelay(300);
      fireEvent.click(nodeDisabledContainer.querySelector('.t-checkbox__input'));
      await mockDelay(300);
      expect(nodeDisabledContainer.querySelectorAll('.t-is-checked').length).toBe(0);
    });

    test('empty[string]', async () => {
      const { container } = render(<Tree data={[]} />);
      await mockTimeout(() => {
        expect(container.querySelector('.t-tree')).toHaveTextContent('暂无数据');
      });

      const { container: stringContainer } = render(<Tree data={[]} empty="空数据（string）" />);
      await mockTimeout(() => {
        console.log('customize empty prop', stringContainer.querySelector('.t-tree'));
        expect(stringContainer.querySelector('.t-tree')).toHaveTextContent('空数据（string）');
      });
    });

    test('operations[TNode/function]', async () => {
      const fn1 = vi.fn();
      const renderOperations = (node) => (
        <>
          <Button style={{ marginLeft: '10px' }} size="small" variant="base" onClick={() => fn1(node)}>
            添加子节点
          </Button>
        </>
      );
      const { container } = await renderTreeWithProps({
        operations: renderOperations,
      });
      await mockDelay(300);
      expect(container.querySelector('.t-tree__operations')).not.toBeNull();

      const renderOperationsNode: any = (
        <>
          <Button style={{ marginLeft: '10px' }} size="small" variant="base">
            添加子节点
          </Button>
        </>
      );
      const { container: nodeContainer } = await renderTreeWithProps({
        operations: renderOperationsNode,
      });
      await mockDelay(300);
      expect(nodeContainer.querySelector('.t-tree__operations')).not.toBeNull();
    });

    test('line[TNode/function]', async () => {
      const { container: booleanLineContainer } = getTreeDefaultMount(Tree, {
        expandAll: true,
        line: true,
      });
      await mockDelay(300);
      expect(booleanLineContainer.querySelectorAll('.t-tree__line').length).toBe(2);

      const { container: nodeLineContainer } = await renderTreeWithProps({
        data: lineData,
        expandAll: true,
        line: <span className="custom-line">line</span>,
      });
      await mockDelay(300);
      expect(nodeLineContainer.querySelectorAll('.custom-line').length).toBe(6);

      const lineFn: any = () => <span className="custom-line"></span>;
      const { container: fnLineContainer } = await renderTreeWithProps({
        data: lineData,
        expandAll: true,
        line: lineFn,
      });
      await mockDelay(300);
      expect(fnLineContainer.querySelectorAll('.custom-line').length).toBe(6);
    });

    test('icon[false/TNode/function]', async () => {
      const { container: falseIconContainer } = getTreeDefaultMount(Tree, {
        icon: false,
      });
      await mockDelay(300);
      expect(falseIconContainer.querySelectorAll('.t-tree__icon').length).toBe(2);

      const elementIcon: any = <span>icon</span>;
      const { container: elementIconContainer } = await renderTreeWithProps({
        icon: elementIcon,
      });
      await mockDelay(300);
      expect(elementIconContainer.querySelectorAll('.t-tree__icon').length).toBe(2);

      const fnIcon: any = () => <span>icon</span>;
      const { container: fnIconContainer } = await renderTreeWithProps({
        icon: fnIcon,
      });
      await mockDelay(300);
      expect(fnIconContainer.querySelectorAll('.t-tree__icon').length).toBe(2);
    });

    test('checkable', async () => {
      const data = [
        {
          label: 't-1',
          value: 1,
          children: [
            {
              label: 't-1-1',
              value: '1-1',
            },
          ],
        },
      ];
      const { container } = await renderTreeWithProps({
        data,
        checkable: true,
      });
      expect(container.querySelector('.t-tree')).not.toBeNull();
      // show node list
      await mockTimeout(() => {
        expect(container.querySelector('.t-tree__list').children.length).not.toBe(0);
      }, 100);
    });

    test('label[function]', async () => {
      const data = [
        {
          label: '第 1 段',
          value: 1,
          children: [
            {
              label: '第 1-1 段',
              value: '1-1',
            },
          ],
        },
        {
          label: '第 2 段',
          value: 2,
        },
      ];
      const { container } = await renderTreeWithProps({
        data,
        label: ({ data, setData }) =>
          data.isEditing ? (
            <input
              className="tree-item-input"
              defaultValue={data.label as string}
              onBlur={(e) => {
                console.log('blur', { ...data, isEditing: false });
                setData({ ...data, label: e.target.value, isEditing: false });
              }}
              onKeyDown={(e) => {
                console.log('keydown', e.key);
                if (e.key === 'Enter') {
                  setData({
                    ...data,
                    label: e.currentTarget.value,
                    isEditing: false,
                  });
                  console.log('Enter setData({ ...data, name: e.target.value, isEditing: false })');
                }
                if (e.key === 'Escape') {
                  setData({ ...data, isEditing: false });
                  console.log('ESC setData({ ...data, isEditing: false })');
                }
              }}
            />
          ) : (
            <span
              className="tree-item-span"
              onDoubleClick={(e) => {
                e.stopPropagation();
                setData({ ...data, isEditing: true });
              }}
            >
              {data.label}
            </span>
          ),
      });
      await mockDelay(300);
      expect(container.querySelector('.tree-item-span')).not.toBeNull();
      fireEvent.dblClick(container.querySelector('.tree-item-span'));
      await mockDelay(300);
      expect(container.querySelector('.tree-item-input')).not.toBeNull();
      fireEvent.change(container.querySelector('.tree-item-input'), {
        target: { value: '123' },
      });
      expect((container.querySelector('.tree-item-input') as HTMLInputElement).value).toBe('123');
      (container.querySelector('.tree-item-input') as HTMLInputElement).focus();
      (container.querySelector('.tree-item-input') as HTMLInputElement).blur();
      await mockDelay(300);
      expect(container.querySelector('.tree-item-input')).toBeNull();
      expect(container.querySelector('.tree-item-span')).not.toBeNull();
      expect(container.querySelector('.tree-item-span').textContent).toBe('123');
    });
  });

  describe('events', () => {
    test('onDragOver, onDragEnd, onDragStart, onDragLeave and onDrop', async () => {
      const onDragOverFn1 = vi.fn();
      const onDragEndFn2 = vi.fn();
      const onDragStartFn3 = vi.fn();
      const onDragLeaveFn4 = vi.fn();
      const { container } = getTreeDefaultMount(
        Tree,
        { checkable: true, disableCheck: true, draggable: true },
        {
          onDragOver: onDragOverFn1,
          onDragEnd: onDragEndFn2,
          onDragStart: onDragStartFn3,
          onDragLeave: onDragLeaveFn4,
        },
      );
      await mockDelay(300);
      fireEvent.dragOver(container.querySelector('.t-tree__item'));
      await mockDelay();
      expect(onDragOverFn1).toHaveBeenCalled();
      fireEvent.dragEnd(container.querySelector('.t-tree__item'));
      await mockDelay();
      expect(onDragEndFn2).toHaveBeenCalled();
      fireEvent.dragStart(container.querySelector('.t-tree__item'));
      await mockDelay();
      expect(onDragStartFn3).toHaveBeenCalled();
      fireEvent.dragLeave(container.querySelector('.t-tree__item'));
      await mockDelay();
      expect(onDragLeaveFn4).toHaveBeenCalled();

      const onDragEndFn1 = vi.fn();
      const onDropFn2 = vi.fn();
      const { container: dropContainer } = getTreeDefaultMount(
        Tree,
        { draggable: true },
        { onDragEnd: onDragEndFn1, onDrop: onDropFn2 },
      );
      await mockDelay(300);
      fireEvent.dragEnd(dropContainer.querySelector('.t-tree__item:nth-child(2)'));
      await mockDelay();
      expect(onDragEndFn1).toHaveBeenCalled();
      fireEvent.drop(dropContainer.querySelector('.t-tree__item'));
      await mockDelay();
      expect(onDropFn2).toHaveBeenCalled();
    });
  });

  describe('instanceFunctions', () => {
    test('query and mutation methods', async () => {
      const { ref } = await renderTreeWithProps({
        data: instanceData,
        checkable: true,
      });

      expect(ref.current.getIndex(1)).toBe(0);
      const node = ref.current.getItem(1);
      expect(node.value).toBe(1);
      expect(node.label).toBe('t-1');
      expect(ref.current.getItems(1).length).toEqual(6);
      expect(ref.current.getParent('1-2-1').value).toBe('1-2');
      expect(ref.current.getParents('1-2-1').length).toBe(2);
      expect(ref.current.getPath('1-2-1').length).toBe(3);
      ref.current.getPath('1-2-1');

      ref.current.insertBefore(1, { value: 'insert-before' });
      expect(ref.current.getItem('insert-before').value).toBe('insert-before');

      ref.current.insertAfter(2, { value: 'insert-after' });
      expect(ref.current.getItem('insert-after').value).toBe('insert-after');

      ref.current.appendTo(1, { value: '1-appendTo' });
      expect(ref.current.getItem('1-appendTo').value).toBe('1-appendTo');
      ref.current.remove('1-appendTo');
      expect(ref.current.getItem('1-appendTo')).toBeUndefined();

      ref.current.setItem(1, {
        label: 't-1-new',
        checked: true,
        actived: true,
        expanded: true,
        checkable: true,
      });
      await mockDelay(300);
      expect(ref.current.getItem(1).label).toBe('t-1-new');
      expect(ref.current.getItem(1).checked).toBe(true);
      expect(ref.current.getItem(1).expanded).toBe(true);
    });
  });

  describe('scenarios', () => {
    const data = [
      {
        value: 'parent',
        label: 'Parent',
        children: [
          { value: 'a', label: 'A' },
          { value: 'b', label: 'B' },
          { value: 'disabled', label: 'Disabled', disabled: true },
        ],
      },
    ];

    const valueModes = [
      ['onlyLeaf', ['a', 'b']],
      ['all', ['parent', 'a', 'b']],
      ['parentFirst', ['parent']],
    ] as const;

    async function setup(props: Partial<TdTreeProps> = {}) {
      const onChange = vi.fn();
      const result = render(<Tree data={data} checkable expandAll transition={false} onChange={onChange} {...props} />);
      await waitFor(() => expect(result.getAllByRole('checkbox')).toHaveLength(4));
      return {
        ...result,
        onChange,
        inputs: result.getAllByRole('checkbox') as HTMLInputElement[],
      };
    }

    describe('disabled children', () => {
      valueModes.forEach(([valueMode, expected]) => {
        test(`valueMode[${valueMode}] round-trips controlled values without checking disabled children`, async () => {
          const onChange = vi.fn();
          function ControlledTree() {
            const [value, setValue] = React.useState([]);
            return (
              <Tree
                data={data}
                checkable
                expandAll
                transition={false}
                valueMode={valueMode}
                value={value}
                onChange={(nextValue, context) => {
                  onChange(nextValue, context);
                  setValue(nextValue);
                }}
              />
            );
          }
          const { getAllByRole } = render(<ControlledTree />);
          await waitFor(() => expect(getAllByRole('checkbox')).toHaveLength(4));
          const inputs = getAllByRole('checkbox');
          fireEvent.click(inputs[0]);
          expect(onChange.mock.lastCall[0]).toEqual(expected);
          await waitFor(() => expect(inputs[0]).toBeChecked());
          expect(inputs[3]).not.toBeChecked();
          fireEvent.click(inputs[0]);
          expect(onChange.mock.lastCall[0]).toEqual([]);
          await waitFor(() => expect(inputs[0]).not.toBeChecked());
        });

        test(`valueMode[${valueMode}] checks and unchecks the parent without selecting disabled children`, async () => {
          const { inputs, onChange } = await setup({ valueMode });
          fireEvent.click(inputs[0]);
          expect(onChange.mock.lastCall[0]).toEqual(expected);
          expect(onChange.mock.lastCall[1].node.value).toBe('parent');
          await waitFor(() => expect(inputs[0]).toBeChecked());
          expect(inputs[0].closest('label')).not.toHaveClass('t-is-indeterminate');
          expect(inputs[1]).toBeChecked();
          expect(inputs[2]).toBeChecked();
          expect(inputs[3]).not.toBeChecked();
          expect(inputs[3]).toBeDisabled();

          fireEvent.click(inputs[0]);
          expect(onChange.mock.lastCall[0]).toEqual([]);
          await waitFor(() => expect(inputs[0]).not.toBeChecked());
          expect(inputs[0].closest('label')).not.toHaveClass('t-is-indeterminate');
          expect(inputs[1]).not.toBeChecked();
          expect(inputs[2]).not.toBeChecked();
        });

        test(`valueMode[${valueMode}] derives full and partial selection from enabled children`, async () => {
          const { inputs, onChange } = await setup({ valueMode });
          fireEvent.click(inputs[1]);
          expect(onChange.mock.lastCall[0]).toEqual(['a']);
          await waitFor(() => expect(inputs[0].closest('label')).toHaveClass('t-is-indeterminate'));

          fireEvent.click(inputs[2]);
          expect(onChange.mock.lastCall[0]).toEqual(expected);
          await waitFor(() => expect(inputs[0]).toBeChecked());
          expect(inputs[0].closest('label')).not.toHaveClass('t-is-indeterminate');

          fireEvent.click(inputs[1]);
          expect(onChange.mock.lastCall[0]).toEqual(['b']);
          await waitFor(() => expect(inputs[0].closest('label')).toHaveClass('t-is-indeterminate'));
          expect(inputs[0]).not.toBeChecked();
        });

        test(`valueMode[${valueMode}] does not check a parent with only disabled children`, async () => {
          const { inputs, onChange } = await setup({
            valueMode,
            data: [
              {
                ...data[0],
                children: data[0].children.map((child) => ({
                  ...child,
                  disabled: true,
                })),
              },
            ],
          });
          expect(inputs[0]).not.toBeChecked();
          expect(inputs[0].closest('label')).not.toHaveClass('t-is-indeterminate');
          fireEvent.click(inputs[0]);
          expect(onChange.mock.lastCall[0]).toEqual([]);
          expect(inputs[0]).not.toBeChecked();
        });
      });

      (['all', 'parentFirst'] as const).forEach((valueMode) => {
        test(`valueMode[${valueMode}] preserves a selected disabled child`, async () => {
          const { inputs, onChange } = await setup({
            valueMode,
            defaultValue: ['disabled'],
          });
          expect(inputs[0]).not.toBeChecked();
          expect(inputs[0].closest('label')).not.toHaveClass('t-is-indeterminate');
          expect(inputs[3]).toBeChecked();
          fireEvent.click(inputs[0]);
          expect(onChange.mock.lastCall[0]).toEqual(
            valueMode === 'all' ? ['parent', 'a', 'b', 'disabled'] : ['parent', 'disabled'],
          );
          await waitFor(() => expect(inputs[0]).toBeChecked());
          fireEvent.click(inputs[0]);
          expect(onChange.mock.lastCall[0]).toEqual(['disabled']);
          await waitFor(() => expect(inputs[0]).not.toBeChecked());
          expect(inputs[0].closest('label')).not.toHaveClass('t-is-indeterminate');
          expect(inputs[3]).toBeChecked();
        });
      });

      test('valueMode[all] excludes disabled branches and their descendants from parent selection', async () => {
        const onChange = vi.fn();
        const { getAllByRole } = render(
          <Tree
            checkable
            expandAll
            transition={false}
            valueMode="all"
            data={[
              {
                value: 'root',
                children: [
                  { value: 'enabled' },
                  {
                    value: 'branch',
                    disabled: true,
                    children: [{ value: 'leaf' }],
                  },
                ],
              },
            ]}
            onChange={onChange}
          />,
        );
        await waitFor(() => expect(getAllByRole('checkbox')).toHaveLength(4));
        const inputs = getAllByRole('checkbox');
        fireEvent.click(inputs[0]);
        expect(onChange.mock.lastCall[0]).toEqual(['root', 'enabled']);
        await waitFor(() => expect(inputs[0]).toBeChecked());
        expect(inputs[2]).not.toBeChecked();
        expect(inputs[3]).not.toBeChecked();
        expect(inputs[2]).toBeDisabled();
        expect(inputs[3]).toBeDisabled();
      });

      test('valueMode[all] propagates full selection through nested enabled branches', async () => {
        const onChange = vi.fn();
        const { getAllByRole } = render(
          <Tree
            checkable
            expandAll
            transition={false}
            valueMode="all"
            data={[{ value: 'root', label: 'Root', children: data }]}
            onChange={onChange}
          />,
        );
        await waitFor(() => expect(getAllByRole('checkbox')).toHaveLength(5));
        const inputs = getAllByRole('checkbox') as HTMLInputElement[];
        fireEvent.click(inputs[0]);
        expect(onChange.mock.lastCall[0]).toEqual(['root', 'parent', 'a', 'b']);
        await waitFor(() => expect(inputs[0]).toBeChecked());
        expect(inputs[1]).toBeChecked();
        expect(inputs[0].closest('label')).not.toHaveClass('t-is-indeterminate');
        expect(inputs[1].closest('label')).not.toHaveClass('t-is-indeterminate');
        expect(inputs[4]).not.toBeChecked();
      });

      test('checkStrictly keeps parent checking independent of child selection', async () => {
        const { inputs, onChange } = await setup({ checkStrictly: true });
        fireEvent.click(inputs[0]);
        expect(onChange.mock.lastCall[0]).toEqual(['parent']);
        await waitFor(() => expect(inputs[0]).toBeChecked());
        expect(inputs[1]).not.toBeChecked();
        expect(inputs[2]).not.toBeChecked();
        expect(inputs[3]).not.toBeChecked();
      });
    });

    test('operations throws when given an invalid type', async () => {
      const renderOperations: any = new Error('error operations');
      try {
        await renderTreeWithProps({ operations: renderOperations });
      } catch (err) {
        expect(err).toEqual(new Error('invalid type of operations'));
      }
    });
  });
});
