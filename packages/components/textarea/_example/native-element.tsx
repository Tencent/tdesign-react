import React, { useRef } from 'react';
import { Button, Space, Textarea, type TextareaRef } from 'tdesign-react';

export default function TextareaNativeElementDemo() {
  const textareaRef = useRef<TextareaRef>(null);

  const handleSelectAll = () => {
    const inputElement = textareaRef.current?.textareaElement;
    if (!inputElement) return;
    inputElement.focus();
    inputElement.setSelectionRange(0, inputElement.value.length);
  };

  return (
    <Space direction="vertical">
      <Space align="center">
        <Button onClick={handleSelectAll}>点击全选文本</Button>
      </Space>
      <Textarea ref={textareaRef} defaultValue="Hello World" />
    </Space>
  );
}
