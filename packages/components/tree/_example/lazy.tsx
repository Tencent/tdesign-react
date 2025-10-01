import React, { useState } from 'react';
import { Space, Switch, Tree } from 'tdesign-react';
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
  const [checkable, setCheckable] = useState(true);
  const [strictly, setStrictly] = useState(false);

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

  return (
    <Space direction="vertical">
      <Space>
        可选: <Switch value={checkable} onChange={(value) => setCheckable(value)} />
      </Space>
      <Space>
        严格模式: <Switch value={checkable} onChange={(value) => setStrictly(value)} />
      </Space>
      <Tree
        hover
        valueMode="all"
        data={items}
        checkable={checkable}
        checkStrictly={strictly}
        load={load}
        onLoad={handleLoad}
      />
    </Space>
  );
};
