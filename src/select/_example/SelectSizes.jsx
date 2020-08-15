import React, { useState } from 'react';

import { Select } from '@tdesign/react';

const { Option } = Select;

const SelectSizes = () => {
  const [value1, setValue1] = useState('apple');
  const onChangeValue1 = (value) => {
    setValue1(value);
  };
  const [value2, setValue2] = useState('apple');
  const onChangeValue2 = (value) => {
    setValue2(value);
  };
  const [value3, setValue3] = useState('apple');
  const onChangeValue3 = (value) => {
    setValue3(value);
  };
  return (
    <div>
      <div style={{ display: 'flex' }}>
        <h4 style={{ width: '80px' }}>Small</h4>
        <Select value={value1} change={onChangeValue1} size="small" style={{ width: '30%' }}>
          <Option key="apple" label="Apple" value="apple" />
          <Option key="orange" label="Orange" value="orange" />
          <Option key="banana" label="Banana" value="banana" />
        </Select>
      </div>
      <div style={{ display: 'flex' }}>
        <h4 style={{ width: '80px' }}>Default</h4>
        <Select value={value2} change={onChangeValue2} style={{ width: '30%' }}>
          <Option key="apple" label="Apple" value="apple" />
          <Option key="orange" label="Orange" value="orange" />
          <Option key="banana" label="Banana" value="banana" />
        </Select>
      </div>
      <div style={{ display: 'flex' }}>
        <h4 style={{ width: '80px' }}>Large</h4>
        <Select value={value3} change={onChangeValue3} size="large" style={{ width: '30%' }}>
          <Option key="apple" label="Apple" value="apple" />
          <Option key="orange" label="Orange" value="orange" />
          <Option key="banana" label="Banana" value="banana" />
        </Select>
      </div>
    </div>
  );
};

export default SelectSizes;
