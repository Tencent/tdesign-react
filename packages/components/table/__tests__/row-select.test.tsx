import React from 'react';
import { vi } from '@test/utils';
import { fireEvent, render } from '@testing-library/react';
import { EnhancedTable, Table } from '..';

const columns = [
  {
    colKey: 'row-select',
    type: 'multiple' as const,
    disabled: ({ row }) => row.disabled === true,
  },
  { colKey: 'key', title: 'Key' },
];

describe('Table', () => {
  function getTableData({ withDisabled = true } = {}) {
    const data = [];
    for (let i = 0; i <= 5; i++) {
      data.push({
        key: `${i}`,
        ...(withDisabled && i === 2 ? { disabled: true } : {}),
      });
    }
    return data;
  }

  const TestPrimaryTable = ({ defaultSelectedRowKeys = [], onSelectChange = vi.fn(), data = getTableData() }) => (
    <Table
      rowKey="key"
      columns={columns}
      data={data}
      defaultSelectedRowKeys={defaultSelectedRowKeys}
      onSelectChange={onSelectChange}
    />
  );

  it('全选（不存在 disabled 行）', async () => {
    const onSelectChange = vi.fn();

    const { container } = render(
      <TestPrimaryTable data={getTableData({ withDisabled: false })} onSelectChange={onSelectChange} />,
    );

    const selectAllCheckbox = container.querySelector('th[data-colkey="row-select"] .t-checkbox');
    expect(selectAllCheckbox).not.toHaveClass('t-is-checked');
    expect(selectAllCheckbox).not.toHaveClass('t-is-indeterminate');

    // 全选
    await fireEvent.click(selectAllCheckbox);
    expect(selectAllCheckbox).toHaveClass('t-is-checked');
    expect(onSelectChange).toHaveBeenCalledWith(['0', '1', '2', '3', '4', '5'], expect.any(Object));

    // 取消全选
    onSelectChange.mockClear();
    await fireEvent.click(selectAllCheckbox);
    expect(selectAllCheckbox).not.toHaveClass('t-is-checked');
    expect(onSelectChange).toHaveBeenCalledWith([], expect.any(Object));
  });

  it('全选（存在 disabled 行）', async () => {
    const onSelectChange = vi.fn();

    const { container } = render(<TestPrimaryTable onSelectChange={onSelectChange} />);

    const selectAllCheckbox = container.querySelector('th[data-colkey="row-select"] .t-checkbox');
    expect(selectAllCheckbox).not.toHaveClass('t-is-checked');
    expect(selectAllCheckbox).not.toHaveClass('t-is-indeterminate');

    // 全选
    await fireEvent.click(selectAllCheckbox);
    expect(selectAllCheckbox).toHaveClass('t-is-indeterminate');
    expect(onSelectChange).toHaveBeenCalledWith(expect.arrayContaining(['0', '1', '3', '4', '5']), expect.any(Object));
    expect(onSelectChange.mock.calls[0][0]).not.toContain('2'); // 禁用行不应该被选中

    // 取消全选
    onSelectChange.mockClear();
    await fireEvent.click(selectAllCheckbox);
    expect(selectAllCheckbox).not.toHaveClass('t-is-indeterminate');
    expect(onSelectChange).toHaveBeenCalledWith([], expect.any(Object));
  });

  it('全选（初始化选中 disabled 行）', async () => {
    const onSelectChange = vi.fn();

    const { container } = render(<TestPrimaryTable defaultSelectedRowKeys={['2']} onSelectChange={onSelectChange} />);

    const selectAllCheckbox = container.querySelector('th[data-colkey="row-select"] .t-checkbox');
    expect(selectAllCheckbox).toHaveClass('t-is-indeterminate');

    // 全选
    await fireEvent.click(selectAllCheckbox);
    expect(selectAllCheckbox).toHaveClass('t-is-checked');
    expect(onSelectChange).toHaveBeenCalledWith(
      expect.arrayContaining(['0', '1', '2', '3', '4', '5']),
      expect.any(Object),
    );

    // 取消全选
    onSelectChange.mockClear();
    await fireEvent.click(selectAllCheckbox);
    expect(selectAllCheckbox).toHaveClass('t-is-indeterminate');
    expect(onSelectChange).toHaveBeenCalledWith(['2'], expect.any(Object)); // 禁用行保留
  });
});

describe('EnhancedTable', () => {
  function getTreeData() {
    const data = [];

    for (let i = 0; i <= 2; i++) {
      const parentItem = {
        key: `${i}`,
        children: [],
      };

      for (let j = 0; j <= 2; j++) {
        const childItem = {
          key: `${i}-${j}`,
          children: [],
        };

        for (let k = 0; k <= 2; k++) {
          childItem.children.push({
            key: `${i}-${j}-${k}`,
          });
        }

        parentItem.children.push(childItem);
      }

      data.push(parentItem);
    }

    return data;
  }

  function getTreeDataWithDisabled() {
    const data = getTreeData();
    data[1].children[1].children[0].disabled = true;
    return data;
  }

  const TestEnhancedTable = ({ checkStrictly = false, defaultSelectedRowKeys = [], onSelectChange = vi.fn() }) => (
    <EnhancedTable
      rowKey="key"
      data={getTreeDataWithDisabled()}
      columns={columns}
      defaultSelectedRowKeys={defaultSelectedRowKeys}
      onSelectChange={onSelectChange}
      tree={{
        checkStrictly,
      }}
    />
  );

  it('全选（存在 disabled 行）', async () => {
    const onSelectChange = vi.fn();

    const { container } = render(<TestEnhancedTable onSelectChange={onSelectChange} />);

    const selectAllCheckbox = container.querySelector('th[data-colkey="row-select"] .t-checkbox');

    // 初始状态
    expect(selectAllCheckbox).not.toHaveClass('t-is-checked');
    expect(selectAllCheckbox).not.toHaveClass('t-is-indeterminate');

    await fireEvent.click(selectAllCheckbox);
    const selectedKeys = onSelectChange.mock.calls[0][0];

    expect(selectAllCheckbox).toHaveClass('t-is-indeterminate');
    expect(selectedKeys).toHaveLength(38); // 39 - 1
    expect(selectedKeys).not.toContain('1-1-0'); // 不包含禁用项
  });

  it('全选（初始化选中 disabled 行）', async () => {
    const onSelectChange = vi.fn();

    const { container } = render(
      <TestEnhancedTable defaultSelectedRowKeys={['1-1-0']} onSelectChange={onSelectChange} />,
    );

    const selectAllCheckbox = container.querySelector('th[data-colkey="row-select"] .t-checkbox');

    expect(selectAllCheckbox).toHaveClass('t-is-indeterminate');

    // 全选
    await fireEvent.click(selectAllCheckbox);

    const selectedKeys = onSelectChange.mock.calls[0][0];

    // 全选 + 禁用行存在 → checked
    expect(selectAllCheckbox).toHaveClass('t-is-checked');

    expect(selectedKeys).toHaveLength(39);
    expect(selectedKeys).toContain('1-1-0');

    // 取消全选
    onSelectChange.mockClear();
    await fireEvent.click(selectAllCheckbox);

    const afterUncheck = onSelectChange.mock.calls[0][0];

    // 只剩禁用行
    expect(afterUncheck).toEqual(['1-1-0']);
    expect(selectAllCheckbox).toHaveClass('t-is-indeterminate');
  });

  it('父节点选择 (checkStrictly=false)', async () => {
    const onSelectChange = vi.fn();
    const { container } = render(
      <TestEnhancedTable defaultSelectedRowKeys={['1-1-0']} onSelectChange={onSelectChange} />,
    );

    const rows = container.querySelectorAll('tr.t-table-tr--level-0');
    const parentCheckbox = rows[1].querySelector('.t-checkbox');

    expect(parentCheckbox).toHaveClass('t-is-indeterminate');

    await fireEvent.click(parentCheckbox);

    const selectedKeys = onSelectChange.mock.calls[0][0];

    expect(parentCheckbox).toHaveClass('t-is-checked');
    expect(selectedKeys).toContain('1');
    expect(selectedKeys).toContain('1-1-0');
    expect(selectedKeys).toHaveLength(13);

    onSelectChange.mockClear();
    await fireEvent.click(parentCheckbox);

    expect(onSelectChange).toHaveBeenCalledWith(['1-1-0'], expect.any(Object));
  });

  it('父节点选择 (checkStrictly=true)', async () => {
    const onSelectChange = vi.fn();
    const { container } = render(
      <TestEnhancedTable defaultSelectedRowKeys={['1-1-0']} onSelectChange={onSelectChange} checkStrictly />,
    );
    const rows = container.querySelectorAll('tr.t-table-tr--level-0');

    const parentCheckbox = rows[1].querySelector('.t-checkbox');
    expect(parentCheckbox).not.toHaveClass('t-is-indeterminate');
    expect(parentCheckbox).not.toHaveClass('t-is-checked');

    await fireEvent.click(parentCheckbox);
    expect(onSelectChange).toHaveBeenCalledWith(expect.arrayContaining(['1-1-0', '1']), expect.any(Object));

    const childCheckbox = rows[2].querySelector('.t-checkbox');
    onSelectChange.mockClear();
    await fireEvent.click(childCheckbox);
    expect(onSelectChange).toHaveBeenCalledWith(expect.arrayContaining(['1-1-0', '1', '2']), expect.any(Object));
  });
});
