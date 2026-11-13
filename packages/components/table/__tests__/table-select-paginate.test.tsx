import React from 'react';
import { fireEvent, render } from '@test/utils';

import { Table } from '..';

const flush = () =>
  new Promise((resolve) => {
    setTimeout(resolve, 0);
  });

describe('Table', () => {
  describe('scenarios', () => {
    describe('select all with controlled pagination', () => {
      it('selects the rows of the current page after current changes', async () => {
        const data = Array.from({ length: 6 }, (_, i) => ({
          id: i + 1,
          name: `row-${i + 1}`,
        }));
        const columns = [
          { colKey: 'row-select', type: 'multiple' as const },
          { colKey: 'name', title: 'name' },
        ];
        let captured: any[] = [];
        const table = (current: number) => (
          <Table
            data={data}
            columns={columns}
            rowKey="id"
            pagination={{ current, pageSize: 2, total: 6 }}
            reserveSelectedRowOnPaginate={false}
            onSelectChange={(keys: any[]) => {
              captured = keys;
            }}
          />
        );
        const { container, rerender } = render(table(1));
        await flush();
        rerender(table(2));
        await flush();

        const visible = [...container.querySelectorAll('tbody tr')].map((tr) => tr.textContent);
        expect(visible).toEqual(['row-3', 'row-4']);

        fireEvent.click(container.querySelector('th .t-checkbox input'));
        await flush();
        expect(captured).toEqual([3, 4]);
      });

      it('still selects the first page rows when current stays at 1', async () => {
        const data = Array.from({ length: 6 }, (_, i) => ({
          id: i + 1,
          name: `row-${i + 1}`,
        }));
        const columns = [
          { colKey: 'row-select', type: 'multiple' as const },
          { colKey: 'name', title: 'name' },
        ];
        let captured: any[] = [];
        const { container } = render(
          <Table
            data={data}
            columns={columns}
            rowKey="id"
            pagination={{ current: 1, pageSize: 2, total: 6 }}
            reserveSelectedRowOnPaginate={false}
            onSelectChange={(keys: any[]) => {
              captured = keys;
            }}
          />,
        );
        await flush();
        fireEvent.click(container.querySelector('th .t-checkbox input'));
        await flush();
        expect(captured).toEqual([1, 2]);
      });
    });
  });
});
