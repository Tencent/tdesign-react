import React from 'react';
import { Textarea, Space } from 'tdesign-react';

export default function InputExample() {
  return <Space direction="vertical" style={{ width: '100%' }}>
    <Textarea placeholder="请输入内容，超出限制无法输入" maxlength={20} />
    <Textarea placeholder="请输入内容，超出限制可以输入" maxlength={20} allowInputOverMax />
    <Textarea placeholder="请输入内容，一个中文汉字表示两个字符长度，超出限制无法输入" maxcharacter={20} />
    <Textarea placeholder="请输入内容，一个中文汉字表示两个字符长度，超出限制可以输入" maxcharacter={20} allowInputOverMax />
  </Space>;
}
