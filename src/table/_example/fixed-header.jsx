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
    },
    needed: i % 4 === 0 ? '是' : '否',
    description: '数据源',
  });
}

export default function TableFixHeader() {
  const [tableLayout, setTableLayout] = useState('fixed');
  const [fixedTopAndBottomRows, setFixedTopAndBottomRows] = useState(false);
  // 如果希望表格列宽自适应，设置 `table-layout: auto` 即可。如果列字段过多超出表格宽度，还需同时设置 table-content-width
  // fixedRows: [2, 2] 表示冻结表格的头两行和尾两行
  // footData 可以是多行，均支持固定在底部，用法同 data
  const table = (
    <Table
      data={data}
      footData={[{}]}
      tableLayout={tableLayout}
      maxHeight={fixedTopAndBottomRows ? 500 : 300}
      fixedRows={fixedTopAndBottomRows ? [2, 2] : undefined}
      bordered
      columns={[
        {
          width: 120,
          colKey: 'platform',
          title: '平台',
          foot: '汇总',
        },
        {
          width: 120,
          colKey: 'type',
          title: '类型',
          foot: 'Number(5)',
        },
        {
          colKey: 'default',
          title: '默认值',
          foot: '-',
        },
        {
          colKey: 'needed',
          title: '必传',
          foot: '否(6)',
        },
        {
          colKey: 'detail.position',
          title: '详情信息',
          width: 200,
          ellipsis: true,
          foot: '-',
        },
        {
          colKey: 'description',
          title: '说明',
          foot: '数据(10)',
        },
      ]}
      rowKey="index"
    />
  );

  return (
    <Space direction="vertical" size="large">
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
