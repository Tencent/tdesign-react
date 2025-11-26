import React, { useState, useEffect, useRef, ReactNode, useMemo } from 'react';
import {
  ChatList,
  ChatSender,
  ChatMessage,
  ChatActionBar,
  ChatLoading,
  isAIMessage,
  type TdChatSenderParams,
  type ChatRequestParams,
  type TdChatMessageConfig,
  type ChatMessagesData,
  type AIMessageContent,
  type TdChatActionsName,
  type ToolCall,
  ToolCallRenderer,
  type AgentToolcallConfig,
  type ToolcallComponentProps,
} from '@tdesign-react/chat';
import { useChat, useAgentToolcall } from '@tdesign-react/chat';
import { MessagePlugin, Card, Space, Loading } from 'tdesign-react';
import { AGUIAdapter } from '../core';

/**
 * GetAccessService 工具调用参数类型
 */
interface GetAccessServiceArgs {
  id: string;
}

/**
 * GetAccessUpstream 工具调用参数类型
 */
interface GetAccessUpstreamArgs {
  id: string;
}

/**
 * GetAccessService 工具调用组件
 */
const GetAccessServiceComponent: React.FC<ToolcallComponentProps<GetAccessServiceArgs>> = ({
  args,
  status,
  result,
  error,
}) => {
  console.log('[GetAccessService] Component 渲染:', args.id, status, { result, error });

  return (
    <Card title="GetAccessService 调用" bordered style={{ marginTop: '8px' }}>
      <Space direction="vertical" style={{ width: '100%' }}>
        <div>
          <strong>状态:</strong>
          <span
            style={{
              marginLeft: '8px',
              padding: '2px 8px',
              borderRadius: '4px',
              background:
                status === 'completed' ? '#52c41a' : status === 'running' ? '#1890ff' : '#faad14',
              color: 'white',
            }}
          >
            {status}
          </span>
        </div>
        <div>
          <strong>参数:</strong>
          <pre style={{ background: '#f5f5f5', padding: '8px', borderRadius: '4px' }}>
            {JSON.stringify(args, null, 2)}
          </pre>
        </div>
        {status === 'running' && <Loading text="加载中..." />}
        {status === 'error' && error && (
          <div style={{ color: '#ff4d4f' }}>
            <strong>错误:</strong> {error.message}
          </div>
        )}
        {status === 'completed' && result && (
          <div>
            <strong>结果:</strong>
            <pre
              style={{
                background: '#f5f5f5',
                padding: '8px',
                borderRadius: '4px',
                maxHeight: '200px',
                overflow: 'auto',
              }}
            >
              {typeof result === 'string' ? JSON.stringify(JSON.parse(result), null, 2) : JSON.stringify(result, null, 2)}
            </pre>
          </div>
        )}
      </Space>
    </Card>
  );
};

/**
 * GetAccessUpstream 工具调用组件
 */
const GetAccessUpstreamComponent: React.FC<ToolcallComponentProps<GetAccessUpstreamArgs>> = ({
  args,
  status,
  result,
  error,
}) => {
  console.log('[GetAccessUpstream] Component 渲染:', { args, status, result, error });

  return (
    <Card title="GetAccessUpstream 调用" bordered style={{ marginTop: '8px' }}>
      <Space direction="vertical" style={{ width: '100%' }}>
        <div>
          <strong>状态:</strong>
          <span
            style={{
              marginLeft: '8px',
              padding: '2px 8px',
              borderRadius: '4px',
              background:
                status === 'completed' ? '#52c41a' : status === 'running' ? '#1890ff' : '#faad14',
              color: 'white',
            }}
          >
            {status}
          </span>
        </div>
        <div>
          <strong>参数:</strong>
          <pre style={{ background: '#f5f5f5', padding: '8px', borderRadius: '4px' }}>
            {JSON.stringify(args, null, 2)}
          </pre>
        </div>
        {status === 'running' && <Loading text="加载中..." />}
        {status === 'error' && error && (
          <div style={{ color: '#ff4d4f' }}>
            <strong>错误:</strong> {error.message}
          </div>
        )}
        {status === 'completed' && result && (
          <div>
            <strong>结果:</strong>
            <pre
              style={{
                background: '#f5f5f5',
                padding: '8px',
                borderRadius: '4px',
                maxHeight: '200px',
                overflow: 'auto',
              }}
            >
              {typeof result === 'string' ? JSON.stringify(JSON.parse(result), null, 2) : JSON.stringify(result, null, 2)}
            </pre>
          </div>
        )}
      </Space>
    </Card>
  );
};

/**
 * AG-UI 协议基础示例
 * 
 * 学习目标：
 * - 开启 AG-UI 协议支持（protocol: 'agui'）
 * - 理解 AG-UI 协议的自动解析机制
 * - 处理文本消息事件（TEXT_MESSAGE_*）
 * - 初始化加载历史消息方法 AGUIAdapter.convertHistoryMessages
 * - 调试 ToolCall 组件状态问题
 */
export default function AguiBasicExample() {
  const [inputValue, setInputValue] = useState('AG-UI协议的作用是什么');
  const listRef = useRef<any>(null);

  // ========== ToolCall 配置 ==========
  const toolcallActions: AgentToolcallConfig[] = [
    {
      name: 'GetAccessService',
      description: '获取访问服务信息',
      parameters: [{ name: 'id', type: 'string', required: true }],
      component: GetAccessServiceComponent,
    },
    {
      name: 'GetAccessUpstream',
      description: '获取访问上游信息',
      parameters: [{ name: 'id', type: 'string', required: true }],
      component: GetAccessUpstreamComponent,
    },
  ];

  // 注册 ToolCall
  useAgentToolcall(toolcallActions);

  const { chatEngine, messages, status } = useChat({
    defaultMessages: [],
    chatServiceConfig: {
      endpoint: 'http://localhost:9000/sse/agui-simple',
      // 开启 AG-UI 协议解析支持
      protocol: 'agui',
      stream: true,
      // 自定义请求参数
      onRequest: (params: ChatRequestParams) => ({
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

  const senderLoading = useMemo(() => status === 'pending' || status === 'streaming', [status]);

  // 消息属性配置
  const messageProps: TdChatMessageConfig = {
    user: { variant: 'base', placement: 'right' },
    assistant: {
      placement: 'left',
      handleActions: {
        suggestion: (data) => {
          setInputValue(data.content.prompt);
        },
      },
    },
  };

  // 操作栏配置
  const getActionBar = (isLast: boolean): TdChatActionsName[] => {
    const actions: TdChatActionsName[] = ['good', 'bad'];
    if (isLast) actions.unshift('replay');
    return actions;
  };

  // 操作处理
  const handleAction = (name: string) => {
    if (name === 'replay') {
      chatEngine.regenerateAIMessage();
    }
  };

  // 处理工具调用响应（如果需要交互式工具）
  const handleToolCallRespond = async <T extends object = any>(toolcall: ToolCall, response: T) => {
    const tools = chatEngine.getToolcallByName(toolcall.toolCallName) || {};
    await chatEngine.sendAIMessage({
      params: {
        prompt: inputValue,
        toolCallMessage: { ...tools, result: JSON.stringify(response) },
      },
      sendRequest: true,
    });
  };

  // 渲染消息内容
  const renderMessageContent = (item: AIMessageContent, index: number, isLast: boolean): ReactNode => {
    if (item.type === 'suggestion' && !isLast) {
      return <div slot={`${item.type}-${index}`} key={`suggestion-${index}`} />;
    }
    // 支持 toolcall 和 toolcall-${toolCallName} 格式
    if ((item.type === 'toolcall' || item.type.startsWith('toolcall-')) && item.data) {
      return (
        <div slot={`${item.type}-${index}`} key={`toolcall-${index}`}>
          <ToolCallRenderer toolCall={item.data} onRespond={handleToolCallRespond} />
        </div>
      );
    }
    return null;
  };

  // 渲染消息体
  const renderMsgContents = (message: ChatMessagesData, isLast: boolean): ReactNode => (
    <>
      {message.content?.map((item, index) => renderMessageContent(item, index, isLast))}
      {isAIMessage(message) && message.status === 'complete' ? (
        <ChatActionBar
          slot="actionbar"
          actionBar={getActionBar(isLast)}
          handleAction={handleAction}
        />
      ) : (
        isLast &&
        message.status !== 'stop' && (
          <div slot="actionbar">
            <ChatLoading animation="dot" />
          </div>
        )
      )}
    </>
  );

  // 发送消息
  const handleSend = async (e: CustomEvent<TdChatSenderParams>) => {
    await chatEngine.sendUserMessage({ prompt: e.detail.value });
    setInputValue('');
  };

  return (
    <div style={{ height: '500px', display: 'flex', flexDirection: 'column' }}>
      <ChatList ref={listRef}>
        {messages.map((message, idx) => (
          <ChatMessage key={message.id} {...messageProps[message.role]} message={message as any}>
            {renderMsgContents(message, idx === messages.length - 1)}
          </ChatMessage>
        ))}
      </ChatList>

      <ChatSender
        value={inputValue}
        placeholder="请输入内容，体验 AG-UI 协议"
        loading={senderLoading}
        onChange={(e) => setInputValue(e.detail)}
        onSend={handleSend as any}
        onStop={() => chatEngine.abortChat()}
      />
    </div>
  );
}
