import React, { useState } from 'react';

import { Select } from '@tencent/tdesign-react';

const MultipleSelect = () => {
  const [value, setValue] = useState([{ label: 'Apple', value: 'apple' }]);
  const onChange = (value) => {
    setValue(value);
  };
  return (
    <Select
      value={value}
      onChange={onChange}
      multiple
      style={{ width: '40%' }}
      valueType="object"
      options={[
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
      ]}
    />
  );
};

export default MultipleSelect;
