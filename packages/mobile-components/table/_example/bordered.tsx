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
  { colKey: 'applicant', title: '标题', ellipsis: true },
  {
    colKey: 'status',
    title: '标题',
    ellipsis: true,
  },
  { colKey: 'channel', title: '标题', ellipsis: true },
  { colKey: 'detail.email', title: '标题', ellipsis: true },
];

export default function BorderedExample() {
  const handleRowClick = (e) => {
    console.log('row-cliek=====', e);
  };

  const handleCellClick = (e) => {
    console.log('cell-cliek=====', e);
  };

  const handleScroll = (e) => {
    console.log('scroll=====', e);
  };

  return (
    <Table
      columns={columns}
      data={data}
      rowKey="index"
      showHeader
      onCellClick={handleCellClick}
      onRowClick={handleRowClick}
      onScroll={handleScroll}
      bordered
    ></Table>
  );
}
