import React from 'react';
import { render, renderHook, vi } from '@test/utils';

import { Table } from '..';
import useRowspanAndColspan from '../hooks/useRowspanAndColspan';

const columns = [{ colKey: 'id' }, { colKey: 'name' }];
const rowKeyError = 'rowKey is wrong, can not get unique identifier of row.';

describe('Table', () => {
  describe('scenarios', () => {
    describe('virtual full rows and cell spans', () => {
      afterEach(() => vi.restoreAllMocks());

      it('skips placeholders and keeps their positions in the callback indices', () => {
        const data = [
          { __VIRTUAL_FAKE_DATA: 'FIRST_FULL_ROW' },
          { id: 41 },
          { id: 42 },
          { __VIRTUAL_FAKE_DATA: 'LAST_FULL_ROW' },
        ];
        const callback = vi.fn(() => ({}));
        const error = vi.spyOn(console, 'error').mockImplementation(() => undefined);
        renderHook(() => useRowspanAndColspan(data, columns, 'id', callback));

        expect(callback.mock.calls).toEqual(
          [1, 2].flatMap((rowIndex) =>
            columns.map((col, colIndex) => [{ row: data[rowIndex], rowIndex, col, colIndex }]),
          ),
        );
        expect(error).not.toHaveBeenCalled();
      });

      it('skips the tail placeholder when marking cells covered by a rowspan', () => {
        const data = [{ id: 40 }, { id: 41 }, { __VIRTUAL_FAKE_DATA: 'LAST_FULL_ROW' }];
        const callback = ({ rowIndex, colIndex }) =>
          rowIndex === 0 && colIndex === 0 ? { rowspan: 3, colspan: 2 } : {};
        const error = vi.spyOn(console, 'error').mockImplementation(() => undefined);
        const { result } = renderHook(() => useRowspanAndColspan(data, columns, 'id', callback));

        expect(result.current.skipSpansMap).toEqual(
          new Map([
            ['40_id', { rowspan: 3, colspan: 2 }],
            ['40_name', { skipped: true }],
            ['41_id', { skipped: true }],
            ['41_name', { skipped: true }],
          ]),
        );
        expect(error).not.toHaveBeenCalled();
      });

      it('still reports a missing row key on a business row', () => {
        const error = vi.spyOn(console, 'error').mockImplementation(() => undefined);
        const data = [{ name: 'Missing id' }];
        const callback = () => ({});
        renderHook(() => useRowspanAndColspan(data, columns, 'id', callback));

        expect(error).toHaveBeenCalledWith(expect.stringContaining(rowKeyError));
      });

      it('shows the filter row and business cells when only the placeholder matched the span rule', () => {
        const data = Array.from({ length: 150 }, (_, id) => ({
          id: id + 1,
          name: `item ${id}`,
        }));
        const { getByText } = render(
          <Table
            data={data}
            columns={columns}
            rowKey="id"
            height={200}
            scroll={{ type: 'virtual' }}
            filterValue={{ name: 'item' }}
            filterRow="Filtered items"
            rowspanAndColspan={({ rowIndex, colIndex }) => (rowIndex === 0 && colIndex === 0 ? { colspan: 2 } : {})}
          />,
        );

        expect(getByText('Filtered items')).toBeVisible();
        expect(getByText('item 0')).toBeVisible();
      });

      it('renders both virtual full rows with dynamic height and no business rows', () => {
        const callback = vi.fn(() => undefined);
        const { container } = render(
          <Table
            data={[]}
            columns={columns}
            rowKey="id"
            height={200}
            scroll={{ type: 'virtual', threshold: 1 }}
            firstFullRow="First"
            lastFullRow="Last"
            rowspanAndColspan={callback}
          />,
        );

        expect(Array.from(container.querySelectorAll('tbody tr'), (row) => row.textContent)).toEqual(['First', 'Last']);
        expect(callback).not.toHaveBeenCalled();
      });

      it('only admits window rows from the current page when a full row makes an empty span map ready', () => {
        const rows = Array.from({ length: 150 }, (_, i) => ({ id: i + 1 }));
        const noMerges = () => undefined;
        const table = (data: typeof rows, current = 15) => (
          <Table
            data={data}
            columns={columns}
            rowKey="id"
            height={200}
            scroll={{ type: 'virtual', bufferSize: 15 }}
            firstFullRow="First"
            rowAttributes={({ row }) => ({ 'data-id': String(row.id) })}
            pagination={{ current, pageSize: 10, total: data.length }}
            rowspanAndColspan={noMerges}
          />
        );
        const { container, getByText, rerender } = render(table(rows));
        const renderedIds = () =>
          Array.from(container.querySelectorAll('tbody tr[data-id]'), (tr) => +tr.getAttribute('data-id'));
        expect(getByText('First')).toBeVisible();
        expect(renderedIds()).toEqual([]);

        const filtered = rows.slice(0, 120);
        rerender(table(filtered));
        expect(getByText('First')).toBeVisible();
        expect(renderedIds()).toEqual([]);

        rerender(table(filtered, 1));
        expect(renderedIds()).toEqual(filtered.slice(0, 10).map((row) => row.id));
      });
    });
  });
});
