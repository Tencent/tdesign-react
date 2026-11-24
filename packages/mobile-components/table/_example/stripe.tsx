import React from 'react';
import { BaseTableProps, Table } from 'tdesign-mobile-react';

const data = [];
const total = 20;
for (let i = 0; i < total; i++) {
  const content = ['内容', '内容', '内容', '内容', '内容'][i % 5];
  data.push({
    index: i + 1,
    applicant: content,
    status: content,
    channel: content,
    detail: {
      email: content,
    },
    operation: content,
    more: content,
  });
}

const columns: BaseTableProps['columns'] = [
  { colKey: 'applicant', title: '标题', fixed: 'left' },
  {
    colKey: 'status',
    title: '标题',
  },
  { colKey: 'channel', title: '标题' },
  { colKey: 'detail.email', title: '标题', ellipsis: true },
  { colKey: 'operation', title: '标题' },
  { colKey: 'more', title: '标题', fixed: 'right' },
];

export default function StripeExample() {
  const handleScroll = (e) => {
    console.log('scroll=====', e);
  };

  return (
    <Table
      columns={columns}
      data={data}
      rowKey="index"
      showHeader
      stripe
      fixedRows={[1, 2]}
      maxHeight={400}
      onScroll={handleScroll}
    ></Table>
  );
}
