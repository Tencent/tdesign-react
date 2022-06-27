import React, { useState } from 'react';
import { Select } from 'tdesign-react';

const { Option } = Select;

export default function SingleSelect() {
  const [value, setValue] = useState('apple');
  const onChange = (value) => {
    setValue(value);
  };

  return (
    <Select value={value} onChange={onChange} style={{ width: '40%' }} clearable>
      <Option key="apple" label="Apple" value="apple" />
      <Option key="orange" value="orange">
        Orange
      </Option>
      <Option key="banana" label="Banana" value="banana" />
    </Select>
  );
}
