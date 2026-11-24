import React from 'react';
import { Table } from 'tdesign-mobile-react';

const data = [
  {
    index: 1,
    applicant: '内容1',
    status: '内容2',
    channel: '内容3',
    detail: {
      email: '内容内容内容123',
    },
  },
  {
    index: 2,
    applicant: '内容4',
    status: '内容5',
    channel: '内容6',
    detail: {
      email: '内容内容内容123',
    },
  },
  {
    index: 3,
    applicant: '内容7',
    status: '内容8',
    channel: '内容9',
    detail: {
      email: '内容内容内容123',
    },
  },
];

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

export default function DragSortExample() {
  return (
    <Table columns={columns} data={data} dragSort="row" cellEmptyContent={'vvv'} rowKey="index" showHeader></Table>
  );
}
