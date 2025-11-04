import React, { useState } from 'react';
import {
  ChatList,
  ChatSender,
  ChatMessage,
  type TdChatSenderParams,
  type ChatRequestParams,
} from '@tdesign-react/chat';
import { useChat } from '../index';

/**
 * AG-UI 协议基础示例
 * 
 * 学习目标：
 * - 开启 AG-UI 协议支持（protocol: 'agui'）
 * - 理解 AG-UI 协议的自动解析机制
 * - 处理文本消息事件（TEXT_MESSAGE_*）
 * 
 * AG-UI 协议说明：
 * AG-UI（Agent-User Interface）是专为 AI Agent 与前端应用交互设计的轻量级协议，
 * 专注于实时交互、状态流式传输和人机协作。
 * 
 * 组件会自动解析以下标准事件：
 * - TEXT_MESSAGE_START/CHUNK/COMPLETE: 文本消息
 * - THINKING_START/CHUNK/COMPLETE: 思考过程
 * - TOOL_CALL_START/CHUNK/COMPLETE: 工具调用
 * - STATE_START/CHUNK/COMPLETE: 状态更新
 * 等等...
 */
export default function AguiBasicExample() {
  const [inputValue, setInputValue] = useState('AG-UI协议的作用是什么');

  const { chatEngine, messages, status } = useChat({
    defaultMessages: [],
    chatServiceConfig: {
      endpoint: 'https://1257786608-9i9j1kpa67.ap-guangzhou.tencentscf.com/sse/agui-simple',
      // 开启 AG-UI 协议解析支持
      protocol: 'agui',
      stream: true,
      // 自定义请求参数
      onRequest: (params: ChatRequestParams) => ({
        headers: {
          'Content-Type': 'application/json',
          'X-Requested-With': 'XMLHttpRequest',
        },
        body: JSON.stringify({
          uid: 'agui-demo',
          prompt: params.prompt,
        }),
      }),
      // 生命周期回调
      onStart: (chunk) => {
        console.log('AG-UI 流式传输开始:', chunk);
      },
      onComplete: (aborted, params, event) => {
        console.log('AG-UI 流式传输完成:', { aborted, event });
      },
      onError: (err) => {
        console.error('AG-UI 错误:', err);
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

      <ChatSender
        value={inputValue}
        placeholder="请输入内容，体验 AG-UI 协议"
        loading={status === 'pending' || status === 'streaming'}
        onChange={(e) => setInputValue(e.detail)}
        onSend={handleSend}
        onStop={() => chatEngine.abortChat()}
      />
    </div>
  );
}
