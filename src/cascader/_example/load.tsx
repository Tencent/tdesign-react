import React, { useState } from 'react';
import { Cascader, type CascaderProps, type CascaderValue } from 'tdesign-react';
import type { TreeOptionData } from '../../common';

export default function Example() {
  const [value1, setValue1] = useState<CascaderValue>([]);
  const options = [
    {
      label: '选项1',
      value: '1',
      children: true,
    },
    {
      label: '选项2',
      value: '2',
      children: true,
    },
  ];

  const onChange1: CascaderProps['onChange'] = (value) => {
    setValue1(value);
  };

  const load: CascaderProps['load'] = (node) =>
    new Promise((resolve) => {
      setTimeout(() => {
        let nodes: TreeOptionData[] = [];
        if (node.getLevel() < 3) {
          nodes = [
            {
              label: `${node.label}.1`,
              children: node.getLevel() < 2,
            },
            {
              label: `${node.label}.2`,
              children: node.getLevel() < 2,
            },
          ];
        }
        resolve(nodes);
      }, 1000);
    });

  return <Cascader options={options} value={value1} onChange={onChange1} load={load} />;
}
