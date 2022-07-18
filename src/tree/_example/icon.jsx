import React from 'react';
import { Tree, Space } from 'tdesign-react';
import { Icon } from 'tdesign-icons-react';

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
  const load = (node) => {
    console.log('load', load);
    const maxLevel = 2;
    return new Promise((resolve) => {
      setTimeout(() => {
        let nodes = [];
        if (node.level < maxLevel) {
          nodes = [
            {
              label: `${node.label}.1`,
              children: node.level < maxLevel - 1,
            },
            {
              label: `${node.label}.2`,
              children: node.level < maxLevel - 1,
            },
          ];
        }
        resolve(nodes);
      }, 500);
    });
  };

  const renderIcon = (node) => {
    let name = 'file';
    if (node.getChildren()) {
      if (node.expanded) {
        name = 'folder-open';
        if (node.loading) {
          name = 'loading';
        }
      } else {
        name = 'folder';
      }
    }
    return <Icon name={name} />;
  };

  const renderIcon2 = (node) => {
    let name = 'attach';
    if (node.getChildren()) {
      if (!node.expanded) {
        name = 'caret-right';
      } else if (node.loading) {
        name = 'loading';
      } else {
        name = 'caret-down';
      }
    }
    return <Icon name={name} />;
  };

  return (
    <Space direction="vertical">
      <h3>render 1:</h3>
      <Tree data={items} hover expandAll load={load} icon={renderIcon} />
      <h3>render 2:</h3>
      <Tree data={items} hover lazy load={load} icon={renderIcon2} />
    </Space>
  );
};
