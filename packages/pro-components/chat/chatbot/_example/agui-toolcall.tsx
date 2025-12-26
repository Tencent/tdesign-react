import React, { useState, useRef } from 'react';
import { ChatBot, ToolCallRenderer, isToolCallContent, useAgentToolcall, ChatServiceConfig, TdChatMessageConfig, ChatMessagesData, ChatRequestParams } from '@tdesign-react/chat';
import { Card, Space, Loading } from 'tdesign-react';

/**
 * 获取状态背景色
 */
const getStatusBackground = (status: string) => {
  if (status === 'complete') return '#52c41a';
  if (status === 'executing') return '#1890ff';
  return '#faad14';
};

/**
 * GetAccessService 工具调用组件
 */
const GetAccessServiceComponent = ({
  args,
  status,
  result,
  error
}: any) => {
  console.log('[GetAccessService] Component 渲染:', args.id, status, {
    result,
    error
  });
  
  return <Card title="GetAccessService 调用" bordered style={{
    marginTop: '8px'
  }}>
      <Space direction="vertical" style={{
      width: '100%'
    }}>
        <div>
          <strong>状态:</strong>
          <span style={{
          marginLeft: '8px',
          padding: '2px 8px',
          borderRadius: '4px',
          background: getStatusBackground(status),
          color: 'white'
        }}>
            {status}
          </span>
        </div>
        <div>
          <strong>参数:</strong>
          <pre style={{
          background: '#f5f5f5',
          padding: '8px',
          borderRadius: '4px'
        }}>
            {JSON.stringify(args, null, 2)}
          </pre>
        </div>
        {status === 'executing' && <Loading text="加载中..." />}
        {status === 'error' && error && <div style={{
        color: '#ff4d4f'
      }}>
            <strong>错误:</strong> {error.message}
          </div>}
        {status === 'complete' && result && <div>
            <strong>结果:</strong>
            <pre style={{
          background: '#f5f5f5',
          padding: '8px',
          borderRadius: '4px',
          maxHeight: '200px',
          overflow: 'auto'
        }}>
              {typeof result === 'string' ? JSON.stringify(JSON.parse(result), null, 2) : JSON.stringify(result, null, 2)}
            </pre>
          </div>}
      </Space>
    </Card>;
};

/**
 * GetAccessUpstream 工具调用组件
 */
const GetAccessUpstreamComponent = ({
  args,
  status,
  result,
  error
}: any) => {
  console.log('[GetAccessUpstream] Component 渲染:', {
    args,
    status,
    result,
    error
  });
  return <Card title="GetAccessUpstream 调用" bordered style={{
    marginTop: '8px'
  }}>
      <Space direction="vertical" style={{
      width: '100%'
    }}>
        <div>
          <strong>状态:</strong>
          <span style={{
          marginLeft: '8px',
          padding: '2px 8px',
          borderRadius: '4px',
          background: getStatusBackground(status),
          color: 'white'
        }}>
            {status}
          </span>
        </div>
        <div>
          <strong>参数:</strong>
          <pre style={{
          background: '#f5f5f5',
          padding: '8px',
          borderRadius: '4px'
        }}>
            {JSON.stringify(args, null, 2)}
          </pre>
        </div>
        {status === 'executing' && <Loading text="加载中..." />}
        {status === 'error' && error && <div style={{
        color: '#ff4d4f'
      }}>
            <strong>错误:</strong> {error.message}
          </div>}
        {status === 'complete' && result && <div>
            <strong>结果:</strong>
            <pre style={{
          background: '#f5f5f5',
          padding: '8px',
          borderRadius: '4px',
          maxHeight: '200px',
          overflow: 'auto'
        }}>
              {typeof result === 'string' ? JSON.stringify(JSON.parse(result), null, 2) : JSON.stringify(result, null, 2)}
            </pre>
          </div>}
      </Space>
    </Card>;
};

/**
 * AG-UI 协议基础示例（使用 ChatBot 组件）
 *
 * 学习目标：
 * - 使用 ChatBot 组件替代 ChatList + ChatSender 的组合方式
 * - 开启 AG-UI 协议支持（protocol: 'agui'）
 * - 理解 AG-UI 协议的自动解析机制
 * - 处理文本消息事件（TEXT_MESSAGE_*）
 * - 通过 slot 渲染自定义 ToolCall 组件
 */
export default function AguiBasicExample() {
  const chatRef = useRef<HTMLElement & typeof ChatBot>(null);
  const [mockMessage, setMockMessage] = useState<ChatMessagesData[]>([]);

  // ========== ToolCall 配置 ==========
  const toolcallActions = [{
    name: 'GetAccessService',
    description: '获取访问服务信息',
    parameters: [{
      name: 'id',
      type: 'string',
      required: true
    }],
    component: GetAccessServiceComponent
  }, {
    name: 'GetAccessUpstream',
    description: '获取访问上游信息',
    parameters: [{
      name: 'id',
      type: 'string',
      required: true
    }],
    component: GetAccessUpstreamComponent
  }];

  // 注册 ToolCall
  useAgentToolcall(toolcallActions);

  // 消息属性配置
  const messageProps: TdChatMessageConfig = {
    user: {
      variant: 'base',
      placement: 'right'
    },
    assistant: {
      placement: 'left'
    }
  };

  // 聊天服务配置
  const chatServiceConfig: ChatServiceConfig = {
    endpoint: 'http://localhost:9000/sse/agui-simple',
    // 开启 AG-UI 协议解析支持
    protocol: 'agui',
    stream: true,
    // 自定义请求参数
    onRequest: (params: ChatRequestParams) => ({
      body: JSON.stringify({
        uid: 'agui-demo',
        prompt: params.prompt
      })
    }),
    // 生命周期回调
    onStart: () => {
      console.log('AG-UI 流式传输开始');
    },
    onComplete: (aborted) => {
      console.log('AG-UI 流式传输完成:', {
        aborted
      });
    },
    onError: (err) => {
      console.error('AG-UI 错误:', err);
    }
  };

  return (
    <div style={{ height: '500px' }}>
      <ChatBot
        ref={chatRef}
        style={{ height: '100%' }}
        defaultMessages={[]}
        messageProps={messageProps}
        senderProps={{
          defaultValue: 'AG-UI协议的作用是什么',
          placeholder: '请输入内容，体验 AG-UI 协议'
        }}
        chatServiceConfig={chatServiceConfig}
        onMessageChange={(e) => {
          setMockMessage(e.detail);
        }}
      >
        {/* 渲染自定义 ToolCall 组件 */}
        {mockMessage
          ?.map((msg) =>
            msg.content?.map((item, index) => {
              // 渲染 toolcall 类型的消息
              if (isToolCallContent(item) && item.data) {
                return (
                  <div slot={`${msg.id}-${item.type}-${index}`} key={`${msg.id}-toolcall-${index}`}>
                    <ToolCallRenderer toolCall={item.data} />
                  </div>
                );
              }
              return null;
            }),
          )
          .flat()}
      </ChatBot>
    </div>
  );
}
