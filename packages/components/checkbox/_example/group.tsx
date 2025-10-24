import React, { useState } from 'react';
import { Checkbox, Divider, Space } from 'tdesign-react';

const options = [
  {
    label: '全选',
    checkAll: true,
  },
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
    disabled: true,
  },
];

export default function CheckboxExample() {
  const [disabled, setDisabled] = useState(false);
  const [city, setCity] = useState(['广州']);
  const [city2, setCity2] = useState(['上海']);

  return (
    <Space direction="vertical">
      <Checkbox
        checked={disabled}
        onChange={(value) => {
          setDisabled(value);
        }}
      >
        禁用全部
      </Checkbox>

      <Space direction="vertical">
        <strong>写法一：使用 options</strong>
        <div>选中值: {city.join('、')}</div>
        <Checkbox.Group
          disabled={disabled}
          value={city}
          onChange={(value) => {
            setCity(value);
          }}
          options={options}
        />
      </Space>

      <Divider />

      <Space direction="vertical">
        <strong>写法二：使用插槽</strong>
        <div>选中值: {city2.join('、')}</div>
        <Checkbox.Group
          disabled={disabled}
          value={city2}
          onChange={(value) => {
            setCity2(value);
          }}
        >
          <Checkbox checkAll>全选</Checkbox>
          <Checkbox value="北京">北京</Checkbox>
          <Checkbox value="上海">上海</Checkbox>
          <Checkbox value="广州" disabled>
            广州
          </Checkbox>
        </Checkbox.Group>
      </Space>
    </Space>
  );
}
