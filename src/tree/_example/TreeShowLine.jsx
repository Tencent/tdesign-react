import React from 'react';
import Tree from '../Tree';

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
                        children: [
                          {
                            label: '我是节点2-1-1-2-1-2-1',
                            children: [
                              {
                                label: '我是节点2-1-1-2-1-2-1-1',
                              },
                              {
                                label: '我是节点2-1-1-2-1-2-1-2',
                              },
                              {
                                label: '我是节点2-1-1-2-1-2-1-3',
                              },
                            ],
                          },
                          {
                            label: '我是节点2-1-1-2-1-2-2',
                          },
                          {
                            label: '我是节点2-1-1-2-1-2-3',
                          },
                          {
                            label: '我是节点2-1-1-2-1-2-4',
                          },
                        ],
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

export default function TreeExample() {
  return (
    <>
      <Tree data={data} line={true} expandOnClickNode={true} />
    </>
  );
}
