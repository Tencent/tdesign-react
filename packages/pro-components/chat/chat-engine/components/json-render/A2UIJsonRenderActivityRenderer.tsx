/**
 * A2UI v0.9 + json-render Activity 渲染器
 * 将 A2UI v0.9 协议转换为 json-render Schema 进行渲染
 * 
 * 工作流程：
 * 1. 接收 ACTIVITY_SNAPSHOT/DELTA 中的 A2UI content
 * 2. 累积处理 A2UI 消息（createSurface, updateComponents, updateDataModel）
 * 3. 转换为 json-render Schema
 * 4. 使用 JsonRenderActivityRenderer 渲染
 * 
 * A2UI v0.9 特点：
 * - createSurface 只是初始化信号，不包含组件
 * - 组件通过 updateComponents 消息逐步发送（数组形式）
 * - 数据通过 updateDataModel 消息填充
 */

import React, { useMemo } from 'react';
import type { ComponentRegistry } from '@json-render/react';
import type { JsonRenderActivityProps, JsonRenderSchema } from './types';
import { JsonRenderActivityRenderer } from './JsonRenderActivityRenderer';
import { convertA2UIMessagesToJsonRender } from './adapters';
import type { A2UIMessage } from './adapters';

export interface A2UIJsonRenderActivityRendererProps extends Omit<JsonRenderActivityProps, 'content'> {
  /** A2UI content（包含 messages 数组） */
  content: {
    messages?: A2UIMessage[];
    [key: string]: any;
  };
  /** 组件注册表（必须） */
  registry: ComponentRegistry;
  /** Action 处理器（可选） */
  actionHandlers?: Record<string, (params: Record<string, unknown>) => void | Promise<void>>;
  /** 显示调试信息 */
  debug?: boolean;
}

/**
 * A2UI v0.9 + json-render Activity 渲染器组件
 * 
 * 设计原则：
 * 1. 遵循 React 标准数据流，使用 useMemo 而非 useEffect + useState
 * 2. 每次 content 变化时重新计算 Schema（消息累积由数据层完成）
 * 3. 使用 JsonRenderActivityRenderer 的 memo 优化避免不必要渲染
 */
export const A2UIJsonRenderActivityRenderer: React.FC<A2UIJsonRenderActivityRendererProps> = ({
  activityType,
  content,
  messageId,
  ext,
  registry,
  actionHandlers,
  debug = false,
}) => {
  // 将 A2UI 消息数组转换为 json-render Schema
  // 使用 useMemo 缓存转换结果，只在 content.messages 变化时重新计算
  const jsonRenderSchema = useMemo<JsonRenderSchema | null>(() => {
    const messages = content.messages;
    
    if (!Array.isArray(messages) || messages.length === 0) {
      if (debug) {
        // eslint-disable-next-line no-console
        console.log('[A2UI Adapter] 没有找到有效的 messages 数组');
      }
      return null;
    }

    if (debug) {
      // eslint-disable-next-line no-console
      console.log('[A2UI Adapter] 转换消息:', {
        messagesCount: messages.length,
        messageTypes: messages.map(m => 
          Object.keys(m).filter(k => ['createSurface', 'updateComponents', 'updateDataModel', 'deleteSurface'].includes(k))[0]
        ),
      });
    }

    // 转换所有消息为 json-render Schema
    const schema = convertA2UIMessagesToJsonRender(messages);
    
    if (debug && schema) {
      // eslint-disable-next-line no-console
      console.log('[A2UI Adapter] 转换结果:', {
        root: schema.root,
        elementsCount: Object.keys(schema.elements).length,
        hasData: Object.keys(schema.data || {}).length > 0,
      });
    }

    return schema;
  }, [content.messages, debug]);

  // 如果还没有有效的 Schema，显示加载状态
  // if (!jsonRenderSchema) {
  //   return (
  //     <div style={{ padding: '16px', color: 'var(--td-text-color-secondary)' }}>
  //       正在解析 A2UI 协议...
  //     </div>
  //   );
  // }

  // 使用 JsonRenderActivityRenderer 渲染转换后的 Schema
  return (
    <JsonRenderActivityRenderer
      activityType={activityType}
      content={jsonRenderSchema}
      messageId={messageId}
      ext={ext}
      registry={registry}
      actionHandlers={actionHandlers}
    />
  );
};

export default A2UIJsonRenderActivityRenderer;
