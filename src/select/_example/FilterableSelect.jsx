import React, { useState } from 'react';

import { Select } from '@tdesign/react';

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
    <Select
      filterable
      value={value}
      change={onChange}
      style={{ width: '40%' }}
      options={options}
      filterMethod={handleFilter}
    />
  );
};

export default FilterableSelect;
