import React from 'react';
import { Textarea } from 'tdesign-mobile-react';

export default function Type() {
  return (
    <Textarea className="textarea-example" label="标签文字" placeholder="请输入文字" value="不可编辑文字" disabled />
  );
}
