import React, { useState } from 'react';

import { Select } from '@tdesign/react';

const { Option } = Select;

const SelectSizes = () => {
  const [value, setValue] = useState('apple');
  const onChange = (value) => {
    setValue(value);
  };
  return (
    <div>
      <div style={{ display: 'flex' }}>
        <h4 style={{ width: '80px' }}>Small</h4>
        <Select value={value} change={onChange} size="small" style={{ width: '30%' }}>
          <Option key="apple" label="Apple" value="apple" />
          <Option key="orange" label="Orange" value="orange" />
          <Option key="banana" label="Banana" value="banana" />
        </Select>
      </div>
      <div style={{ display: 'flex' }}>
        <h4 style={{ width: '80px' }}>Default</h4>
        <Select value={value} change={onChange} style={{ width: '30%' }}>
          <Option key="apple" label="Apple" value="apple" />
          <Option key="orange" label="Orange" value="orange" />
          <Option key="banana" label="Banana" value="banana" />
        </Select>
      </div>
      <div style={{ display: 'flex' }}>
        <h4 style={{ width: '80px' }}>Large</h4>
        <Select value={value} change={onChange} size="large" style={{ width: '30%' }}>
          <Option key="apple" label="Apple" value="apple" />
          <Option key="orange" label="Orange" value="orange" />
          <Option key="banana" label="Banana" value="banana" />
        </Select>
      </div>
    </div>
  );
};

export default SelectSizes;
