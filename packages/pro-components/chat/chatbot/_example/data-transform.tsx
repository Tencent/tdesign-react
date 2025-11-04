import React from 'react';
import { ChatBot, SSEChunkData, AIMessageContent, ChatServiceConfig } from '@tdesign-react/chat';

/**
 * 数据转换示例
 * 
 * 学习目标：
 * - 理解 onMessage 的数据转换逻辑
 * - 处理后端返回的不同事件类型
 * - 了解何时返回 null
 */
export default function DataTransform() {
  // 聊天服务配置
  const chatServiceConfig: ChatServiceConfig = {
    endpoint: 'https://1257786608-9i9j1kpa67.ap-guangzhou.tencentscf.com/sse/normal',
    stream: true,
    // 数据转换：将后端数据转换为组件所需格式
    onMessage: (chunk: SSEChunkData): AIMessageContent | null => {
      console.log('收到数据块:', chunk);

      const { type, ...rest } = chunk.data;

      // 根据不同的事件类型，返回不同的内容块
      switch (type) {
        // 文本内容
        case 'text':
          return {
            type: 'markdown',
            data: rest?.msg || '',
            strategy: 'merge', // 合并到同一个文本块
          };

        // 思考过程
        case 'think':
          return {
            type: 'thinking',
            data: {
              title: rest.title || '思考中',
              text: rest.content || '',
            },
            status: /完成/.test(rest?.title) ? 'complete' : 'streaming',
          };

        // 搜索结果
        case 'search':
          return {
            type: 'search',
            data: {
              title: rest.title || '搜索结果',
              references: rest?.content || [],
            },
          };

        // 忽略其他类型的事件
        default:
          console.log('忽略事件类型:', type);
          return null;
      }
    },
  };

  return (
    <div style={{ height: '600px' }}>
      <ChatBot chatServiceConfig={chatServiceConfig} />
    </div>
  );
}
