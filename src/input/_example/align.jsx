import React from 'react';
import { Input } from 'tdesign-react';

export default function InputExample() {
  return (
    <div className="tdesign-demo-item--input__input-box">
      <Input defaultValue="居左对齐" align="left" />
      <Input defaultValue="居中对齐" align="center" />
      <Input defaultValue="居右对齐" align="right" />
    </div>
  );
}
