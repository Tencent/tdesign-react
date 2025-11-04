import React, { useRef, useState } from 'react';
import {
  ChatList,
  ChatSender,
  ChatMessage,
  type ChatMessagesData,
  type SSEChunkData,
  type AIMessageContent,
  type TdChatSenderParams,
  type TdChatListApi,
} from '@tdesign-react/chat';
import { Button, Space } from 'tdesign-react';
import { useChat } from '../index';

/**
 * 消息管理示例
 * 
 * 学习目标：
 * - 使用 defaultMessages 初始化消息
 * - 通过 chatEngine.setMessages 动态管理消息
 * - 理解 replace、prepend、append 三种模式
 */
export default function MessagesExample() {
  const listRef = useRef<TdChatListApi>(null);
  const [inputValue, setInputValue] = useState('');

  // 初始化消息
  const defaultMessages: ChatMessagesData[] = [
    {
      id: 'welcome',
      role: 'assistant',
      status: 'complete',
      content: [
        {
          type: 'text',
          data: '你好！我是智能助手，有什么可以帮助你的吗？',
        },
      ],
    },
  ];

  // 模拟历史消息
  const historyMessages: ChatMessagesData[] = [
    {
      id: 'history-1',
      role: 'user',
      datetime: '2024-01-01 10:00:00',
      content: [{ type: 'text', data: 'ChatEngine 是什么？' }],
    },
    {
      id: 'history-2',
      role: 'assistant',
      datetime: '2024-01-01 10:00:05',
      status: 'complete',
      content: [
        {
          type: 'markdown',
          data: 'ChatEngine 是一个灵活的对话引擎 Hook，用于深度定制聊天界面。',
        },
      ],
    },
  ];

  const { chatEngine, messages, status } = useChat({
    defaultMessages,
    chatServiceConfig: {
      endpoint: 'https://1257786608-9i9j1kpa67.ap-guangzhou.tencentscf.com/sse/normal',
      stream: true,
      onMessage: (chunk: SSEChunkData): AIMessageContent => {
        const { type, ...rest } = chunk.data;
        return {
          type: 'markdown',
          data: rest?.msg || '',
        };
      },
    },
  });

  // 加载历史消息（在顶部插入）
  const loadHistory = () => {
    chatEngine.setMessages(historyMessages, 'prepend');
    // 滚动到顶部查看历史消息
    setTimeout(() => {
      listRef.current?.scrollList({ to: 'top', behavior: 'smooth' });
    }, 100);
  };

  // 清空消息
  const clearMessages = () => {
    chatEngine.setMessages([], 'replace');
  };

  // 重置为初始消息
  const resetMessages = () => {
    chatEngine.setMessages(defaultMessages, 'replace');
  };

  const handleSend = async (e: CustomEvent<TdChatSenderParams>) => {
    const { value } = e.detail;
    await chatEngine.sendUserMessage({ prompt: value });
    setInputValue('');
    // 滚动到底部
    setTimeout(() => {
      listRef.current?.scrollList({ to: 'bottom' });
    }, 100);
  };

  return (
    <div>
      {/* 操作按钮 */}
      <Space style={{ marginBottom: '16px' }}>
        <Button onClick={loadHistory}>加载历史消息</Button>
        <Button onClick={resetMessages}>重置消息</Button>
        <Button onClick={clearMessages}>清空消息</Button>
      </Space>

      {/* 聊天界面 */}
      <div style={{ height: '500px', display: 'flex', flexDirection: 'column' }}>
        <ChatList ref={listRef} style={{ flex: 1 }}>
          {messages.map((message) => (
            <ChatMessage
              key={message.id}
              message={message}
              placement={message.role === 'user' ? 'right' : 'left'}
              variant={message.role === 'user' ? 'base' : 'text'}
            />
          ))}
        </ChatList>

        <ChatSender
          value={inputValue}
          placeholder="请输入内容"
          loading={status === 'pending' || status === 'streaming'}
          onChange={(e) => setInputValue(e.detail)}
          onSend={handleSend}
          onStop={() => chatEngine.abortChat()}
        />
      </div>
    </div>
  );
}
