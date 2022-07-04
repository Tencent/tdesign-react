import React, { useState } from 'react';
import { Select, Tag } from 'tdesign-react';

const CustomSelected = () => {
  const [value, setValue] = useState(['1', '2', '3']);
  const onChange = (value) => {
    setValue(value);
  };
  return (
    <Select
      clearable
      multiple
      value={value}
      onChange={onChange}
      style={{ width: '400px' }}
      options={[
        { label: '选项一', value: '1' },
        { label: '选项二', value: '2' },
        { label: '选项三', value: '3' },
        { label: '选项四', value: '4' },
        { label: '选项五', value: '5' },
        { label: '选项六', value: '6' },
        { label: '选项七', value: '7' },
        { label: '选项八', value: '8' },
        { label: '选项九', value: '9' },
      ]}
      valueDisplay={({ value }) => (value.length > 0 ? value.map((v, idx) => <Tag key={idx}>{`${v}选项`}</Tag>) : null)}
    />
  );
};

export default CustomSelected;
