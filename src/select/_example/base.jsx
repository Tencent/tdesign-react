import React, { useState } from 'react';

import { Select } from '@tencent/tdesign-react';

const { Option } = Select;

const SingleSelect = () => {
  const [value, setValue] = useState('apple');
  const onChange = (value) => {
    setValue(value);
  };
  return (
    <div style={{ display: 'flex' }}>
      <Select value={value} onChange={onChange} style={{ width: '40%' }}>
        <Option key="apple" label="Apple" value="apple" />
        <Option key="orange" label="Orange" value="orange" disabled />
        <Option key="banana" label="Banana" value="banana" />
      </Select>
      <Select value="apple" style={{ width: '40%', marginLeft: '10%' }} disabled>
        <Option key="apple" label="Apple" value="apple" />
      </Select>
    </div>
  );
};

export default SingleSelect;
