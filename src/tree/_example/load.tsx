import React from 'react';
import { Tree, TreeProps } from 'tdesign-react';

const items = [
  {
    label: '1',
    children: true,
  },
  {
    label: '2',
    children: true,
  },
];

export default () => {
  const load: TreeProps['load'] = (node) =>
    new Promise((resolve) => {
      setTimeout(() => {
        let nodes = [];
        if (node.getLevel() < 2) {
          nodes = [
            {
              label: `${node.label}.1`,
              children: true,
            },
            {
              label: `${node.label}.2`,
              children: true,
            },
          ];
        }
        resolve(nodes);
      }, 1000);
    });

  return <Tree data={items} hover lazy={false} expandAll load={load} />;
};
