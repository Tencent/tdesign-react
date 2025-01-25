import React from 'react';
import { render, fireEvent, vi, mockTimeout, mockDelay } from '@test/utils';
import Tree from '../Tree';
import Button from '../../button';
import { TdTreeProps } from '../type';

// TODO
describe('Tree test', () => {
  // label 类型定义有问题
  const items = [
    {
      label: '第1一段',
      value: 1,
      children: [
        {
          label: '第二段',
          value: '1-1',
        },
        {
          label: '第二段',
          value: '1-2',
        },
      ],
    },
    {
      label: '第二段',
      value: 2,
    },
  ];
  async function renderTreeWithProps(props?: TdTreeProps) {
    const ref = {
      current: null,
    };
    const result = render(<Tree data={items} label={() => '自定义节点标签'} {...props} ref={ref} />);
    return {
      ...result,
      ref,
    };
  }

  test('empty Tree', async () => {
    const { container } = render(<Tree data={[]} />);
    await mockTimeout(() => {
      expect(container.querySelector('.t-tree')).toHaveTextContent('暂无数据');
    });
  });

  test('customize empty prop', async () => {
    const { container } = render(<Tree data={[]} empty="空数据（string）" />);
    await mockTimeout(() => {
      console.log('customize empty prop', container.querySelector('.t-tree'));
      expect(container.querySelector('.t-tree')).toHaveTextContent('空数据（string）');
    });
  });

  test('test trigger events', async () => {
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
    const { container } = await renderTreeWithProps({ data, checkable: true });
    expect(container.querySelector('.t-tree')).not.toBeNull();
    // show node list
    await mockTimeout(() => {
      expect(container.querySelector('.t-tree__list').children.length).not.toBe(0);
    }, 100);
  });

  test('test Tree instance api', async () => {
    const data = [
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
    const { ref } = await renderTreeWithProps({ data, checkable: true });

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

  test('test render Tree operations, props.operations is a function', async () => {
    const fn1 = vi.fn();
    const renderOperations = (node) => (
      <>
        <Button style={{ marginLeft: '10px' }} size="small" variant="base" onClick={() => fn1(node)}>
          添加子节点
        </Button>
      </>
    );
    const { container } = await renderTreeWithProps({ operations: renderOperations });
    await mockDelay(300);
    expect(container.querySelector('.t-tree__operations')).not.toBeNull();
  });

  test('test render Tree operations function, props.operations is a reactNode', async () => {
    // operations 类型定义有些问题
    const renderOperations: any = (
      <>
        <Button style={{ marginLeft: '10px' }} size="small" variant="base">
          添加子节点
        </Button>
      </>
    );
    const { container } = await renderTreeWithProps({ operations: renderOperations });
    await mockDelay(300);
    expect(container.querySelector('.t-tree__operations')).not.toBeNull();
  });
  test('test render Tree operations error', async () => {
    const renderOperations: any = new Error('error operations');
    try {
      await renderTreeWithProps({ operations: renderOperations });
    } catch (err) {
      expect(err).toEqual(new Error('invalid type of operations'));
    }
  });

  it('when props.disableCheck is a function , it works fine', async () => {
    const onChangeFn1 = vi.fn();
    const { container } = await renderTreeWithProps({
      onChange: onChangeFn1,
      checkable: true,
      disableCheck: () => true,
    });

    await mockDelay(300);
    expect(container.querySelectorAll('.t-checkbox__input').length).toBe(2);
    fireEvent.click(container.querySelector('.t-checkbox__input'));
    await mockDelay(300);
    expect(container.querySelectorAll('.t-is-checked').length).toBe(0);
    expect(onChangeFn1).not.toHaveBeenCalled();
  });

  it('should calculate right class of tree item.', async () => {
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

  describe('Test props.line', async () => {
    const data = [
      {
        label: '第1一段',
        value: 1,
        children: [
          {
            label: '第二段',
            value: '1-1',
            children: [
              {
                label: '第三段',
                value: '1-1-1',
              },
            ],
          },
        ],
      },
      {
        label: '第二段',
        value: 2,
        children: [
          {
            label: '2.1',
            value: '2-1',
            children: [
              {
                label: '2.1.1',
                value: '2-1-1',
              },
            ],
          },
        ],
      },
    ];
    it('wehen props.line is customized, it works fine', async () => {
      const { container } = await renderTreeWithProps({
        data,
        expandAll: true,
        line: <span className="custom-line">line</span>,
      });
      await mockDelay(300);
      expect(container.querySelectorAll('.custom-line').length).toBe(6);
    });

    it('wehen props.line is a customized function, it works fine', async () => {
      const line: any = () => <span className="custom-line"></span>;
      const { container } = await renderTreeWithProps({
        data,
        expandAll: true,
        line,
      });
      await mockDelay(300);
      expect(container.querySelectorAll('.custom-line').length).toBe(6);
    });
  });
  test('when props.icon is a validElement, it works fine', async () => {
    const icon: any = <span>icon</span>;
    const { container } = await renderTreeWithProps({ icon });
    await mockDelay(300);
    expect(container.querySelectorAll('.t-tree__icon').length).toBe(2);
  });

  it('when props.icon is a validElement, it works fine', async () => {
    const icon: any = <span>icon</span>;
    const { container } = await renderTreeWithProps({ icon });
    await mockDelay(300);
    expect(container.querySelectorAll('.t-tree__icon').length).toBe(2);
  });
  it('when props.icon is a function, it works fine', async () => {
    const icon: any = () => <span>icon</span>;
    const { container } = await renderTreeWithProps({ icon });
    await mockDelay(300);
    expect(container.querySelectorAll('.t-tree__icon').length).toBe(2);
  });

  // TODO: icon error can't be caught by vitest
  // it('test render Tree icon error', async () => {
  //   const icon: any = new Error('error icon');
  //   try {
  //     renderTreeWithProps({ icon });
  //   } catch (err) {
  //     expect(err).toEqual(new Error('invalid type of icon'));
  //   }
  // });

  test('TreeNodeState.loading works fine', async () => {
    const data = [
      {
        label: '第1一段',
        value: 1,
        loading: true,
        expanded: true,
        children: [
          {
            label: '第二段',
            value: '1-1',
          },
        ],
      },
      {
        label: '第二段',
        value: 2,
      },
    ];
    const { container } = await renderTreeWithProps({ data });
    await mockDelay(300);
    expect(container.querySelectorAll('.t-loading').length).toBe(1);
  });

  test('custom label', async () => {
    const data = [
      {
        label: '第1一段',
        value: 1,
        children: [
          {
            label: '第二段',
            value: '1-1',
          },
        ],
      },
      {
        label: '第二段',
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
                setData({ ...data, label: e.currentTarget.value, isEditing: false });
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
    fireEvent.change(container.querySelector('.tree-item-input'), { target: { value: '123' } });
    expect(container.querySelector('.tree-item-input').value).toBe('123');
    container.querySelector('.tree-item-input').focus();
    container.querySelector('.tree-item-input').blur();
    await mockDelay(300);
    expect(container.querySelector('.tree-item-input')).toBeNull();
    expect(container.querySelector('.tree-item-span')).not.toBeNull();
    expect(container.querySelector('.tree-item-span').textContent).toBe('123');
  });
});
