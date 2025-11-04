import React, { ReactNode, useRef, useState } from 'react';
import {
  ChatList,
  ChatSender,
  ChatMessage,
  ChatActionBar,
  ChatLoading,
  type ChatMessagesData,
  type SSEChunkData,
  type AIMessageContent,
  type TdChatSenderParams,
  type TdChatMessageConfig,
  type TdChatActionsName,
  isAIMessage,
  getMessageContentForCopy,
} from '@tdesign-react/chat';
import { Avatar } from 'tdesign-react';
import { useChat } from '../index';

/**
 * 自定义 UI 示例
 * 
 * 学习目标：
 * - 自定义消息样式（头像、位置、气泡样式）
 * - 添加操作按钮（复制、点赞、重试等）
 * - 使用插槽自定义消息内容
 */
export default function CustomUIExample() {
  const [inputValue, setInputValue] = useState('');

  const { chatEngine, messages, status } = useChat({
    defaultMessages: [],
    chatServiceConfig: {
      endpoint: 'https://1257786608-9i9j1kpa67.ap-guangzhou.tencentscf.com/sse/normal',
      stream: true,
      onMessage: (chunk: SSEChunkData): AIMessageContent => {
        const { type, ...rest } = chunk.data;
        switch (type) {
          case 'think':
            return {
              type: 'thinking',
              data: {
                title: rest.title || '思考中',
                text: rest.content || '',
              },
              status: /耗时/.test(rest?.title) ? 'complete' : 'streaming',
            };
          case 'text':
            return {
              type: 'markdown',
              data: rest?.msg || '',
            };
          default:
            return null;
        }
      },
      onRequest: (params) => ({
        headers: { 'X-Requested-With': 'XMLHttpRequest' },
        body: JSON.stringify({
          uid: 'custom-ui-demo',
          think: true,
          ...params,
        }),
      }),
    },
  });

  // 消息配置
  const messageProps: TdChatMessageConfig = {
    user: {
      variant: 'base',
      placement: 'right',
      avatar: <Avatar image="https://tdesign.gtimg.com/site/avatar.jpg" />,
    },
    assistant: {
      variant: 'text',
      placement: 'left',
      avatar: <Avatar>AI</Avatar>,
      chatContentProps: {
        thinking: {
          maxHeight: 150,
          layout: 'block',
        },
      },
    },
  };

  // 操作按钮配置
  const getActionBar = (isLast: boolean): TdChatActionsName[] => {
    const actions: TdChatActionsName[] = ['copy', 'good', 'bad'];
    // 只有最后一条 AI 消息才能重新生成
    if (isLast) {
      actions.push('replay');
    }
    return actions;
  };

  // 操作按钮处理
  const handleAction = (name: string, data?: any) => {
    switch (name) {
      case 'replay':
        console.log('重新生成');
        chatEngine.regenerateAIMessage();
        break;
      case 'good':
        console.log('点赞', data);
        break;
      case 'bad':
        console.log('点踩', data);
        break;
      default:
        console.log('操作', name, data);
    }
  };

  // 渲染消息内容（添加操作栏或加载状态）
  const renderMessageContent = (message: ChatMessagesData, isLast: boolean): ReactNode => {
    if (isAIMessage(message) && message.status === 'complete') {
      return (
        <ChatActionBar
          slot="actionbar"
          actionBar={getActionBar(isLast)}
          handleAction={handleAction}
          copyText={getMessageContentForCopy(message)}
        />
      );
    }
    return <ChatLoading animation="dot" />;
  };

  const handleSend = async (e: CustomEvent<TdChatSenderParams>) => {
    const { value } = e.detail;
    await chatEngine.sendUserMessage({ prompt: value });
    setInputValue('');
  };

  return (
    <div style={{ height: '600px', display: 'flex', flexDirection: 'column' }}>
      <ChatList style={{ flex: 1 }}>
        {messages.map((message, idx) => (
          <ChatMessage key={message.id} {...messageProps[message.role]} message={message}>
            {renderMessageContent(message, idx === messages.length - 1)}
          </ChatMessage>
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
  );
}
