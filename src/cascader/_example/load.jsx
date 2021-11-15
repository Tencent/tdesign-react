import React, { useState } from 'react';
import { Cascader } from 'tdesign-react';

export default function Example() {
  const [value1, setValue1] = useState([]);
  const options = [
    {
      label: '上海',
      value: '1',
      children: true,
    },
    {
      label: '深圳',
      value: '2',
      children: true,
    },
  ];

  const itemStyle = {
    marginTop: '16px',
  };

  const onChange1 = (value) => {
    setValue1(value);
  };

  const load = (node) =>
    new Promise((resolve) => {
      setTimeout(() => {
        let nodes = [];
        if (node.level < 3) {
          nodes = [
            {
              label: `${node.label}.1`,
              children: node.level < 2,
            },
            {
              label: `${node.label}.2`,
              children: node.level < 2,
            },
          ];
        }
        resolve(nodes);
      }, 1000);
    });

  return (
    <div className="tdesign-demo-block-column">
      <Cascader style={itemStyle} options={options} value={value1} onChange={onChange1} load={load} />
    </div>
  );
}
