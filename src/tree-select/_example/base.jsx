import React, { useState } from 'react';
import { TreeSelect, SelectInput } from 'tdesign-react';

const OPTIONS = [
  { label: 'tdesign-vue', value: 1 },
  {
    label: 'tdesign-react',
    value: 2,
    children: [
      { label: 'tdesign-web-react', value: 2.1 },
      { label: 'tdesign-mobile-react', value: 2.2 },
    ],
  },
  { label: 'tdesign-miniprogram', value: 3 },
  { label: 'tdesign-angular', value: '4' },
  { label: 'tdesign-mobile-vue', value: '5' },
  { label: <span>tdesign-mobile-react</span>, value: '6' },
];

export default function Example() {
  const [value, setValue] = useState([3, '4']);

  return (
    <TreeSelect
      value={value}
      data={OPTIONS}
      multiple
      filterable
      onChange={setValue}
      // inputValue='tdesign-vue'
      onInputChange={(a, b) => {
        console.log(a, b)
      }}
    ></TreeSelect>
  );
}
