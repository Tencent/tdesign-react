import React, { useState } from 'react';
import { Cascader, Space } from 'tdesign-react';

export default function Example() {
  const [value, setValue] = useState('');
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

  const onChange = (value) => {
    setValue(value);
  };

  return (
    <Space direction="vertical">
      <Cascader options={options} value={value} trigger="click" onChange={onChange} />
      <Cascader options={options} value={value} trigger="hover" onChange={onChange} />
    </Space>
  );
}
