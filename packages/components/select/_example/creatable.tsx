import React, { useState } from 'react';
import { Select, Space } from 'tdesign-react';

export default function SelectCreatable() {
  const [value, setValue] = useState('');
  const [multipleValue, setMultipleValue] = useState([]);
  const [options, changeOptions] = useState([
    { label: '选项一', value: '1' },
    { label: '选项二', value: '2' },
    { label: '选项三', value: '3' },
  ]);
  const onChange = (value: string) => {
    setValue(value);
  };
  const onMultipleChange = (value: string[]) => {
    setMultipleValue(value);
  };
  const handleOnCreate = (value: string) => {
    changeOptions(options.concat([{ value, label: value }]));
  };
  return (
    <Space breakLine style={{ width: '100%' }}>
      <Select
        value={value}
        onChange={onChange}
        style={{ width: '40%' }}
        options={options}
        filterable
        creatable
        onCreate={handleOnCreate}
      />
      <Select
        value={multipleValue}
        onChange={onMultipleChange}
        style={{ width: '40%' }}
        options={options}
        filterable
        creatable
        multiple
        onCreate={handleOnCreate}
      />
    </Space>
  );
}
