import React, { useState } from 'react';

import { Select } from '@tdesign/react';

const { Option } = Select;

const LabelInValueSelect = () => {
  const [value, setValue] = useState({ label: 'Apple', value: 'apple' });
  const onChange = (value) => {
    console.log('Value', value);
    setValue(value);
  };
  const [value2, setValue2] = useState([{ label: 'Apple', value: 'apple' }]);
  const onChange2 = (value) => {
    console.log('Value', value);
    setValue2(value);
  };

  return (
    <div style={{ display: 'flex' }}>
      <Select value={value} change={onChange} style={{ width: '40%' }} labelInValue>
        <Option key="apple" label="Apple" value="apple" />
        <Option key="orange" label="Orange" value="orange" disabled />
        <Option key="banana" label="Banana" value="banana" />
      </Select>
      <Select
        value={value2}
        change={onChange2}
        multiple
        style={{ width: '40%', marginLeft: '10%' }}
        labelInValue
      >
        <Option key="apple" label="Apple" value="apple" />
        <Option key="orange" label="Orange" value="orange" />
        <Option key="banana" label="Banana" value="banana" />
      </Select>
    </div>
  );
};

export default LabelInValueSelect;
