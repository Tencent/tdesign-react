import React, { useState } from 'react';
import { Select } from 'tdesign-react';

const SelectCustomKeys = () => {
  const [value, setValue] = useState('1');
  const [value2, setValue2] = useState(['shanghai']);

  const onChange = (value) => {
    setValue(value);
  };

  const onChange2 = (value) => {
    setValue2(value);
  };

  const options = [
    {
      text: '已选择的选项',
      data: '1',
    },
    {
      text: '短的选项二',
      data: '2',
    },
    {
      text: '很长很长很长的选项三',
      data: '3',
    },
  ];

  const deepOptions = [
    {
      city: {
        id: 'shanghai',
        name: '上海',
      },
    },
    {
      city: {
        id: 'shenzhen',
        name: '深圳',
      },
    },
    {
      city: {
        id: 'guangzhou',
        name: '广州',
      },
      disabled: true,
    },
  ];
  return (
    <>
      <Select
        value={value}
        onChange={onChange}
        style={{ width: '200px', display: 'inline-block', marginRight: '20px' }}
        options={options}
        keys={{ value: 'data', label: 'text' }}
      />
      <Select
        value={value2}
        onChange={onChange2}
        multiple
        style={{ width: '200px', display: 'inline-block' }}
        options={deepOptions}
        keys={{ value: 'city.id', label: 'city.name' }}
      />
    </>
  );
};

export default SelectCustomKeys;
