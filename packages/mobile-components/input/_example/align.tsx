import React from 'react';
import { Input } from 'tdesign-mobile-react';

export default function Align() {
  return (
    <>
      <Input label="左对齐" placeholder="请输入文字" />
      <Input label="居中" placeholder="请输入文字" align="center" />
      <Input label="右对齐" placeholder="请输入文字" align="right" />
    </>
  );
}
