import React, { useState, useRef, useMemo } from 'react';
import { ChatList, ChatSender, ChatMessage, ChatActionBar, ChatLoading, isAIMessage, ToolCallRenderer, isToolCallContent , useChat, useAgentToolcall } from '@tdesign-react/chat';
import { Card, Space, Loading } from 'tdesign-react';

  
  const getStatusBackground = () => {
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
}) => {
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
          background: getStatusBackground(),
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
}) => {
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
          background: getStatusBackground(),
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
  const listRef = useRef(null);

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
  
  const {
    chatEngine,
    messages,
    status
  } = useChat({
    defaultMessages: [],
    chatServiceConfig: {
      endpoint: 'http://localhost:9000/sse/agui-simple',
      // 开启 AG-UI 协议解析支持
      protocol: 'agui',
      stream: true,
      // 自定义请求参数
      onRequest: params => ({
        body: JSON.stringify({
          uid: 'agui-demo',
          prompt: params.prompt
        })
      }),
      // 生命周期回调
      onStart: chunk => {
        console.log('AG-UI 流式传输开始:', chunk);
      },
      onComplete: (aborted, params, event) => {
        console.log('AG-UI 流式传输完成:', {
          aborted,
          event
        });
      },
      onError: err => {
        console.error('AG-UI 错误:', err);
      }
    }
  });
  const senderLoading = useMemo(() => status === 'pending' || status === 'streaming', [status]);

  // 消息属性配置
  const messageProps = {
    user: {
      variant: 'base',
      placement: 'right'
    },
    assistant: {
      placement: 'left',
      handleActions: {
        suggestion: data => {
          setInputValue(data.content.prompt);
        }
      }
    }
  };

  // 操作栏配置
  const getActionBar = isLast => {
    const actions = ['good', 'bad'];
    if (isLast) actions.unshift('replay');
    return actions;
  };

  // 操作处理
  const handleAction = name => {
    if (name === 'replay') {
      chatEngine.regenerateAIMessage();
    }
  };

  // 处理工具调用响应（如果需要交互式工具）
  const handleToolCallRespond = async (toolcall, response) => {
    const tools = chatEngine.getToolcallByName(toolcall.toolCallName) || {};
    await chatEngine.sendAIMessage({
      params: {
        prompt: inputValue,
        toolCallMessage: {
          ...tools,
          result: JSON.stringify(response)
        }
      },
      sendRequest: true
    });
  };

  // 渲染消息内容
  const renderMessageContent = (item, index, isLast) => {
    if (item.type === 'suggestion' && !isLast) {
      return <div slot={`${item.type}-${index}`} key={`suggestion-${index}`} />;
    }
    // 支持 toolcall-${toolCallName} 格式
    if (isToolCallContent(item) && item.data) {
      return <div slot={`${item.type}-${index}`} key={`toolcall-${index}`}>
          <ToolCallRenderer toolCall={item.data} onRespond={handleToolCallRespond} />
        </div>;
    }
    return null;
  };

  // 渲染消息体
  const renderMsgContents = (message, isLast) => <>
      {message.content?.map((item, index) => renderMessageContent(item, index, isLast))}
      {isAIMessage(message) && message.status === 'complete' ? <ChatActionBar slot="actionbar" actionBar={getActionBar(isLast)} handleAction={handleAction} /> : isLast && message.status !== 'stop' && <div slot="actionbar">
            <ChatLoading animation="dot" />
          </div>}
    </>;

  // 发送消息
  const handleSend = async e => {
    await chatEngine.sendUserMessage({
      prompt: e.detail.value
    });
    setInputValue('');
  };
  return <div style={{
    height: '500px',
    display: 'flex',
    flexDirection: 'column'
  }}>
      <ChatList ref={listRef}>
        {messages.map((message, idx) => <ChatMessage key={message.id} {...messageProps[message.role]} message={message}>
            {renderMsgContents(message, idx === messages.length - 1)}
          </ChatMessage>)}
      </ChatList>

      <ChatSender value={inputValue} placeholder="请输入内容，体验 AG-UI 协议" loading={senderLoading} onChange={e => setInputValue(e.detail)} onSend={handleSend} onStop={() => chatEngine.abortChat()} />
    </div>;
}
