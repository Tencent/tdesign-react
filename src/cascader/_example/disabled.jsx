import React, { useState } from 'react';
import { Cascader } from 'tdesign-react';

export default function Example() {
  const value1 = '1.1';
  const value2 = ['1.1'];
  const [options] = useState([
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
  ]);

  const itemStyle = {
    marginTop: '16px',
  };

  return (
    <div className="tdesign-demo-block-column">
      <Cascader style={itemStyle} options={options} value={value1} disabled />
      <Cascader style={itemStyle} options={options} value={value2} disabled multiple />
    </div>
  );
}
