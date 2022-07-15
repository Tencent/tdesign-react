import React, { useState } from 'react';
import { TreeSelect, Radio, Space } from 'tdesign-react';

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
  const [type, setType] = useState('default');

  function filterFunction(searchText, node) {
    return node.data.label.indexOf(searchText) >= 0;
  }

  return (
    <Space direction="vertical" style={{ width: 300 }}>
      <Radio.Group value={type} onChange={(v) => setType(v)} variant="default-filled">
        <Radio.Button value="default">默认</Radio.Button>
        <Radio.Button value="function">自定义方法</Radio.Button>
      </Radio.Group>
      {type === 'default' ? (
        <>
          <TreeSelect data={options} clearable filterable placeholder="请选择" />
          <TreeSelect data={options} multiple clearable filterable placeholder="请选择" />
        </>
      ) : (
        <>
          <TreeSelect data={options} clearable filter={filterFunction} placeholder="请选择" />
          <TreeSelect data={options} multiple clearable filter={filterFunction} placeholder="请选择" />
        </>
      )}
    </Space>
  );
}
