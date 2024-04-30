import React from 'react';
import { Transfer } from 'tdesign-react';

const list = [];
for (let i = 0; i < 20; i++) {
  list.push({
    value: i.toString(),
    label: `内容${i + 1}`,
  });
}

export default function PaginationExample() {
  const pagination = [
    {
      pageSize: 10,
      onPageChange: (current) => {
        console.log('current', current);
      },
    },
    {
      pageSize: 5,
      defaultCurrent: 1,
    },
  ];

  const handlePageChange = (...args) => {
    console.log('args', args);
  };
  return <Transfer data={list} pagination={pagination} onPageChange={handlePageChange}></Transfer>;
}
