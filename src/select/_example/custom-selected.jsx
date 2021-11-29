import React, { useState } from 'react';

import { Select, Tag } from 'tdesign-react';

const CustomSelected = () => {
  const [value, setValue] = useState(['apple']);
  const onChange = (value) => {
    setValue(value);
  };
  return (
    <div style={{ display: 'flex' }}>
      <Select
        clearable
        multiple
        value={value}
        onChange={onChange}
        style={{ width: '40%' }}
        options={[
          {
            label: 'Apple',
            value: 'apple',
          },
          {
            label: 'Banana',
            value: 'banana',
          },
          {
            label: 'Orange',
            value: 'orange',
          },
        ]}
        valueDisplay={({ value }) =>
          value.length > 0 ? value.map((v, idx) => <Tag key={idx}>{`${v}选项`}</Tag>) : null
        }
      />
    </div>
  );
};

export default CustomSelected;
