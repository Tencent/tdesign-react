import React from 'react';
import { Space, Tree } from 'tdesign-react';

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
        label: '2.2 （不允许其它节点拖放为其子节点）',
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
  const handleAllowDrop: TreeProps['allowDrop'] = (ctx) => {
    const { dropNode, dropPosition } = ctx;
    if (dropNode.value === '2.2' && dropPosition === 0) {
      return false;
    }
  };
  const handleDrop: TreeProps['onDrop'] = (ctx) => {
    console.log(ctx);
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
        allowDrop={handleAllowDrop}
        onDrop={handleDrop}
        onDragStart={handleDragStart}
        onDragEnd={handleDragEnd}
        onDragLeave={handleDragLeave}
        onDragOver={handleDragOver}
      />
    </Space>
  );
};
