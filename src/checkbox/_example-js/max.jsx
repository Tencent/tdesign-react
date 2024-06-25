import React, { useState } from 'react';
import { Checkbox, InputNumber, Space } from 'tdesign-react';

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
    value: '深圳',
    label: '深圳',
  },
];

export default function CheckboxExample() {
  const [city, setCity] = useState(['北京']);
  const [max, setMax] = useState(1);
  return (
    <Space direction="vertical">
      <div>
        最多可选:{' '}
        <InputNumber
          value={max}
          max={3}
          min={1}
          onChange={(value) => {
            setMax(value);
          }}
        />
      </div>
      <div>选中值: {city.length ? city.join('、') : '无'}</div>

      <Checkbox.Group max={max} value={city} onChange={(value) => setCity(value)}>
        {options.map((item) => (
          <Checkbox key={item.value} value={item.value}>
            {item.label}
          </Checkbox>
        ))}
      </Checkbox.Group>
    </Space>
  );
}
