import React, { useState } from 'react';

import { Select, Space } from 'tdesign-react';

const { Option } = Select;

const FilterableSelect = () => {
  const [value, setValue] = useState('');
  const [value2, setValue2] = useState(['1']);

  const onChange = (value) => {
    setValue(value);
  };

  const onMultipleChange = (value) => {
    setValue2(value);
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

  const handleBlur = (value, e) => {
    console.log('handleBlur: ', value, e);
  };

  const handleFocus = (value, e) => {
    console.log('handleFocus: ', value, e);
  };

  const handleEnter = (context) => {
    console.log('handleEnter: ', context);
  };

  return (
    <Space breakLine style={{ width: '100%' }}>
      <Select
        value={value}
        onChange={onChange}
        placeholder="-请选择-"
        filterable
        style={{ width: '400px', display: 'inline-block' }}
        onBlur={handleBlur}
        onFocus={handleFocus}
        onEnter={handleEnter}
      >
        {options.map((option, index) => (
          <Option key={index} value={option.value} label={option.label}></Option>
        ))}
      </Select>
      <Select
        value={value2}
        onChange={onMultipleChange}
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
