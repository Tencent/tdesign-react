import React from 'react';
import { BaseTableProps, Table } from 'tdesign-mobile-react';

const SHORT_TEXT = '单元格内容单元格内容单元格内容';
const CENTER_LONG_TEXT = '单元格内容'.repeat(200);
const BOTTOM_LONG_TEXT = '单元格内容'.repeat(80);
const EXTRA_LONG_TEXT = '单元格内容'.repeat(300);

const columns: BaseTableProps['columns'] = [
  {
    colKey: 'centerWithTitle',
    title: '居中弹出·有标题',
    width: 180,
    ellipsis: { placement: 'center', title: '表格标题文案' },
    ellipsisTitle: { placement: 'center', title: '居中弹出·有标题' },
  },
  {
    colKey: 'centerNoTitle',
    title: '居中弹出·无标题',
    width: 180,
    ellipsis: { placement: 'center' },
  },
  {
    colKey: 'centerNoCloseBtn',
    title: '居中弹出·无标题无关闭按钮',
    width: 240,
    ellipsis: { placement: 'center', closeBtn: false },
  },
  {
    colKey: 'bottomWithTitle',
    title: '底部弹出·有标题',
    width: 180,
    ellipsis: { placement: 'bottom', title: '表格标题文案' },
    ellipsisTitle: { placement: 'bottom', title: '底部弹出·有标题' },
  },
  {
    colKey: 'bottomNoCloseBtn',
    title: '底部弹出·无关闭按钮',
    width: 220,
    ellipsis: { placement: 'bottom', title: '表格标题文案', closeBtn: false },
  },
  {
    colKey: 'bottomNoTitle',
    title: '底部弹出·无标题无关闭按钮',
    width: 240,
    ellipsis: { placement: 'bottom', closeBtn: false },
  },
];

const data = [
  { id: 1, centerText: SHORT_TEXT, bottomText: SHORT_TEXT },
  { id: 2, centerText: CENTER_LONG_TEXT, bottomText: BOTTOM_LONG_TEXT },
  { id: 3, centerText: EXTRA_LONG_TEXT, bottomText: EXTRA_LONG_TEXT },
].map(({ id, centerText, bottomText }) => ({
  id,
  centerWithTitle: centerText,
  centerNoTitle: centerText,
  centerNoCloseBtn: centerText,
  bottomWithTitle: bottomText,
  bottomNoCloseBtn: bottomText,
  bottomNoTitle: bottomText,
}));

export default function EllipsisExample() {
  const handleRowClick = (e) => {
    console.log('[row-click]', e);
  };

  const handleCellClick = (e) => {
    console.log('[cell-click]', e);
  };

  return (
    <Table
      columns={columns}
      data={data}
      rowKey="id"
      showHeader
      cellEmptyContent="-"
      onRowClick={handleRowClick}
      onCellClick={handleCellClick}
    ></Table>
  );
}
