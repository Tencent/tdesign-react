import React, { useState } from 'react';
import { TreeSelect } from 'tdesign-react';

const options = [
  {
    name: '广东省',
    pinyin: 'guangdong',
    children: [
      {
        name: '广州市',
        pinyin: 'guangzhou',
      },
      {
        name: '深圳市',
        pinyin: 'shenzhen',
      },
    ],
  },
  {
    name: '江苏省',
    pinyin: 'jiangsu',
    children: [
      {
        name: '南京市',
        pinyin: 'nanjing',
      },
      {
        name: '苏州市',
        pinyin: 'suzhou',
      },
    ],
  },
];

export default function Example() {
  const [value, setValue] = useState('shenzhen');

  return (
    <TreeSelect
      data={options}
      clearable
      placeholder="请选择"
      value={value}
      // defaultValue="guangdong"
      onChange={(val) => {
        setValue(val);
        console.log(val);
      }}
      style={{ width: 300 }}
      popupProps={{ overlayStyle: { width: '500px' } }}
      treeProps={{
        keys: {
          label: 'name',
          value: 'pinyin',
          children: 'children',
        },
      }}
    />
  );
}
