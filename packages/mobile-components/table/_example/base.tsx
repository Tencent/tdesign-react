import React from 'react';
import { Table } from 'tdesign-mobile-react';

const data = [];
const total = 10;
for (let i = 0; i < total; i++) {
  data.push({
    index: i + 1,
    applicant: ['内容', '内容', '内容'][i % 3],
    status: ['内容', '内容', '内容'][i % 3],
    channel: ['内容', '内容', '内容'][i % 3],
    detail: {
      email: ['内容', '内容', '内容内容内容'][i % 3],
    },
  });
}

const columns = [
  { colKey: 'applicant', title: '标题', ellipsis: true, cell: 'type-slot-name' },
  {
    colKey: 'status',
    title: '标题',
    ellipsis: true,
  },
  {
    colKey: 'channel',
    title: '标题',
    cell: ({ col, row }) => row[col.colKey],
    ellipsis: true,
  },
  {
    colKey: 'detail.email',
    title: '标题',
    ellipsis: true,
    render(context) {
      const { type } = context;
      return {
        title: '标题',
        cell: '内容',
      }[type];
    },
  },
];

export default function BaseExample() {
  const handleRowClick = (e) => {
    console.log('row-cliek=====', e);
  };

  const handleCellClick = (e) => {
    console.log('cell-cliek=====', e);
  };

  return (
    <Table
      columns={columns}
      data={data}
      cellEmptyContent={'vvv'}
      rowKey="index"
      showHeader
      onCellClick={handleCellClick}
      onRowClick={handleRowClick}
    ></Table>
  );
}
