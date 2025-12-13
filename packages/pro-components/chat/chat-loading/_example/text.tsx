import React from 'react';
import { Space } from 'tdesign-react';
import { ChatLoading } from '@tdesign-react/chat';

const ChatLoadingTextExample = () => (
  <Space size={60}>
    <ChatLoading animation="moving" text="思考中..." />
  </Space>
);

export default ChatLoadingTextExample;
