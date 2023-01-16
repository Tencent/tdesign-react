import React, { useState } from 'react';

import { Select } from 'tdesign-react';

const { Option } = Select;

const options = [
  { label: '用户一', value: '1', description: '这是一段用户描述信息，可自定义内容' },
  { label: '用户二', value: '2', description: '这是一段用户描述信息，可自定义内容' },
  { label: '用户三', value: '3', description: '这是一段用户描述信息，可自定义内容' },
  { label: '用户四', value: '4', description: '这是一段用户描述信息，可自定义内容' },
  { label: '用户五', value: '5', description: '这是一段用户描述信息，可自定义内容' },
  { label: '用户六', value: '6', description: '这是一段用户描述信息，可自定义内容' },
  { label: '用户七', value: '7', description: '这是一段用户描述信息，可自定义内容' },
  { label: '用户八', value: '8', description: '这是一段用户描述信息，可自定义内容' },
  { label: '用户九', value: '9', description: '这是一段用户描述信息，可自定义内容' },
];

const avatarUrl = 'https://tdesign.gtimg.com/site/avatar.jpg';

export default function CustomOptions() {
  const [value, setValue] = useState('1');
  const onChange = (value) => {
    setValue(value);
  };

  return (
    <Select value={value} onChange={onChange} style={{ width: '300px' }} clearable>
      {options.map((option, idx) => (
        <Option style={{ height: '60px' }} key={idx} value={option.value} label={option.label}>
          <div style={{ display: 'flex' }}>
            <img
              src={avatarUrl}
              style={{
                maxWidth: '40px',
                borderRadius: '50%',
              }}
            />
            <div style={{ marginLeft: '16px' }}>
              <div>{option.label}</div>
              <div
                style={{
                  fontSize: '13px',
                  color: 'var(--td-gray-color-9)',
                }}
              >
                {option.description}
              </div>
            </div>
          </div>
        </Option>
      ))}
    </Select>
  );
}
