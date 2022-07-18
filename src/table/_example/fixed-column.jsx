import React, { useState } from 'react';
import { Table, Radio, Checkbox, Space } from 'tdesign-react';

const data = [];
for (let i = 0; i < 5; i++) {
  data.push({
    index: i,
    platform: i % 2 === 0 ? '共有' : '私有',
    type: ['String', 'Number', 'Array', 'Object'][i % 4],
    default: ['-', '0', '[]', '{}'][i % 4],
    detail: {
      position: `读取 ${i} 个数据的嵌套信息值`,
    },
    needed: i % 4 === 0 ? '是' : '否',
    description: '数据源',
  });
}

export default function TableFixedColumn() {
  const [tableLayout, setTableLayout] = useState('fixed');
  const [emptyData, setEmptyData] = useState(false);
  const [leftFixedColumn, setLeftFixedColumn] = useState(2);
  const [rightFixedColumn, setReftFixedColumn] = useState(1);

  const table = (
    <Table
      bordered
      rowKey="index"
      data={emptyData ? [] : data}
      tableLayout={tableLayout}
      tableContentWidth={tableLayout === 'fixed' ? undefined : '1200px'}
      resizable={true}
      columns={[
        {
          align: 'center',
          width: 80,
          colKey: 'index',
          title: '序号',
          fixed: 'left',
        },
        {
          colKey: 'platform',
          title: '平台',
          width: 100,
          fixed: leftFixedColumn >= 2 ? 'left' : undefined,
        },
        {
          colKey: 'type',
          title: '类型',
          width: 150,
          // fixed: 'left',
        },
        {
          colKey: 'default',
          title: '默认值',
          width: 150,
        },
        {
          colKey: 'description',
          title: '说明',
          width: 100,
        },
        {
          colKey: 'needed',
          title: '是否必传',
          width: 150,
          // fixed: 'right',
        },
        {
          colKey: 'operation',
          title: '操作',
          width: 120,
          align: 'center',
          cell: () => <span>删除</span>,
          fixed: rightFixedColumn >= 2 ? 'right' : undefined,
        },
        {
          colKey: 'detail.position',
          title: '详情信息',
          width: 120,
          fixed: 'right',
          // 允许自定义浮层 Popup 全部属性
          ellipsis: { placement: 'bottom-right' },
        },
      ]}
    />
  );

  return (
    <Space direction="vertical" style={{ width: '100%' }}>
      <Radio.Group value={leftFixedColumn} variant="default-filled" onChange={setLeftFixedColumn}>
        <Radio.Button value={1}>左侧固定一列</Radio.Button>
        <Radio.Button value={2}>左侧固定两列</Radio.Button>
      </Radio.Group>

      <Radio.Group value={rightFixedColumn} variant="default-filled" onChange={setReftFixedColumn}>
        <Radio.Button value={1}>右侧固定一列</Radio.Button>
        <Radio.Button value={2}>右侧固定两列</Radio.Button>
      </Radio.Group>

      <div>
        <Radio.Group value={tableLayout} variant="default-filled" onChange={setTableLayout}>
          <Radio.Button value="fixed">table-layout: fixed</Radio.Button>
          <Radio.Button value="auto">table-layout: auto</Radio.Button>
        </Radio.Group>
        <Checkbox value={emptyData} onChange={setEmptyData} style={{ marginLeft: '16px', verticalAlign: 'middle' }}>
          空数据
        </Checkbox>
      </div>

      {table}
    </Space>
  );
}
