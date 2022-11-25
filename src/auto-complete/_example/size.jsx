import React, { useState } from 'react';
import { AutoComplete, Space } from 'tdesign-react';

const options = ['第一个联想词', '第二个联想词', '第三个联想词'];

const AutoCompleteSize = () => {
  const [value1, setValue1] = useState('');
  const [value2, setValue2] = useState('');
  const [value3, setValue3] = useState('');

  return (
    <Space direction='vertical' style={{ width: '100%' }}>
      <AutoComplete
        value={value1}
        options={options}
        onChange={setValue1}
        size="small"
        inputProps={{ label: '小尺寸：' }}
      />
      <AutoComplete
        value={value2}
        options={options}
        onChange={setValue2}
        inputProps={{ label: '中尺寸：' }}
      />
      <AutoComplete
        value={value3}
        options={options}
        onChange={setValue3}
        size="large"
        inputProps={{ label: '大尺寸：' }}
      />
    </Space>
  );
};

AutoCompleteSize.displayName = 'AutoCompleteSize';

export default AutoCompleteSize;
