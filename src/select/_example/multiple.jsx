import React, { useState } from 'react';

import { Select } from 'tdesign-react';

const MultipleSelect = () => {
  const [value, setValue] = useState(['banana']);
  const onChange = (value) => {
    setValue(value);
  };
  return (
    <Select
      value={value}
      onChange={onChange}
      multiple
      style={{ width: '40%' }}
      options={[
        {
          label: 'Apple',
          value: 'apple',
          disabled: true,
        },
        {
          label: 'Banana',
          value: 'banana',
        },
        {
          label: 'Orange',
          value: 'orange',
        },
      ]}
    />
  );
};

export default MultipleSelect;
