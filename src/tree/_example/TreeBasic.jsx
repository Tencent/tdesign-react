import React from 'react';
// import { Tree } from '@tdesign/react';
import Tree from '../Tree';

const data = [
  {
    children: [
      {
        label: '',
        value: '1-1',
      },
      {
        label: '',
        value: '1-2',
        children: [
          {
            label: '我是节点1-2-1',
            value: '1-2-1',
          },
          {
            label: '我是节点1-2-2',
            value: '1-2-2',
          },
          {
            label: '我是节点1-2-3',
            value: '1-2-3',
          },
        ],
      },
      {
        label: '我是节点1-3',
        value: '1-3',
      },
    ],
    label: '',
    value: '1',
  },
  {
    children: [
      {
        label: '我是节点2-1',
        value: '2-1',
        children: [
          {
            label: '我是节点2-1-1',
            value: '2-1-1',
            children: [
              {
                label: '我是节点2-1-1-1',
                value: '2-1-1-1',
              },
              {
                label: '我是节点2-1-1-2',
                value: '2-1-1-2',
                children: [
                  {
                    label: '我是节点2-1-1-2-1',
                    value: '2-1-1-2-1',
                    children: [
                      {
                        label: '我是节点2-1-1-2-1-1',
                        value: '2-1-1-2-1-1',
                      },
                      {
                        label: '我是节点2-1-1-2-1-2',
                        value: '2-1-1-2-1-2',
                      },
                    ],
                  },
                  {
                    label: '我是节点2-1-1-2-2',
                    value: '2-1-1-2-2',
                  },
                ],
              },
            ],
          },
        ],
      },
      {
        label: '我是节点2-2',
        value: '2-2',
      },
      {
        label: '我是节点2-3',
        value: '2-3',
      },
    ],
    label: '我是节点2',
    value: '2',
  },
];

// 各种 empty 类型示例
// 1、string 类型
const empty = '我是string类型的empty';
// 2、Function 类型
// const empty = (node) => {
//   if (!node.parent) {
//     return '我是function类型的empty（根节点）';
//   }
//   return '我是function类型的empty（普通节点）';
// };
// 3、ReactNode 类型
// const empty = <div style={{ color: 'blue' }}>我是 ReactNode 类型的 empty</div>;

// Function 类型的 label
const label = (node) => `${node.label}，我是 Function 方法渲染的`;

export default function TreeExample() {
  return (
    <>
      <Tree data={data} expandParent={true} defaultExpanded={['1']} empty={empty} label={label} />
    </>
  );
}
