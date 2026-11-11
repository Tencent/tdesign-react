import React, { useMemo, useRef, useState } from 'react';
import { Button, Card, InputNumber, MessagePlugin, Select, Space, Tag } from 'tdesign-react';
import { ChatList, ChatMessage, ChatSender } from '@tdesign-react/chat';

import { useChat, useInterrupt } from '../index';

import type {
  ChatJSONValue,
  ChatRequestParams,
  Interrupt,
  TdChatMessageConfig,
  TdChatSenderParams,
} from '@tdesign-react/chat';
import type { InterruptResponseStatus } from '../hooks/useInterrupt';

// 本地 chat-agent-api 服务地址（默认端口 9000，见 chat-agent-api/config.js）
const MOCK_BASE_URL = 'http://127.0.0.1:9000';

// resumeInterrupt 透传的中断恢复扩展参数
type InterruptRequestParams = ChatRequestParams<{
  resume?: unknown;
  threadId?: string;
  runId?: string;
}>;

// ==================== 中断下发结构（示例层约定） ====================

/** confirmation 类中断通过 metadata.options 下发的选项 */
interface InterruptOption {
  label: string;
  theme?: 'primary' | 'default';
  /** resolved 时原样回传给后端的响应载荷 */
  payload?: ChatJSONValue;
  /** 为 true 表示放弃该中断（cancelled，不携带 payload） */
  cancel?: boolean;
}

/** input_required 类中断携带的 JSON Schema 字段 */
interface SchemaProp {
  type?: 'string' | 'number';
  title?: string;
  enum?: string[];
}
interface ResponseSchema {
  type?: string;
  properties?: Record<string, SchemaProp>;
  required?: string[];
}

const REASON_LABEL: Record<string, string> = {
  tool_call: '工具调用确认',
  input_required: '结构化输入',
  confirmation: '确认',
};

function getOptions(interrupt: Interrupt): InterruptOption[] {
  const options = (interrupt.metadata as { options?: InterruptOption[] } | undefined)?.options;
  return Array.isArray(options) ? options : [];
}

// ==================== 单个中断卡片 ====================

interface InterruptCardProps {
  interrupt: Interrupt;
  status: InterruptResponseStatus;
  disabled: boolean;
  onResolve: (payload?: ChatJSONValue) => void;
  onCancel: () => void;
}

/**
 * 根据中断类型渲染不同交互：
 * - 携带 responseSchema → 结构化表单
 * - 携带 metadata.options → 选项按钮
 * - 兜底 → 确认 / 取消
 */
const InterruptCard: React.FC<InterruptCardProps> = ({ interrupt, status, disabled, onResolve, onCancel }) => {
  const schema = interrupt.responseSchema as ResponseSchema | undefined;
  const options = getOptions(interrupt);
  const responded = status !== 'pending';
  const [form, setForm] = useState<Record<string, ChatJSONValue>>({});

  const setField = (key: string, value: ChatJSONValue) => setForm((prev) => ({ ...prev, [key]: value }));

  const renderField = (key: string, prop: SchemaProp) => {
    const fieldDisabled = disabled || responded;
    if (prop.enum) {
      return (
        <Select
          disabled={fieldDisabled}
          value={form[key] as string}
          onChange={(v) => setField(key, v as string)}
          options={prop.enum.map((opt) => ({ label: opt, value: opt }))}
          placeholder={`请选择${prop.title || key}`}
        />
      );
    }
    if (prop.type === 'number') {
      return (
        <InputNumber
          disabled={fieldDisabled}
          value={form[key] as number}
          onChange={(v) => setField(key, (v as number) ?? '')}
          placeholder={`请输入${prop.title || key}`}
          style={{ width: '100%' }}
        />
      );
    }
    return null;
  };

  const submitForm = () => {
    const required = schema?.required || [];
    const missing = required.filter((key) => form[key] === undefined || form[key] === '');
    if (missing.length > 0) {
      MessagePlugin.warning(`请填写：${missing.map((k) => schema?.properties?.[k]?.title || k).join('、')}`);
      return;
    }
    onResolve(form);
  };

  const renderStatusTag = () => {
    if (status === 'resolved') {
      return (
        <Tag theme="success" size="small">
          已填写
        </Tag>
      );
    }
    if (status === 'cancelled') {
      return (
        <Tag theme="default" size="small">
          已跳过
        </Tag>
      );
    }
    return null;
  };

  return (
    <Card
      bordered
      style={{
        margin: '8px 12px',
        borderColor: '#0052d9',
        background: '#f2f3ff',
      }}
    >
      <Space direction="vertical" size="small" style={{ width: '100%' }}>
        <Space align="center" size="small">
          <Tag theme="primary" variant="light" size="small">
            {REASON_LABEL[interrupt.reason] || interrupt.reason}
          </Tag>
          {renderStatusTag()}
        </Space>

        <div style={{ fontSize: 13, color: '#333' }}>{interrupt.message || '请作出选择'}</div>

        {/* 1) 结构化输入表单 */}
        {schema?.properties && (
          <Space direction="vertical" size="small" style={{ width: '100%' }}>
            {Object.entries(schema.properties).map(([key, prop]) => (
              <div key={key}>
                <div style={{ fontSize: 12, color: '#666', marginBottom: 4 }}>
                  {prop.title || key}
                  {schema.required?.includes(key) ? <span style={{ color: '#e34d59' }}> *</span> : null}
                </div>
                {renderField(key, prop)}
              </div>
            ))}
            <Button theme="primary" size="small" disabled={disabled || responded} onClick={submitForm}>
              提交
            </Button>
          </Space>
        )}

        {/* 2) 选项按钮 */}
        {!schema?.properties && options.length > 0 && (
          <Space size="small" breakLine>
            {options.map((option, index) => (
              <Button
                key={index}
                theme={option.theme || 'default'}
                variant={option.cancel ? 'text' : 'base'}
                size="small"
                disabled={disabled || responded}
                onClick={() => (option.cancel ? onCancel() : onResolve(option.payload))}
              >
                {option.label}
              </Button>
            ))}
          </Space>
        )}

        {/* 3) 兜底：确认 / 取消 */}
        {!schema?.properties && options.length === 0 && (
          <Space size="small">
            <Button
              theme="primary"
              size="small"
              disabled={disabled || responded}
              onClick={() => onResolve({ approved: true })}
            >
              确认
            </Button>
            <Button theme="default" variant="text" size="small" disabled={disabled || responded} onClick={onCancel}>
              取消
            </Button>
          </Space>
        )}
      </Space>
    </Card>
  );
};

// ==================== 主示例 ====================

/**
 * AG-UI 中断（Interrupt / Human-in-the-Loop）示例
 *
 * 演示一轮多个并列中断 + 两种响应形态：
 * - 结构化输入（responseSchema → 表单）
 * - 确认（metadata.options → 选项按钮）
 * 用户逐个响应后，在全部响应（isFullyResolved）时统一恢复运行。
 *
 * 契约参考：https://docs.ag-ui.com/concepts/interrupts
 */
export default function AguiInterruptExample() {
  const listRef = useRef<any>(null);
  const [inputValue, setInputValue] = useState<string>('帮我规划并预订一个北京 3 日游');

  const { chatEngine, messages, status } = useChat({
    defaultMessages: [],
    chatServiceConfig: {
      endpoint: `${MOCK_BASE_URL}/sse/agui-interrupt`,
      protocol: 'agui',
      stream: true,
      onRequest: (params: ChatRequestParams) => {
        // resume / threadId / runId 为中断恢复的扩展字段（由 resumeInterrupt 透传）
        const p = params as InterruptRequestParams;
        return {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            prompt: p.prompt,
            resume: p.resume,
            threadId: p.threadId,
            runId: p.runId,
          }),
        };
      },
      onError: (err: Error | Response) => {
        console.error('[Interrupt] 错误:', err);
        MessagePlugin.error('对话出错');
      },
    },
  });

  // 中断能力：监听、多中断状态跟踪、响应与恢复
  const { interrupts, hasPending, responses, isFullyResolved, resuming, resolve, cancel, resume, clear } = useInterrupt(
    chatEngine,
    {
      onError: (error) => MessagePlugin.error(error instanceof Error ? error.message : '中断处理失败'),
    },
  );

  const senderLoading = useMemo(() => status === 'pending' || status === 'streaming', [status]);

  const handleResumeAll = async () => {
    const messageId = await resume();
    if (messageId) listRef.current?.scrollList({ to: 'bottom' });
  };

  const handleSend = async (e: CustomEvent<TdChatSenderParams>) => {
    const { value } = e.detail;
    await chatEngine.sendUserMessage({ prompt: value });
    setInputValue('');
    listRef.current?.scrollList({ to: 'bottom' });
  };

  const messageProps: TdChatMessageConfig = {
    user: { variant: 'base', placement: 'right' },
    assistant: { placement: 'left' },
  };

  return (
    <div style={{ height: '600px', display: 'flex', flexDirection: 'column' }}>
      {/* 操作栏 */}
      <div
        style={{
          padding: '12px',
          borderBottom: '1px solid #e7e7e7',
          backgroundColor: '#fafafa',
        }}
      >
        <Space align="center">
          <Tag theme={hasPending ? 'warning' : 'default'} size="small">
            {hasPending ? '等待响应' : '空闲'}
          </Tag>
          <Button
            size="small"
            variant="text"
            onClick={() => {
              chatEngine.clearMessages();
              clear();
              MessagePlugin.success('已清空');
            }}
          >
            清空消息
          </Button>
        </Space>
      </div>

      {/* 消息列表 + 中断面板 + 输入框 */}
      <div
        style={{
          flex: 1,
          display: 'flex',
          flexDirection: 'column',
          minHeight: 0,
        }}
      >
        <ChatList ref={listRef}>
          {messages.map((message) => (
            <ChatMessage key={message.id} {...messageProps[message.role]} message={message} />
          ))}
        </ChatList>

        {/* 中断响应面板：一轮内的多个中断逐个响应，全部响应后统一恢复 */}
        {hasPending && (
          <div>
            {interrupts.map((interrupt) => (
              <InterruptCard
                key={interrupt.id}
                interrupt={interrupt}
                status={responses[interrupt.id] || 'pending'}
                disabled={resuming}
                onResolve={(payload) => resolve(interrupt.id, payload)}
                onCancel={() => cancel(interrupt.id)}
              />
            ))}
            <div style={{ margin: '0 12px 8px', textAlign: 'right' }}>
              <Button theme="primary" loading={resuming} disabled={!isFullyResolved} onClick={handleResumeAll}>
                提交全部并继续
              </Button>
            </div>
          </div>
        )}

        {/* 输入框 */}
        <ChatSender
          value={inputValue}
          placeholder="请输入您的需求，例如：帮我规划并预订一个北京 3 日游"
          loading={senderLoading}
          onChange={(e) => setInputValue(e.detail)}
          onSend={handleSend}
          onStop={() => chatEngine.abortChat()}
        />
      </div>
    </div>
  );
}
