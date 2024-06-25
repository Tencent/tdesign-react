import React, { useState } from 'react';
import { AutoComplete, Space } from 'tdesign-react';

const options = ['第一个联想词', '第二个联想词', '第三个联想词'];

const AutoCompleteStatus = () => {
  const [value, setValue] = useState('');

  return (
    <Space direction='vertical' style={{ width: '100%' }} size="32px">
      <AutoComplete
        value={value}
        options={options}
        onChange={setValue}
        disabled
        tips="这是禁用状态"
        placeholder="请输入关键词搜索"
      />
      <AutoComplete
        value={value}
        options={options}
        onChange={setValue}
        readonly
        tips="这是只读状态"
        placeholder="请输入关键词搜索"
      />
      <AutoComplete
        value={value}
        options={options}
        onChange={setValue}
        tips="这是普通状态"
        placeholder="请输入关键词搜索"
      />
      <AutoComplete
        value={value}
        options={options}
        onChange={setValue}
        tips="这是告警状态"
        status="warning"
        placeholder="请输入关键词搜索"
      />
      <AutoComplete
        value={value}
        options={options}
        onChange={setValue}
        tips="这是错误状态"
        status="error"
        placeholder="请输入关键词搜索"
      />
      <AutoComplete
        value={value}
        options={options}
        onChange={setValue}
        tips="这是成功状态"
        status="success"
        placeholder="请输入关键词搜索"
      />
    </Space>
  );
};

AutoCompleteStatus.displayName = 'AutoCompleteStatus';

export default AutoCompleteStatus;
