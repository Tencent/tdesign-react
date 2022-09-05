import React, { useState } from 'react';
import { Cascader, Space } from 'tdesign-react';

export default function Example() {
  const [value1, setValue1] = useState('');
  const [value2, setValue2] = useState([]);
  const options = [
    {
      name: '选项一',
      code: '1',
      items: [
        {
          name: '子选项一',
          code: '1.1',
        },
        {
          name: '子选项二',
          code: '1.2',
        },
        {
          name: '子选项三',
          code: '1.3',
        },
      ],
    },
    {
      name: '选项二',
      code: '2',
      items: [
        {
          name: '子选项一',
          code: '2.1',
        },
        {
          name: '子选项二',
          code: '2.2',
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

  const keys = { label: 'name', value: 'code', children: 'items' };

  return (
    <Space direction="vertical">
      <Cascader keys={keys} options={options} value={value1} onChange={onChange1} />
      <Cascader keys={keys} options={options} value={value2} multiple onChange={onChange2} />
    </Space>
  );
}
