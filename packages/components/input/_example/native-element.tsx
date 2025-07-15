import React, { useRef } from 'react';
import { Button, Input, Space, type InputRef } from 'tdesign-react';

export default function InputNativeElementDemo() {
  const inputRef = useRef<InputRef>(null);

  const handleSelectAll = () => {
    const inputElement = inputRef.current?.inputElement;
    if (!inputElement) return;
    inputElement.focus();
    inputElement.setSelectionRange(0, inputElement.value.length);
  };

  return (
    <Space direction="vertical">
      <Space align="center">
        <Button onClick={handleSelectAll}>点击全选文本</Button>
      </Space>
      <Input ref={inputRef} defaultValue="Hello World" />
    </Space>
  );
}
