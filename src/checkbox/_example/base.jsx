import React, { useState } from 'react';
import { Checkbox } from '@tencent/tdesign-react';

export default function CheckboxExample() {
  const [taste, setTaste] = useState([]);

  return (
    <Checkbox.Group value={taste} onChange={(value) => setTaste(value)}>
      <Checkbox value="la">加辣</Checkbox>
      <Checkbox value="ma">加麻</Checkbox>
      <Checkbox value="nocong">不要葱花</Checkbox>
    </Checkbox.Group>
  );
}
