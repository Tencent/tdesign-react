import React, { useState } from 'react';
import { Select } from 'tdesign-react';
import { BrowseIcon } from 'tdesign-icons-react';

const SelectPrefix = () => {
  const [value, setValue] = useState('');
  const onChange = (value) => {
    setValue(value);
  };
  return (
    <Select
      value={value}
      onChange={onChange}
      style={{ width: '40%' }}
      prefixIcon={<BrowseIcon style={{ marginRight: '8px' }} />}
      options={[
        { label: '选项一', value: '1' },
        { label: '选项二', value: '2' },
        { label: '选项三', value: '3' },
      ]}
    />
  );
};

export default SelectPrefix;
