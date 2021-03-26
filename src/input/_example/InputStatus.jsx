import React, { useState } from 'react';
import { Input } from '@tencent/tdesign-react';

export default function InputExample() {
  const [value, onChange] = useState('');
  return (
    <div className="tdesign-demo-item--input__input-box">
      <Input placeholder="成功状态" value={value} onChange={onChange} status="success" />
      <Input placeholder="警告状态" value={value} onChange={onChange} status="warning" />
      <Input placeholder="错误状态" value={value} onChange={onChange} status="error" />
    </div>
  );
}
