import React, { useState } from 'react';
import { TreeSelect, Tag, Space } from 'tdesign-react';

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
  const [value, setValue] = useState('guangzhou');
  const [mulValue, setMulValue] = useState(['guangzhou', 'shenzhen']);
  return (
    <Space direction="vertical" style={{ width: 300 }}>
      <TreeSelect
        data={options}
        clearable
        placeholder="请选择"
        value={value}
        onChange={(val) => setValue(val)}
        valueDisplay={({ value }) => `${value.label}(${value.value})`}
      />
      <TreeSelect
        data={options}
        multiple
        clearable
        placeholder="请选择"
        value={mulValue}
        valueDisplay={({ onClose, value }) =>
          value.map(({ label, value }, index) => (
            <Tag key={value} closable onClose={() => onClose(index)}>
              {label}({value})
            </Tag>
          ))
        }
        onChange={(val) => setMulValue(val)}
      />
    </Space>
  );
}
