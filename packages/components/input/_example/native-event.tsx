import React, { useState } from 'react';
import { Divider, Input, Space } from 'tdesign-react';

export default function InputNativeEventDemo() {
  const [cursorPosition, setCursorPosition] = useState<number>(0);
  const [selectedText, setSelectedText] = useState<string>('');

  /* 文档上明确有写的事件，遵循其回调格式 */
  const handleBlur = (value: string, context: { e: React.FocusEvent<HTMLInputElement> }) => {
    console.log(value, context);
    setCursorPosition(0);
    setSelectedText('');
  };

  /* 文档上没写的事件，遵循原生的回调格式 */
  const handleSelect = (e: React.FocusEvent<HTMLInputElement>) => {
    const { value, selectionStart, selectionEnd } = e.target;
    const selectedText = value.substring(selectionStart, selectionEnd);
    setCursorPosition(selectionStart);
    setSelectedText(selectedText);
  };

  return (
    <Space size="100px">
      <Space direction="vertical">
        {/* 设置 Tab 键切换焦点的顺序，如果不设置，默认按 DOM 顺序，否则根据 tabIndex 的大小
          https://developer.mozilla.org/docs/Web/HTML/Reference/Global_attributes/tabindex */}
        <Input tabIndex={2} placeholder="我会被聚焦" />
        <Input placeholder="先聚焦我，然后按 Tab 键切换焦点" tabIndex={1} style={{ width: 300 }} />
        {/* <input tabIndex={2} placeholder="我会被聚焦" />
        <input tabIndex={1} placeholder="先聚焦我，然后按 Tab 键切换焦点"/> */}
      </Space>
      <Divider layout="vertical" style={{ height: '100%' }} />
      <Space direction="vertical">
        <Input defaultValue="Helle World" onBlur={handleBlur} onSelect={handleSelect} />
        <Space direction="vertical">
          <p>光标位置: {cursorPosition}</p>
          <p>选中文本: {selectedText || '未选中'}</p>
        </Space>
      </Space>
    </Space>
  );
}
