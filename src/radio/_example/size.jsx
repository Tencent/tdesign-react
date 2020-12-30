import React, { useState } from 'react';
import { Radio } from '@tencent/tdesign-react';

export default function RadioExample() {
  const [gender, setGender] = useState('male');

  return (
    <>
      <Radio.Group size="small" value={gender} onChange={(value) => setGender(value)}>
        <Radio name="male">男性</Radio>
        <Radio name="female">女性</Radio>
      </Radio.Group>
      <br />
      <Radio.Group value={gender} onChange={(value) => setGender(value)}>
        <Radio name="male1">男性</Radio>
        <Radio name="female1">女性</Radio>
      </Radio.Group>
      <br />
      <Radio.Group size="large" value={gender} onChange={(value) => setGender(value)}>
        <Radio name="male2">男性</Radio>
        <Radio name="female3">女性</Radio>
      </Radio.Group>
    </>
  );
}
