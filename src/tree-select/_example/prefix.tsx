import React, { useState } from 'react';
import { TreeSelect } from 'tdesign-react';
import { UserIcon } from 'tdesign-icons-react';

const options = [
  {
    label: '开发一组',
    value: 'group1',
    children: [
      {
        label: '小赵',
        value: 'zhao',
      },
      {
        label: '小钱',
        value: 'qian',
      },
    ],
  },
  {
    label: '开发二组',
    value: 'group2',
    children: [
      {
        label: '小孙',
        value: 'sun',
      },
      {
        label: '小李',
        value: 'li',
      },
    ],
  },
];

export default function Example() {
  const [value, setValue] = useState('');

  return (
    <TreeSelect
      data={options}
      clearable
      placeholder="请输入"
      value={value}
      prefixIcon={<UserIcon />}
      onChange={(val) => {
        setValue(val);
        console.log(val);
      }}
      style={{ width: 300 }}
    />
  );
}
