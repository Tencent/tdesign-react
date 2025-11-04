import React, { useState, useEffect } from 'react';
import {
  ChatList,
  ChatSender,
  ChatMessage,
  type SSEChunkData,
  type AIMessageContent,
  type TdChatSenderParams,
} from '@tdesign-react/chat';
import { Space, Tag } from 'tdesign-react';
import { useChat } from '../index';

/**
 * 生命周期示例
 * 
 * 学习目标：
 * - 监听聊天状态变化（idle、pending、streaming、complete、error）
 * - 使用生命周期回调（onStart、onComplete、onError、onAbort）
 * - 理解状态流转过程
 */
export default function LifecycleExample() {
  const [inputValue, setInputValue] = useState('');
  const [logs, setLogs] = useState<string[]>([]);

  // 添加日志
  const addLog = (message: string) => {
    setLogs((prev) => [...prev, `[${new Date().toLocaleTimeString()}] ${message}`]);
  };

  const { chatEngine, messages, status } = useChat({
    defaultMessages: [],
    chatServiceConfig: {
      endpoint: 'https://1257786608-9i9j1kpa67.ap-guangzhou.tencentscf.com/sse/normal',
      stream: true,
      // 开始流式传输
      onStart: (chunk) => {
        addLog('🚀 开始流式传输');
        console.log('onStart:', chunk);
      },
      // 数据转换
      onMessage: (chunk: SSEChunkData): AIMessageContent => {
        const { type, ...rest } = chunk.data;
        return {
          type: 'markdown',
          data: rest?.msg || '',
        };
      },
      // 完成（包括正常完成和用户中止）
      onComplete: (aborted, params, event) => {
        if (aborted) {
          addLog('⏹️ 用户中止对话');
        } else {
          addLog('✅ 对话完成');
        }
        console.log('onComplete:', { aborted, params, event });
      },
      // 错误处理
      onError: (err) => {
        addLog(`❌ 发生错误: ${err.message || '未知错误'}`);
        console.error('onError:', err);
      },
      // 用户主动中止
      onAbort: async () => {
        addLog('🛑 执行中止清理');
        console.log('onAbort');
      },
    },
  });

  // 监听状态变化
  useEffect(() => {
    const statusMap = {
      idle: '空闲',
      pending: '等待响应',
      streaming: '流式传输中',
      complete: '完成',
      error: '错误',
    };
    addLog(`📊 状态变更: ${statusMap[status] || status}`);
  }, [status]);

  const handleSend = async (e: CustomEvent<TdChatSenderParams>) => {
    const { value } = e.detail;
    addLog(`📤 发送消息: ${value}`);
    await chatEngine.sendUserMessage({ prompt: value });
    setInputValue('');
  };

  const handleStop = () => {
    addLog('🔴 点击停止按钮');
    chatEngine.abortChat();
  };

  // 获取状态标签颜色
  const getStatusTheme = () => {
    switch (status) {
      case 'idle':
        return 'default';
      case 'pending':
        return 'warning';
      case 'streaming':
        return 'primary';
      case 'complete':
        return 'success';
      case 'error':
        return 'danger';
      default:
        return 'default';
    }
  };

  return (
    <div>
      {/* 状态显示 */}
      <Space style={{ marginBottom: '16px' }}>
        <span>当前状态：</span>
        <Tag theme={getStatusTheme()}>{status}</Tag>
      </Space>

      {/* 聊天界面 */}
      <div style={{ height: '400px', display: 'flex', flexDirection: 'column' }}>
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
          placeholder="请输入内容"
          loading={status === 'pending' || status === 'streaming'}
          onChange={(e) => setInputValue(e.detail)}
          onSend={handleSend}
          onStop={handleStop}
        />
      </div>

      {/* 日志面板 */}
      <div
        style={{
          marginTop: '16px',
          padding: '12px',
          background: '#f5f5f5',
          borderRadius: '4px',
          maxHeight: '200px',
          overflow: 'auto',
        }}
      >
        <div style={{ fontWeight: 'bold', marginBottom: '8px' }}>生命周期日志：</div>
        {logs.map((log, idx) => (
          <div key={idx} style={{ fontSize: '12px', lineHeight: '20px', fontFamily: 'monospace' }}>
            {log}
          </div>
        ))}
      </div>
    </div>
  );
}
