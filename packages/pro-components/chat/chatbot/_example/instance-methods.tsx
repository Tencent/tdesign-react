import React, { useRef, useState } from 'react';
import { ChatBot, SSEChunkData, AIMessageContent, ChatServiceConfig, type TdChatbotApi } from '@tdesign-react/chat';
import { Button, Space, Divider, MessagePlugin } from 'tdesign-react';

/**
 * 实例方法示例
 * 
 * 学习目标：
 * - 通过 ref 获取组件实例
 * - 调用实例方法控制组件行为
 * - 了解各种实例方法的使用场景
 * 
 * 方法分类：
 * 1. 消息设置：sendUserMessage、sendSystemMessage、setMessages
 * 2. 发送控制: addPrompt、regenerate、abortChat、selectFile、scrollList
 * 3. 获取状态
 */
export default function InstanceMethods() {
  const chatRef = useRef<HTMLElement & TdChatbotApi>(null);
  const [ready, setReady] = useState(false);

  // 聊天服务配置
  const chatServiceConfig: ChatServiceConfig = {
    endpoint: 'https://1257786608-9i9j1kpa67.ap-guangzhou.tencentscf.com/sse/normal',
    stream: true,
    onMessage: (chunk: SSEChunkData): AIMessageContent => {
      const { type, ...rest } = chunk.data;
      return {
        type: 'markdown',
        data: rest?.msg || '',
      };
    },
  };

  // 组件就绪回调
  const handleChatReady = () => {
    console.log('ChatEngine 已就绪');
    setReady(true);
  };

  // 1. 发送用户消息
  const handleSendUserMessage = () => {
    chatRef.current?.sendUserMessage({
      prompt: '这是通过实例方法发送的用户消息',
    });
  };

  // 2. 发送系统消息
  const handleSendSystemMessage = () => {
    chatRef.current?.sendSystemMessage('这是一条系统通知消息');
  };

  // 3. 添加提示语到输入框
  const handleAddPrompt = () => {
    chatRef.current?.addPrompt('请介绍一下 TDesign');
  };

  // 4. 设置消息
  const handleSetMessages = () => {
    chatRef.current?.setMessages(
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

  // 4. 清空消息
  const handleClearMessages = () => {
    chatRef.current?.clearMessages();
  };

  // 5. 重新生成最后一条消息
  const handleRegenerate = () => {
    chatRef.current?.regenerate();
  };

  // 6. 中止当前请求
  const handleAbort = () => {
    chatRef.current?.abortChat();
    MessagePlugin.info('已中止当前请求');
  };

  // 7. 滚动列表
  const handleScrollToBottom = () => {
    chatRef.current?.scrollList({ to: 'bottom', behavior: 'smooth' });
  };

  // 8. 触发文件选择
  const handleSelectFile = () => {
    chatRef.current?.selectFile();
  };

  // 9. 获取当前状态
  const handleGetStatus = () => {
    const status = {
      isChatEngineReady: chatRef.current?.isChatEngineReady,
      chatStatus: chatRef.current?.chatStatus,
      senderLoading: chatRef.current?.senderLoading,
      messagesCount: chatRef.current?.chatMessageValue?.length || 0,
    };
    console.log('当前状态:', status);
    MessagePlugin.info(`状态: ${status.chatStatus}, 消息数: ${status.messagesCount}`);
  };

  return (
    <div>
      {/* 操作按钮区域 */}
      <div style={{ marginBottom: '16px' }}>
        <div style={{ marginBottom: '16px', padding: '12px', background: '#f5f5f5', borderRadius: '4px' }}>
          <div style={{ marginBottom: '8px', fontSize: '14px', fontWeight: 500 }}>快捷指令：</div>
          <Space size="small" breakLine>
          <Button size="small" variant="outline" onClick={handleSendUserMessage} disabled={!ready}>
            发送用户消息
          </Button>
          <Button size="small" variant="outline" onClick={handleSendUserMessage} disabled={!ready}>
            发送AI消息
          </Button>
          <Button size="small" variant="outline" onClick={handleSendSystemMessage} disabled={!ready}>
            发送系统消息
          </Button>
          <Button size="small" variant="outline" onClick={handleSetMessages} disabled={!ready}>
            批量设置消息
          </Button>
          <Button size="small" variant="outline" onClick={handleClearMessages} disabled={!ready}>
            清空消息
          </Button>
          <Button size="small" variant="outline" onClick={handleRegenerate} disabled={!ready}>
            重新生成
          </Button>
          <Button size="small" variant="outline" onClick={handleAbort} disabled={!ready}>
            中止请求
          </Button>
          <Button size="small" variant="outline" onClick={handleScrollToBottom} disabled={!ready}>
            滚动列表
          </Button>
          <Button size="small" variant="outline" onClick={handleAddPrompt} disabled={!ready}>
            填充提示语
          </Button>
          <Button size="small" variant="outline" onClick={handleSelectFile} disabled={!ready}>
            选择文件
          </Button>
          <Button size="small" variant="outline" onClick={handleGetStatus} disabled={!ready}>
            获取状态
          </Button>
          </Space>
        </div>
      </div>

      {/* 聊天组件 */}
      <div style={{ height: '500px' }}>
        <ChatBot ref={chatRef} chatServiceConfig={chatServiceConfig} onChatReady={handleChatReady} />
      </div>
    </div>
  );
}
