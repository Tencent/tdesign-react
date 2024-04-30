import React, { useState } from 'react';
import { Input } from 'tdesign-react';

export default function InputExample() {
  const [value, setValue] = useState('');
  function format(val) {
    const reg = /(\d)(?=(?:\d{3})+$)/g;
    const str = val.replace(reg, '$1,');
    return str;
  }

  const inputStatus = isNaN(+value) ? 'error' : '';
  const tips = inputStatus ? '请输入数字' : '';

  return (
    <Input
      value={value}
      onChange={setValue}
      status={inputStatus}
      format={format}
      tips={tips}
      placeholder="请输入数字"
    />
  );
}
