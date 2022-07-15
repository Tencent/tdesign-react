import React, { useState } from 'react';
import { Radio, Space } from 'tdesign-react';

export default function RadioExample() {
  const [city, setCity] = useState('bj');
  const [city2, setCity2] = useState('sz');
  const [city3, setCity3] = useState('深圳');
  const objOptions = [
    {
      value: 'bj',
      label: '北京',
    },
    {
      value: 'sh',
      label: '上海',
    },
    {
      value: 'gz',
      label: '广州',
      disabled: true,
    },
    {
      value: 'sz',
      label: '深圳',
    },
  ];
  const itemOptions = ['北京', '上海', '广州', '深圳'];
  return (
    <Space direction="vertical">
      <Radio.Group value={city} onChange={setCity}>
        <Radio value="bj">北京</Radio>
        <Radio value="sh">上海</Radio>
        <Radio value="gz">广州</Radio>
        <Radio value="sz">深圳</Radio>
      </Radio.Group>

      <Radio.Group value={city2} options={objOptions} onChange={setCity2} />

      <Radio.Group value={city3} options={itemOptions} onChange={setCity3} />
    </Space>
  );
}
