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
        label: '我是节点1-2aaa',
        children: [
          {
            label: '我是节点1-2-1aaa',
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
    label: '我是节点1aaa',
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
    // 没有关键字时，仅显示根节点
    if (!node.getParentData()) {
      return true;
    }
    return false;
  }
  return node.data && node.data.label && node.data.label.indexOf(value) > 0;
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
