import React, { useState } from 'react';
import { Radio } from '@tencent/tdesign-react';

export default function RadioExample() {
  const [gender, setGender] = useState('male');

  return (
    <Radio.Group value={gender} onChange={(value) => setGender(value)}>
      <Radio name="male">男性</Radio>
      <Radio name="female">女性</Radio>
    </Radio.Group>
  );
}
