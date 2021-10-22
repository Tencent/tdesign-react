import React, { useState } from 'react';
import { Cascader } from '@tencent/tdesign-react';

export default function Example() {
  const [value1, setValue1] = useState([]);
  const [value2, setValue2] = useState([]);
  const [value3, setValue3] = useState([]);
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
          label: '福田区',
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

  const onChange3 = (value) => {
    setValue3(value);
  };

  return (
    <div className="tdesign-demo-block-column">
      <Cascader style={itemStyle} options={options} value={value1} onChange={onChange1} multiple valueMode="onlyLeaf" />
      <Cascader
        style={itemStyle}
        options={options}
        value={value2}
        onChange={onChange2}
        multiple
        valueMode="parentFirst"
      />
      <Cascader style={itemStyle} options={options} value={value3} onChange={onChange3} multiple valueMode="all" />
    </div>
  );
}
