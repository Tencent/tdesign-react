import React from 'react';
import { Tree } from 'tdesign-react';
import type { TreeProps } from 'tdesign-react';

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
        let nodes: Array<{ label: string; children: boolean }> = [];
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

  const handleLoad: TreeProps['onLoad'] = (state) => {
    console.log('on load:', state);
  };

  return <Tree data={items} hover expandAll load={load} onLoad={handleLoad} />;
};
