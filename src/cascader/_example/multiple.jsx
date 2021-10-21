import React, { useState } from 'react';
import { Cascader } from '@tencent/tdesign-react';

export default function Example() {
  const [value, setValue] = useState(['1.1']);
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

  const onChange = (value) => {
    setValue(value);
  };

  const itemStyle = {
    marginTop: '16px',
  };

  return (
    <>
      <div style={itemStyle}>非受控</div>
      <Cascader style={itemStyle} options={options} defaultValue={value} size="small" multiple clearable />
      <div style={itemStyle}>受控</div>
      <Cascader style={itemStyle} options={options} value={value} multiple clearable />
      <Cascader style={itemStyle} options={options} onChange={onChange} value={value} size="large" multiple clearable />
    </>
  );
}
