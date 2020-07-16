import React, { useState } from 'react';
import { Input, InputGroup } from '@tdesign/react';

export default function InputExample() {
  const [value1, onChange1] = useState('');
  const [value2, onChange2] = useState('');
  return (
    <>
      <InputGroup>
        <Input
          placeholder="姓"
          value={value1}
          onChange={(event) => {
            onChange1(event.target.value);
          }}
        />
        <Input
          placeholder="名"
          value={value2}
          onChange={(event) => {
            onChange2(event.target.value);
          }}
        />
      </InputGroup>
      <br />
      <br />
      <InputGroup seperate>
        <Input
          placeholder="姓"
          value={value1}
          onChange={(event) => {
            onChange1(event.target.value);
          }}
        />
        <Input
          placeholder="名"
          value={value2}
          onChange={(event) => {
            onChange2(event.target.value);
          }}
        />
      </InputGroup>{' '}
    </>
  );
}
