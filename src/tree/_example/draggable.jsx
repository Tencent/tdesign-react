import React from 'react';
import { Tree, Space } from 'tdesign-react';

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
        label: '2.2',
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
  const handleDrop = ({ node, dropPosition, e }) => {
    console.log(node, dropPosition, e);
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
      />
    </Space>
  );
};
