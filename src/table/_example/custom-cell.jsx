import React from 'react';
import { Table } from 'tdesign-react';
import { AttachIcon } from 'tdesign-icons-react';

const columns = [
  {
    colKey: 'type',
    title: '类型',
  },
  {
    colKey: 'platform',
    title: '平台',
    cell: () => (
      <span>
        <AttachIcon></AttachIcon>
        <a href="#" style={{ color: '#0052d9', textDecoration: 'none' }}>公有</a>
      </span>
    ),
  },
  {
    colKey: 'property',
    title: '属性名',
    cell: ({ col, row }) => <div>使用 cell 方法自定义单元格：{row[col.colKey]}</div>,
  },
  {
    colKey: 'description',
    // render 即可渲染表头，也可以渲染单元格。但 cell 只能渲染单元格，title 只能渲染表头
    render(context) {
      const { type, rowIndex, colIndex } = context;
      if (type === 'title') return 'render';
      return `render 方法渲染单元格: ${rowIndex}-${colIndex}`;
    },
  },
];
const data = [
  {
    platform: '公有',
    property: 'data',
    type: 'any[]',
    default: '[]',
    needed: 'Y',
    description: '数据源',
  },
  {
    platform: '公有',
    property: 'rowkey',
    type: 'String',
    default: '-1',
    needed: 'N',
    description: '指定rowkey',
  },
];

export default function TableFixHeader() {
  return <Table bordered data={data} columns={columns} rowKey="property" />;
}
