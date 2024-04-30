import React, { useState } from 'react';
import { Checkbox, Space } from 'tdesign-react';

const options = [
  {
    value: '北京',
    label: '北京',
  },
  {
    value: '上海',
    label: '上海',
  },
  {
    value: '广州',
    label: '广州',
  },
  {
    label: '全选',
    checkAll: true,
  },
];

export default function CheckboxExample() {
  const [disabled, setDisabled] = useState(false);
  const [city, setCity] = useState(['北京']);

  return (
    <Space direction="vertical">
      <div>选中值: {city.join('、')}</div>
      <div>
        <Checkbox checked={disabled} onChange={(value) => setDisabled(value)}>
          禁用全部
        </Checkbox>
      </div>

      <Checkbox.Group
        disabled={disabled}
        value={city}
        onChange={(value) => {
          setCity(value);
        }}
        options={options}
      />
    </Space>
  );
}
