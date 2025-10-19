import React, { useState } from 'react';
import { Cascader } from 'tdesign-react';
import type { CascaderProps, CascaderValue } from 'tdesign-react';

const list = [];
for (let i = 1; i < 100; i++) {
  const children = [];
  for (let j = 1; j < 100; j++) {
    const child = [];
    for (let k = 1; k < 100; k++) {
      child.push({
        label: `子选项${i}.${j}.${k}`,
        value: `${i}.${j}.${k}`,
      });
    }
    children.push({
      label: `子选项${i}.${j}`,
      value: `${i}.${j}`,
      children: child,
    });
  }

  list.push({
    label: `选项${i}`,
    value: `${i}`,
    children,
  });
}

export default function Example() {
  const [value, setValue] = useState<CascaderValue>(['20.1.20']);
  const options = list;

  const onChange: CascaderProps['onChange'] = (value) => {
    setValue(value);
  };

  return (
    <div className="tdesign-demo-block-row">
      <Cascader
        options={options}
        onChange={onChange}
        value={value}
        multiple
        clearable
        scroll={{ type: 'virtual', bufferSize: 5, threshold: 10 }}
      />
    </div>
  );
}
