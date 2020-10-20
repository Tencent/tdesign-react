import React from 'react';
import Tree from '../Tree';

const loadNode = (node, resolve) => {
  if (node.value === '2') {
    return resolve([]);
  }
  if (node.value === '1-2') {
    return resolve([
      {
        value: '1-2-1',
        label: '我是节点1-2-1',
      },
      {
        value: '1-2-2',
        label: '我是节点1-2-2',
      },
    ]);
  }

  setTimeout(() => {
    resolve([
      {
        value: node.value + '-1',
        label: node.label + '-1',
      },
    ]);
  }, 500);
};

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
      label: '我是节点2',
    },
  ];
  return (
    <>
      <Tree data={data} lazy={true} load={loadNode} />
    </>
  );
}
