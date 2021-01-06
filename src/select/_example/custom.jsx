import React, { useState } from 'react';

import { Select, Icon } from '@tencent/tdesign-react';

const { Option } = Select;

const PrefixIconSelect = () => {
  const [value, setValue] = useState('apple');
  const onChange = (value) => {
    setValue(value);
  };
  return (
    <Select value={value} onChange={onChange} style={{ width: '40%' }} prefixIcon={() => <Icon name="desktop" />}>
      <Option key="apple" label="apple" value="apple">
        apple
      </Option>
      <Option key="orange" label="Orange" value="orange" disabled>
        Orange
      </Option>
      <Option key="banana" label="Banana" value="banana">
        Banana
      </Option>
    </Select>
  );
};

export default PrefixIconSelect;
