import React from 'react';
import { Space } from 'tdesign-react';
import { UserMessage, ChatMessage } from '@tdesign-react/aigc';

const message: UserMessage = {
  id: '1',
  role: 'user',
  content: [
    {
      type: 'text',
      data: '牛顿第一定律是否适用于所有参考系？',
    },
  ],
};

export default function ChatMessageExample() {
  return (
    <Space direction="vertical" style={{ width: '100%' }}>
      <ChatMessage role={message.role} content={message.content}></ChatMessage>
      <ChatMessage variant="base" role={message.role} content={message.content}></ChatMessage>
      <ChatMessage variant="outline" role={message.role} content={message.content}></ChatMessage>
    </Space>
  );
}
