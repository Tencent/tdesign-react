/**
 * A2UI v0.9.1 会议预约表单示例
 *
 * 演示 A2UI 多 Surface 协作 + 用户自定义组件注册的完整能力：
 *   阶段 1：表单 Surface（booking-form）—— TextField / Slider / Switch 收集信息
 *   阶段 2：确认 Surface（booking-confirm）—— 使用**用户自定义组件 BookingSummary** 展示信息
 *   阶段 3：用户确认后 —— deleteSurface 销毁 Surface + 显示"预约成功"
 *
 * 用户自定义组件示例：
 *   BookingSummary 是一个纯展示组件，通过 useDataValue hook 订阅 A2UI dataModel 的多个字段，
 *   直接注册到 registry（无需 withA2UIBinding，因为它不需要双向绑定）。
 */
import React, { useMemo, useRef, useState } from 'react';
import { MessagePlugin } from 'tdesign-react';
import {
  ActivityRenderer,
  ChatList,
  ChatMessage,
  ChatSender,
  createA2UIJsonRenderActivityConfig,
  createA2UIRegistry,
  isActivityContent,
  useAgentActivity,
  useChat,
  useDataValue,
} from '@tdesign-react/chat';

import type {
  AIMessageContent,
  ChatMessagesData,
  ChatRequestParams,
  ComponentRenderProps,
  TdChatListApi,
  TdChatSenderParams,
} from '@tdesign-react/chat';

const MOCK_SERVER = 'https://1257786608-9i9j1kpa67.ap-guangzhou.tencentscf.com';
const ENDPOINT = `${MOCK_SERVER}/sse/a2ui-form`;
const ACTIVITY_TYPE = 'a2ui-form';

interface A2UIActionPayload {
  /** 服务端事件名（对应组件 schema 里 action.event.name） */
  name: string;
  /** 事件上下文：已被前端把 { path } 解析为实际值 */
  context?: Record<string, unknown>;
  /** ISO 8601 时间戳 */
  timestamp?: string;
  /** Surface 唯一标识（可选） */
  surfaceId?: string;
  /** 触发组件的 id（可选） */
  sourceComponentId?: string;
}

type ChatRequestParamsWithAction = ChatRequestParams<{
  /** A2UI v0.9.1 官方 client-to-server action 消息 payload */
  action?: A2UIActionPayload;
}>;

// ============ 用户自定义组件：BookingSummary ============
//
// 展示预约信息卡片。所有字段通过 A2UI 数据绑定注入：
//   topic:      { path: '/data/topic' }      → element.props.topicPath = '/data/topic'
//   attendees:  { path: '/data/attendees' }  → element.props.attendeesPath = '/data/attendees'
//   recording:  { path: '/data/recording' }  → element.props.recordingPath = '/data/recording'
//   submitTime: { path: '/data/submitTime' } → element.props.submitTimePath = '/data/submitTime'
//
// A2UI 协议层通用扫描机制会自动把 `xxx: { path }` 转换成 `xxxPath`，业务组件用 useDataValue
// 订阅对应路径即可读取实时值。
//
interface BookingSummaryProps {
  topicPath?: string;
  attendeesPath?: string;
  recordingPath?: string;
  submitTimePath?: string;
}

const BookingSummary: React.FC<ComponentRenderProps<BookingSummaryProps>> = ({ element }) => {
  const { topicPath, attendeesPath, recordingPath, submitTimePath } = element.props || {};

  // 订阅 dataModel 的 4 个字段（细粒度订阅，任一字段变化只触发本组件重渲染）
  const topic = useDataValue<string>(topicPath);
  const attendees = useDataValue<number>(attendeesPath);
  const recording = useDataValue<boolean>(recordingPath);
  const submitTime = useDataValue<string>(submitTimePath);

  return (
    <div
      style={{
        padding: '16px',
        background: 'linear-gradient(135deg, #f6ffed 0%, #e6f7ff 100%)',
        borderLeft: '4px solid var(--td-brand-color, #0052d9)',
        borderRadius: '4px',
        display: 'flex',
        flexDirection: 'column',
        gap: '10px',
      }}
    >
      <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
        <span style={{ fontSize: '20px' }}>📅</span>
        <span
          style={{
            fontSize: '15px',
            fontWeight: 600,
            color: 'var(--td-text-color-primary, #000)',
          }}
        >
          预约信息卡片
        </span>
        <span
          style={{
            marginLeft: 'auto',
            fontSize: '11px',
            color: 'var(--td-text-color-placeholder, #ccc)',
          }}
        >
          BookingSummary · 自定义组件
        </span>
      </div>

      <div
        style={{
          display: 'grid',
          gridTemplateColumns: 'auto 1fr',
          gap: '8px 12px',
          fontSize: '13px',
        }}
      >
        <span style={{ color: 'var(--td-text-color-secondary, #888)' }}>📝 会议主题</span>
        <strong>{topic || '（未填写）'}</strong>

        <span style={{ color: 'var(--td-text-color-secondary, #888)' }}>👥 参会人数</span>
        <strong>{attendees ?? 0} 人</strong>

        <span style={{ color: 'var(--td-text-color-secondary, #888)' }}>🎥 是否录像</span>
        <strong
          style={{
            color: recording ? 'var(--td-success-color, #00a870)' : 'var(--td-text-color-disabled, #999)',
          }}
        >
          {recording ? '✓ 开启' : '✗ 关闭'}
        </strong>

        <span style={{ color: 'var(--td-text-color-secondary, #888)' }}>⏱️ 提交时间</span>
        <span
          style={{
            fontSize: '12px',
            color: 'var(--td-text-color-secondary, #888)',
          }}
        >
          {submitTime || '—'}
        </span>
      </div>
    </div>
  );
};

// 通过 createA2UIRegistry 扩展 A2UI registry，注入自定义组件
// 之后服务端 A2UI schema 里用 component: 'BookingSummary' 就能被自动查找并渲染
const customRegistry = createA2UIRegistry({
  BookingSummary,
});

export default function AguiA2UIFormExample() {
  const [inputValue, setInputValue] = useState('开始预约会议');
  const listRef = useRef<TdChatListApi>(null);

  // ============ ChatEngine ============
  const { chatEngine, messages, status } = useChat({
    defaultMessages: [],
    chatServiceConfig: {
      endpoint: ENDPOINT,
      protocol: 'agui',
      stream: true,
      onRequest: (params: ChatRequestParams) => {
        const paramsWithAction = params as ChatRequestParamsWithAction;
        const requestBody: Record<string, unknown> = {
          uid: 'a2ui-form-demo',
          prompt: paramsWithAction.prompt,
        };
        // 用户点击 A2UI Button 触发的 action 回传（对齐 A2UI v0.9.1 官方 wire format）
        if (paramsWithAction.action) {
          requestBody.version = 'v0.9.1';
          requestBody.action = paramsWithAction.action;
        }
        return { body: JSON.stringify(requestBody) };
      },
      onError: (err) => {
        const msg = err instanceof Error ? err.message : '请求失败';
        MessagePlugin.error(`请求失败: ${msg}`);
      },
    },
  });

  // ============ Action Handlers ============
  //
  // 这些 handler 由 A2UI 的 Button.action 触发。
  // action.context 里的 { path: '/xxx' } 会被前端从 dataModel 实时解析后传进 params。
  //
  const a2uiConfig = useMemo(
    () =>
      createA2UIJsonRenderActivityConfig({
        activityType: ACTIVITY_TYPE,
        // 传入扩展了 BookingSummary 的自定义 registry
        registry: customRegistry,
        actionHandlers: {
          // 提交预约：服务端会锁定原表单 + 创建新的确认 Surface
          submitBooking: async (params) => {
            const topic = String(params?.topic || '').trim();
            if (!topic) {
              MessagePlugin.warning('请先填写会议主题');
              return;
            }
            try {
              const actionParams: ChatRequestParamsWithAction = {
                action: {
                  name: 'submitBooking',
                  context: params,
                  timestamp: new Date().toISOString(),
                },
              };
              await chatEngine.sendAIMessage({
                params: actionParams as ChatRequestParams,
                sendRequest: true,
              });
              listRef.current?.scrollList({ to: 'bottom' });
            } catch (error) {
              const msg = error instanceof Error ? error.message : '提交失败';
              MessagePlugin.error(msg);
            }
          },

          // 确认预约：服务端会删除两个 Surface + 显示"预约成功"
          confirmBooking: async (params) => {
            try {
              const actionParams: ChatRequestParamsWithAction = {
                action: {
                  name: 'confirmBooking',
                  context: params,
                  timestamp: new Date().toISOString(),
                },
              };
              await chatEngine.sendAIMessage({
                params: actionParams as ChatRequestParams,
                sendRequest: true,
              });
              listRef.current?.scrollList({ to: 'bottom' });
            } catch (error) {
              const msg = error instanceof Error ? error.message : '确认失败';
              MessagePlugin.error(msg);
            }
          },
        },
      }),
    [chatEngine],
  );

  useAgentActivity(a2uiConfig);

  // ============ 事件处理 ============
  const handleSend = async (e: CustomEvent<TdChatSenderParams>) => {
    const { value } = e.detail;
    if (!value.trim()) return;
    await chatEngine.sendUserMessage({ prompt: value });
    setInputValue('');
  };

  const handleStop = () => {
    chatEngine.abortChat();
    MessagePlugin.info('已停止生成');
  };

  // ============ 消息渲染 ============
  const renderMessageContent = (item: AIMessageContent, index: number) => {
    if (isActivityContent(item)) {
      return (
        <div slot={`${item.type}-${index}`} key={`activity-${index}`}>
          <ActivityRenderer activity={item.data} />
        </div>
      );
    }
    return null;
  };

  const renderMsgContents = (message: ChatMessagesData) => {
    if (Array.isArray(message.content)) {
      return <>{message.content.map((item, index) => renderMessageContent(item as AIMessageContent, index))}</>;
    }
    return null;
  };

  return (
    <div style={{ height: '600px', display: 'flex', flexDirection: 'column' }}>
      <div
        style={{
          flex: 1,
          overflow: 'auto',
          display: 'flex',
          flexDirection: 'column',
        }}
      >
        <ChatList ref={listRef as any}>
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
      </div>

      {/* 输入区 */}
      <ChatSender
        value={inputValue}
        placeholder="发送任意消息开始，随后在表单中填写并「提交预约」"
        loading={status === 'pending' || status === 'streaming'}
        onChange={(e: CustomEvent<string>) => setInputValue(e.detail)}
        onSend={handleSend}
        onStop={handleStop}
      />
    </div>
  );
}
