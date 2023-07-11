import React from 'react';
import { Tree } from 'tdesign-react';

const options = [];
for (let i = 0; i < 1000; i++) {
  options.push({
    label: `第${i + 1}`,
    children: [
      {
        label: `第${i + 1}段第1个子节点`,
      },
      {
        label: `第${i + 1}段第2个子节点`,
      },
    ],
  });
}

export default () => (
  <Tree data={options} activable hover transition scroll={{ type: 'virtual' }} style={{ height: '300px' }} />
);
