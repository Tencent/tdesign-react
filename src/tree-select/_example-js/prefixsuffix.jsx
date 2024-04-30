import React from 'react';
import { TreeSelect } from 'tdesign-react';
import { UserIcon, CaretDownSmallIcon } from 'tdesign-icons-react';

const options = [
  {
    label: '广东省',
    value: 'guangdong',
    children: [
      {
        label: '广州市',
        value: 'guangzhou',
      },
      {
        label: '深圳市',
        value: 'shenzhen',
        children: [
          {
            label: '南山区海天二路33号腾讯滨海大厦',
            value: 'Tencent',
          },
        ],
      },
    ],
  },
  {
    label: '江苏省',
    value: 'jiangsu',
    disabled: true,
    children: [
      {
        label: '南京市',
        value: 'nanjing',
      },
      {
        label: '苏州市',
        value: 'suzhou',
      },
    ],
  },
];

export default function Example() {
  return (
    <TreeSelect
      data={options}
      clearable
      placeholder="请输入"
      prefixIcon={<UserIcon />}
      suffixIcon={<CaretDownSmallIcon />}
      style={{ width: 300 }}
    />
  );
}
