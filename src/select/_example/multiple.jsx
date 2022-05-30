import React, { useState } from 'react';

import { Select } from 'tdesign-react';

const MultipleSelect = () => {
  const [value, setValue] = useState(['apple', 'banana', 'orange', 'lemon']);
  const onChange = (value) => {
    setValue(value);
  };
  return (
    <Select
      className="select-multiple-demo"
      value={value}
      onChange={onChange}
      filterable
      multiple
      style={{ width: '40%' }}
      options={[
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
        {
          label: 'Lemon',
          value: 'lemon',
          disabled: true,
        },
      ]}
    />
  );
};

export default MultipleSelect;
