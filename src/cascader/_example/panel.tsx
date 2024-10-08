import React, { useState } from 'react';
import { CascaderPanel, Space } from 'tdesign-react';
import type { CascaderProps, CascaderValue } from 'tdesign-react';

export default function Example() {
  const [value1, setValue1] = useState<CascaderValue>('');
  const [value2, setValue2] = useState<CascaderValue>([]);
  const options = [
    {
      label: '选项一',
      value: '1',
      children: [
        {
          label: '子选项一',
          value: '1.1',
        },
        {
          label: '子选项二',
          value: '1.2',
        },
        {
          label: '子选项三',
          value: '1.3',
        },
      ],
    },
    {
      label: '选项二',
      value: '2',
      children: [
        {
          label: '子选项一',
          value: '2.1',
        },
        {
          label: '子选项二',
          value: '2.2',
        },
      ],
    },
  ];

  const onChange1: CascaderProps['onChange'] = (value) => {
    setValue1(value);
  };
  const onChange2: CascaderProps['onChange'] = (value) => {
    setValue2(value);
  };

  const style = {
    border: '1px solid #eee',
    width: '100%',
  };

  return (
    <Space direction="vertical">
      <div style={style}>
        <CascaderPanel options={options} value={value1} showAllLevels={false} onChange={onChange1} />
      </div>
      <div style={style}>
        <CascaderPanel options={options} value={value2} showAllLevels={false} multiple onChange={onChange2} />
      </div>
    </Space>
  );
}
