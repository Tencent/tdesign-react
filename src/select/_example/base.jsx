import React, { useState } from 'react';

import { Select } from '@tencent/tdesign-react';

const { Option } = Select;

const SingleSelect = () => {
  const [value, setValue] = useState('apple');
  const onChange = (value) => {
    setValue(value);
  };
  return (
    <Select
      value={['2']}
      multiple
      keys={{
        label: 'displayName',
        value: 'name',
      }}
      placeholder="选择服务"
      options={[
        { displayName: '1', name: '2' },
        { displayName: 'h', name: '24' },
        { displayName: '3', name: '25' },
      ]}
    />
  );
};

export default SingleSelect;
