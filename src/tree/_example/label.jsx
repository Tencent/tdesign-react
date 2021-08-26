import React from 'react';
import { Tree } from '@tencent/tdesign-react';

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
  const renderLabel = (node) => <strong>{`value: ${node.value}, label: ${node.label}`}</strong>;

  return (
    <div className="tdesign-tree-base">
      <Tree data={items} expandAll label={renderLabel} />
    </div>
  );
};
