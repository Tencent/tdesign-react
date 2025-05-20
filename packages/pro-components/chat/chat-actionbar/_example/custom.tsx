import React from 'react';
import { Space } from 'tdesign-react';
import { ChatActionBar } from '@tdesign-react/aigc';

const ChatActionBarExample = () => {
  const onActions = (name, data) => {
    console.log('消息事件触发：', name, data);
  };

  return (
    <Space>
      <ChatActionBar actionBar={['good', 'bad', 'replay']} handleAction={onActions}></ChatActionBar>
    </Space>
  );
};

export default ChatActionBarExample;
