import React, { useState } from 'react';
import { Select, Space } from 'tdesign-react';

const { Option } = Select;

const SelectSizes = () => {
  const [value1, setValue1] = useState('');
  const onChangeValue1 = (value) => {
    setValue1(value);
  };
  const [value2, setValue2] = useState('');
  const onChangeValue2 = (value) => {
    setValue2(value);
  };
  const [value3, setValue3] = useState('');
  const onChangeValue3 = (value) => {
    setValue3(value);
  };
  return (
    <Space breakLine>
      <Select value={value1} onChange={onChangeValue1} size="small">
        <Option key="apple" label="Apple" value="apple" />
        <Option key="orange" label="Orange" value="orange" />
        <Option key="banana" label="Banana" value="banana" />
      </Select>

      <Select value={value2} onChange={onChangeValue2}>
        <Option key="apple" label="Apple" value="apple" />
        <Option key="orange" label="Orange" value="orange" />
        <Option key="banana" label="Banana" value="banana" />
      </Select>

      <Select value={value3} onChange={onChangeValue3} size="large">
        <Option key="apple" label="Apple" value="apple" />
        <Option key="orange" label="Orange" value="orange" />
        <Option key="banana" label="Banana" value="banana" />
      </Select>
    </Space>
  );
};

export default SelectSizes;
