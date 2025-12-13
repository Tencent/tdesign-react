import React, { useRef, useState } from 'react';
import {
  ChatBot,
  SSEChunkData,
  AIMessageContent,
  ChatServiceConfig,
  ChatMessagesData,
  type TdChatbotApi,
} from '@tdesign-react/chat';
import { Button, Space } from 'tdesign-react';

/**
 * 初始化消息示例
 *
 * 学习目标：
 * - 使用 defaultMessages 设置欢迎语和建议问题
 * - 通过 setMessages 动态加载历史消息
 * - 实现点击建议问题填充输入框
 */
export default function InitialMessages() {
  const chatRef = useRef<HTMLElement & TdChatbotApi>(null);
  const [hasHistory, setHasHistory] = useState(false);

  // 初始化消息
  const defaultMessages: ChatMessagesData[] = [
    {
      id: 'welcome',
      role: 'assistant',
      content: [
        {
          type: 'text',
          status: 'complete',
          data: '你好！我是 TDesign 智能助手，有什么可以帮助你的吗？',
        },
        {
          type: 'suggestion',
          status: 'complete',
          data: [
            {
              title: 'TDesign 是什么？',
              prompt: '请介绍一下 TDesign 设计体系',
            },
            {
              title: '如何快速上手？',
              prompt: 'TDesign React 如何快速开始使用？',
            },
            {
              title: '有哪些组件？',
              prompt: 'TDesign 提供了哪些常用组件？',
            },
          ],
        },
      ],
    },
  ];

  // 模拟历史消息数据（通常从后端接口获取）
  const historyMessages: ChatMessagesData[] = [
    {
      id: 'history-1',
      role: 'user',
      datetime: '2024-01-01 10:00:00',
      content: [
        {
          type: 'text',
          data: 'TDesign 支持哪些框架？',
        },
      ],
    },
    {
      id: 'history-2',
      role: 'assistant',
      datetime: '2024-01-01 10:00:05',
      status: 'complete',
      content: [
        {
          type: 'markdown',
          data: 'TDesign 目前支持以下框架：\n\n- **React**\n- **Vue 2/3**\n- **Flutter**\n- **小程序**',
        },
      ],
    },
    {
      id: 'history-3',
      role: 'user',
      datetime: '2024-01-01 10:01:00',
      content: [
        {
          type: 'text',
          data: '如何安装 TDesign React？',
        },
      ],
    },
    {
      id: 'history-4',
      role: 'assistant',
      datetime: '2024-01-01 10:01:03',
      status: 'complete',
      content: [
        {
          type: 'markdown',
          data: '安装 TDesign React 非常简单：\n\n```bash\nnpm install tdesign-react\n```',
        },
      ],
    },
  ];

  // 加载历史消息
  const loadHistory = () => {
    chatRef.current?.setMessages(historyMessages, 'replace');
    setHasHistory(true);
  };

  // 清空消息
  const clearMessages = () => {
    chatRef.current?.clearMessages();
    setHasHistory(false);
  };

  // 聊天服务配置
  const chatServiceConfig: ChatServiceConfig = {
    endpoint: 'https://1257786608-9i9j1kpa67.ap-guangzhou.tencentscf.com/sse/normal',
    stream: true,
    onMessage: (chunk: SSEChunkData): AIMessageContent => {
      const { ...rest } = chunk.data;
      return {
        type: 'markdown',
        data: rest?.msg || '',
      };
    },
  };

  // 消息配置：处理建议问题点击
  const messageProps = {
    assistant: {
      handleActions: {
        // 点击建议问题时，填充到输入框
        suggestion: ({ content }) => {
          chatRef.current?.addPrompt(content.prompt);
        },
      },
    },
  };

  return (
    <div>
      {/* 操作按钮 */}
      <div style={{ marginBottom: '16px', padding: '12px', background: '#f5f5f5', borderRadius: '4px' }}>
        <div style={{ marginBottom: '8px', fontSize: '14px', fontWeight: 500 }}>快捷指令：</div>
        <Space>
          <Button variant="outline" size="small" onClick={loadHistory} disabled={hasHistory}>
            加载历史消息
          </Button>
          <Button variant="outline" size="small" onClick={clearMessages} disabled={!hasHistory}>
            清空历史消息
          </Button>
        </Space>
      </div>
      {/* 聊天组件 */}
      <div style={{ height: '500px' }}>
        <ChatBot
          ref={chatRef}
          defaultMessages={defaultMessages}
          messageProps={messageProps}
          chatServiceConfig={chatServiceConfig}
        />
      </div>
    </div>
  );
}
