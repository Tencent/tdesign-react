import React from 'react';
import { Table } from 'tdesign-mobile-react';

const data = [];
const total = 5;
for (let i = 0; i < total; i++) {
  data.push({
    index: i + 1,
    applicant: ['横向平铺内容不省略', '内容', '内容'][i % 3],
    status: ['横向平铺内容不省略', '内容', '内容'][i % 3],
    channel: ['横向平铺内容不省略', '内容', '内容'][i % 3],
    detail: {
      email: ['横向平铺内容不省略', '内容', '内容'][i % 3],
    },
  });
}

const columns = [
  { colKey: 'applicant', title: '标题', width: 180 },
  {
    colKey: 'status',
    title: '标题',
    width: 180,
  },
  { colKey: 'channel', title: '标题', width: 180 },
  { colKey: 'detail.email', title: '标题', width: 180 },
];

export default function ScrollExample() {
  const handleScroll = (e) => {
    console.log('scroll=====', e);
  };

  return <Table columns={columns} data={data} rowKey="index" showHeader onScroll={handleScroll}></Table>;
}
