import React from 'react';
import { Divider, Space, Select } from 'tdesign-react';
import { AIMessage, ChatMessage, TdChatLoadingProps } from '@tdesign-react/chat';

const messages: Record<string, AIMessage> = {
  loading: {
    id: '11111',
    role: 'assistant',
    status: 'pending',
    datetime: '今天16:38',
  },
  error: {
    id: '22222',
    role: 'assistant',
    status: 'error',
    content: [
      {
        type: 'text',
        data: '自定义错误文案',
      },
    ],
  },
};

export default function ChatMessageExample() {
  return (
    <Space direction="vertical" style={{ width: '100%' }}>
      <Divider style={{ color: 'var(--td-text-color-placeholder)' }}>加载状态下的消息</Divider>
      <ChatMessage
        avatar="https://tdesign.gtimg.com/site/chat-avatar.png"
        animation="skeleton"
        name="TDesignAI"
        {...messages.loading}
      ></ChatMessage>
      <ChatMessage
        avatar="https://tdesign.gtimg.com/site/chat-avatar.png"
        animation="moving"
        name="TDesignAI"
        {...messages.loading}
      ></ChatMessage>
      <ChatMessage
        avatar="https://tdesign.gtimg.com/site/chat-avatar.png"
        animation="gradient"
        name="TDesignAI"
        {...messages.loading}
      ></ChatMessage>
      <ChatMessage
        avatar="https://tdesign.gtimg.com/site/chat-avatar.png"
        animation="dot"
        name="TDesignAI"
        {...messages.loading}
      ></ChatMessage>
      <Divider style={{ color: 'var(--td-text-color-placeholder)' }}>出错状态下的消息</Divider>
      <ChatMessage
        avatar="https://tdesign.gtimg.com/site/chat-avatar.png"
        role="assistant"
        status="error"
      ></ChatMessage>
      <ChatMessage
        avatar="https://tdesign.gtimg.com/site/chat-avatar.png"
        role="assistant"
        status="error"
        content={messages.error.content}
      ></ChatMessage>
    </Space>
  );
}
