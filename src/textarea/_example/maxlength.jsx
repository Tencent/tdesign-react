import React from 'react';
import { Textarea } from '@tencent/tdesign-react';

export default function InputExample() {
  return (
    <div className="tdesign-demo-item--input__input-box">
      <Textarea placeholder="请输入内容" maxlength={20} />
    </div>
  );
}
