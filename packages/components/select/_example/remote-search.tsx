import React, { useEffect, useState } from 'react';
import { Select, Space } from 'tdesign-react';

const OPTIONS = Array.from({ length: 20 }).map((_, i) => ({
  value: `t${i + 1}`,
  label: `Tencent_${i + 1}`,
}));

const RemoteSearchSelect = () => {
  const [singleLoading, setSingleLoading] = useState(false);
  const [singleOptions, setSingleOptions] = useState([]);
  const [singleValue, setSingleValue] = useState('');

  const [multipleLoading, setMultipleLoading] = useState(false);
  const [multipleOptions, setMultipleOptions] = useState([]);
  const [multipleValue, setMultipleValue] = useState([]);

  useEffect(() => {
    setSingleLoading(true);
    setMultipleLoading(true);

    setTimeout(() => {
      setSingleOptions(OPTIONS);
      setSingleLoading(false);
      setSingleValue(OPTIONS[0].value);
      setMultipleOptions(OPTIONS);
      setMultipleLoading(false);
      setMultipleValue([OPTIONS[0].value, OPTIONS[1].value]);
    }, 500);
  }, []);

  const handleSingle = (search: string) => {
    setSingleLoading(true);
    setTimeout(() => {
      const filtered = OPTIONS.filter((item) => item.label.includes(search));
      setSingleOptions(filtered);
      setSingleLoading(false);
    }, 500);
  };

  const handleMultiple = (search: string) => {
    setMultipleLoading(true);
    setTimeout(() => {
      const filtered = OPTIONS.filter((item) => item.label.includes(search));
      setMultipleOptions(filtered);
      setMultipleLoading(false);
    }, 500);
  };

  return (
    <Space direction="vertical">
      <Select
        filterable
        options={singleOptions}
        value={singleValue}
        loading={singleLoading}
        onChange={setSingleValue}
        onSearch={handleSingle}
      />
      <Select
        multiple
        filterable
        options={multipleOptions}
        value={multipleValue}
        loading={multipleLoading}
        onChange={setMultipleValue}
        onSearch={handleMultiple}
        style={{ width: '400px' }}
      />
    </Space>
  );
};

export default RemoteSearchSelect;
