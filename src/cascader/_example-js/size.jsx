import React, { useState } from 'react';
import { Cascader, Space } from 'tdesign-react';

export default function Example() {
  const [value, setValue] = useState([]);
  const [options] = useState([
    {
      label: '选项一',
      value: '1',
      children: [
        {
          label: '子选项一',
          value: '1.1',
        },
        {
          label: '子选项二',
          value: '1.2',
        },
        {
          label: '子选项三',
          value: '1.3',
        },
      ],
    },
    {
      label: '选项二',
      value: '2',
      children: [
        {
          label: '子选项一',
          value: '2.1',
        },
        {
          label: '子选项二',
          value: '2.2',
        },
      ],
    },
  ]);

  const onChange = (value) => {
    setValue(value);
  };

  const itemStyle = {
    marginTop: '16px',
  };

  return (
    <Space direction="vertical">
      {/* 非受控 */}
      <Cascader style={itemStyle} options={options} defaultValue={value} clearable size="small" placeholder="请选择" />
      {/* 受控 */}
      <Cascader style={itemStyle} options={options} onChange={onChange} value={value} size="medium" clearable />
      {/* 受控 */}
      <Cascader style={itemStyle} options={options} onChange={onChange} value={value} size="large" clearable />
    </Space>
  );
}
