import React from 'react';
import { Textarea } from 'tdesign-react';

export default function InputExample() {
  return (
    <div className="tdesign-demo-block-column">
      <Textarea placeholder="请输入内容" readonly defaultValue="只读状态" />
      <Textarea placeholder="请输入内容" disabled defaultValue="禁用状态" />
    </div>
  );
}
