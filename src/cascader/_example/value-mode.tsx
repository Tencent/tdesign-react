import React, { useState } from 'react';
import { Cascader, Space } from 'tdesign-react';
import type { CascaderProps, CascaderValue } from 'tdesign-react';

export default function Example() {
  const [value1, setValue1] = useState<CascaderValue>([]);
  const [value2, setValue2] = useState<CascaderValue>([]);
  const [value3, setValue3] = useState<CascaderValue>([]);
  const options = [
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
  ];

  const onChange1: CascaderProps['onChange'] = (value) => {
    setValue1(value);
  };

  const onChange2: CascaderProps['onChange'] = (value) => {
    setValue2(value);
  };

  const onChange3: CascaderProps['onChange'] = (value) => {
    setValue3(value);
  };

  return (
    <Space direction="vertical">
      <Cascader options={options} value={value1} onChange={onChange1} multiple valueMode="onlyLeaf" />
      <Cascader options={options} value={value2} onChange={onChange2} multiple valueMode="parentFirst" />
      <Cascader options={options} value={value3} onChange={onChange3} multiple valueMode="all" />
    </Space>
  );
}
