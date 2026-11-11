import React from 'react';
import { fireEvent, render, vi } from '@test/utils';

import { Table } from '..';

import type { PrimaryTableProps } from '../interface';
import type { PrimaryTableCol, TableRowData } from '../type';

const TOTAL = 6;
const DATA: TableRowData[] = Array.from({ length: TOTAL }, (_, index) => ({ id: index + 1 }));
const COLUMNS: PrimaryTableCol[] = [
  { colKey: 'row-select', type: 'multiple' },
  { colKey: 'id', title: 'ID' },
];

function renderTable(props: Partial<PrimaryTableProps> = {}) {
  const onSelectChange = vi.fn();
  const utils = render(
    <Table
      rowKey="id"
      data={DATA}
      columns={COLUMNS}
      reserveSelectedRowOnPaginate={false}
      onSelectChange={onSelectChange}
      {...props}
    />,
  );
  const selectAllCheckbox = utils.container.querySelector('th[data-colkey="row-select"] .t-checkbox');
  const latestKeys = () => onSelectChange.mock.calls[onSelectChange.mock.calls.length - 1]?.[0];
  const visibleKeys = () =>
    Array.from(utils.container.querySelectorAll('tbody tr td:nth-child(2)'), (cell) => cell.textContent);
  return { ...utils, onSelectChange, selectAllCheckbox, latestKeys, visibleKeys };
}

describe('Table row-select with reserveSelectedRowOnPaginate=false', () => {
  it('select-all only selects the rows of the current page', async () => {
    const { selectAllCheckbox, onSelectChange, latestKeys, visibleKeys } = renderTable({
      pagination: { defaultCurrent: 1, defaultPageSize: 2, total: TOTAL },
    });
    // 表格自身做本地分页，当前页只有 2 行
    expect(visibleKeys()).toEqual(['1', '2']);
    expect(selectAllCheckbox).not.toHaveClass('t-is-checked');

    await fireEvent.click(selectAllCheckbox);

    expect(onSelectChange).toHaveBeenCalledTimes(1);
    expect(latestKeys()).toEqual([1, 2]);
    expect(onSelectChange.mock.calls[0][1].selectedRowData).toEqual([{ id: 1 }, { id: 2 }]);
    expect(onSelectChange.mock.calls[0][1].type).toBe('check');
    // 全选状态只按当前页计算
    expect(selectAllCheckbox).toHaveClass('t-is-checked');
    expect(selectAllCheckbox).not.toHaveClass('t-is-indeterminate');
  });

  it('select-all on a non-first page only selects that page', async () => {
    const { selectAllCheckbox, latestKeys, visibleKeys } = renderTable({
      pagination: { defaultCurrent: 2, defaultPageSize: 2, total: TOTAL },
    });
    expect(visibleKeys()).toEqual(['3', '4']);
    expect(selectAllCheckbox).not.toHaveClass('t-is-checked');

    await fireEvent.click(selectAllCheckbox);

    expect(latestKeys()).toEqual([3, 4]);
    expect(selectAllCheckbox).toHaveClass('t-is-checked');
  });

  it('uncheck clears the current page only', async () => {
    const { selectAllCheckbox, latestKeys } = renderTable({
      pagination: { defaultCurrent: 1, defaultPageSize: 2, total: TOTAL },
    });

    await fireEvent.click(selectAllCheckbox);
    await fireEvent.click(selectAllCheckbox);

    expect(latestKeys()).toEqual([]);
    expect(selectAllCheckbox).not.toHaveClass('t-is-checked');
    expect(selectAllCheckbox).not.toHaveClass('t-is-indeterminate');
  });

  it('drops selected keys that are outside the current page', async () => {
    const { selectAllCheckbox, latestKeys } = renderTable({
      defaultSelectedRowKeys: [5],
      pagination: { defaultCurrent: 1, defaultPageSize: 2, total: TOTAL },
    });
    // 第 3 页的 key 不属于当前页，全选框处于半选状态
    expect(selectAllCheckbox).toHaveClass('t-is-indeterminate');

    await fireEvent.click(selectAllCheckbox);

    expect(latestKeys()).toEqual([1, 2]);
    expect(selectAllCheckbox).toHaveClass('t-is-checked');
  });

  it('select-all follows the page after pagination changes', async () => {
    const { container, selectAllCheckbox, latestKeys, visibleKeys } = renderTable({
      pagination: { defaultCurrent: 1, defaultPageSize: 2, total: TOTAL },
    });

    await fireEvent.click(selectAllCheckbox);
    expect(latestKeys()).toEqual([1, 2]);

    // 切换到第 2 页：保留选中关闭时会清空已选
    await fireEvent.click(container.querySelector('.t-pagination__btn-next'));
    expect(visibleKeys()).toEqual(['3', '4']);
    expect(selectAllCheckbox).not.toHaveClass('t-is-checked');

    await fireEvent.click(selectAllCheckbox);
    expect(latestKeys()).toEqual([3, 4]);
  });

  it('keeps the whole data set selectable when reserveSelectedRowOnPaginate=true', async () => {
    const { selectAllCheckbox, latestKeys } = renderTable({
      reserveSelectedRowOnPaginate: true,
      pagination: { defaultCurrent: 1, defaultPageSize: 2, total: TOTAL },
    });

    await fireEvent.click(selectAllCheckbox);

    expect(latestKeys()).toEqual([1, 2, 3, 4, 5, 6]);
    expect(selectAllCheckbox).toHaveClass('t-is-checked');
  });

  it('keeps select-all working without pagination', async () => {
    const { selectAllCheckbox, latestKeys } = renderTable();

    await fireEvent.click(selectAllCheckbox);

    expect(latestKeys()).toEqual([1, 2, 3, 4, 5, 6]);
    expect(selectAllCheckbox).toHaveClass('t-is-checked');
  });

  it('selects only the current page when data is paginated on the server', async () => {
    // 远程分页：data 已经是当前页数据，表格不应再切片
    const { selectAllCheckbox, latestKeys } = renderTable({
      data: [{ id: 11 }, { id: 12 }],
      pagination: { current: 2, pageSize: 2, total: TOTAL },
    });

    await fireEvent.click(selectAllCheckbox);

    expect(latestKeys()).toEqual([11, 12]);
    expect(selectAllCheckbox).toHaveClass('t-is-checked');
  });
});
