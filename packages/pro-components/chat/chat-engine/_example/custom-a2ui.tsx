/**
 * 自定义协议 + A2UI 示例
 *
 * 演示内容：
 * 1. 不依赖 AG-UI 协议，使用自定义 SSE 协议
 * 2. 直接使用 A2uiMessageProcessor 处理 A2UI 消息
 * 3. 配合 useChat 的 onMessage 回调实现自定义解析
 * 4. 完整的 ChatEngine 实例用法展示
 *
 * 核心概念：
 * - 自定义协议格式：{ type: 'text' | 'a2ui', ... }
 * - 直接使用 A2uiMessageProcessor 管理 Surface 状态
 * - 使用 A2UISurfaceRenderer 进行渲染
 */
import React, { useState, useRef, useMemo, useSyncExternalStore, useCallback } from 'react';
import {
  ChatList,
  ChatSender,
  ChatMessage,
  type TdChatSenderParams,
  type ChatRequestParams,
  type ChatMessagesData,
  type AIMessageContent,
  type SSEChunkData,
} from '@tdesign-react/chat';
import { useChat } from '@tdesign-react/chat';
import { MessagePlugin } from 'tdesign-react';

import {
  A2uiMessageProcessor,
  createA2uiProcessor,
  type A2UIServerMessage,
} from '../core/a2ui';
import { A2UISurfaceRenderer, defaultComponentRegistry } from '../components/a2ui';

// Mock Server 地址
const MOCK_SERVER = 'http://localhost:9001';

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
 * 将自定义协议转换为 A2UI v0.9 标准格式
 */
function convertToA2UIMessages(
  msg: CustomMessage,
  initialData?: Record<string, unknown>,
): A2UIServerMessage[] {
  if (msg.type !== 'a2ui' || !msg.surfaceId) return [];

  const messages: A2UIServerMessage[] = [];

  // 处理 operations 数组
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
                components: [{ id: op.componentId, component: op.payload.component || 'Unknown', ...op.payload }],
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
      component.children = node.children.map((child: any) =>
        typeof child === 'string' ? child : flatten(child),
      );
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
  const listRef = useRef<any>(null);

  // 跟踪 A2UI Surface 关联的消息 ID
  const [surfaceMessageMap, setSurfaceMessageMap] = useState<Map<string, string>>(new Map());
  const currentMessageIdRef = useRef<string>('');

  // 创建 A2UI Processor（用于处理自定义协议的 A2UI 消息）
  const processorRef = useRef<A2uiMessageProcessor | null>(null);
  if (!processorRef.current) {
    processorRef.current = createA2uiProcessor({
      onAction: (action, context) => {
        const actionType = action.type || action.name;
        if (actionType === 'submit') {
          const path = (action.payload as any)?.path || action.context?.path;
          const formData = context?.getData?.(path as string);
          MessagePlugin.success(`表单提交成功: ${JSON.stringify(formData)}`);
        } else if (actionType === 'cancel') {
          MessagePlugin.info('用户取消了操作');
        }
      },
    });
  }
  const processor = processorRef.current;

  // 订阅 processor 状态变化（用于触发重渲染）
  const surfaceSnapshot = useSyncExternalStore(
    processor.subscribe,
    processor.getSnapshot,
    processor.getServerSnapshot,
  );

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
        } else if (data.type === 'a2ui' && data.surfaceId) {
          // A2UI 消息：转换并处理
          const a2uiMessages = convertToA2UIMessages(data, data.data);
          if (a2uiMessages.length > 0) {
            processor.processMessages(a2uiMessages);
            // 记录 Surface 与消息的关联
            setSurfaceMessageMap((prev) => {
              const next = new Map(prev);
              next.set(data.surfaceId!, currentMessageIdRef.current);
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
    [processor],
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
        processor.clearAllSurfaces();
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

  // 获取当前活跃的 Surface IDs
  const surfaceIds = Array.from(surfaceSnapshot.keys());

  // 自定义消息渲染
  const renderMessage = (message: ChatMessagesData) => {
    // 检查是否有关联的 A2UI Surface
    const relatedSurfaceId = Array.from(surfaceMessageMap.entries()).find(
      ([, msgId]) => msgId === message.id,
    )?.[0];

    return (
      <div key={message.id}>
        <ChatMessage
          message={message}
          placement={message.role === 'user' ? 'right' : 'left'}
          variant={message.role === 'user' ? 'base' : 'text'}
        />
        {/* 在消息后面渲染关联的 A2UI Surface */}
        {relatedSurfaceId && surfaceSnapshot.has(relatedSurfaceId) && (
          <div style={{ marginTop: '8px', marginBottom: '16px' }}>
            <A2UISurfaceRenderer
              processor={processor}
              surfaceId={relatedSurfaceId}
              registry={defaultComponentRegistry}
            />
          </div>
        )}
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
        <p style={{ margin: '4px 0 0', fontSize: '12px', color: 'var(--td-text-color-secondary)' }}>
          不依赖 AG-UI，使用自定义 SSE 协议配合 A2uiMessageProcessor 实现动态表单
        </p>
      </div>

      {/* 消息列表 */}
      {/* @ts-ignore ChatList is a Web Component wrapper that accepts children */}
      <ChatList ref={listRef} style={{ flex: 1, overflow: 'auto' }}>
        {messages.map(renderMessage)}
        {/* 渲染未关联到消息的 Surface（独立 Surface） */}
        {surfaceIds
          .filter((id) => !surfaceMessageMap.has(id))
          .map((surfaceId) => (
            <div key={surfaceId} style={{ marginTop: '16px' }}>
              <A2UISurfaceRenderer
                processor={processor}
                surfaceId={surfaceId}
                registry={defaultComponentRegistry}
              />
            </div>
          ))}
      </ChatList>

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
