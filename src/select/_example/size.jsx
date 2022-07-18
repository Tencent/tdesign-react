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
        <Option key="1" label="选项一" value="1" />
        <Option key="2" label="选项二" value="2" />
        <Option key="3" label="选项三" value="3" />
      </Select>

      <Select value={value2} onChange={onChangeValue2}>
        <Option key="1" label="选项一" value="1" />
        <Option key="2" label="选项二" value="2" />
        <Option key="3" label="选项三" value="3" />
      </Select>

      <Select value={value3} onChange={onChangeValue3} size="large">
        <Option key="1" label="选项一" value="1" />
        <Option key="2" label="选项二" value="2" />
        <Option key="3" label="选项三" value="3" />
      </Select>
    </Space>
  );
};

export default SelectSizes;
