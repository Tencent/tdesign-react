import React, { useState } from 'react';
import {
  ChatList,
  ChatSender,
  ChatMessage,
  type SSEChunkData,
  type AIMessageContent,
  type TdChatSenderParams,
} from '@tdesign-react/chat';
import { useChat } from '@tdesign-react/chat';

/**
 * 快速开始示例
 *
 * 学习目标：
 * - 使用 useChat Hook 创建聊天引擎
 * - 组合 ChatList、ChatMessage、ChatSender 组件
 * - 理解 chatEngine、messages、status 的作用
 */
export default function BasicExample() {
  const [inputValue, setInputValue] = useState('');

  // 使用 useChat Hook 创建聊天引擎
  const { chatEngine, messages, status } = useChat({
    defaultMessages: [],
    chatServiceConfig: {
      endpoint: 'https://1257786608-9i9j1kpa67.ap-guangzhou.tencentscf.com/sse/normal',
      stream: true,
      // 数据转换
      onMessage: (chunk: SSEChunkData): AIMessageContent => {
        const { ...rest } = chunk.data;
        return {
          type: 'markdown',
          data: rest?.msg || '',
        };
      },
    },
  });

  // 发送消息
  const handleSend = async (e: CustomEvent<TdChatSenderParams>) => {
    const { value } = e.detail;
    await chatEngine.sendUserMessage({ prompt: value });
    setInputValue('');
  };

  // 停止生成
  const handleStop = () => {
    chatEngine.abortChat();
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column' }}>
      {/* 消息列表 */}
      <ChatList style={{ flex: 1 }}>
        {messages.map((message) => (
          <ChatMessage
            key={message.id}
            message={message}
            placement={message.role === 'user' ? 'right' : 'left'}
            variant={message.role === 'user' ? 'base' : 'text'}
          />
        ))}
      </ChatList>

      {/* 输入框 */}
      <ChatSender
        value={inputValue}
        placeholder="请输入内容"
        loading={status === 'pending' || status === 'streaming'}
        onChange={(e) => setInputValue(e.detail)}
        onSend={handleSend}
        onStop={handleStop}
      />
    </div>
  );
}
