import React from 'react';
import { Input } from 'tdesign-mobile-react';

export default function Base() {
  return (
    <>
      <Input label="标签文字" placeholder="请输入文字" />
      <Input label="标签文字" placeholder="请输入文字（选填）" />
      <Input placeholder="请输入文字" />
    </>
  );
}
