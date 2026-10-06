import React, { useState } from 'react';
import { act, fireEvent, render, vi } from '@test/utils';

import { EnhancedTable, Table } from '..';

import type { PrimaryTableProps } from '../interface';
import type { PrimaryTableCol } from '../type';

const data = Array.from({ length: 6 }, (_, index) => ({ id: index + 1 }));
const columns: PrimaryTableCol[] = [
  { colKey: 'row-select', type: 'multiple' },
  { colKey: 'id', title: 'ID' },
];
const defaultPagination = {
  defaultCurrent: 1,
  defaultPageSize: 2,
  total: data.length,
};

function getSelectAll(container: HTMLElement) {
  return container.querySelector('th[data-colkey="row-select"] .t-checkbox');
}

function getVisibleKeys(container: HTMLElement) {
  return Array.from(container.querySelectorAll('tbody tr td:nth-child(2)'), (cell) => Number(cell.textContent));
}

function expectSelection(onSelectChange: ReturnType<typeof vi.fn>, keys: number[], type = 'check') {
  expect(onSelectChange).toHaveBeenLastCalledWith(keys, {
    selectedRowData: keys.map((id) => ({ id })),
    type,
    currentRowKey: 'CHECK_ALL_BOX',
  });
}

function SelectTable(props: Partial<PrimaryTableProps>) {
  return (
    <Table
      rowKey="id"
      data={data}
      columns={columns}
      pagination={defaultPagination}
      reserveSelectedRowOnPaginate={false}
      {...props}
    />
  );
}

describe('Table current-page select-all', () => {
  it.each([
    { pagination: { defaultCurrent: 1, defaultPageSize: 2 }, keys: [1, 2] },
    { pagination: { defaultCurrent: 2, defaultPageSize: 2 }, keys: [3, 4] },
    { pagination: { current: 1, pageSize: 2 }, keys: [1, 2] },
    { pagination: { current: 2, pageSize: 2 }, keys: [3, 4] },
  ])('selects only the page for pagination $pagination', async ({ pagination, keys }) => {
    const onSelectChange = vi.fn();
    const { container } = render(<SelectTable pagination={pagination} onSelectChange={onSelectChange} />);
    const selectAll = getSelectAll(container);
    expect(container.querySelectorAll('tbody tr')).toHaveLength(2);
    expect(selectAll).not.toHaveClass('t-is-checked');

    await fireEvent.click(selectAll);
    expectSelection(onSelectChange, keys);
    expect(onSelectChange).toHaveBeenCalledTimes(1);
    expect(selectAll).toHaveClass('t-is-checked');
    expect(selectAll).not.toHaveClass('t-is-indeterminate');

    await fireEvent.click(selectAll);
    expectSelection(onSelectChange, [], 'uncheck');
    expect(selectAll).not.toHaveClass('t-is-checked');

    await fireEvent.click(selectAll);
    expectSelection(onSelectChange, keys);
    expect(onSelectChange).toHaveBeenCalledTimes(3);
  });

  it('supports controlled selectedRowKeys', async () => {
    const onSelectChange = vi.fn();
    function ControlledSelection() {
      const [selectedRowKeys, setSelectedRowKeys] = useState<Array<string | number>>([1]);
      return (
        <SelectTable
          selectedRowKeys={selectedRowKeys}
          onSelectChange={(keys, context) => {
            setSelectedRowKeys(keys);
            onSelectChange(keys, context);
          }}
        />
      );
    }
    const { container } = render(<ControlledSelection />);
    const selectAll = getSelectAll(container);
    expect(selectAll).toHaveClass('t-is-indeterminate');
    await fireEvent.click(selectAll);
    expectSelection(onSelectChange, [1, 2]);
    expect(selectAll).toHaveClass('t-is-checked');
    await fireEvent.click(selectAll);
    expectSelection(onSelectChange, [], 'uncheck');
  });

  it.each([false, true])('uses the new page after navigation, controlled pagination=%s', async (controlled) => {
    const onSelectChange = vi.fn();
    function PaginatedSelection() {
      const [pagination, setPagination] = useState({
        current: 1,
        pageSize: 2,
      });
      return (
        <SelectTable
          pagination={controlled ? { ...pagination, total: data.length, onChange: setPagination } : defaultPagination}
          onSelectChange={onSelectChange}
        />
      );
    }
    const { container } = render(<PaginatedSelection />);
    await fireEvent.click(getSelectAll(container));
    await fireEvent.click(container.querySelector('.t-pagination__btn-next'));
    expect(onSelectChange).toHaveBeenLastCalledWith([], {
      selectedRowData: [],
      type: 'uncheck',
      currentRowKey: 'CLEAR_ON_PAGINATE',
    });
    expect(container.querySelector('tbody tr td:nth-child(2)')).toHaveTextContent('3');
    expect(getSelectAll(container)).not.toHaveClass('t-is-checked');
    await fireEvent.click(getSelectAll(container));
    expectSelection(onSelectChange, [3, 4]);
    await fireEvent.click(getSelectAll(container));
    expectSelection(onSelectChange, [], 'uncheck');
  });

  it.each([false, true])('uses the new page size, controlled pagination=%s', async (controlled) => {
    const onSelectChange = vi.fn();
    function PageSizeSelection() {
      const [pagination, setPagination] = useState({
        current: 1,
        pageSize: 2,
      });
      return (
        <SelectTable
          pagination={{
            ...(controlled ? pagination : defaultPagination),
            total: data.length,
            pageSizeOptions: [2, 3],
            onChange: controlled ? setPagination : undefined,
          }}
          onSelectChange={onSelectChange}
        />
      );
    }
    const { container, getByDisplayValue, getByText } = render(<PageSizeSelection />);
    await act(async () => {
      fireEvent.click(getByDisplayValue('2 条/页'));
    });
    await act(async () => {
      fireEvent.click(getByText('3 条/页'));
    });
    expect(container.querySelectorAll('tbody tr')).toHaveLength(3);
    await fireEvent.click(getSelectAll(container));
    expectSelection(onSelectChange, [1, 2, 3]);
  });

  it.each([undefined, true])('keeps all-page selection when reserve=%s', async (reserveSelectedRowOnPaginate) => {
    const onSelectChange = vi.fn();
    const { container } = render(
      <SelectTable reserveSelectedRowOnPaginate={reserveSelectedRowOnPaginate} onSelectChange={onSelectChange} />,
    );
    await fireEvent.click(container.querySelector('.t-pagination__btn-next'));
    await fireEvent.click(getSelectAll(container));
    expectSelection(onSelectChange, [1, 2, 3, 4, 5, 6]);
    await fireEvent.click(getSelectAll(container));
    expectSelection(onSelectChange, [], 'uncheck');
  });

  it('selects all data without pagination', async () => {
    const onSelectChange = vi.fn();
    const { container } = render(<SelectTable pagination={undefined} onSelectChange={onSelectChange} />);
    await fireEvent.click(getSelectAll(container));
    expectSelection(onSelectChange, [1, 2, 3, 4, 5, 6]);
    await fireEvent.click(getSelectAll(container));
    expectSelection(onSelectChange, [], 'uncheck');
  });

  it.each(['disabled', 'checkProps'] as const)('respects %s and retains preselected disabled rows', (disabledProp) => {
    const disabled = ({ row }) => row.id === 2;
    const selectColumn = {
      ...columns[0],
      ...(disabledProp === 'disabled' ? { disabled } : { checkProps: (params) => ({ disabled: disabled(params) }) }),
    };
    for (const defaultSelectedRowKeys of [[], [2]]) {
      const onSelectChange = vi.fn();
      const { container, unmount } = render(
        <SelectTable
          columns={[selectColumn, columns[1]]}
          defaultSelectedRowKeys={defaultSelectedRowKeys}
          onSelectChange={onSelectChange}
        />,
      );
      fireEvent.click(getSelectAll(container));
      expectSelection(onSelectChange, [...defaultSelectedRowKeys, 1]);
      expect(getSelectAll(container)).toHaveClass(
        defaultSelectedRowKeys.length ? 't-is-checked' : 't-is-indeterminate',
      );
      fireEvent.click(getSelectAll(container));
      expectSelection(onSelectChange, defaultSelectedRowKeys, 'uncheck');
      unmount();
    }
  });

  it('disables select-all when the current page has no selectable rows', async () => {
    const onSelectChange = vi.fn();
    const { container } = render(
      <SelectTable
        columns={[
          {
            ...columns[0],
            checkProps: ({ row }) => ({ disabled: row.id <= 2 }),
          },
          columns[1],
        ]}
        onSelectChange={onSelectChange}
      />,
    );
    expect(getSelectAll(container)).toHaveClass('t-is-disabled');
    await fireEvent.click(getSelectAll(container));
    expect(onSelectChange).not.toHaveBeenCalled();
  });

  it('disables select-all for empty data', async () => {
    const onSelectChange = vi.fn();
    const { container } = render(<SelectTable data={[]} onSelectChange={onSelectChange} />);
    expect(getSelectAll(container)).toHaveClass('t-is-disabled');
    await fireEvent.click(getSelectAll(container));
    expect(onSelectChange).not.toHaveBeenCalled();
  });

  it.each([false, true])('preserves flattened tree selection when reserve=%s', async (reserveSelectedRowOnPaginate) => {
    const treeData = [
      { id: 1, children: [{ id: 11 }] },
      { id: 2, children: [{ id: 21 }] },
    ];
    const onSelectChange = vi.fn();
    const { container } = render(
      <EnhancedTable
        rowKey="id"
        data={treeData}
        columns={columns}
        tree={{ checkStrictly: false }}
        pagination={{ defaultCurrent: 1, defaultPageSize: 1, total: 2 }}
        reserveSelectedRowOnPaginate={reserveSelectedRowOnPaginate}
        onSelectChange={onSelectChange}
      />,
    );
    await fireEvent.click(getSelectAll(container));
    expect(onSelectChange).toHaveBeenLastCalledWith([1, 11, 2, 21], {
      selectedRowData: [treeData[0], treeData[0].children[0], treeData[1], treeData[1].children[0]],
      type: 'check',
      currentRowKey: 'CHECK_ALL_BOX',
    });
    await fireEvent.click(getSelectAll(container));
    expectSelection(onSelectChange, [], 'uncheck');
  });

  it('selects remote data without slicing it again', async () => {
    const onSelectChange = vi.fn();
    const { container } = render(
      <SelectTable
        data={data.slice(2, 4)}
        pagination={{ current: 2, pageSize: 2, total: data.length }}
        onSelectChange={onSelectChange}
      />,
    );
    expect(container.querySelectorAll('tbody tr')).toHaveLength(2);
    expect(container.querySelector('tbody tr td:nth-child(2)')).toHaveTextContent('3');
    await fireEvent.click(getSelectAll(container));
    expectSelection(onSelectChange, [3, 4]);
  });

  it('selects all supplied data when disableDataPage is true', async () => {
    const onSelectChange = vi.fn();
    const { container } = render(
      <SelectTable
        disableDataPage
        pagination={{ current: 2, pageSize: 2, total: data.length }}
        onSelectChange={onSelectChange}
      />,
    );
    expect(container.querySelectorAll('tbody tr')).toHaveLength(6);
    await fireEvent.click(getSelectAll(container));
    expectSelection(onSelectChange, [1, 2, 3, 4, 5, 6]);
  });

  it('uses replacement data without pagination', async () => {
    const onSelectChange = vi.fn();
    const { container, rerender } = render(
      <SelectTable pagination={undefined} data={data.slice(0, 2)} onSelectChange={onSelectChange} />,
    );
    rerender(<SelectTable pagination={undefined} data={data.slice(2, 4)} onSelectChange={onSelectChange} />);
    expect(container.querySelector('tbody tr td:nth-child(2)')).toHaveTextContent('3');
    await fireEvent.click(getSelectAll(container));
    expectSelection(onSelectChange, [3, 4]);
  });

  it.each([
    { pagination: { current: 2, pageSize: 2 }, keys: [3, 4] },
    { pagination: { current: 1, pageSize: 3 }, keys: [1, 2, 3] },
  ])('syncs controlled pagination props $pagination', async ({ pagination, keys }) => {
    const onSelectChange = vi.fn();
    const { container, rerender } = render(
      <SelectTable pagination={{ current: 1, pageSize: 2 }} onSelectChange={onSelectChange} />,
    );
    rerender(<SelectTable pagination={pagination} onSelectChange={onSelectChange} />);
    expect(container.querySelectorAll('tbody tr')).toHaveLength(keys.length);
    expect(container.querySelector('tbody tr td:nth-child(2)')).toHaveTextContent(String(keys[0]));
    expect(onSelectChange).not.toHaveBeenCalled();
    await fireEvent.click(getSelectAll(container));
    expectSelection(onSelectChange, keys);
    expect(onSelectChange).toHaveBeenCalledTimes(1);
  });

  it('uses the default first page when defaultCurrent is omitted', async () => {
    const onSelectChange = vi.fn();
    const { container } = render(
      <SelectTable pagination={{ defaultPageSize: 2, total: data.length }} onSelectChange={onSelectChange} />,
    );
    expect(container.querySelectorAll('tbody tr')).toHaveLength(2);
    await fireEvent.click(getSelectAll(container));
    expectSelection(onSelectChange, [1, 2]);
  });

  it.each([
    { defaultCurrent: 1, pageSize: 2 },
    { current: 1, defaultPageSize: 2 },
  ])('matches rendered pagination defaults for %j', async (pagination) => {
    const onSelectChange = vi.fn();
    const { container } = render(<SelectTable pagination={pagination} onSelectChange={onSelectChange} />);
    expect(container.querySelectorAll('tbody tr')).toHaveLength(6);
    await fireEvent.click(getSelectAll(container));
    expectSelection(onSelectChange, [1, 2, 3, 4, 5, 6]);
  });

  it('does not reset the current page when uncontrolled pagination defaults change', async () => {
    const onSelectChange = vi.fn();
    const { container, rerender } = render(<SelectTable onSelectChange={onSelectChange} />);
    await fireEvent.click(container.querySelector('.t-pagination__btn-next'));
    rerender(
      <SelectTable
        pagination={{ defaultCurrent: 3, defaultPageSize: 3, total: data.length }}
        onSelectChange={onSelectChange}
      />,
    );
    expect(container.querySelectorAll('tbody tr')).toHaveLength(2);
    expect(container.querySelector('tbody tr td:nth-child(2)')).toHaveTextContent('3');
    await fireEvent.click(getSelectAll(container));
    expectSelection(onSelectChange, [3, 4]);
  });

  it('selects all data after pagination is removed', async () => {
    const onSelectChange = vi.fn();
    const { container, rerender } = render(<SelectTable onSelectChange={onSelectChange} />);
    rerender(<SelectTable pagination={undefined} onSelectChange={onSelectChange} />);
    expect(container.querySelectorAll('tbody tr')).toHaveLength(6);
    await fireEvent.click(getSelectAll(container));
    expectSelection(onSelectChange, [1, 2, 3, 4, 5, 6]);
  });

  it.each([undefined, 2])('waits for controlled current acceptance with pageSize=%s', async (pageSize) => {
    const moreData = Array.from({ length: 24 }, (_, index) => ({ id: index + 1 }));
    const onSelectChange = vi.fn();
    const onChange = vi.fn();
    const pagination = {
      current: 1,
      ...(pageSize === undefined ? {} : { pageSize }),
      total: moreData.length,
      onChange,
    };
    const { container, rerender } = render(
      <SelectTable data={moreData} selectedRowKeys={[]} pagination={pagination} onSelectChange={onSelectChange} />,
    );
    await fireEvent.click(container.querySelector('.t-pagination__btn-next'));
    expect(onChange).toHaveBeenCalledTimes(1);
    const size = pageSize ?? 10;
    const firstPage = moreData.slice(0, size).map(({ id }) => id);
    expect(getVisibleKeys(container)).toEqual(firstPage);
    await fireEvent.click(getSelectAll(container));
    expectSelection(onSelectChange, firstPage);

    rerender(
      <SelectTable
        data={moreData}
        selectedRowKeys={[]}
        pagination={{ ...pagination, current: 2 }}
        onSelectChange={onSelectChange}
      />,
    );
    const secondPage = moreData.slice(size, size * 2).map(({ id }) => id);
    expect(getVisibleKeys(container)).toEqual(secondPage);
    await fireEvent.click(getSelectAll(container));
    expectSelection(onSelectChange, secondPage);
  });

  it('accepts page navigation when only pageSize is controlled', async () => {
    const moreData = Array.from({ length: 24 }, (_, index) => ({ id: index + 1 }));
    const onSelectChange = vi.fn();
    const onChange = vi.fn();
    const { container } = render(
      <SelectTable
        data={moreData}
        pagination={{ defaultCurrent: 1, pageSize: 2, total: moreData.length, onChange }}
        onSelectChange={onSelectChange}
      />,
    );
    expect(getVisibleKeys(container)).toEqual(moreData.slice(0, 10).map(({ id }) => id));
    await fireEvent.click(container.querySelector('.t-pagination__btn-next'));
    expect(onChange).toHaveBeenCalledTimes(1);
    expect(getVisibleKeys(container)).toEqual([3, 4]);
    await fireEvent.click(getSelectAll(container));
    expectSelection(onSelectChange, [3, 4]);
  });

  it.each([false, true])('waits for rendered page size changes, pageSize controlled=%s', async (controlledPageSize) => {
    const moreData = Array.from({ length: 24 }, (_, index) => ({ id: index + 1 }));
    const onSelectChange = vi.fn();
    const onChange = vi.fn();
    const oldSize = controlledPageSize ? 2 : 10;
    const newSize = controlledPageSize ? 3 : 20;
    const pagination = {
      current: 1,
      ...(controlledPageSize ? { pageSize: oldSize } : {}),
      total: moreData.length,
      pageSizeOptions: [oldSize, newSize],
      onChange,
    };
    const { container, rerender, getByDisplayValue, getByText } = render(
      <SelectTable data={moreData} selectedRowKeys={[]} pagination={pagination} onSelectChange={onSelectChange} />,
    );
    await act(async () => {
      fireEvent.click(getByDisplayValue(`${oldSize} 条/页`));
    });
    await act(async () => {
      fireEvent.click(getByText(`${newSize} 条/页`));
    });
    expect(onChange).toHaveBeenCalledTimes(1);
    const originalPage = moreData.slice(0, oldSize).map(({ id }) => id);
    expect(getVisibleKeys(container)).toEqual(originalPage);
    await fireEvent.click(getSelectAll(container));
    expectSelection(onSelectChange, originalPage);

    rerender(
      <SelectTable
        data={moreData}
        selectedRowKeys={[]}
        pagination={{ ...pagination, pageSize: newSize }}
        onSelectChange={onSelectChange}
      />,
    );
    const updatedPage = moreData.slice(0, newSize).map(({ id }) => id);
    expect(getVisibleKeys(container)).toEqual(updatedPage);
    await fireEvent.click(getSelectAll(container));
    expectSelection(onSelectChange, updatedPage);
  });

  it.each([1, 2])('keeps the current page when reserve changes to false, initial page=%s', async (defaultCurrent) => {
    const onSelectChange = vi.fn();
    const pagination = { ...defaultPagination, defaultCurrent };
    const { container, rerender } = render(
      <SelectTable reserveSelectedRowOnPaginate pagination={pagination} onSelectChange={onSelectChange} />,
    );
    if (defaultCurrent === 1) await fireEvent.click(container.querySelector('.t-pagination__btn-next'));
    expect(getVisibleKeys(container)).toEqual([3, 4]);
    rerender(<SelectTable pagination={pagination} onSelectChange={onSelectChange} />);
    expect(getVisibleKeys(container)).toEqual([3, 4]);
    expect(onSelectChange).not.toHaveBeenCalled();
    await fireEvent.click(getSelectAll(container));
    expectSelection(onSelectChange, [3, 4]);
    expect(onSelectChange).toHaveBeenCalledTimes(1);
  });

  it.each([false, true])('matches rendered rows when pagination is restored, controlled=%s', async (controlled) => {
    const onSelectChange = vi.fn();
    const pagination = controlled
      ? { current: 2, pageSize: 2, total: data.length }
      : { defaultCurrent: 2, defaultPageSize: 2, total: data.length };
    const { container, rerender } = render(<SelectTable pagination={pagination} onSelectChange={onSelectChange} />);
    expect(getVisibleKeys(container)).toEqual([3, 4]);
    rerender(<SelectTable pagination={undefined} onSelectChange={onSelectChange} />);
    expect(getVisibleKeys(container)).toEqual([1, 2, 3, 4, 5, 6]);
    rerender(<SelectTable pagination={pagination} onSelectChange={onSelectChange} />);
    const keys = controlled ? [3, 4] : [1, 2, 3, 4, 5, 6];
    expect(getVisibleKeys(container)).toEqual(keys);
    expect(onSelectChange).not.toHaveBeenCalled();
    await fireEvent.click(getSelectAll(container));
    expectSelection(onSelectChange, keys);
    expect(onSelectChange).toHaveBeenCalledTimes(1);
  });
});
