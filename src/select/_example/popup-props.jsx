import React, { useState } from 'react';
import { Select } from 'tdesign-react';

const SelectPopupProps = () => {
  const [value, setValue] = useState('1');
  const onChange = (value) => {
    setValue(value);
  };
  return (
    <Select
      value={value}
      onChange={onChange}
      style={{ width: '40%' }}
      popupProps={{ overlayStyle: { width: '600px' } }}
      options={[
        {
          label: '已选择的选项',
          value: '1',
        },
        {
          label: '短的选项二',
          value: '2',
        },
      ]}
    ></Select>
  );
};

export default SelectPopupProps;
