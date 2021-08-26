import React, { useState } from 'react';
import { Radio } from '@tencent/tdesign-react';

export default function RadioExample() {
  const [city, setCity] = useState('bj');

  return (
    <Radio.Group value={city} onChange={(value) => setCity(value)}>
      <Radio value="bj">北京</Radio>
      <Radio value="sh">上海</Radio>
      <Radio value="gz">广州</Radio>
      <Radio value="sz">深圳</Radio>
    </Radio.Group>
  );
}
