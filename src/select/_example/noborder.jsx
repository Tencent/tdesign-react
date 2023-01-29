import React, { useState } from 'react';

import { Select } from 'tdesign-react';

const SelectNoborder = () => {
  const [value, setValue] = useState('1');
  const onChange = (value) => {
    setValue(value);
  };
  return (
    <Select
      value={value}
      onChange={onChange}
      borderless
      clearable={true}
      style={{ width: '40%' }}
      options={[
        {
          label: '已选择的选项',
          value: '1',
        },
        {
          label: '短的选项二',
          value: '2',
        },
        {
          label: '选项内容过长的选择器选项',
          value: '3',
        },
      ]}
    ></Select>
  );
};

export default SelectNoborder;
