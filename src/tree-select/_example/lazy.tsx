import React, { useState } from 'react';
import { TreeSelect } from 'tdesign-react';

import type { TreeSelectProps } from 'tdesign-react';

const options: TreeSelectProps['data'] = [
  {
    label: '1',
    value: '1',
    children: true,
  },
  {
    label: '2',
    value: '2',
    children: true,
  },
];

export default function Example() {
  const [value, setValue] = useState('');

  const loadFunc: TreeSelectProps<{ label: string; value: string; children: boolean }>['treeProps']['load'] = (node) =>
    new Promise((resolve) => {
      setTimeout(() => {
        let nodes: any = [];
        if (node.getLevel() < 2) {
          nodes = [
            {
              label: `${node.label}.1`,
              value: `${node.value}.1`,
              children: true,
            },
            {
              label: `${node.label}.2`,
              value: `${node.value}.2`,
              children: true,
            },
          ];
        }
        resolve(nodes);
      }, 2000);
    });

  return (
    <div style={{ width: 300 }}>
      <TreeSelect
        data={options}
        clearable
        placeholder="请选择"
        value={value}
        treeProps={{ load: loadFunc, lazy: true }}
        onChange={(val: string) => {
          setValue(val);
          console.log(val);
        }}
      />
    </div>
  );
}
