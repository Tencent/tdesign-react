import React, { useState } from 'react';
import { Cascader } from 'tdesign-react';

export default function Example() {
  const [value, setValue] = useState('1.1');
  const [options] = useState([
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
    <div className="tdesign-demo-block-column">
      {/* 非受控 */}
      <Cascader style={itemStyle} options={options} size="small" defaultValue={value} clearable size="small" placeholder='请选择' />
      {/* 受控 */}
      <Cascader style={itemStyle} options={options} onChange={onChange} value={value} size="medium" clearable placeholder='请选择' />
      {/* 受控 */}
      <Cascader style={itemStyle} options={options} onChange={onChange} value={value} size="large" clearable size="large" placeholder='请选择' />
    </div>
  );
}
