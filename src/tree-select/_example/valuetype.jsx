import React, { useState } from 'react';
import { TreeSelect, Space } from 'tdesign-react';

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
  const [value, setValue] = useState({ label: '深圳市', value: 'shenzhen' });
  const [mulValue, setMulValue] = useState([
    { label: '广州市', value: 'guangzhou' },
    { label: '深圳市', value: 'shenzhen' },
  ]);

  return (
    <Space direction="vertical" style={{ width: 300 }}>
      <TreeSelect
        data={options}
        clearable
        placeholder="请选择"
        value={value}
        valueType="object"
        onChange={(val) => {
          setValue(val);
          console.log(val);
        }}
      />
      <TreeSelect
        data={options}
        clearable
        multiple
        valueType="object"
        placeholder="请选择"
        value={mulValue}
        onChange={(val) => {
          setMulValue(val);
          console.log(val);
        }}
      />
    </Space>
  );
}
