import React from 'react';
import { render } from '@test/utils';

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

// single select
export function getTreeDefaultMount(TreeSelect, props, events) {
  const value = [1, 2, 3, '4', '5'];
  return render(
    <TreeSelect
      value={value}
      data={OPTIONS}
      {...props}
      {...events}
    ></TreeSelect>
  );
}
