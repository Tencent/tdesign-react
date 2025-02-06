import React, { useState } from 'react';
import { Cascader } from 'tdesign-react';
import type { CascaderProps, CascaderValue } from 'tdesign-react';

export default function Example() {
  const [value, setValue] = useState<CascaderValue>(['8.1']);
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
    {
      label: '选项三',
      value: '3',
      children: [
        {
          label: '子选项一',
          value: '3.1',
        },
        {
          label: '子选项二',
          value: '3.2',
        },
      ],
    },
    {
      label: '选项四',
      value: '4',
      children: [
        {
          label: '子选项一',
          value: '4.1',
        },
        {
          label: '子选项二',
          value: '4.2',
        },
      ],
    },
    {
      label: '选项五',
      value: '5',
      children: [
        {
          label: '子选项一',
          value: '5.1',
        },
        {
          label: '子选项二',
          value: '5.2',
        },
      ],
    },
    {
      label: '选项六',
      value: '6',
      children: [
        {
          label: '子选项一',
          value: '6.1',
        },
        {
          label: '子选项二',
          value: '6.2',
        },
      ],
    },
    {
      label: '选项七',
      value: '7',
      children: [
        {
          label: '子选项一',
          value: '7.1',
        },
        {
          label: '子选项二',
          value: '7.2',
        },
      ],
    },
    {
      label: '选项8',
      value: '8',
      children: [
        {
          label: '子选项一',
          value: '8.1',
        },
        {
          label: '子选项二',
          value: '8.2',
        },
      ],
    },
  ];

  const onChange: CascaderProps['onChange'] = (value) => {
    setValue(value);
  };

  return (
    <div className="tdesign-demo-block-row">
      <Cascader options={options} onChange={onChange} value={value} multiple clearable />
    </div>
  );
}
