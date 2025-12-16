import React from 'react';
import { Table } from 'tdesign-react';

import type { TableProps } from 'tdesign-react';

export default function TableEllipsis() {
  const data: TableProps['data'] = [];
  const total = 5;
  for (let i = 0; i < total; i++) {
    data.push({
      id: i + 1,
      channel: ['电子签署', '纸质签署', '纸质签署'][i % 3],
      propsAndContent1: ['2021-11-01', '2021-12-01', '2022-01-01', '2022-02-01', '2022-03-01'][i % 4],
    });
  }

  const columns: TableProps['columns'] = [
    {
      title: '签署方式（超长标题示例）',
      colKey: 'channel',
      // width: 120,
      ellipsis: true,
    },
    {
      title: '审核时间',
      colKey: 'propsAndContent1',
      // width: 100,
      ellipsis: {
        props: {
          theme: 'light' as const,
          placement: 'bottom-right' as const,
        },
        content: ({ row }) => (
          <p>
            <b>创建日期:</b> {row.propsAndContent1}
          </p>
        ),
      },
    },
  ];

  return (
    <div>
      <Table rowKey="index" resizable data={data} columns={columns} />
    </div>
  );
}
