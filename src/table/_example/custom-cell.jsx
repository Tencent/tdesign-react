import React from 'react';
import { Table, AttachIcon } from '@tencent/tdesign-react';

const columns = [
  {
    colKey: 'type',
    title: '类型',
    width: 80,
  },
  {
    colKey: 'platform',
    title: '平台',
    cell: ({ col, row }) => (
      <span>
        <AttachIcon></AttachIcon>
        <a href="#">公有</a>
      </span>
    ),
    width: 236,
  },
  {
    colKey: 'property',
    title: '属性名',
    cell: ({ col, row }) => <div>使用 cell 方法自定义单元格：{row[col.colKey]}</div>,
    width: 290,
  },
  {
    colKey: 'description',
    // render 即可渲染表头，也可以渲染单元格。但 cell 只能渲染单元格，title 只能渲染表头
    render(context) {
      const { type, rowIndex, colIndex } = context;
      if (type === 'title') return 'render';
      return `render 方法渲染单元格: ${rowIndex}-${colIndex}`;
    },
    width: 235,
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
  return (
    <div>
      <ul>
        <li>单元格默认使用 row[colKey] 渲染数据内容，自定义单元格有以下 2 种方式</li>
        <li>1) 使用 cell 作为渲染函数，函数参数为：{'cell({col, colIndex, row, rowIndex})'}</li>
        <li>
          2)【不推荐使用】使用 render 作为渲染函数，函数参数为：{'render({col, colIndex, row, rowIndex, type})'}
          ，单元格的 type 值为 cell，标题的 type 值为 title
        </li>
      </ul>
      <br />
      <Table bordered data={data} columns={columns} rowKey="property" />
    </div>
  );
}
