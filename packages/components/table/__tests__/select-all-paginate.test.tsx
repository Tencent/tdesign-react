import React from 'react';
import { fireEvent, render } from '@testing-library/react';

import Table from '../index';

const data = Array.from({ length: 6 }, (_, i) => ({ id: i + 1, name: `row-${i + 1}` }));

const columns = [
  { colKey: 'row-select', type: 'multiple' as const },
  { colKey: 'name', title: 'Name' },
];

const flush = async () => {
  await new Promise((resolve) => {
    setTimeout(resolve, 30);
  });
};

describe('Table select-all with reserveSelectedRowOnPaginate=false (issue #4416)', () => {
  it('selects only the current page rows when check-all is clicked', async () => {
    let captured: any = null;

    const { container } = render(
      <Table
        data={data}
        columns={columns}
        rowKey="id"
        defaultSelectedRowKeys={[]}
        pagination={{ current: 1, pageSize: 2, total: 6 }}
        reserveSelectedRowOnPaginate={false}
        onSelectChange={(keys, context) => {
          captured = { keys, selectedRowData: (context.selectedRowData || []).map((r: any) => r.id) };
        }}
      />,
    );
    await flush();

    // 表头全选框
    const headerCheckbox = container.querySelector('th .t-checkbox input') as HTMLInputElement;
    expect(headerCheckbox).toBeTruthy();
    fireEvent.click(headerCheckbox);
    await flush();

    // eslint-disable-next-line no-console
    console.log('CAPTURED:', JSON.stringify(captured));
    expect(captured).toBeTruthy();
    // 每页 2 条，全选只应包含当前页的 2 条
    expect(captured.keys.length).toBe(2);
    expect(captured.selectedRowData.length).toBe(2);
  });
});
