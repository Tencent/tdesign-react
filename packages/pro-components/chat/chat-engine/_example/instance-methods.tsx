import React, { useState } from 'react';
import {
  ChatList,
  ChatSender,
  ChatMessage,
  useChat,
  type SSEChunkData,
  type AIMessageContent,
  type TdChatSenderParams,
} from '@tdesign-react/chat';
import { Button, Space, MessagePlugin } from 'tdesign-react';

/**
 * 实例方法示例
 * 
 * 学习目标：
 * - 通过 chatEngine 调用实例方法
 * - 了解各种实例方法的使用场景
 * 
 * 方法分类：
 * 1. 消息设置：sendUserMessage、sendSystemMessage、setMessages
 * 2. 发送控制: regenerateAIMessage、abortChat
 * 3. 获取状态
 */
export default function InstanceMethods() {
  const [inputValue, setInputValue] = useState('');

  const { chatEngine, messages, status } = useChat({
    defaultMessages: [],
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

  // 1. 发送用户消息
  const handleSendUserMessage = () => {
    chatEngine.sendUserMessage({
      prompt: '这是通过实例方法发送的用户消息',
    });
  };

  const handleSendAIMessage = () => {
    chatEngine.sendAIMessage({
      params: {
        prompt: '这是通过实例方法发送的用户消息',
      },
      content: [{
        type: 'text',
        data: '这是通过实例方法发送的AI回答',
      }],
      sendRequest: false,
    });
  };

  // 2. 发送系统消息
  const handleSendSystemMessage = () => {
    chatEngine.sendSystemMessage('这是一条系统通知消息');
  };

  // 3. 填充提示语到输入框
  const handleAddPrompt = () => {
    setInputValue('请介绍一下 TDesign');
  };

  // 4. 批量设置消息
  const handleSetMessages = () => {
    chatEngine.setMessages(
      [
        {
          id: `msg-${Date.now()}`,
          role: 'assistant',
          content: [{ type: 'text', data: '这是通过 setMessages 设置的消息' }],
          status: 'complete',
        },
      ],
      'replace',
    );
  };

  // 5. 清空消息
  const handleClearMessages = () => {
    chatEngine.setMessages([], 'replace');
  };

  // 6. 重新生成最后一条消息
  const handleRegenerate = () => {
    chatEngine.regenerateAIMessage();
  };

  // 7. 中止当前请求
  const handleAbort = () => {
    chatEngine.abortChat();
    MessagePlugin.info('已中止当前请求');
  };

  // 8. 获取当前状态
  const handleGetStatus = () => {
    const statusInfo = {
      chatStatus: status,
      messagesCount: messages.length,
    };
    console.log('当前状态:', statusInfo);
    MessagePlugin.info(`状态: ${statusInfo.chatStatus}, 消息数: ${statusInfo.messagesCount}`);
  };

  // 发送消息
  const handleSend = async (e: CustomEvent<TdChatSenderParams>) => {
    const { value } = e.detail;
    await chatEngine.sendUserMessage({ prompt: value });
    setInputValue('');
  };

  return (
    <div>
      {/* 操作按钮区域 */}
      <div style={{ marginBottom: '16px', padding: '12px', background: '#f5f5f5', borderRadius: '4px' }}>
        <div style={{ marginBottom: '8px', fontSize: '14px', fontWeight: 500 }}>快捷指令：</div>
        <Space size="small" breakLine>
          <Button size="small" variant="outline" onClick={handleSendUserMessage}>
            发送用户消息
          </Button>
          <Button size="small" variant="outline" onClick={handleSendAIMessage}>
            发送AI消息
          </Button>
          <Button size="small" variant="outline" onClick={handleSendSystemMessage}>
            发送系统消息
          </Button>
          <Button size="small" variant="outline" onClick={handleSetMessages}>
            批量设置消息
          </Button>
          <Button size="small" variant="outline" onClick={handleClearMessages}>
            清空消息
          </Button>
          <Button size="small" variant="outline" onClick={handleRegenerate}>
            重新生成
          </Button>
          <Button size="small" variant="outline" onClick={handleAbort}>
            中止请求
          </Button>
          <Button size="small" variant="outline" onClick={handleAddPrompt}>
            填充提示语
          </Button>
          <Button size="small" variant="outline" onClick={handleGetStatus}>
            获取状态
          </Button>
        </Space>
      </div>

      {/* 聊天界面 */}
      <div style={{ height: '400px', display: 'flex', flexDirection: 'column' }}>
        <ChatList>
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
