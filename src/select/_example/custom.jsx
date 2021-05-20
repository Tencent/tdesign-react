import React, { useState } from 'react';

import { Select } from '@tencent/tdesign-react';

const { Option } = Select;

const RemoteSearchSelect = () => {
  const defaultOptions = [
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
  ];
  const [value, setValue] = useState();
  const [loading, setLoading] = useState(false);
  const [options, setOptions] = useState(defaultOptions);

  const onChange = (value) => {
    setValue(value);
  };

  const handleRemoteSearch = (search) => {
    setLoading(true);
    setTimeout(() => {
      setLoading(false);
      let options = [];
      if (search) {
        options = [
          {
            value: `${search}_test1`,
            label: `${search}_test1`,
          },
          {
            value: `${search}_test2`,
            label: `${search}_test2`,
          },
          {
            value: `${search}_test3`,
            label: `${search}_test3`,
          },
        ];
      } else {
        options = defaultOptions;
      }
      console.log(options, 'options');
      setOptions(options);
    }, 300);
  };

  return (
    <Select
      filterable
      value={value}
      onChange={onChange}
      style={{ width: '40%' }}
      loading={loading}
      onSearch={handleRemoteSearch}
      options={options}
    />
  );
};

export default RemoteSearchSelect;
