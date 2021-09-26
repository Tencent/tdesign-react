import React, { useState } from 'react';
import { Cascader } from '@tencent/tdesign-react';

export default function Example() {
  const [value1, setValue1] = useState('');
  const options = [
    {
      label: '这里是上海的一个特别长长长长长长长长的地名',
      value: '1',
      children: [
        {
          label: '黄浦区',
          value: '1.1',
        },
        {
          label: '静安区',
          value: '1.2',
        },
        {
          label: '浦东新区',
          value: '1.3',
        },
      ],
    },
    {
      label: '深圳',
      value: '2',
      children: [
        {
          label: '宝安区',
          value: '2.1',
        },
        {
          label: '南山区',
          value: '2.2',
        },
        {
          label: '这里是深圳的一个特别长长长长长长长长的地名',
          value: '2.3',
        },
      ],
    },
  ];

  const itemStyle = {
    marginTop: '16px',
  };

  const onChange1 = (value) => {
    setValue1(value);
  };

  return (
    <>
      <Cascader style={itemStyle} options={options} value={value1} onChange={onChange1} />
    </>
  );
}
