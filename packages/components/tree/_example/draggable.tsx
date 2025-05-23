import React from 'react';
import { Tree, Space } from 'tdesign-react';

import type { TreeProps } from 'tdesign-react';

const items = [
  {
    value: '1',
    label: '1',
    children: [
      {
        value: '1.1',
        label: '1.1',
        children: [
          {
            value: '1.1.1',
            label: '1.1.1',
            children: [
              {
                value: '1.1.1.1',
                label: '1.1.1.1',
              },
              {
                value: '1.1.1.2',
                label: '1.1.1.2',
              },
            ],
          },
          {
            value: '1.1.2',
            label: '1.1.2',
            children: [
              {
                value: '1.1.2.1',
                label: '1.1.2.1',
              },
              {
                value: '1.1.2.2',
                label: '1.1.2.2',
              },
            ],
          },
        ],
      },
    ],
  },
  {
    value: '2',
    label: '2',
    children: [
      {
        value: '2.1',
        label: '2.1',
      },
      {
        value: '2.2',
        label: '2.2 不允许拖放为 2.2 的子节点',
      },
    ],
  },
];

export default () => {
  const handleDragStart = () => {
    console.log('dragStart');
  };
  const handleDragEnd = () => {
    console.log('dragEnd');
  };
  const handleDragOver = () => {
    console.log('dragOver');
  };
  const handleDragLeave = () => {
    console.log('dragLeave');
  };
  const handleDrop: TreeProps['onDrop'] = ({ dragNode, dropPosition, e }) => {
    console.log(dragNode, dropPosition, e);
  };

  const handleAllowDrop: TreeProps['allowDrop'] = (ctx) => {
    const { dropNode, dropPosition } = ctx;
    if (dropNode.value === '2.2' && dropPosition === 0) {
      return false;
    }
  };

  return (
    <Space direction="vertical">
      <Tree
        data={items}
        activable
        hover
        transition
        expandAll
        draggable
        onDrop={handleDrop}
        onDragStart={handleDragStart}
        onDragEnd={handleDragEnd}
        onDragLeave={handleDragLeave}
        onDragOver={handleDragOver}
        allowDrop={handleAllowDrop}
      />
    </Space>
  );
};
