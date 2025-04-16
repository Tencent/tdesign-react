import React, { useState } from 'react';
import { Select, Space } from 'tdesign-react';

const RemoteSearchSelect = () => {
  const [value, setValue] = useState('');
  const [loading, setLoading] = useState(false);
  const [options, setOptions] = useState([]);

  const [multipleValue, setMultipleValue] = useState([]);
  const [multipleLoading, setMultipleLoading] = useState(false);
  const [multipleOptions, setMultipleOptions] = useState([]);

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

  const handleMultipleRemoteSearch = (search: string) => {
    setMultipleLoading(true);

    setTimeout(() => {
      setMultipleLoading(false);
      if (search) {
        const remoteOptions = [
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
          {
            value: `腾讯_test1_1`,
            label: `腾讯_test1_1`,
          },
          {
            value: `腾讯_test2_2`,
            label: `腾讯_test2_2`,
          },
          {
            value: `腾讯_test3_3`,
            label: `腾讯_test3_3`,
          },
        ].filter((item) => item.label.includes(search));

        const mergedOptions = [...remoteOptions, ...multipleValue];
        const multipleOptions = Array.from(new Map(mergedOptions.map((item) => [item.value, item])).values());

        setMultipleOptions(multipleOptions);
      } else {
        setMultipleOptions(multipleValue);
      }
    }, 500);
  };

  const onMultipleChange = (value: string[]) => {
    setMultipleValue(value);
  };

  return (
    <Space direction="vertical" style={{ width: 350 }}>
      <Select
        value={value}
        filterable
        placeholder="请选择"
        loading={loading}
        options={options}
        onSearch={handleRemoteSearch}
        onChange={onChange}
      />

      <Select
        value={multipleValue}
        valueType="object"
        filterable
        placeholder="请选择"
        loading={multipleLoading}
        options={multipleOptions}
        onSearch={handleMultipleRemoteSearch}
        onChange={onMultipleChange}
        multiple
        reserveKeyword
      />
    </Space>
  );
};

export default RemoteSearchSelect;
