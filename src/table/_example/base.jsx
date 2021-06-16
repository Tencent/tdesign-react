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
    detail: {
      name: '嵌套信息读取',
    },
  });
}

export default function TableBasic() {
  return (
    <Table
      data={data}
      columns={[
        {
          align: 'center',
          width: 100,
          minWidth: 100,
          className: 'row',
          ellipsis: true,
          colKey: 'index',
          title: 'index',
        },

        {
          align: 'left',
          width: 100,
          minWidth: 100,
          className: 'test',
          ellipsis: true,
          colKey: 'platform',
          title: '平台',
        },
        {
          align: 'left',
          className: 'test4',
          ellipsis: true,
          colKey: 'default',
          title: '默认值',
        },
        {
          align: 'left',
          width: 100,
          minWidth: 100,
          className: 'test3',
          ellipsis: true,
          colKey: 'needed',
          title: '是否必传',
        },
        {
          align: 'left',
          width: 100,
          minWidth: 100,
          className: 'test3',
          ellipsis: true,
          colKey: 'detail.name',
          title: '详情信息',
        },
        {
          align: 'left',
          width: 100,
          minWidth: 100,
          className: 'row',
          ellipsis: true,
          colKey: 'description',
          title: '说明',
        },
      ]}
      rowKey="index"
      tableLayout="auto"
      verticalAlign="top"
      size="small"
      bordered
      hover
      stripe
      rowClassName={(rowKey) => `${rowKey}-class`}
      // 与pagination对齐
      pagination={{
        pageSize: 10,
        total,
        current: 2,
        showJumper: true,
        showSizer: true,
        visibleWithOnePage: true,

        onChange() {
          console.log('pagination change');
        },
      }}
    />
  );
}
