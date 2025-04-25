import React, { useState } from 'react';
import { ChatSender } from 'tdesign-react';

const ChatSenderExample = () => {
  const [inputValue, setInputValue] = useState('输入内容');
  const [loading, setLoading] = useState(false);

  // 输入变化处理
  const handleChange = (e) => {
    console.log('onChange', e.detail);
    setInputValue(e.detail);
  };

  // 发送处理
  const handleSend = () => {
    console.log('提交', { value: inputValue });
    setInputValue('');
    setLoading(true);
  };

  // 停止处理
  const handleStop = () => {
    console.log('停止');
    setLoading(false);
  };

  return (
    <ChatSender
      value={inputValue}
      placeholder="请输入内容"
      loading={loading}
      autosize={{ minRows: 2 }}
      onChange={handleChange}
      onSend={handleSend}
      onStop={handleStop}
    />
  );
};

export default ChatSenderExample;
