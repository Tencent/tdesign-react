import React, { useState, useRef, useMemo, ReactNode } from 'react';
import { ChatList, ChatSender, ChatMessage, useChat } from '@tdesign-react/chat';
import type {
  SSEChunkData,
  AIMessageContent,
  ChatRequestParams,
  ChatMessagesData,
  ChatServiceConfig,
} from '@tdesign-react/chat';
import { Card, Space, Radio, Tag, Button } from 'tdesign-react';
import { ErrorCircleFilledIcon, RefreshIcon } from 'tdesign-icons-react';

/**
 * AG-UI RUN_ERROR 示例
 *
 * 演示 AG-UI 协议中 RUN_ERROR 事件的处理：
 * 1. 默认渲染：使用内置的 text 类型 + error 状态展示
 * 2. 自定义渲染：通过 onMessage 返回自定义类型实现个性化错误展示
 *
 * 错误类型：
 * - default: 服务器内部错误
 * - timeout: 请求超时
 * - rate_limit: 频率限制
 * - auth: 认证失败
 * - network: 网络异常
 * - model: 模型不可用
 * - content_filter: 内容审核
 * - quota: 配额用完
 * - custom: 自定义错误（演示自定义渲染）
 */

// 错误类型选项
const ErrorTypeOptions = [
  { label: '默认错误', value: 'default' },
  { label: '请求超时', value: 'timeout' },
  { label: '频率限制', value: 'rate_limit' },
  { label: '认证失败', value: 'auth' },
  { label: '网络异常', value: 'network' },
  { label: '模型不可用', value: 'model' },
  { label: '内容审核', value: 'content_filter' },
  { label: '配额用完', value: 'quota' },
  { label: '自定义错误', value: 'custom' },
];

// 渲染模式选项
const RenderModeOptions = [
  { label: '默认渲染', value: 'default' },
  { label: '自定义渲染', value: 'custom' },
];

// ==================== 自定义错误内容类型扩展 ====================

declare global {
  interface AIContentTypeOverrides {
    'custom-error': {
      type: 'custom-error';
      status: 'error';
      data: {
        message: string;
        code: string;
        timestamp: number;
      };
    };
  }
}

// ==================== 自定义错误组件 ====================

interface CustomErrorProps {
  message: string;
  code: string;
  timestamp: number;
  onRetry?: () => void;
}

/**
 * 自定义错误展示组件
 * 更丰富的错误信息展示和交互
 */
const CustomErrorDisplay: React.FC<CustomErrorProps> = ({ message, code, timestamp, onRetry }) => {
  // 获取错误类型对应的颜色和图标
  const getErrorTheme = () => {
    switch (code) {
      case 'TIMEOUT':
      case 'RATE_LIMIT':
        return { color: '#faad14', label: '警告' };
      case 'AUTH':
      case 'QUOTA':
        return { color: '#ff4d4f', label: '错误' };
      case 'NETWORK':
      case 'MODEL':
        return { color: '#1890ff', label: '服务' };
      default:
        return { color: '#ff4d4f', label: '错误' };
    }
  };

  const theme = getErrorTheme();
  const time = new Date(timestamp).toLocaleTimeString();

  return (
    <Card
      bordered
      style={{
        marginTop: 8,
        width: '100%',
        borderColor: theme.color,
        borderLeftWidth: 4,
      }}
    >
      <Space direction="vertical" style={{ width: '100%' }}>
        {/* 错误标题 */}
        <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
          <ErrorCircleFilledIcon style={{ color: theme.color, fontSize: 20 }} />
          <span style={{ fontSize: 15, fontWeight: 600, color: '#333' }}>请求出错</span>
          <Tag theme="danger" variant="light" size="small">
            {code}
          </Tag>
        </div>

        {/* 错误消息 */}
        <div
          style={{
            padding: '12px 16px',
            background: '#fff2f0',
            borderRadius: 6,
            fontSize: 14,
            color: '#434343',
          }}
        >
          {message}
        </div>

        {/* 底部操作 */}
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <span style={{ fontSize: 12, color: '#999' }}>发生时间：{time}</span>
          {onRetry && (
            <Button size="small" variant="outline" icon={<RefreshIcon />} onClick={onRetry}>
              重试
            </Button>
          )}
        </div>
      </Space>
    </Card>
  );
};

// ==================== 主组件 ====================

const AguiErrorExample: React.FC = () => {
  const listRef = useRef<any>(null);
  const inputRef = useRef<any>(null);
  const [inputValue, setInputValue] = useState<string>('触发一个错误');
  const [errorType, setErrorType] = useState<string>('default');
  const [renderMode, setRenderMode] = useState<string>('custom');

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
              text: '这是 AG-UI RUN_ERROR 事件处理示例。选择错误类型和渲染模式，然后发送消息触发错误。',
            },
          ],
        },
      ] as any[],
    [],
  );

  // 聊天服务配置
  const chatServiceConfig: ChatServiceConfig = useMemo(
    () => ({
      endpoint: 'http://localhost:9001/sse/agui-error',
      protocol: 'agui',
      stream: true,
      onRequest: (params: ChatRequestParams) => ({
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          prompt: params.prompt,
          errorType,
        }),
      }),
      // 自定义消息解析 - 用于自定义错误渲染
      onMessage:
        renderMode === 'custom'
          ? (chunk: SSEChunkData): AIMessageContent | null => {
              const event = typeof chunk.data === 'string' ? JSON.parse(chunk.data) : chunk.data;

              // 拦截 RUN_ERROR 事件，返回自定义类型
              if (event.type === 'RUN_ERROR') {
                return {
                  type: 'custom-error',
                  status: 'error',
                  data: {
                    message: event.message || '未知错误',
                    code: event.code || 'UNKNOWN',
                    timestamp: event.timestamp || Date.now(),
                  },
                };
              }

              // 其他事件返回 null，使用默认处理
              return null;
            }
          : undefined,
      onError: (err: Error | Response) => {
        console.error('Chat Error:', err);
      },
    }),
    [errorType, renderMode],
  );

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

  // 渲染自定义错误内容
  const renderMessageContent = (message: ChatMessagesData, item: AIMessageContent, index: number): ReactNode => {
    if (item.type === 'custom-error') {
      const errorData = item.data as { message: string; code: string; timestamp: number };
      return (
        <div slot={`${item.type}-${index}`} key={`${message.id}-error-${index}`}>
          <CustomErrorDisplay
            message={errorData.message}
            code={errorData.code}
            timestamp={errorData.timestamp}
            onRetry={() => {
              chatEngine.sendUserMessage({ prompt: inputValue || '重试请求' });
            }}
          />
        </div>
      );
    }
    return null;
  };

  // 渲染消息内容
  const renderMsgContents = (message: ChatMessagesData): ReactNode => (
    <>{message.content?.map((item: any, index: number) => renderMessageContent(message, item, index))}</>
  );

  // 发送消息
  const sendHandler = async (e: any) => {
    const { value } = e.detail;
    await chatEngine.sendUserMessage({ prompt: value });
    setInputValue('');
  };

  return (
    <Space direction="vertical" style={{ width: '100%' }}>
      {/* 配置面板 */}
      <Card bordered style={{ marginBottom: 16 }}>
        <Space direction="vertical" style={{ width: '100%' }}>
          <div style={{ marginBottom: 8, fontSize: 14, fontWeight: 500 }}>示例说明：</div>
          <p style={{ margin: '8px 0', fontSize: 13, color: '#666' }}>
            演示 AG-UI 协议 RUN_ERROR 事件的默认渲染和自定义渲染实现。
          </p>

          {/* 错误类型选择 */}
          <div style={{ marginTop: 12 }}>
            <span style={{ fontSize: 13, marginRight: 12 }}>错误类型：</span>
            <Radio.Group value={errorType} onChange={(val) => setErrorType(val as string)} variant="default-filled">
              {ErrorTypeOptions.map((opt) => (
                <Radio.Button key={opt.value} value={opt.value}>
                  {opt.label}
                </Radio.Button>
              ))}
            </Radio.Group>
          </div>

          {/* 渲染模式选择 */}
          <div style={{ marginTop: 8 }}>
            <span style={{ fontSize: 13, marginRight: 12 }}>渲染模式：</span>
            <Radio.Group value={renderMode} onChange={(val) => setRenderMode(val as string)} variant="default-filled">
              {RenderModeOptions.map((opt) => (
                <Radio.Button key={opt.value} value={opt.value}>
                  {opt.label}
                </Radio.Button>
              ))}
            </Radio.Group>
          </div>

          <div style={{ marginTop: 8, fontSize: 12, color: '#999' }}>
            提示：默认渲染使用内置 text+error 状态，自定义渲染通过 onMessage 拦截返回 custom-error 类型
          </div>
        </Space>
      </Card>

      {/* 聊天区域 */}
      <div style={{ display: 'flex', flexDirection: 'column', height: '400px' }}>
        <ChatList ref={listRef}>
          {messages.map((message) => (
            <ChatMessage key={message.id} {...messageProps[message.role]} message={message}>
              {renderMsgContents(message)}
            </ChatMessage>
          ))}
        </ChatList>
        <ChatSender
          ref={inputRef}
          value={inputValue}
          placeholder="发送消息触发错误"
          loading={senderLoading}
          onChange={(e: any) => setInputValue(e.detail)}
          onSend={sendHandler}
          onStop={() => chatEngine.abortChat()}
        />
      </div>
    </Space>
  );
};

export default AguiErrorExample;
