import React from 'react';
import { Tree } from '@tdesign/react';

export default function TreeExample() {
  const data = [
    {
      id: '1',
      children: [
        {
          id: '1-1',
          label: '我是节点1-1',
        },
        {
          id: '1-2',
          label: '我是节点1-2',
        },
        {
          id: '1-3',
          label: '我是节点1-3',
        },
      ],
      label: '我是节点1',
    },
    {
      id: '2',
      children: [
        {
          id: '2-1',
          label: '我是节点2-1',
        },
        {
          id: '2-2',
          label: '我是节点2-2',
        },
        {
          id: '2-3',
          label: '我是节点2-3',
        },
      ],
      label: '我是节点2',
    },
  ];
  return (
    <>
      <Tree data={data}></Tree>
    </>
  );
}
