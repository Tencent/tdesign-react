import React, { useState } from 'react';

import { Select } from '@tencent/tdesign-react';

const { Option, OptionGroup } = Select;

const OptionGroupSelect = () => {
  const [value, setValue] = useState('apple');
  const onChange = (value) => {
    setValue(value);
  };

  const options1 = [
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

  const options2 = [
    {
      label: 'Potato',
      value: 'potato',
    },
    {
      label: 'Tomato',
      value: 'tomato',
    },
    {
      label: 'Cabbage',
      value: 'cabbage',
    },
  ];

  return (
    <Select value={value} change={onChange} style={{ width: '40%' }}>
      <OptionGroup label="Fruit">
        {options1.map((item, index) => (
          <Option label={item.label} value={item.value} key={index} />
        ))}
      </OptionGroup>
      <OptionGroup label="Vegetable">
        {options2.map((item, index) => (
          <Option label={item.label} value={item.value} key={index} />
        ))}
      </OptionGroup>
    </Select>
  );
};

export default OptionGroupSelect;
