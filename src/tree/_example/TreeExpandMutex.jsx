import React from 'react';
import Tree from '../Tree';

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
    ],
    label: '我是节点2',
  },
];

export default function TreeExample() {
  return (
    <>
      <Tree data={data} expandMutex={true} />
    </>
  );
}
