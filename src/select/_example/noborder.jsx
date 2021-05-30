import React, { useState } from 'react';

import { Select } from '@tencent/tdesign-react';

const { Option } = Select;

const SelectNoborder = () => {
  const [value, setValue] = useState('apple');
  const onChange = (value) => {
    setValue(value);
  };
  return (
    <Select value={value} onChange={onChange} bordered={false} clearable style={{ width: '40%' }}>
      <Option key="apple" label="Apple" value="apple" />
      <Option key="orange" label="Orange" value="orange" />
      <Option key="banana" label="Banana" value="banana" />
    </Select>
  );
};

export default SelectNoborder;
