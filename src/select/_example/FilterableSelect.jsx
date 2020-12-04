import React, { useState } from 'react';

import { Select } from '@tencent/tdesign-react';

const { Option } = Select;

const FilterableSelect = () => {
  const [value, setValue] = useState();

  const onChange = (value) => {
    setValue(value);
  };

  const options = [
    {
      label: 'Apple',
      value: 'apple',
    },
    {
      label: 'Banana',
      value: 'banana',
    },
    {
      label: 'Orange',
      value: 'orange',
    },
  ];

  const handleFilter = () => {
    console.log('Filter');
  };

  return (
    <Select filterable value={value} change={onChange} style={{ width: '40%' }} filterMethod={handleFilter}>
      {options.map((item, index) => (
        <Option key={index} label={item.label} value={item.value} />
      ))}
    </Select>
  );
};

export default FilterableSelect;
