import React from 'react';
import { AppIcon } from 'tdesign-icons-react';
import { Input } from 'tdesign-mobile-react';

export default function Prefix() {
  return (
    <>
      <Input label="标签文字" placeholder="请输入文字" prefixIcon={<AppIcon />} />
      <Input placeholder="请输入文字" prefixIcon={<AppIcon />} />
    </>
  );
}
