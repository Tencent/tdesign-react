import React from 'react';
import type { SSEChunkData, AIMessageContent, ChatServiceConfig } from '@tdesign-react/chat';
import { ChatBot } from '@tdesign-react/chat';

export default function chatSample() {
  // 聊天服务配置
  const chatServiceConfig: ChatServiceConfig = {
    // 对话服务地址
    endpoint: `https://1257786608-9i9j1kpa67.ap-guangzhou.tencentscf.com/sse/normal`,
    // 开启流式对话传输
    stream: true,
    // 自定义流式数据结构解析
    onMessage: (chunk: SSEChunkData): AIMessageContent => {
      const { type, ...rest } = chunk.data;
      return {
        type: 'markdown',
        data: rest?.msg || '',
      };
    },
  };

  return (
    <div style={{ height: '600px' }}>
      <ChatBot chatServiceConfig={chatServiceConfig}></ChatBot>
    </div>
  );
}
