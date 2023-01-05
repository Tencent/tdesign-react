import React from 'react';
import { fireEvent, render, vi } from '@test/utils';
import { Table, PrimaryTable, EnhancedTable } from '..';

const data = new Array(5).fill(null).map((item, index) => ({
  id: index + 100,
  index: index + 100,
  instance: `JQTest${index + 1}`,
  status: index % 2,
  owner: 'jenny;peter',
  description: 'test',
}));

// 多种表格组件同时测试
const TABLES = [Table, PrimaryTable, EnhancedTable];

const SIMPLE_COLUMNS = [
  { title: 'Index', colKey: 'index' },
  { title: 'Instance', colKey: 'instance' },
];

const EXPAND_CELL = 'td.t-table__expandable-icon-cell';

/**
 * 可展开表格
 */
TABLES.forEach((TTable) => {
  describe(`Expandable ${TTable.name}`, () => {
    it('expandedRowKeys is empty', () => {
      const { container } = render(
        <TTable
          expandedRowKeys={[]}
          rowKey="index"
          data={data}
          columns={SIMPLE_COLUMNS}
          expandedRow={() => <div>expanded row</div>}
        ></TTable>,
      );
      expect(container.querySelector('.t-table__expandable-icon-cell')).toBeTruthy();
      expect(container.querySelector('.t-table__expanded-row')).toBeFalsy();
    });

    it('onExpandChange', async () => {
      const expandedRowKeys = [101];
      const fn = vi.fn();
      const { container } = render(
        <TTable
          expandedRowKeys={expandedRowKeys}
          rowKey="index"
          data={data}
          columns={SIMPLE_COLUMNS}
          onExpandChange={fn}
          expandedRow={() => <div>expanded row</div>}
        ></TTable>,
      );

      // trigger the first row expand
      const expandIcon = container.querySelector('.t-table__expand-box');
      fireEvent.click(expandIcon);
      expect(fn).toHaveBeenCalled();
      // onExpandChange has two arguments
      expect(fn.mock.calls[0].length).toBe(2);
      // first argument is expandedRowKeys
      expect(fn.mock.calls[0][0]).toEqual([101, 100]);
      // second argument is currentRowData and expandedRowData
      expect(fn.mock.calls[0][1]).toEqual({
        currentRowData: data[0],
        expandedRowData: [data[0], data[1]],
      });
    });
  });
});
