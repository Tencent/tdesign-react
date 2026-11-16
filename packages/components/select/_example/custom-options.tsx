import React, { useState } from 'react';
import { Select, Space } from 'tdesign-react';

const { Option } = Select;

const generateCustomContent = (index: number) => (
  <div style={{ display: 'flex', padding: '8px 0' }}>
    <img
      src="https://tdesign.gtimg.com/site/avatar.jpg"
      style={{
        maxWidth: '40px',
        borderRadius: '50%',
      }}
    />
    <div style={{ marginLeft: '16px' }}>
      <div>用户{index}</div>
      <div
        style={{
          fontSize: '13px',
          color: 'var(--td-gray-color-9)',
        }}
      >
        这是一段用户描述信息，可自定义内容
      </div>
    </div>
  </div>
);

const createOption = (index: number) => {
  const label = `用户${index}`;
  return {
    label,
    value: index.toString(),
    description: '这是一段用户描述信息，可自定义内容',
  };
};

const options1 = Array.from({ length: 5 }, (_, index) => ({
  ...createOption(index + 1),
}));

const options2 = Array.from({ length: 5 }, (_, index) => ({
  ...createOption(index + 1),
  content: generateCustomContent(index + 1),
}));

function CustomOptions() {
  const [value, setValue] = useState('1');
  const onChange = (value: string) => {
    setValue(value);
  };

  return (
    <Space size="150px">
      <Space direction="vertical">
        <strong>法一：使用插槽</strong>
        <Select value={value} onChange={onChange} clearable>
          {options1.map((option, idx) => (
            <Option style={{ height: '60px' }} key={idx} value={option.value} label={option.label}>
              {generateCustomContent(idx + 1)}
            </Option>
          ))}
        </Select>
      </Space>
      <Space direction="vertical">
        <strong>法二：使用 `content` 属性</strong>
        <Select options={options2} value={value} onChange={onChange} clearable style={{ width: 200 }} />
      </Space>
    </Space>
  );
}

export default CustomOptions;
