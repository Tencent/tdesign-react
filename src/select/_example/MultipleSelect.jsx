import React, { useState } from 'react';

import { Select } from '@tdesign/react';

const { Option } = Select;

const MultipleSelect = () => {
  const [value, setValue] = useState([{ label: 'Apple', value: 'apple' }]);
  const onChange = (value) => {
    setValue(value);
  };
  return (
    <Select value={value} change={onChange} multiple>
      <Option key="apple" label="Apple" value="apple" />
      <Option key="orange" label="Orange" value="orange" disabled />
      <Option key="banana" label="Banana" value="banana" />
    </Select>
  );
};

export default MultipleSelect;
