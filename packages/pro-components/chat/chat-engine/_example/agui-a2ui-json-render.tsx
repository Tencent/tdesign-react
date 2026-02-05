/**
 * AG-UI + A2UI + json-render 集成示例
 *
 * 演示内容：
 * 1. 使用 AG-UI 协议（protocol: 'agui'）接收流式数据
 * 2. 通过 ACTIVITY_SNAPSHOT/ACTIVITY_DELTA 事件传递 A2UI 消息
 * 3. A2UIJsonRenderActivityRenderer 将 A2UI 转换为 json-render Schema
 * 4. 使用 json-render 高性能渲染引擎渲染 UI
 *
 * 核心概念：
 * - AG-UI 协议负责消息流的结构化传输
 * - A2UI 协议负责 UI 的声明式定义
 * - json-render 提供高性能渲染能力
 * - 三者通过 Activity 机制无缝集成
 */
import React, { useState, useRef, useMemo } from 'react';
import {
  ChatList,
  ChatSender,
  ChatMessage,
  type ChatRequestParams,
  isActivityContent,
  ActivityRenderer,
} from '@tdesign-react/chat';
import { useChat, useAgentActivity, createA2UIJsonRenderActivityConfig } from '@tdesign-react/chat';
import { MessagePlugin } from 'tdesign-react';

// Mock Server 地址
const MOCK_SERVER = 'http://localhost:9001';

export default function AguiA2UIJsonRenderExample() {
  const [inputValue, setInputValue] = useState('创建一个用户信息表单（A2UI + json-render）');
  const [currentStage, setCurrentStage] = useState<string>('');
  const listRef = useRef<any>(null);

  // 使用 useChat 创建 ChatEngine 实例
  const { chatEngine, messages, status } = useChat({
    defaultMessages: [],
    chatServiceConfig: {
      endpoint: `${MOCK_SERVER}/sse/a2ui-json-render-activity`,
      // 开启 AG-UI 协议解析
      protocol: 'agui',
      stream: true,
      // 自定义请求参数
      onRequest: (params: ChatRequestParams) => {
        const requestBody: Record<string, any> = {
          uid: 'agui-a2ui-json-render-demo',
          prompt: params.prompt,
          demoMode: true,
        };

        // 如果有用户操作消息，添加到请求体
        if ((params as any).userActionMessage) {
          requestBody.userActionMessage = (params as any).userActionMessage;
          console.log('📤 发送用户操作到服务端:', requestBody.userActionMessage);
        }

        return {
          body: JSON.stringify(requestBody),
        };
      },
      // 生命周期回调
      onStart: (chunk) => {
        console.log('[AG-UI] 流式传输开始:', chunk);
        setCurrentStage('🚀 开始流式传输');
      },
      onComplete: (aborted, _params, event) => {
        console.log('[AG-UI] 流式传输完成:', { aborted, event });
        setCurrentStage('✅ 传输完成');
      },
      onError: (err) => {
        console.error('[AG-UI] 错误:', err);
        const errorMsg = err instanceof Error ? err.message : '请求失败';
        MessagePlugin.error(`请求失败: ${errorMsg}`);
        setCurrentStage(`❌ 错误: ${errorMsg}`);
      },
    },
  });

  // 创建 A2UI + json-render Activity 配置
  const a2uiJsonRenderConfig = useMemo(
    () =>
      createA2UIJsonRenderActivityConfig({
        activityType: 'a2ui-json-render',
        debug: true, // 开启调试模式
        // Action 处理器映射表（统一使用 actionHandlers）
        actionHandlers: {
          // 重置操作：本地处理
          reset: async (params) => {
            console.log('🔄 重置表单:', params);
            // 注意：表单数据清空由 json-render 内部的 DataProvider 管理
            MessagePlugin.info('表单已重置');
            setCurrentStage('表单已重置');
          },

          // 提交操作：发送到服务端
          submit: async (params) => {
            console.log('🎯 提交表单:', params);
            setCurrentStage('提交表单...');

            try {
              await chatEngine.sendAIMessage({
                params: {
                  userActionMessage: {
                    name: 'submit',
                    params,
                    timestamp: new Date().toISOString(),
                  },
                },
                sendRequest: true,
              });

              setCurrentStage('表单提交成功');
              MessagePlugin.success('提交成功');
              listRef.current?.scrollList({ to: 'bottom' });
            } catch (error) {
              console.error('❌ 提交失败:', error);
              MessagePlugin.error(`提交失败: ${error instanceof Error ? error.message : '未知错误'}`);
              setCurrentStage('提交失败');
            }
          },

          // 取消操作：本地处理
          cancel: async (params) => {
            console.log('❌ 取消操作:', params);
            MessagePlugin.info('已取消');
            setCurrentStage('已取消');
          },
        },
      }),
    [chatEngine],
  );

  // 注册 A2UI + json-render Activity 渲染器
  useAgentActivity(a2uiJsonRenderConfig);

  // 发送消息
  const handleSend = async (e: CustomEvent<{ value: string }>) => {
    const { value } = e.detail;
    if (!value.trim()) return;

    // 重置状态
    setCurrentStage('');

    await chatEngine.sendUserMessage({ prompt: value });
    setInputValue('');
  };

  // 停止生成
  const handleStop = () => {
    chatEngine.abortChat();
    MessagePlugin.info('已停止生成');
  };

  // 渲染消息内容（Activity 需要手动渲染到 slot）
  const renderMessageContent = (item: any, index: number) => {
    if (isActivityContent(item)) {
      return (
        <div slot={`${item.type}-${index}`} key={`activity-${index}`}>
          <ActivityRenderer activity={item.data} />
        </div>
      );
    }
    return null;
  };

  const renderMsgContents = (message: any) => {
    if (Array.isArray(message.content)) {
      return <>{message.content.map((item: any, index: number) => renderMessageContent(item, index))}</>;
    }
    return null;
  };

  return (
    <div style={{ height: '800px', display: 'flex', flexDirection: 'column' }}>
      {/* 标题区域 */}
      <div style={{ marginBottom: '16px', padding: '12px', background: '#f5f5f5', borderRadius: '4px' }}>
        <h3 style={{ margin: 0, fontSize: '16px' }}>AG-UI + A2UI + json-render 集成演示</h3>
        <p style={{ margin: '4px 0 0', fontSize: '12px', color: 'var(--td-text-color-secondary)' }}>
          使用 A2UI 协议定义 UI，通过 json-render 高性能渲染引擎渲染
        </p>
        {currentStage && (
          <div
            style={{
              marginTop: '8px',
              fontSize: '12px',
              color: 'var(--td-text-color-primary)',
            }}
          >
            当前状态: {currentStage}
          </div>
        )}
      </div>

      {/* 消息列表 */}
      <ChatList ref={listRef} style={{ flex: 1, overflow: 'auto' }}>
        {messages.map((message) => (
          <ChatMessage
            key={message.id}
            message={message}
            placement={message.role === 'user' ? 'right' : 'left'}
            variant={message.role === 'user' ? 'base' : 'text'}
          >
            {renderMsgContents(message)}
          </ChatMessage>
        ))}
      </ChatList>

      {/* 输入区域 */}
      <ChatSender
        value={inputValue}
        placeholder="输入消息，例如：创建一个用户信息表单（A2UI + json-render）"
        loading={status === 'pending' || status === 'streaming'}
        onChange={(e: CustomEvent<string>) => setInputValue(e.detail)}
        onSend={handleSend as any}
        onStop={handleStop}
      />
    </div>
  );
}
