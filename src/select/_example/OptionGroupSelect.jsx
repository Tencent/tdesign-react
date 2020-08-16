import React, { useState } from 'react';

import { Select } from '@tdesign/react';

const OptionGroupSelect = () => {
  const [value, setValue] = useState({ label: 'Apple', value: 'apple' });
  const onChange = (value) => {
    setValue(value);
  };

  const optionGroup = [
    {
      label: 'Fruit',
      options: [
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
      ],
    },
    {
      label: 'Vegetable',
      options: [
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
      ],
    },
  ];

  return <Select value={value} change={onChange} optionGroup={optionGroup} />;
};

export default OptionGroupSelect;
