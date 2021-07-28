import React, { useState } from 'react';
import { Input } from '@tencent/tdesign-react';

export default function InputExample() {
  const [value1, onChange1] = useState('');
  const [value2, onChange2] = useState('');
  return (
    <div className="tdesign-demo-item--input__input-box">
      <Input.Group>
        <Input
          placeholder="姓"
          value={value1}
          onChange={(value) => {
            onChange1(value);
          }}
        />
        <Input
          placeholder="名"
          value={value2}
          onChange={(value) => {
            onChange2(value);
          }}
        />
      </Input.Group>
      <Input.Group seperate>
        <Input
          placeholder="姓"
          value={value1}
          onChange={(value) => {
            onChange1(value);
          }}
        />
        <Input
          placeholder="名"
          value={value2}
          onChange={(value) => {
            onChange2(value);
          }}
        />
      </Input.Group>
    </div>
  );
}
