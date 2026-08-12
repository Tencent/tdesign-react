import React from 'react';
import { Space } from 'tdesign-react';
import { ChatLoading } from '@tdesign-react/chat';

const ChatLoadingExample = () => (
  <Space size={60}>
    <ChatLoading animation="moving" />
    <ChatLoading animation="gradient" />
    <ChatLoading animation="circle" />
    <ChatLoading animation="dots" />
  </Space>
);

export default ChatLoadingExample;
