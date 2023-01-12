import React, { useState } from 'react';

import { Select, Space } from 'tdesign-react';

const options = [
  { label: '选项一', value: '1' },
  { label: '选项二', value: '2' },
  { label: '选项三', value: '3' },
];

const MultipleSelect = () => {
  const [value, setValue] = useState(['1', '3']);
  const onChange = (value) => {
    setValue(value);
  };
  return (
    <Space breakLine style={{ width: '100%' }}>
      <Select
        value={value}
        onChange={onChange}
        multiple
        style={{ width: '40%' }}
        options={options}
        minCollapsedNum={1}
      />
      <Select
        value={value}
        onChange={onChange}
        multiple
        style={{ width: '40%' }}
        options={options}
        minCollapsedNum={1}
        collapsedItems={({ count }) => (count > 0 ? <span style={{ color: '#ED7B2F' }}>+{count}</span> : null)}
      />
    </Space>
  );
};

export default MultipleSelect;
