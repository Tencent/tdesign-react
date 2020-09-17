import React, { useState } from 'react';

import { Select, Icon } from '@tdesign/react';

const { Option } = Select;

const PrefixIconSelect = () => {
  const [value, setValue] = useState('apple');
  const onChange = (value) => {
    setValue(value);
  };
  return (
    <Select
      value={value}
      change={onChange}
      style={{ width: '40%' }}
      prefixIcon={() => <Icon name="github" />}
    >
      <Option key="apple" label="Apple" value="apple" />
      <Option key="orange" label="Orange" value="orange" disabled />
      <Option key="banana" label="Banana" value="banana" />
    </Select>
  );
};

export default PrefixIconSelect;
