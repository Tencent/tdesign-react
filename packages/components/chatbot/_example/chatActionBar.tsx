import React from 'react';
import { Space, ChatActionBar } from 'tdesign-react';

const ChatActionBarExample = () => {
  const onActions = (name, data) => {
    console.log('消息事件触发：', name, data);
  };
  return (
    <Space>
      <ChatActionBar comment="good" copyText="这是一段文字" handleAction={onActions}></ChatActionBar>
      <ChatActionBar actionBar={['good', 'bad', 'replay']} handleAction={onActions}></ChatActionBar>
    </Space>
  );
};

export default ChatActionBarExample;
