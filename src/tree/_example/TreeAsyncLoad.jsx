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
    children: true,
  },
];

const loadNode = (node) =>
  // console.log('loadNode:', node);
  new Promise((resolve) => {
    setTimeout(() => {
      let nodes = [];
      if (node.level < 2) {
        nodes = [
          {
            label: `${node.label}-1`,
            children: true,
          },
          {
            label: `${node.label}-2`,
            children: true,
          },
        ];
      }
      resolve(nodes);
    }, 2000);
  });
export default function TreeExample() {
  return (
    <>
      <Tree data={data} load={loadNode} lazy={true} expandAll={true} />
    </>
  );
}
