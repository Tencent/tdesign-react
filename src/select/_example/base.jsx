import React, { useState } from 'react';
import { Select } from 'tdesign-react';

export default function SingleSelect() {
  const [value, setValue] = useState('');
  const onChange = (value) => {
    setValue(value);
  };

  return (
    <Select
      value={value}
      onChange={onChange}
      style={{ width: '40%' }}
      clearable
      options={[
        { label: '架构云', value: '1' },
        { label: '大数据', value: '2' },
        { label: '区块链', value: '3' },
        { label: '物联网', value: '4', disabled: true },
        { label: '人工智能', value: '5', content: <span>人工智能（新）</span> },
      ]}
    ></Select>
  );
}
