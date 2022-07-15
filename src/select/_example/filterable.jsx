import React, { useState } from 'react';

import { Select, Space } from 'tdesign-react';

const FilterableSelect = () => {
  const [value, setValue] = useState('');
  const [value2, setValue2] = useState(['1']);

  const onChange = (value) => {
    setValue(value);
  };

  const options = [
    { label: '选项一', value: '1' },
    { label: '选项二', value: '2' },
    { label: '选项三', value: '3' },
  ];

  const filterMethod = (search, option) => {
    console.log('search:', search, ', option:', option);
    return option.label.indexOf(search) !== -1;
  };

  const handleBlur = ({ value, e }) => {
    console.log('handleBlur: ', value, e);
  };

  const handleFocus = ({ value, e }) => {
    console.log('handleFocus: ', value, e);
  };

  return (
    <Space breakLine style={{ width: '100%' }}>
      <Select
        value={value}
        onChange={onChange}
        placeholder="-请选择-"
        options={options}
        filterable
        style={{ width: '400px', display: 'inline-block' }}
        onBlur={handleBlur}
        onFocus={handleFocus}
      />
      <Select
        value={value2}
        onChange={setValue2}
        multiple
        placeholder="-请选择-"
        options={options}
        filterable
        filter={filterMethod}
        style={{ width: '400px', display: 'inline-block' }}
        onBlur={handleBlur}
        onFocus={handleFocus}
      />
    </Space>
  );
};

export default FilterableSelect;
