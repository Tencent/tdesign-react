import React, { useState } from 'react';
import { Select, Space } from 'tdesign-react';

const { Option } = Select;

const options1 = [
  { label: '全选', checkAll: true },
  { label: '架构云', value: '1' },
  { label: '大数据', value: '2' },
  { label: '区块链', value: '3' },
  { label: '物联网', value: '4', disabled: true },
  { label: '人工智能', value: '5', content: <span>人工智能（新）</span> },
  {
    label: '计算场景',
    value: '6',
  },
];

const options2 = [
  { label: '云服务器', value: '1' },
  { label: '云数据库', value: '2' },
  { label: '域名注册', value: '3' },
  { label: '网站备案', value: '4' },
  { label: '对象存储', value: '5' },
  { label: '低代码平台', value: '6', content: <span>低代码平台（新）</span> },
];

const MultipleSelect = () => {
  const [value, setValue] = useState(['3', '5']);

  const handleChange = (v, context) => {
    console.log('context:', context);
    setValue(v);
  };

  return (
    <Space breakLine style={{ width: '100%' }}>
      <Select value={value} onChange={handleChange} filterable multiple options={options1} />
      <Select defaultValue={['1', '2', '3', '4', '5', '6']} placeholder="请选择云产品" multiple>
        {options2.map((item) => (
          <Option value={item.value} label={item.label} key={item.value} content={item.content}></Option>
        ))}
      </Select>
    </Space>
  );
};

export default MultipleSelect;
