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
    label: '2（不允许拖放该节点及其子节点）',
    disabled: true,
    children: [
      {
        value: '2.1',
        label: '2.1',
        disabled: true,
      },
      {
        value: '2.2',
        label: '2.2',
        disabled: true,
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
    // 放置位置：-1 上方，0 内部，1 下方
    // 适合在这做简单的权限检查
    const { dragNode, dropNode, dropPosition } = ctx;
    console.log('allowDrop', dragNode, dropNode, dropPosition);
    if ((dragNode.value as string).startsWith('2') || (dropNode.value as string).startsWith('2')) {
      return false;
    }
  };
  const handleDrop: TreeProps['onDrop'] = (ctx) => {
    // 与 allowDrop 的回调类型一致，但适合在这处理复杂的业务操作
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
