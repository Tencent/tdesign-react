import React from 'react';
// import { Tree } from '@tdesign/react';
import Tree from '../Tree';

const data = [
  {
    children: [
      {
        label: '',
      },
      {
        label: '',
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
    label: '',
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
                children: [
                  {
                    label: '我是节点2-1-1-2-1',
                    children: [
                      {
                        label: '我是节点2-1-1-2-1-1',
                      },
                      {
                        label: '我是节点2-1-1-2-1-2',
                      },
                    ],
                  },
                  {
                    label: '我是节点2-1-1-2-2',
                  },
                ],
              },
            ],
          },
        ],
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

export default function TreeExample() {
  return (
    <>
      <Tree data={data} defaultExpanded={['1', '1-2']} expandLevel={1} empty={empty} />
    </>
  );
}
