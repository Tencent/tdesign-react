import React, { useState, useRef, useMemo, ReactNode } from 'react';
import {
  ChatList,
  ChatSender,
  ChatMessage,
  ChatActionBar,
  ChatLoading,
  useChat,
  useAgentToolcall,
  isToolCallContent,
  isAIMessage,
  ToolCallRenderer,
} from '@tdesign-react/chat';
import type {
  ChatServiceConfig,
  AgentToolcallConfig,
  ToolcallComponentProps,
  AIMessageContent,
  ChatMessagesData,
} from '@tdesign-react/chat';
import { Space, Radio, Card, Tag } from 'tdesign-react';
import { CheckCircleFilledIcon, LoadingIcon, TimeFilledIcon } from 'tdesign-icons-react';

/**
 * AG-UI 简化 Chunk 模式示例
 *
 * 演示 AG-UI 协议中的简化数据流模式：
 * 1. TEXT_MESSAGE_CHUNK：仅发送 Chunk 事件，客户端自动补全 Start → Content → End 生命周期
 * 2. TOOL_CALL_CHUNK：仅发送 Chunk 事件，客户端自动补全 Start → Args → End 生命周期
 * 3. 混合模式：TEXT_MESSAGE_CHUNK + TOOL_CALL_CHUNK 混合使用
 *
 * 这种简化模式的优势：
 * - 减少事件数量，简化后端实现
 * - 降低网络传输开销
 * - 客户端自动处理生命周期管理
 */

/**
 * 搜索工具组件 - 展示搜索参数的流式传入效果
 */
interface SearchArgs {
  query?: string;
  limit?: number;
  category?: string;
}

const SearchToolComponent: React.FC<ToolcallComponentProps<SearchArgs>> = ({ args, status }) => {
  const getStatusIcon = () => {
    if (status === 'idle' || status === 'executing') {
      return <LoadingIcon style={{ marginRight: 4 }} />;
    }
    if (status === 'complete') {
      return <CheckCircleFilledIcon style={{ marginRight: 4, color: '#52c41a' }} />;
    }
    return <TimeFilledIcon style={{ marginRight: 4, color: '#faad14' }} />;
  };

  const getStatusText = () => {
    if (status === 'idle') return '准备搜索...';
    if (status === 'executing') return '正在接收参数...';
    if (status === 'complete') return '参数接收完成';
    return '搜索中';
  };

  return (
    <Card bordered style={{ marginTop: 12 }}>
      <Space direction="vertical" style={{ width: '100%' }}>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
          <span style={{ fontSize: 14, fontWeight: 600 }}>🔍 搜索工具</span>
          <Tag theme={status === 'complete' ? 'success' : 'primary'} variant="light">
            {getStatusIcon()}
            {getStatusText()}
          </Tag>
        </div>

        {/* 流式展示参数 */}
        <div style={{ marginTop: 8, padding: 12, background: '#f5f5f5', borderRadius: 4, fontFamily: 'monospace' }}>
          <div style={{ fontSize: 12, color: '#666', marginBottom: 8 }}>参数 (流式接收中):</div>
          <pre style={{ margin: 0, fontSize: 12, whiteSpace: 'pre-wrap', wordBreak: 'break-all' }}>
            {args ? JSON.stringify(args, null, 2) : '等待参数...'}
          </pre>
        </div>

        {status === 'executing' && (
          <div style={{ fontSize: 12, color: '#1890ff', marginTop: 4 }}>
            ⏳ 参数正在流式传入，可以观察到 JSON 逐步构建的过程...
          </div>
        )}
      </Space>
    </Card>
  );
};

/**
 * 计算器工具组件 - 展示计算参数
 */
interface CalculateArgs {
  expression?: string;
  precision?: number;
}

const CalculateToolComponent: React.FC<ToolcallComponentProps<CalculateArgs>> = ({ args, status }) => {
  const getResult = () => {
    if (!args?.expression || status !== 'complete') return null;
    try {
      // 安全计算（仅用于演示）
      const result = args.expression.replace(/[^0-9+\-*/().]/g, '');
      // eslint-disable-next-line no-eval
      return eval(result);
    } catch {
      return '计算错误';
    }
  };

  const result = getResult();

  const getStatusText = () => {
    if (status === 'executing') return '接收参数中...';
    if (status === 'complete') return '计算完成';
    return '等待中';
  };

  return (
    <Card bordered style={{ marginTop: 12 }}>
      <Space direction="vertical" style={{ width: '100%' }}>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
          <span style={{ fontSize: 14, fontWeight: 600 }}>🧮 计算器工具</span>
          <Tag theme={status === 'complete' ? 'success' : 'warning'} variant="light">
            {getStatusText()}
          </Tag>
        </div>

        <div style={{ marginTop: 8, padding: 12, background: '#f5f5f5', borderRadius: 4 }}>
          <div style={{ fontSize: 13 }}>
            <strong>表达式：</strong>
            <code style={{ marginLeft: 8, padding: '2px 6px', background: '#e8e8e8', borderRadius: 4 }}>
              {args?.expression || '等待输入...'}
            </code>
          </div>
          {args?.precision !== undefined && (
            <div style={{ fontSize: 13, marginTop: 4 }}>
              <strong>精度：</strong> {args.precision} 位小数
            </div>
          )}
          {result !== null && (
            <div style={{ fontSize: 15, marginTop: 8, color: '#52c41a', fontWeight: 600 }}>
              <strong>结果：</strong> {result}
            </div>
          )}
        </div>
      </Space>
    </Card>
  );
};

/**
 * 天气查询工具组件
 */
interface WeatherArgs {
  city?: string;
  days?: number;
}

const WeatherToolComponent: React.FC<ToolcallComponentProps<WeatherArgs>> = ({ args, status }) => {
  const getStatusText = () => {
    if (status === 'executing') return '接收参数...';
    if (status === 'complete') return '参数完成';
    return '等待中';
  };

  return (
    <Card bordered style={{ marginTop: 12 }}>
      <Space direction="vertical" style={{ width: '100%' }}>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
          <span style={{ fontSize: 14, fontWeight: 600 }}>🌤️ 天气查询</span>
          <Tag theme={status === 'complete' ? 'success' : 'primary'} variant="light">
            {status === 'executing' && <LoadingIcon style={{ marginRight: 4 }} />}
            {getStatusText()}
          </Tag>
        </div>

        <div style={{ marginTop: 8, padding: 12, background: '#e6f7ff', borderRadius: 4 }}>
          <div style={{ fontSize: 13 }}>
            <strong>城市：</strong> {args?.city || <span style={{ color: '#999' }}>接收中...</span>}
          </div>
          {args?.days !== undefined && (
            <div style={{ fontSize: 13, marginTop: 4 }}>
              <strong>预报天数：</strong> {args.days} 天
            </div>
          )}
        </div>
      </Space>
    </Card>
  );
};

// 工具调用配置
const toolcallActions: AgentToolcallConfig[] = [
  {
    name: 'search',
    description: '搜索工具',
    parameters: [
      { name: 'query', type: 'string', required: true },
      { name: 'limit', type: 'number', required: false },
      { name: 'category', type: 'string', required: false },
    ],
    component: SearchToolComponent,
  },
  {
    name: 'calculate',
    description: '计算器工具',
    parameters: [
      { name: 'expression', type: 'string', required: true },
      { name: 'precision', type: 'number', required: false },
    ],
    component: CalculateToolComponent,
  },
  {
    name: 'weather',
    description: '天气查询工具',
    parameters: [
      { name: 'city', type: 'string', required: true },
      { name: 'days', type: 'number', required: false },
    ],
    component: WeatherToolComponent,
  },
];

// 模式选项
const ModeOptions = [
  { label: '纯文本 Chunk', value: 'text' },
  { label: '工具调用 Chunk', value: 'toolcall' },
  { label: '混合模式', value: 'mixed' },
];

// 模式对应的 endpoint
const EndpointMap: Record<string, string> = {
  text: 'https://1257786608-9i9j1kpa67.ap-guangzhou.tencentscf.com/sse/agui-text-chunk',
  toolcall: 'https://1257786608-9i9j1kpa67.ap-guangzhou.tencentscf.com/sse/agui-toolcall-chunk',
  mixed: 'https://1257786608-9i9j1kpa67.ap-guangzhou.tencentscf.com/sse/agui-mixed-chunk',
};

const AguiChunkExample: React.FC = () => {
  const listRef = useRef<any>(null);
  const inputRef = useRef<any>(null);
  const [inputValue, setInputValue] = useState<string>('测试简化 Chunk 模式');
  const [mode, setMode] = useState<string>('mixed');

  // 注册工具调用
  useAgentToolcall(toolcallActions);

  // 默认消息
  const defaultMessages = useMemo(
    () =>
      [
        {
          id: 'welcome',
          role: 'assistant' as const,
          content: [
            {
              type: 'text',
              text: '这是 AG-UI 简化 Chunk 模式示例。选择一种模式，然后发送消息进行测试。',
            },
          ],
        },
      ] as any[],
    [],
  );

  // 聊天服务配置
  const chatServiceConfig: () => ChatServiceConfig = () => ({
    endpoint: EndpointMap[mode],
    protocol: 'agui',
    stream: true,
    onRequest: (params) => ({
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        prompt: params.prompt,
        mode,
      }),
    }),
    onError: (err) => {
      console.error('Chat Error:', err);
    },
  });

  const { chatEngine, messages, status } = useChat({
    defaultMessages,
    chatServiceConfig,
  });

  const senderLoading = useMemo(() => status === 'pending' || status === 'streaming', [status]);

  // 消息配置
  const messageProps = {
    user: {
      variant: 'base' as const,
      placement: 'right' as const,
    },
    assistant: {
      placement: 'left' as const,
    },
  };

  // 发送消息
  const sendHandler = async (e: any) => {
    const { value } = e.detail;
    await chatEngine.sendUserMessage({ prompt: value });
    setInputValue('');
  };

  // 渲染消息内容 - 处理工具调用和系统消息
  const renderMessageContent = (item: AIMessageContent, index: number): ReactNode => {
    // 处理系统消息（ext.role === 'system'）
    // 系统消息需要渲染为独立的 ChatMessage 组件
    if ((item as any)?.ext?.role === 'system') {
      return (
        <ChatMessage
          key={`system-${index}`}
          slot={`system-text-${index}`}
          role="system"
          content={[{ type: 'text', data: item.data as string }]}
        />
      );
    }

    // 处理工具调用
    if (isToolCallContent(item) && item.data) {
      return (
        <div slot={`${item.type}-${index}`} key={`toolcall-${index}`}>
          <ToolCallRenderer toolCall={item.data} />
        </div>
      );
    }
    return null;
  };

  // 渲染消息体
  const renderMsgContents = (message: ChatMessagesData, isLast: boolean): ReactNode => (
    <>
      {message.content?.map((item, index) => renderMessageContent(item, index))}
      {isAIMessage(message) && message.status === 'complete' ? (
        <ChatActionBar slot="actionbar" actionBar={['good', 'bad']} />
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

  return (
    <Space direction="vertical" style={{ width: '100%' }}>
      {/* 配置面板 */}
      <Card bordered style={{ marginBottom: 16 }}>
        <Space direction="vertical" style={{ width: '100%' }}>
          <div style={{ marginBottom: 8, fontSize: 14, fontWeight: 500 }}>示例说明：</div>
          <p style={{ margin: '8px 0', fontSize: 13, color: '#666' }}>
            演示 AG-UI 协议的简化 Chunk 模式，服务端仅发送 Chunk 事件，客户端自动补全完整生命周期。
          </p>

          {/* 模式选择 */}
          <div style={{ marginTop: 12 }}>
            <span style={{ fontSize: 13, marginRight: 12 }}>测试模式：</span>
            <Radio.Group value={mode} onChange={(val) => setMode(val as string)} variant="default-filled">
              {ModeOptions.map((opt) => (
                <Radio.Button key={opt.value} value={opt.value}>
                  {opt.label}
                </Radio.Button>
              ))}
            </Radio.Group>
          </div>

          {/* 模式说明 */}
          <div style={{ marginTop: 12, padding: 12, background: '#f5f5f5', borderRadius: 4 }}>
            {mode === 'text' && (
              <div style={{ fontSize: 12, color: '#666' }}>
                <strong>纯文本 Chunk 模式：</strong>
                <br />
                服务端仅发送 TEXT_MESSAGE_CHUNK 事件，不发送 TEXT_MESSAGE_START/END。
                <br />
                客户端自动识别首个 chunk 并补全 Start 事件。
              </div>
            )}
            {mode === 'toolcall' && (
              <div style={{ fontSize: 12, color: '#666' }}>
                <strong>工具调用 Chunk 模式：</strong>
                <br />
                服务端仅发送 TOOL_CALL_CHUNK 事件，不发送 TOOL_CALL_START/END。
                <br />
                首个 chunk 需包含 toolCallName，后续 chunk 仅需 toolCallId 和 delta。
              </div>
            )}
            {mode === 'mixed' && (
              <div style={{ fontSize: 12, color: '#666' }}>
                <strong>混合模式：</strong>
                <br />
                同时使用 TEXT_MESSAGE_CHUNK 和 TOOL_CALL_CHUNK 简化模式。
                <br />
                展示文本输出 → 工具调用 → 工具结果 → 继续文本输出的完整流程。
              </div>
            )}
          </div>
        </Space>
      </Card>

      {/* 聊天区域 */}
      <div style={{ display: 'flex', flexDirection: 'column', height: '400px' }}>
        <ChatList ref={listRef}>
          {messages.map((message, idx) => (
            <ChatMessage key={message.id} {...messageProps[message.role]} message={message}>
              {renderMsgContents(message, idx === messages.length - 1)}
            </ChatMessage>
          ))}
        </ChatList>
        <ChatSender
          ref={inputRef}
          value={inputValue}
          placeholder="发送消息测试简化 Chunk 模式"
          loading={senderLoading}
          onChange={(e: any) => setInputValue(e.detail)}
          onSend={sendHandler}
          onStop={() => chatEngine.abortChat()}
        />
      </div>
    </Space>
  );
};

export default AguiChunkExample;
