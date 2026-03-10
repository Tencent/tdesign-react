import React, { useState, useRef } from 'react';
import {
  ChatList,
  ChatSender,
  ChatMessage,
  type TdChatSenderParams,
  type ChatRequestParams,
} from '@tdesign-react/chat';
import { useChat } from '@tdesign-react/chat';

/**
 * OpenClaw 协议基础示例
 *
 * 学习目标：
 * - 开启 OpenClaw 协议支持（protocol: 'openclaw'）
 * - 理解 OpenClaw WebSocket 连接和流式消息传输
 * - 通过 onRequest 传入业务参数（sessionKey、token 等）
 *
 * 注意：需要启动 Mock Server（mock-server/online2/）才能正常运行
 * 启动命令：cd mock-server/online2 && node app.js
 */
export default function OpenClawBasicExample() {
  const [inputValue, setInputValue] = useState('你好，请介绍一下自己');
  const listRef = useRef<any>(null);

  const { chatEngine, messages, status } = useChat({
    defaultMessages: [],
    chatServiceConfig: {
      // WebSocket 端点
      endpoint: 'ws://127.0.0.1:18789',
      // 开启 OpenClaw 协议
      protocol: 'openclaw',
      stream: true,

      // OpenClaw 专属配置（仅协议层必需项，有默认值可不传）
      openclaw: {
        heartbeatInterval: 30000,
        client: {
          id: 'tdesign-demo',
          version: '1.0.0',
          mode: 'webchat',
        },
      },

      // 通过 onRequest 传入业务参数
      // sessionKey、token 等敏感/业务相关参数在这里配置
      onRequest: (params: ChatRequestParams) => ({
        sessionKey: 'demo-session',
        message: params.prompt,
        // token: await getTokenFromBackend(),  // 实际业务中可从后端获取
      }),

      // 生命周期回调
      onStart: (chunk) => {
        console.log('OpenClaw 流式传输开始:', chunk);
      },
      onComplete: (aborted, params) => {
        console.log('OpenClaw 流式传输完成:', { aborted, params });
      },
      onError: (err) => {
        console.error('OpenClaw 错误:', err);
      },
    },
  });

  const handleSend = async (e: CustomEvent<TdChatSenderParams>) => {
    const { value } = e.detail;
    await chatEngine.sendUserMessage({ prompt: value });
    setInputValue('');
  };

  return (
    <div style={{ height: '500px', display: 'flex', flexDirection: 'column' }}>
      <ChatList ref={listRef}>
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
        placeholder="请输入内容，体验 OpenClaw 协议（需启动 Mock Server）"
        loading={status === 'pending' || status === 'streaming'}
        onChange={(e) => setInputValue(e.detail)}
        onSend={handleSend}
        onStop={() => chatEngine.abortChat()}
      />
    </div>
  );
}
