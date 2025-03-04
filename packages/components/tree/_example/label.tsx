import React from 'react';
import { Tree } from '@tdesign/components';
import type { TreeProps } from '@tdesign/components';

const items = [
  {
    label: '1',
    children: [
      {
        label: '1.1',
      },
      {
        label: '1.2',
      },
    ],
  },
  {
    label: '2',
    children: [
      {
        label: '2.1',
      },
      {
        label: '2.2',
      },
    ],
  },
];

export default () => {
  const renderLabel: TreeProps['label'] = (node) => <strong>{`value: ${node.value}, label: ${node.label}`}</strong>;

  return <Tree data={items} expandAll label={renderLabel} />;
};
