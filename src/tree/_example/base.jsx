import React from 'react';
import { Tree } from 'tdesign-react';

const items = [
  {
    label: '第一段',
    children: [
      {
        label: '第二段',
      },
      {
        label: '第二段',
      },
    ],
  },
  {
    label: '第一段',
    children: [
      {
        label: '第二段',
      },
      {
        label: '第二段',
      },
    ],
  },
  {
    label: '第一段',
    children: [
      {
        label: '第二段',
      },
      {
        label: '第二段',
      },
    ],
  },
  {
    label: '第一段',
    children: [
      {
        label: '第二段',
      },
      {
        label: '第二段',
      },
    ],
  },
];

export default () => <Tree data={items} activable hover transition />;
