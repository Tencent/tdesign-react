import React from 'react';
import { Table } from 'tdesign-react';

const columns = [
  {
    align: 'center',
    width: '100',
    className: 'row',
    colKey: 'index',
    title: '序号',
    foot: () => <b style={{ color: 'rgb(0, 82, 217)' }}>表尾</b>,
  },
  {
    width: 100,
    colKey: 'platform',
    title: '平台',
    foot: ({ rowIndex }) => <span>第 {rowIndex + 1} 行</span>,
  },
  {
    colKey: 'type',
    title: '类型',
  },
  {
    colKey: 'default',
    title: '默认值',
    foot: ({ row }) => <span>{row.default || '空'}</span>,
  },
  {
    colKey: 'required',
    title: '是否必传',
    width: 150,
  },
  {
    colKey: 'detail.position',
    title: '详情信息',
    width: 200,
    ellipsis: true,
    foot: () => <div>渲染函数输出表尾信息</div>,
  },
];

const data = [];
for (let i = 0; i < 3; i++) {
  data.push({
    index: i,
    platform: i % 2 === 0 ? '共有' : '私有',
    type: ['String', 'Number', 'Array', 'Object'][i % 4],
    default: ['-', '0', '[]', '{}'][i % 4],
    detail: {
      position: `读取 ${i} 个数据的嵌套信息值`,
    },
    required: i % 4 === 0 ? '是' : '否',
    description: '数据源',
  });
}

const footData = [{ required: 'N', type: '全部类型' }];

export default function TableFixHeader() {
  return <Table bordered data={data} columns={columns} rowKey="type" footData={footData} />;
}
