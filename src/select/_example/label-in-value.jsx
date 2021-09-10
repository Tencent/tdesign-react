import React, { useState } from 'react';

import { Select } from '@tencent/tdesign-react';

const { Option } = Select;

const LabelInValueSelect = () => {
  const [value, setValue] = useState({ label: 'Apple', value: 'apple' });
  const onChange = (value) => {
    console.log('Value', value);
    setValue(value);
  };
  const [value2, setValue2] = useState(['apple']);
  const onChange2 = (value) => {
    console.log('Value', value);
    setValue2(value);
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

export default LabelInValueSelect;
