import React, { useState } from 'react';
import { Input, Space } from 'tdesign-react';

export default function InputExample() {
  const [value1, setValue1] = useState('');
  const [value2, setValue2] = useState('');
  const [value3, setValue3] = useState('');
  const [value4, setValue4] = useState('');

  const [tips, setTips] = useState('');

  return (
    <Space direction="vertical" size={24} style={{ width: '500px' }}>
      <Input
        value={value1}
        onChange={setValue1}
        maxlength={5}
        showLimitNumber
        placeholder="内置字数限制，最大文本长度，一个中文字等于一个长度"
      />

      <Input
        value={value2}
        onChange={setValue2}
        maxcharacter={10}
        showLimitNumber
        placeholder="内置字数限制，最大字符数量限制，一个中文字等于两个字符"
      />

      <Input
        value={value3}
        onChange={setValue3}
        maxlength={5}
        allowInputOverMax
        showLimitNumber
        placeholder="内置字数限制，字数超出时允许继续输入"
        tips={tips}
        status={tips ? 'error' : 'default'}
        onValidate={({ error }) => {
          console.log(error);
          setTips(error ? '输入内容长度不允许超过 5 个字' : '');
        }}
      />

      <Input
        value={value4}
        onChange={setValue4}
        maxlength={5}
        suffix={`${[...value4].length}/5`}
        placeholder="自定义字数限制文本"
      />
    </Space>
  );
}
