import React from 'react';
import { Table } from 'tdesign-react';

const exampleList = Array(5)
  .fill(1)
  .map((_, i) => ({
    index: i,
    platform: '公有，代表这个数据可以是被公开的',
    property: 'data',
    type: 'any[]',
    default: '[]',
    needed: 'Y',
    description: '数据源',
  }));

export default function TableFixedColumn() {
  return (
    <Table
      bordered
      data={exampleList}
      columns={[
        {
          fixed: 'left',
          align: 'left',
          width: 90,
          className: 'row',
          colKey: 'type',
          title: '类型',
        },
        {
          fixed: 'left',
          align: 'left',
          width: 100,
          className: 'test',
          colKey: 'platform',
          title: '平台',
        },
        {
          align: 'left',
          fixed: 'left',
          width: 150,
          className: 'test2',
          colKey: 'property',
          title: '属性',
        },
        {
          align: 'left',

          width: 150,
          className: 'test2',
          colKey: 'property1',
          title: '属性1',
        },
        {
          align: 'left',

          width: 150,
          className: 'test2',
          colKey: 'property2',
          title: '属性2',
        },
        {
          align: 'left',
          fixed: 'right',
          width: 150,
          className: 'test4',
          colKey: 'default',
          title: '默认值',
        },
        {
          align: 'left',
          fixed: 'right',
          width: 110,
          className: 'test3',
          colKey: 'needed',
          title: '是否必传',
        },
        {
          align: 'left',
          fixed: 'right',
          width: 120,
          className: 'row',
          colKey: 'description',
          title: '说明',
        },
      ]}
      rowKey="index"
    />
  );
}
