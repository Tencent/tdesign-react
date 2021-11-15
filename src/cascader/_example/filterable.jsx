import React, { useState } from 'react';
import { Cascader } from 'tdesign-react';

export default function Example() {
  const [value1, setValue1] = useState('');
  const [value2, setValue2] = useState(['1.1']);
  const options = [
    {
      label: '上海',
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
          label: '这里是深圳',
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

  const onChange2 = (value) => {
    setValue2(value);
  };

  return (
    <div className="tdesign-demo-block-column">
      <Cascader style={itemStyle} options={options} value={value1} onChange={onChange1} filterable />
      <Cascader style={itemStyle} options={options} value={value2} multiple onChange={onChange2} filterable />
    </div>
  );
}
