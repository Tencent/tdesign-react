import React, { useState } from 'react';
import { Cascader, Space } from 'tdesign-react';

export default function Example() {
  const [value1, setValue1] = useState(['1', '1.1']);
  const [value2, setValue2] = useState([
    ['1', '1.1'],
    ['1', '1.2'],
  ]);
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

  const onChange1 = (value) => {
    setValue1(value);
  };
  const onChange2 = (value) => {
    setValue2(value);
  };

  return (
    <Space direction="vertical">
      {JSON.stringify(value1)}
      <Cascader options={options} value={value1} onChange={onChange1} valueType="full" />
      {JSON.stringify(value2)}
      <Cascader options={options} value={value2} onChange={onChange2} valueType="full" multiple />
    </Space>
  );
}
