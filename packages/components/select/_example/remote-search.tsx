import React, { useState } from 'react';
import { Select } from 'tdesign-react';

const RemoteSearchSelect = () => {
  const [value, setValue] = useState('');

  const [loading, setLoading] = useState(false);
  const [options, setOptions] = useState([]);

  const onChange = (value: string) => {
    setValue(value);
  };

  const handleRemoteSearch = (search: string) => {
    setLoading(true);

    setTimeout(() => {
      setLoading(false);
      let options = [];
      if (search) {
        options = [
          {
            value: `腾讯_test1`,
            label: `腾讯_test1`,
          },
          {
            value: `腾讯_test2`,
            label: `腾讯_test2`,
          },
          {
            value: `腾讯_test3`,
            label: `腾讯_test3`,
          },
        ].filter((item) => item.label.includes(search));
      }

      setOptions(options);
    }, 500);
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
