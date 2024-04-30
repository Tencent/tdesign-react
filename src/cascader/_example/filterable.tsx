import React, { useState } from 'react';
import { Cascader, Space } from 'tdesign-react';

export default function Example() {
  const [value1, setValue1] = useState('');
  const [value2, setValue2] = useState(['1.1']);
  const options = [
    {
      label: '当选项一数据展示文本过长时',
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
          label: '当选项数据展示文本过长时',
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
          label: '当选项数据展示文本过长时',
          value: '2.2',
        },
      ],
    },
  ];

  const onChange1 = (value) => {
    setValue1(value);
  };

  const onChange2 = (value) => {
    setValue2(value);
  };

  return (
    <Space direction="vertical">
      <Cascader options={options} value={value1} onChange={onChange1} filterable />
      <Cascader options={options} value={value2} multiple onChange={onChange2} filterable />
    </Space>
  );
}
