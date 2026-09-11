/**
 * 自定义协议 + A2UI 示例
 *
 * 演示内容：
 * 1. 不依赖 AG-UI 协议，使用自定义 SSE 协议
 * 2. 通过 useA2UISurface hook 处理 A2UI 消息（基于 json-render adapter）
 * 3. 配合 useChat 的 onMessage 回调实现自定义解析
 * 4. 完整的 ChatEngine 实例用法展示
 *
 * 核心概念：
 * - 自定义协议格式：{ type: 'text' | 'a2ui', ... }
 * - 把自定义协议消息转换为 A2UI v0.9.1 标准消息后，交给 useA2UISurface 处理
 * - 渲染端使用 A2UISurfaceRenderer + tdesignRegistry / a2uiRegistry
 */
import React, { useCallback, useRef, useState } from 'react';
import { MessagePlugin } from 'tdesign-react';
import {
  a2uiRegistry,
  A2UISurfaceRenderer,
  ChatList,
  ChatMessage,
  ChatSender,
  useA2UISurface,
  useChat,
} from '@tdesign-react/chat';

import type { A2UIMessage } from '@tdesign/web-components-chat/chat-engine';
import type {
  AIMessageContent,
  ChatMessagesData,
  ChatRequestParams,
  SSEChunkData,
  TdChatSenderParams,
} from '@tdesign-react/chat';

// Mock Server 地址
const MOCK_SERVER = 'https://1257786608-9i9j1kpa67.ap-guangzhou.tencentscf.com';

/**
 * 自定义协议消息类型
 */
interface CustomMessage {
  type: 'text' | 'a2ui';
  // 文本消息
  msg?: string;
  // A2UI 消息
  surfaceId?: string;
  operations?: CustomA2UIOperation[];
  data?: Record<string, unknown>;
}

/**
 * 自定义 A2UI 操作类型
 * 简化版的操作格式，更易于后端实现
 */
interface CustomA2UIOperation {
  type: 'create' | 'update' | 'patch' | 'delete';
  surfaceId: string;
  componentId?: string;
  payload?: any;
}

/**
 * 将自定义协议转换为 A2UI v0.9.1 标准格式
 */
function convertToA2UIMessages(msg: CustomMessage, initialData?: Record<string, unknown>): A2UIMessage[] {
  if (msg.type !== 'a2ui' || !msg.surfaceId) return [];

  const messages: A2UIMessage[] = [];

  if (msg.operations) {
    for (const op of msg.operations) {
      switch (op.type) {
        case 'create':
          // 创建 Surface
          messages.push({
            createSurface: {
              surfaceId: op.surfaceId,
              catalogId: 'default',
            },
          });
          // 如果有初始数据
          if (initialData) {
            messages.push({
              updateDataModel: {
                surfaceId: op.surfaceId,
                path: '/',
                op: 'replace',
                value: initialData,
              },
            });
          }
          // 如果有 payload（root 组件），转换为 updateComponents
          if (op.payload) {
            const components = flattenComponents(op.payload);
            messages.push({
              updateComponents: {
                surfaceId: op.surfaceId,
                components,
              },
            });
          }
          break;

        case 'update':
          // 更新整个组件树
          if (op.payload) {
            const components = flattenComponents(op.payload);
            messages.push({
              updateComponents: {
                surfaceId: op.surfaceId,
                components,
              },
            });
          }
          break;

        case 'patch':
          // 增量更新单个组件
          if (op.componentId && op.payload) {
            messages.push({
              updateComponents: {
                surfaceId: op.surfaceId,
                components: [
                  {
                    id: op.componentId,
                    component: op.payload.component || 'Unknown',
                    ...op.payload,
                  },
                ],
              },
            });
          }
          break;

        case 'delete':
          messages.push({
            deleteSurface: {
              surfaceId: op.surfaceId,
            },
          });
          break;
      }
    }
  }

  return messages;
}

/**
 * 将嵌套组件树展平为组件数组
 */
function flattenComponents(root: any): any[] {
  const components: any[] = [];
  let idCounter = 0;

  function flatten(node: any): string {
    const nodeId = node.id || `comp_${(idCounter += 1)}`;
    const component = { ...node, id: nodeId };

    if (Array.isArray(node.children)) {
      component.children = node.children.map((child: any) => (typeof child === 'string' ? child : flatten(child)));
    }

    if (node.child && typeof node.child === 'object') {
      component.child = flatten(node.child);
    }

    components.push(component);
    return nodeId;
  }

  flatten({ ...root, id: root.id || 'root' });
  return components;
}

export default function CustomA2UIExample() {
  const [inputValue, setInputValue] = useState('帮我创建一个用户信息表单');
  const listRef = useRef<HTMLElement>(null);

  // 跟踪 A2UI Surface 关联的消息 ID
  const [surfaceMessageMap, setSurfaceMessageMap] = useState<Map<string, string>>(new Map());
  const currentMessageIdRef = useRef<string>('');

  // A2UI Surface 控制器：负责消息分发与状态管理
  const a2uiSurface = useA2UISurface({ debug: false });

  // Action 处理映射：表单的 submit / cancel
  const actionHandlers = {
    submit: async (params: Record<string, unknown>) => {
      MessagePlugin.success(`表单提交成功: ${JSON.stringify(params)}`);
    },
    cancel: async () => {
      MessagePlugin.info('用户取消了操作');
    },
    reset: async () => {
      MessagePlugin.info('已重置表单');
    },
  };

  // 自定义消息处理函数
  const handleCustomMessage = useCallback(
    (chunk: SSEChunkData): AIMessageContent | null => {
      try {
        const data = chunk.data as CustomMessage;

        if (data.type === 'text' && data.msg) {
          // 文本消息：返回标准格式让引擎处理
          return {
            type: 'text',
            data: data.msg,
          } as AIMessageContent;
        }
        if (data.type === 'a2ui' && data.surfaceId) {
          const { surfaceId } = data;
          // A2UI 消息：转换并交给 useA2UISurface 处理
          const a2uiMessages = convertToA2UIMessages(data, data.data);
          if (a2uiMessages.length > 0) {
            a2uiSurface.processMessages(a2uiMessages);
            // 记录 Surface 与消息的关联
            setSurfaceMessageMap((prev) => {
              const next = new Map(prev);
              next.set(surfaceId, currentMessageIdRef.current);
              return next;
            });
          }
          // A2UI 消息不返回内容，由 Surface 渲染
          return null;
        }
      } catch (err) {
        console.error('解析自定义协议消息失败:', err);
      }
      return null;
    },
    [a2uiSurface],
  );

  // 使用 useChat 创建 ChatEngine 实例（自定义协议）
  const { chatEngine, messages, status } = useChat({
    defaultMessages: [],
    chatServiceConfig: {
      endpoint: `${MOCK_SERVER}/sse/a2ui-custom`,
      stream: true,
      // 使用 onMessage 回调处理自定义协议
      onMessage: (chunk, message) => {
        // 记录当前消息 ID
        if (message?.id) {
          currentMessageIdRef.current = message.id;
        }
        return handleCustomMessage(chunk);
      },
      onRequest: (params: ChatRequestParams) => ({
        body: JSON.stringify({
          uid: 'custom-a2ui-demo',
          prompt: params.prompt,
        }),
      }),
      onStart: () => {
        // 清理旧的 Surface
        a2uiSurface.clearAllSurfaces();
        setSurfaceMessageMap(new Map());
      },
      onComplete: () => {
        // 流式传输完成
      },
      onError: (err) => {
        const errorMsg = err instanceof Error ? err.message : '请求失败';
        MessagePlugin.error(errorMsg);
      },
    },
  });

  // 发送消息
  const handleSend = async (e: CustomEvent<TdChatSenderParams>) => {
    const { value } = e.detail;
    if (!value.trim()) return;

    await chatEngine.sendUserMessage({ prompt: value });
    setInputValue('');
  };

  // 停止生成
  const handleStop = () => {
    chatEngine.abortChat();
    MessagePlugin.info('已停止生成');
  };

  // 渲染 ChatMessage 内部的扩展内容：关联的 A2UI Surface
  const renderMsgContents = (message: ChatMessagesData) => {
    const relatedSurfaceId = Array.from(surfaceMessageMap.entries()).find(([, msgId]) => msgId === message.id)?.[0];
    if (!relatedSurfaceId || !a2uiSurface.hasSurface(relatedSurfaceId)) return null;
    return (
      <div slot="a2ui-surface" style={{ marginTop: '8px' }}>
        <A2UISurfaceRenderer surfaceId={relatedSurfaceId} registry={a2uiRegistry} actionHandlers={actionHandlers} />
      </div>
    );
  };

  return (
    <div style={{ height: '600px', display: 'flex', flexDirection: 'column' }}>
      {/* 标题区域 */}
      <div
        style={{
          padding: '12px 16px',
          borderBottom: '1px solid var(--td-component-stroke)',
          backgroundColor: 'var(--td-bg-color-container)',
        }}
      >
        <h3 style={{ margin: 0, fontSize: '16px' }}>自定义协议 + A2UI 示例</h3>
        <p
          style={{
            margin: '4px 0 0',
            fontSize: '12px',
            color: 'var(--td-text-color-secondary)',
          }}
        >
          不依赖 AG-UI，使用自定义 SSE 协议配合 useA2UISurface（基于 json-render adapter）实现动态表单
        </p>
      </div>

      {/* 消息列表：外层 div 接管布局样式，避开 ChatList 类型签名不含 style 的问题 */}
      <div style={{ flex: 1, overflow: 'auto' }}>
        <ChatList ref={listRef}>
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

      {/* 渲染未关联到消息的 Surface（独立 Surface） */}
      {a2uiSurface.surfaceIds
        .filter((id) => !surfaceMessageMap.has(id))
        .map((surfaceId) => (
          <div key={surfaceId} style={{ marginTop: '16px' }}>
            <A2UISurfaceRenderer surfaceId={surfaceId} registry={a2uiRegistry} actionHandlers={actionHandlers} />
          </div>
        ))}

      {/* 输入区域 */}
      <ChatSender
        value={inputValue}
        placeholder="输入消息，例如：帮我创建一个用户表单"
        loading={status === 'pending' || status === 'streaming'}
        onChange={(e) => setInputValue(e.detail)}
        onSend={handleSend}
        onStop={handleStop}
      />

      {/* 快捷操作 */}
      <div
        style={{
          padding: '8px 16px',
          borderTop: '1px solid var(--td-component-stroke)',
          display: 'flex',
          gap: '8px',
          flexWrap: 'wrap',
        }}
      >
        <QuickAction label="创建表单" onClick={() => setInputValue('帮我创建一个用户信息表单')} />
        <QuickAction
          label="协议对比"
          onClick={() => {
            MessagePlugin.info('自定义协议格式更简单，适合自研后端；AG-UI 协议更标准，适合通用场景');
          }}
        />
      </div>
    </div>
  );
}

// 快捷操作按钮
function QuickAction({ label, onClick }: { label: string; onClick: () => void }) {
  return (
    <button
      onClick={onClick}
      style={{
        padding: '4px 12px',
        fontSize: '12px',
        border: '1px solid var(--td-component-stroke)',
        borderRadius: '4px',
        backgroundColor: 'var(--td-bg-color-container)',
        cursor: 'pointer',
      }}
    >
      {label}
    </button>
  );
}
