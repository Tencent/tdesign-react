import React, { useState } from 'react';
import { Select } from 'tdesign-react';

export default function SelectCreatable() {
  const [value, setValue] = useState('');
  const [options, changeOptions] = useState([
    { label: '选项一', value: '1' },
    { label: '选项二', value: '2' },
    { label: '选项三', value: '3' },
  ]);
  const onChange = (value) => {
    setValue(value);
  };
  const handleOnCreate = (value) => {
    changeOptions(options.concat([{ value, label: value }]));
  };
  return (
    <Select
      value={value}
      onChange={onChange}
      style={{ width: '40%' }}
      options={options}
      filterable
      creatable
      onCreate={handleOnCreate}
    />
  );
}
