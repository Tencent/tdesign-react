import React from 'react';
import { Input } from 'tdesign-mobile-react';

export default function MaxLength() {
  return (
    <>
      <Input label="标签文字" placeholder="请输入文字" maxlength={10} tips="最大输入10个字符" />
      <Input label="标签文字" placeholder="请输入文字" maxcharacter={10} tips="最大输入10个字符，汉字算两个" />
    </>
  );
}
