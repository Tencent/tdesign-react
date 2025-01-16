import React, { useState } from 'react';
import { Radio, RadioOption, Space } from 'tdesign-react';

const objOptions: RadioOption[] = [
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
// eslint-disable-next-line prefer-const
let itemOptions = ['北京', '上海', '广州', '深圳'];

type ValueType = '北京' | '上海' | '广州' | '深圳';
type FirstCityType = 'bj' | 'sh' | 'gz' | 'sz';

export default function RadioExample() {
  const [city, setCity] = useState<FirstCityType>('bj');
  const [city2, setCity2] = useState<FirstCityType>('sz');
  const [city3, setCity3] = useState<ValueType>('深圳');

  return (
    <Space direction="vertical">
      <Radio.Group value={city} onChange={(val: FirstCityType) => setCity(val)} allowUncheck>
        <Radio value="bj">北京</Radio>
        <Radio value="sh">上海</Radio>
        <Radio value="gz">广州</Radio>
        <Radio value="sz">深圳</Radio>
      </Radio.Group>

      <Radio.Group value={city2} options={objOptions} allowUncheck onChange={(val: FirstCityType) => setCity2(val)} />
      <Radio.Group
        variant="default-filled"
        theme="button"
        value={city2}
        options={objOptions}
        onChange={(val: FirstCityType) => setCity2(val)}
      />

      <Radio.Group theme="button" value={city3} options={itemOptions} onChange={(val: ValueType) => setCity3(val)} />
      <Radio.Group
        variant="primary-filled"
        theme="button"
        value={city3}
        options={itemOptions}
        onChange={(val: ValueType) => setCity3(val)}
      />
    </Space>
  );
}
