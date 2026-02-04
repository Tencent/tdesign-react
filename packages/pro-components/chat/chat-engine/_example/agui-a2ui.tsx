/**
 * AG-UI + A2UI 集成示例
 *
 * 演示内容：
 * 1. 使用 AG-UI 协议（protocol: 'agui'）接收流式数据
 * 2. 通过 ACTIVITY_SNAPSHOT/ACTIVITY_DELTA 事件传递 A2UI Surface 数据
 * 3. 使用 useAgentActivity 注册 A2UI 渲染器
 * 4. 完整的 ChatEngine 实例用法展示
 *
 * 核心概念：
 * - AG-UI 协议负责消息流的结构化传输
 * - A2UI 协议负责动态 UI 的声明式渲染
 * - 两者通过 Activity 机制无缝集成
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
import { useChat, useAgentActivity } from '@tdesign-react/chat';
import { MessagePlugin } from 'tdesign-react';

import {
  createA2UIActivityConfig,
} from '../components/a2ui';

// Mock Server 地址
const MOCK_SERVER = 'https://1257786608-9i9j1kpa67.ap-guangzhou.tencentscf.com';

export default function AguiA2UIExample() {
  const [inputValue, setInputValue] = useState('帮我创建一个用户信息表单');
  const [currentStage, setCurrentStage] = useState<string>('');
  const listRef = useRef<any>(null);

    // 使用 useChat 创建 ChatEngine 实例
  const { chatEngine, messages, status } = useChat({
    defaultMessages: [],
    chatServiceConfig: {
      endpoint: `${MOCK_SERVER}/sse/a2ui-activity`,
      // 开启 AG-UI 协议解析
      protocol: 'agui',
      stream: true,
      // 自定义请求参数
      onRequest: (params: ChatRequestParams) => {
        // 构造请求体，支持普通消息和用户操作消息
        const requestBody: Record<string, any> = {
          uid: 'agui-a2ui-demo',
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

  // 创建 A2UI Activity 配置
  // 使用内置的 A2UI 0.9 协议标准 Action 处理
  const a2uiActivityConfig = useMemo(
    () =>
      createA2UIActivityConfig({
        activityType: 'a2ui-surface',
        loading: false, // 关闭骨架屏，避免残留问题
        // Action 处理回调：接收解析后的结果，自行决定如何处理
        onAction: async ({ userActionMessage, action, actionContext }) => {
          console.log('🎯 A2UI Action 触发:', userActionMessage);
          setCurrentStage(`处理操作: ${userActionMessage.name}`);
          
          // 根据 action.name 决定处理方式
          if (action.name === 'reset') {
            // 本地处理：重置表单数据，不发送请求
            actionContext?.updateData('/userInfo', {
              name: '',
              email: '',
              phone: '',
              gender: '',
            });
            setCurrentStage('表单已重置');
            return;
          }
          
          // 其他操作：发送请求到服务端
          try {
            await chatEngine.sendAIMessage({
              params: { userActionMessage },
              sendRequest: true,
            });
            
            setCurrentStage(`操作 "${userActionMessage.name}" 已发送到服务端`);
            listRef.current?.scrollList({ to: 'bottom' });
          } catch (error) {
            console.error('❌ 服务端处理失败:', error);
            MessagePlugin.error(`操作失败: ${error instanceof Error ? error.message : '未知错误'}`);
            setCurrentStage('操作处理失败');
          }
        },
      }),
    [chatEngine],
  );

  // 注册 A2UI Activity 渲染器
  useAgentActivity(a2uiActivityConfig);

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
      <div
       style={{ marginBottom: '16px', padding: '12px', background: '#f5f5f5', borderRadius: '4px' }}
      >
        <h3 style={{ margin: 0, fontSize: '16px' }}>AG-UI + A2UI 用户信息采集演示 (v0.9)</h3>
        <p style={{ margin: '4px 0 0', fontSize: '12px', color: 'var(--td-text-color-secondary)' }}>
          演示完整的用户信息采集流程：流式渲染 → 用户填写 → 操作反馈 → 数据处理
        </p>
        {currentStage && (
          <div style={{ 
            marginTop: '8px', 
            fontSize: '12px',
            color: 'var(--td-text-color-primary)'
          }}>
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
        placeholder="输入消息，例如：帮我创建一个用户信息表单"
        loading={status === 'pending' || status === 'streaming'}
        onChange={(e: CustomEvent<string>) => setInputValue(e.detail)}
        onSend={handleSend as any}
        onStop={handleStop}
      />
    </div>
  );
}

