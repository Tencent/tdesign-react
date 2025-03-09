import React, { useState } from 'react';
import { Cascader, Space } from 'tdesign-react';
import type { CascaderProps, CascaderValue } from 'tdesign-react';

import type { TreeOptionData } from '../../common';

export default function Example() {
  const [singleValue, setSingleValue] = useState<CascaderValue>('');
  const [multipleValue, setMultipleValue] = useState<CascaderValue>([]);

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

  const onSingleChange: CascaderProps['onChange'] = (value) => {
    setSingleValue(value);
  };

  const onMultipleChange: CascaderProps['onChange'] = (value) => {
    setMultipleValue(value);
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
      }, 300);
    });

  return (
    <Space direction="vertical">
      <Cascader options={options} value={singleValue} onChange={onSingleChange} load={load} />
      <Cascader multiple options={options} value={multipleValue} onChange={onMultipleChange} load={load} />
    </Space>
  );
}
