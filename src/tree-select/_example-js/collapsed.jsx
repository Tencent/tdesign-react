import React, { useState } from 'react';
import { TreeSelect, Tag, Tooltip, Space } from 'tdesign-react';

const options = [
  {
    label: '广东省',
    value: 'guangdong',
    children: [
      {
        label: '广州市',
        value: 'guangzhou',
      },
      {
        label: '深圳市',
        value: 'shenzhen',
      },
    ],
  },
  {
    label: '江苏省',
    value: 'jiangsu',
    children: [
      {
        label: '南京市',
        value: 'nanjing',
      },
      {
        label: '苏州市',
        value: 'suzhou',
      },
    ],
  },
];

export default function Example() {
  const [value, setValue] = useState(['guangzhou', 'shenzhen']);
  const [customizeValue, setCustomizeValue] = useState(['guangzhou', 'shenzhen']);
  return (
    <Space direction="vertical" style={{ width: 300 }}>
      <TreeSelect
        data={options}
        multiple
        clearable
        placeholder="请选择"
        minCollapsedNum={1}
        value={value}
        onChange={(val) => setValue(val)}
      />
      <TreeSelect
        data={options}
        multiple
        clearable
        placeholder="请选择"
        minCollapsedNum={1}
        collapsedItems={({ collapsedSelectedItems }) => (
          <Tooltip content={collapsedSelectedItems.map((item) => item.label).join('、')}>
            <Tag>更多...</Tag>
          </Tooltip>
        )}
        value={customizeValue}
        onChange={(val) => setCustomizeValue(val)}
      />
    </Space>
  );
}
