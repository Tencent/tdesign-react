import React, { useState } from 'react';

import { Select } from '@tdesign/react';

const SelectWithOptions = () => {
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
    },
    {
      label: 'Orange',
      value: 'orange',
    },
  ];
  return <Select value={value} change={onChange} style={{ width: '40%' }} options={options} />;
};

export default SelectWithOptions;
