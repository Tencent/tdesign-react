import React, { useState } from 'react';
import { Select } from 'tdesign-react';

import type { SelectProps } from 'tdesign-react';

const options: SelectProps['options'] = [];
for (let i = 0; i < 100; i++) {
  options.push({ label: `第 ${i} 项`, value: i });
}

const SingleSelect = () => {
  const [value, setValue] = useState(50);

  const onChange = (value: number) => {
    setValue(value);
  };

  return <Select options={options} defaultValue={value} onChange={onChange} style={{ width: 200 }}></Select>;
};

export default SingleSelect;
