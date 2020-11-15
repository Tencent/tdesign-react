import React from 'react';
import Tree from '../Tree';

export default function TreeExample() {
  const data = [
    {
      id: '1',
      list: [
        {
          id: '1-1',
          text: '我是节点1-1',
        },
        {
          id: '1-2',
          text: '我是节点1-2',
        },
      ],
      text: '我是节点1',
    },
    {
      id: '2',
      list: [
        {
          id: '2-1',
          text: '我是节点2-1',
        },
        {
          id: '2-2',
          text: '我是节点2-2',
        },
      ],
      text: '我是节点2',
    },
  ];
  return (
    <>
      <Tree
        data={data}
        keys={{
          value: 'id',
          children: 'list',
          label: 'text',
        }}
      />
    </>
  );
}
