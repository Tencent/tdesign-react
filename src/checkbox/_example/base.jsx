import React, { useState } from 'react';
import { Checkbox } from '@tencent/tdesign-react';

export default function CheckboxExample() {
  const [taste, setTaste] = useState([]);

  return (
    <Checkbox.Group value={taste} onChange={setTaste}>
      <Checkbox name="la">加辣</Checkbox>
      <Checkbox name="ma">加麻</Checkbox>
      <Checkbox name="nocong">不要葱花</Checkbox>
    </Checkbox.Group>
  );
}
