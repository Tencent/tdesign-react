import React from 'react';
import { Table } from 'tdesign-react';

const columns = [
  {
    colKey: 'type',
    title: '类型',
  },
  {
    colKey: 'platform',
    // 使用 title 自定义标题
    title: ({ colIndex }) => <b style={{ color: '#0052d9' }}>{['', '标题(使用 title 方法自定义)'][colIndex]}</b>,
  },
  {
    colKey: 'property',
    // render 可以渲染表头，也可以渲染单元格。但 title 只能渲染表头，cell 只能渲染单元格
    render: ({ type, row, col }) =>
      ({
        title: '属性名(使用 render 方法自定义)',
        cell: row && row[col.colKey],
      }[type]),
  },
];
const data = [
  {
    platform: 'title',
    property: 'data',
    type: 'any[]',
    default: '[]',
    needed: 'Y',
    description: '数据源',
  },
  {
    platform: 'title',
    property: 'rowKey',
    type: 'String',
    default: '-1',
    needed: 'N',
    description: '指定 rowKey',
  },
];

export default function TableFixHeader() {
  return <Table bordered data={data} columns={columns} rowKey="type" />;
}
