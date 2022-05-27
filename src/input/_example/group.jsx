import React, { useState } from 'react';
import { Input } from 'tdesign-react';

export default function InputExample() {
  return (
    <div className="tdesign-demo-item--input__input-box">
      <Input.Group separate>
        <Input defaultValue="0731" style={{ width: 100 }} />
        <Input defaultValue="12345677" />
      </Input.Group>
      <Input.Group separate>
        <Input />
        <Input />
      </Input.Group>
      <Input.Group separate>
        <Input style={{ width: 100 }} defaultValue="0731" />
        <span style={{ lineHeight: '32px' }}>&nbsp;-&nbsp;</span>
        <Input style={{ width: 100 }} defaultValue="12345" />
        <Input style={{ width: 100 }} defaultValue="678901" />
        <Input style={{ width: 100 }} />
      </Input.Group>
    </div>
  );
}
