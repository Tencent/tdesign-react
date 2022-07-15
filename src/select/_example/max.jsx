import React, { useState } from 'react';
import { Select } from 'tdesign-react';

const { Option } = Select;

const SelectMax = () => {
  const [value, setValue] = useState(['1']);
  const onChange = (value) => {
    setValue(value);
  };
  return (
    <Select value={value} onChange={onChange} multiple style={{ width: '40%' }} max={2}>
      <Option key="1" label="选项一" value="1" />
      <Option key="2" label="选项二" value="2" />
      <Option key="3" label="选项三" value="3" />
    </Select>
  );
};

export default SelectMax;
