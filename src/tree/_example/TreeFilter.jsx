import React, { useState } from 'react';
import Tree from '../Tree';
import Input from '../../input';

const initData = [
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
        children: [
          {
            label: '我是节点2-1-1',
            children: [
              {
                label: '我是节点2-1-1-1',
              },
              {
                label: '我是节点2-1-1-2',
              },
            ],
          },
        ],
      },
      {
        label: '我是节点2-2',
        children: [
          {
            label: '我是节点2-2-1',
            children: [
              {
                label: '我是节点2-2-1-1',
              },
              {
                label: '我是节点2-2-1-2',
              },
            ],
          },
        ],
      },
      {
        label: '我是节点2-3',
      },
    ],
    label: '我是节点2',
  },
];

function filter(node, value) {
  if (!value) {
    return false;
  }
  return value && node.label.indexOf(value) > 0;
}

export default function TreeExample() {
  const [value, setValue] = useState('');

  return (
    <>
      <Input
        placeholder="请输入内容"
        value={value}
        onChange={(event) => {
          setValue(event.target.value);
        }}
      />
      <Tree data={initData} filter={(node) => filter(node, value)} valueMode="all" />
    </>
  );
}
