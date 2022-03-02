import React, { useState } from 'react';
import { Input } from 'tdesign-react';

export default function InputExample() {
  const [value, onChange] = useState('');
  return (
    <div className="tdesign-demo-item--input__input-box">
      <Input placeholder="禁用状态" disabled value={value} onChange={onChange} />
      <Input placeholder="只读状态" readonly value={value} onChange={onChange} />
      <br /><br />
      <Input placeholder="成功状态" value={value} onChange={onChange} status="success" />
      <Input placeholder="警告状态" value={value} onChange={onChange} status="warning" />
      <Input placeholder="错误状态" value={value} onChange={onChange} status="error" />
      <br /><br />
      <Input placeholder="普通状态" tips="这是普通文本提示" value={value} onChange={onChange} />
      <Input placeholder="成功状态" tips="校验通过文本提示" value={value} onChange={onChange} status="success" />
      <Input placeholder="警告状态" tips="校验不通过文本提示" value={value} onChange={onChange} status="warning" />
      <Input placeholder="错误状态" tips="校验存在严重问题文本提示" value={value} onChange={onChange} status="error" />
    </div>
  );
}
