import React from 'react';
import { Transfer, Tree } from 'tdesign-react';

import type { TransferProps, TreeProps } from 'tdesign-react';

const list: TransferProps['data'] = [
  {
    value: '1',
    label: '1',
    children: [
      {
        value: '1.1',
        label: '1.1',
      },
      {
        value: '1.2',
        label: '1.2',
        children: [
          {
            value: '1.2.1',
            label: '1.2.1',
            children: [
              {
                value: '1.2.1.1',
                label: '1.2.1.1',
              },
              {
                value: '1.2.1.2',
                label: '1.2.1.2',
              },
            ],
          },
        ],
      },
    ],
  },
  {
    value: '2',
    label: '2',
    children: [
      {
        value: '2.1',
        label: '2.1',
      },
      {
        value: '2.2',
        label: '2.2',
      },
    ],
  },
];

export default function BaseExample() {
  const TreeNode = (props: TreeProps) => <Tree {...props} checkable expandAll={true} hover={true} transition={true} />;
  return <Transfer data={list} tree={TreeNode}></Transfer>;
}
