import React, { useState } from 'react';
import { Cascader } from 'tdesign-react';

export default function Example() {
  const [value, setValue] = useState(['1.1', '1.2', '1.3']);
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

  const itemStyle = {
    marginTop: '16px',
  };

  return (
    <div className="tdesign-demo-block-column">
      <Cascader style={itemStyle} options={options} value={value} onChange={onChange} multiple minCollapsedNum={1} />
      <Cascader style={itemStyle} options={options} value={value} onChange={onChange} multiple minCollapsedNum={2} />
      <Cascader
        style={itemStyle}
        options={options}
        value={value}
        onChange={onChange}
        multiple
        minCollapsedNum={1}
        collapsedItems={<div>自定义内容</div>}
      />
    </div>
  );
}
