import React, { useState } from 'react';
import { Cascader } from 'tdesign-react';

export default function Example() {
  const [value, setValue] = useState(['1.1']);
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
    <div className="tdesign-demo-block-row">
      <Cascader options={options} onChange={onChange} value={value} multiple clearable />
    </div>
  );
}
