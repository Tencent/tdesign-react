import React, { useState } from 'react';

import { Select } from 'tdesign-react';

const { Option } = Select;

const SelectMax = () => {
  const [value, setValue] = useState(['apple']);
  const onChange = (value) => {
    setValue(value);
  };
  return (
    <Select value={value} onChange={onChange} multiple style={{ width: '40%' }} max={2}>
      <Option key="apple" label="Apple" value="apple" />
      <Option key="orange" label="Orange" value="orange" />
      <Option key="banana" label="Banana" value="banana" />
    </Select>
  );
};

export default SelectMax;
