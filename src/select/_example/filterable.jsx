import React, { useState } from 'react';

import { Select } from 'tdesign-react';

const FilterableSelect = () => {
  const [value, setValue] = useState('apple');

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
      disabled: true,
    },
    {
      label: 'Orange',
      value: 'orange',
    },
  ];
  return <Select filterable value={value} onChange={onChange} style={{ width: '40%' }} options={options} />;
};

export default FilterableSelect;
