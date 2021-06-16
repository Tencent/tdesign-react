import React from 'react';
import { Table } from '@tencent/tdesign-react';

const data = [];
const total = 30;
for (let i = 0; i < total; i++) {
  data.push({
    index: i,
    platform: '公有',
    type: 'any[]',
    default: '[]',
    needed: 'Y',
    description: '数据源',
    property: 'any',
    detail: {
      name: '嵌套信息读取',
    },
  });
}

export default function TableFixHeader() {
  return (
    <Table
      data={data}
      maxHeight={200}
      bordered
      stripe
      columns={[
        {
          align: 'left',
          width: '100',
          minWidth: '100',
          className: 'row',
          ellipsis: true,
          colKey: 'index',
          title: 'index',
        },
        {
          align: 'left',
          width: '100',
          minWidth: '100',
          className: 'row',
          ellipsis: true,
          colKey: 'type',
          title: '类型',
        },
        {
          align: 'left',
          width: '100',
          minWidth: '100',
          className: 'test',
          ellipsis: true,
          colKey: 'platform',
          title: '平台',
        },
        {
          align: 'left',
          width: '100',
          minWidth: '100',
          className: 'test2',
          ellipsis: true,
          colKey: 'property',
          title: '属性',
        },
        {
          align: 'left',
          width: '100',
          minWidth: '100',
          className: 'test4',
          ellipsis: true,
          colKey: 'default',
          title: '默认值',
        },
        {
          align: 'left',
          width: '100',
          minWidth: '100',
          className: 'test3',
          ellipsis: true,
          colKey: 'needed',
          title: '是否必传',
        },
        {
          align: 'left',
          width: '100',
          minWidth: '100',
          className: 'row',
          ellipsis: true,
          colKey: 'description',
          title: '说明',
        },
      ]}
      rowKey="index"
    />
  );
}
