import React, { useState } from 'react';
import { Table, Radio, Checkbox, Space } from 'tdesign-react';

const RadioGroup = Radio.Group;
const RadioButton = Radio.Button;
const data = [];

for (let i = 0; i < 20; i++) {
  data.push({
    index: i,
    platform: i % 2 === 0 ? '共有' : '私有',
    type: ['String', 'Number', 'Array', 'Object'][i % 4],
    default: ['-', '0', '[]', '{}'][i % 4],
    detail: {
      position: `读取 ${i} 个数据的嵌套信息值`,
      position1: `读取 ${i} 个数据的嵌套信息值`,
    },
    description: '数据源',
    needed: i % 4 === 0 ? '是' : '否',
  });
}

export default function TableFixedColumn() {
  const [tableLayout, setTableLayout] = useState('fixed');
  const [fixedTopAndBottomRows, setFixedTopAndBottomRows] = useState(false);
  // <!-- 如果希望表格列宽自适应，设置 `table-layout: auto` 即可。需同时设置 table-content-width -->
  // <!-- fixedRows: [2, 2] 表示冻结表格的头两行和尾两行 -->
  // <!-- footData 可以是多行，均支持固定在底部 -->
  const table = (
    <Table
      bordered
      data={data}
      footData={[{}]}
      tableLayout={tableLayout}
      tableContentWidth={tableLayout === 'fixed' ? undefined : '1600px'}
      maxHeight={fixedTopAndBottomRows ? 500 : 300}
      fixedRows={fixedTopAndBottomRows ? [2, 2] : undefined}
      columns={[
        {
          align: 'center',
          width: 100,
          colKey: 'index',
          title: '序号',
          fixed: 'left',
          foot: '总述',
        },
        {
          colKey: 'platform',
          title: '平台',
          width: 120,
          foot: '公有(5)',
        },
        {
          colKey: 'type',
          title: '类型',
          width: 120,
          foot: 'Number(5)',
        },
        {
          colKey: 'default',
          title: '默认值',
          width: 150,
          foot: '-',
        },
        {
          colKey: 'detail.position',
          title: '详情信息',
          width: 250,
          foot: '-',
        },
        {
          colKey: 'description',
          title: '说明',
          width: 120,
          foot: '数据(10)',
        },
        {
          colKey: 'needed',
          title: '必传',
          foot: '否(6)',
          width: 120,
        },
        {
          colKey: 'operation',
          title: '操作',
          width: 100,
          cell: '删除',
          fixed: 'right',
        },
      ]}
      rowKey="index"
    />
  );

  return (
    <Space direction="vertical" size="large" style={{ width: '100%' }}>
      <RadioGroup value={tableLayout} variant="default-filled" onChange={setTableLayout}>
        <RadioButton value="fixed">table-layout: fixed</RadioButton>
        <RadioButton value="auto">table-layout: auto</RadioButton>
      </RadioGroup>
      <Checkbox value={fixedTopAndBottomRows} onChange={setFixedTopAndBottomRows}>
        是否冻结首尾两行
      </Checkbox>

      {table}
    </Space>
  );
}
