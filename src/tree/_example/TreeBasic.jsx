import React from 'react';
// import { Tree } from '@tdesign/react';
import Tree from '../Tree';

export default function TreeExample() {
  const data = [
    {
      value: '1',
      children: [
        {
          value: '1-1',
          label: '我是节点1-1',
        },
        {
          value: '1-2',
          label: '我是节点1-2',
          children: [
            {
              value: '1-2-1',
              label: '我是节点1-2-1',
            },
            {
              value: '1-2-2',
              label: '我是节点1-2-2',
            },
            {
              value: '1-2-3',
              label: '我是节点1-2-3',
            },
          ],
        },
        {
          value: '1-3',
          label: '我是节点1-3',
        },
      ],
      label: '我是节点1',
    },
    {
      value: '2',
      children: [
        {
          value: '2-1',
          label: '我是节点2-1',
        },
        {
          value: '2-2',
          label: '我是节点2-2',
        },
        {
          value: '2-3',
          label: '我是节点2-3',
        },
      ],
      label: '我是节点2',
    },
  ];
  return (
    <>
      <Tree data={data} defaultExpanded={['1', '1-2']} expandLevel={1} expandOnClickNode={true} />
    </>
  );
}
