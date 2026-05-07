import React from 'react';
import { Space, Textarea } from 'tdesign-react';

export default function InputExample() {
  return (
    <Space direction="vertical" style={{ width: '100%' }}>
      <Textarea placeholder="请输入内容，超出限制无法输入" tips="这里可以放一些提示文字" maxlength={20} />
      <Textarea placeholder="请输入内容，超出限制可以输入" maxlength={20} allowInputOverMax />
      <Textarea placeholder="请输入内容，一个中文汉字表示两个字符长度，超出限制无法输入" maxcharacter={20} />
      <Textarea
        placeholder="请输入内容，一个中文汉字表示两个字符长度，超出限制可以输入"
        maxcharacter={20}
        allowInputOverMax
      />
      <Textarea
        placeholder="自定义计数元素"
        maxlength={20}
        count={(ctx) => {
          const isMaxReached = ctx.count >= ctx.maxLength;
          return (
            <div style={{ fontSize: '12px' }}>
              <span style={{ color: isMaxReached ? 'red' : 'gray' }}>{ctx.count}</span>/
              <span style={{ color: 'mediumblue' }}>{ctx.maxLength}</span>
            </div>
          );
        }}
      />
    </Space>
  );
}
