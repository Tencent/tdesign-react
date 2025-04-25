import React from 'react';
import { ChatLoading, Space } from 'tdesign-react';

const ChatLoadingExample = () => (
  <>
    <Space>
      <div style={{ width: 600, height: 150 }}>
        <ChatLoading animation="skeleton"></ChatLoading>
      </div>
    </Space>
    <Space size={60}>
      <ChatLoading animation="moving" />
      <ChatLoading animation="gradient" />
      <ChatLoading animation="circle" />
      <ChatLoading animation="moving" text={'加载中...'} />
    </Space>
  </>
);

export default ChatLoadingExample;
