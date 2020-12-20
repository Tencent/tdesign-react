import React from 'react';
// import { Tree } from '@tdesign/react';
import Tree from '../Tree';
import Button from '../../button';

const data = [
  {
    children: [
      {
        label: '我是节点1-1',
      },
      {
        label: '我是节点1-2',
        children: [
          {
            label: '我是节点1-2-1',
          },
          {
            label: '我是节点1-2-2',
          },
          {
            label: '我是节点1-2-3',
          },
        ],
      },
      {
        label: '我是节点1-3',
      },
    ],
    label: '我是节点1',
  },
  {
    children: [
      {
        label: '我是节点2-1',
      },
      {
        label: '我是节点2-2',
      },
      {
        label: '我是节点2-3',
      },
    ],
    label: '我是节点2',
  },
];

function handleInsertBefore(node) {
  const treeData = {
    label: '我是新节点',
  };
  node.insertBefore(treeData);
}
function handleInsertAfter(node) {
  const treeData = {
    label: '我是新节点',
  };
  node.insertAfter(treeData);
}
function handleDelete(node) {
  node.remove();
}

function renderOperations(node) {
  return (
    <>
      <Button onClick={() => handleInsertBefore(node)}>insertBefore</Button>
      <Button onClick={() => handleInsertAfter(node)}>insertAfter</Button>
      <Button onClick={() => handleDelete(node)}>remove</Button>
    </>
  );
}

export default function TreeExample() {
  const operations = renderOperations;
  return (
    <>
      <Tree data={data} expandLevel={1} expandOnClickNode={true} operations={operations} />
    </>
  );
}
