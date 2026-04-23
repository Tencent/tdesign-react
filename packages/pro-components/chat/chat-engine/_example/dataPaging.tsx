import React, { useEffect, useRef, useState } from 'react';
import {
  ChatList,
  ChatSender,
  ChatMessage,
  useChat,
  SSEChunkData,
  AIMessageContent,
  TdChatSenderParams,
  ChatMessagesData,
} from '@tdesign-react/chat';

/** 每次加载的消息数量 */
const PAGE_SIZE = 10;

/**
 * 模拟后端接口：异步获取历史消息
 * @param count 消息数量
 * @param prefix 消息前缀（区分不同会话）
 */
function fetchHistoryMessages(count = 100, prefix = ''): Promise<ChatMessagesData[]> {
  return new Promise((resolve) => {
    setTimeout(() => {
      const messages: ChatMessagesData[] = [];
      for (let i = 0; i < count; i++) {
        const isUser = i % 2 === 0;
        if (isUser) {
          messages.push({
            id: `${prefix}msg-${i}`,
            role: 'user',
            status: 'complete',
            content: [
              {
                type: 'text',
                data: `${prefix}这是第 ${i + 1} 条用户消息，用于测试异步数据分页渲染。`,
              },
            ],
          });
        } else {
          messages.push({
            id: `${prefix}msg-${i}`,
            role: 'assistant',
            status: 'complete',
            content: [
              {
                type: 'markdown',
                data: `${prefix}这是第 ${
                  i + 1
                } 条 **AI 回复**。\n\n此示例模拟异步获取历史消息后，通过 \`chatEngine.setMessages\` 注入数据，useChat 内部自动处理分页。`,
              },
            ],
          });
        }
      }
      resolve(messages);
    }, 500); // 模拟 500ms 网络延迟
  });
}

/**
 * 数据分页渲染示例（异步获取数据）
 *
 * 学习目标：
 * - defaultMessages 为空，异步获取历史消息后直接通过 chatEngine.setMessages 注入
 * - useChat 内部自动检测从无到有的变化，自动处理分页切片
 * - useChat 返回 chatListProps，直接展开到 ChatList 上即可启用分页功能
 */
export default function DataPagingExample() {
  const [inputValue, setInputValue] = useState('');
  const [loading, setLoading] = useState(true);
  const [currentChat, setCurrentChat] = useState<'A' | 'B'>('A');

  const listRef = useRef<any>(null);

  const { chatEngine, messages, status, chatListProps } = useChat({
    chatServiceConfig: {
      endpoint: 'https://1257786608-9i9j1kpa67.ap-guangzhou.tencentscf.com/sse/normal',
      stream: true,
      onMessage: (chunk: SSEChunkData): AIMessageContent => {
        const { ...rest } = chunk.data;
        return {
          type: 'markdown',
          data: rest?.msg || '',
        };
      },
    },
    chatPagingConfig: {
      pageSize: PAGE_SIZE,
    },
  });

  // 模拟异步获取历史消息
  useEffect(() => {
    fetchHistoryMessages(100, '').then((historyMessages) => {
      chatEngine.setMessages(historyMessages, 'replace');
      setLoading(false);
    });
  }, [chatEngine]);

  // 切换会话：模拟从100条消息切换到5条消息，或反过来
  const handleSwitchChat = () => {
    const nextChat = currentChat === 'A' ? 'B' : 'A';
    setCurrentChat(nextChat);
    setLoading(true);

    // 会话A: 100条消息（有分页），会话B: 5条消息（无分页）
    const count = nextChat === 'A' ? 100 : 5;
    const prefix = nextChat === 'A' ? '' : `[会话B] `;

    fetchHistoryMessages(count, prefix).then((historyMessages) => {
      chatEngine.setMessages(historyMessages, 'replace');
      setLoading(false);
    });
  };

  // 发送消息
  const handleSend = async (e: CustomEvent<TdChatSenderParams>) => {
    const { value } = e.detail;
    await chatEngine.sendUserMessage({ prompt: value });
    setInputValue('');
    listRef.current?.scrollList({ to: 'bottom' });
  };

  // 停止生成
  const handleStop = () => {
    chatEngine.abortChat();
  };

  if (loading) {
    return (
      <div style={{ height: '600px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
        加载历史消息中...
      </div>
    );
  }

  return (
    <div style={{ height: '600px', display: 'flex', flexDirection: 'column' }}>
      {/* 消息数量提示 + 切换会话按钮 */}
      <div
        style={{
          padding: '8px 16px',
          fontSize: 13,
          color: '#888',
          borderBottom: '1px solid #e7e7e7',
          flexShrink: 0,
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
        }}
      >
        <span>
          当前会话：{currentChat}（渲染消息：{messages.length} 条）
        </span>
        <button
          onClick={handleSwitchChat}
          style={{
            padding: '4px 12px',
            fontSize: 12,
            cursor: 'pointer',
            borderRadius: 4,
            border: '1px solid #ddd',
            background: '#f5f5f5',
          }}
        >
          切换到会话 {currentChat === 'A' ? 'B（5条）' : 'A（100条）'}
        </button>
      </div>
      {/*
        数据分页：
        - chatListProps 由 useChat 返回，包含 hasMore / onLoadMore / onScroll
        - 直接展开到 ChatList 上即可
      */}
      <ChatList ref={listRef} style={{ flex: 1 }} defaultScrollTo="bottom" {...chatListProps}>
        {messages.map((message) => (
          <ChatMessage
            key={message.id}
            id={message.id}
            message={message}
            placement={message.role === 'user' ? 'right' : 'left'}
            variant={message.role === 'user' ? 'base' : 'text'}
            avatar={
              message.role === 'user'
                ? 'https://tdesign.gtimg.com/site/avatar.jpg'
                : 'https://tdesign.gtimg.com/site/chat-avatar.png'
            }
            name={message.role === 'user' ? '用户' : 'AI 助手'}
          />
        ))}
      </ChatList>

      {/* 输入框 */}
      <ChatSender
        value={inputValue}
        placeholder="请输入内容，也可以滚动到顶部查看历史消息"
        loading={status === 'pending' || status === 'streaming'}
        onChange={(e) => setInputValue(e.detail)}
        onSend={handleSend}
        onStop={handleStop}
      />
    </div>
  );
}
