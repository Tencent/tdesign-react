import React, { useState } from 'react';
import { Select, Space } from 'tdesign-react';

const { Option, OptionGroup } = Select;

const OptionGroupSelect = () => {
  const [value, setValue] = useState('');
  const [value2, setValue2] = useState([1]);

  const onChange = (value: string) => {
    setValue(value);
  };

  const onChange2 = (value: number[]) => {
    setValue2(value);
  };
  const options1 = [
    { label: '选项一', value: 1 },
    { label: '选项二', value: 2 },
  ];

  const options2 = [
    { label: '选项三', value: 4 },
    { label: '选项四', value: 5 },
    { label: '选项五', value: 6 },
  ];

  const options3 = [
    { label: '选项六', value: 7 },
    { label: '选项七', value: 8 },
    { label: '选项八', value: 9 },
  ];

  const groupOptions = [
    {
      group: '分组一',
      children: options1,
    },
    {
      group: '分组二',
      children: options2,
    },
    {
      group: '分组三',
      divider: true,
      children: options3,
    },
  ];

  return (
    <Space breakLine style={{ width: '100%' }}>
      <Select value={value} onChange={onChange} style={{ width: '40%' }} options={groupOptions} filterable />
      <Select value={value2} onChange={onChange2} style={{ width: '40%' }} multiple filterable>
        <Option value="all" label="全选" checkAll></Option>
        <OptionGroup label="分组一" divider={true}>
          {options1.map((item, index) => (
            <Option label={item.label} value={item.value} key={index} />
          ))}
        </OptionGroup>
        <OptionGroup label="分组二" divider={true}>
          {options2.map((item, index) => (
            <Option label={item.label} value={item.value} key={index} />
          ))}
        </OptionGroup>
        <OptionGroup label="分组三" divider={true}>
          {options3.map((item, index) => (
            <Option label={item.label} value={item.value} key={index} />
          ))}
        </OptionGroup>
      </Select>
    </Space>
  );
};

export default OptionGroupSelect;
