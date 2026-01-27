/**
 * A2UI v0.9 + json-render Activity 渲染器
 * 将 A2UI v0.9 协议转换为 json-render Schema 进行渲染
 * 
 * 工作流程：
 * 1. 接收 ACTIVITY_SNAPSHOT/DELTA 中的 A2UI content
 * 2. 区分消息类型：UI型 vs 纯数据型
 * 3. UI型：转换为 Schema 并注册到 SurfaceStateManager，渲染 UI
 * 4. 纯数据型：通过 SurfaceStateManager 更新数据，触发订阅者重渲染，本组件不渲染
 * 
 * 消息分类：
 * - UI型消息：包含 createSurface / updateComponents / deleteSurface → 需要渲染/更新 UI
 * - 纯数据型消息：仅包含 updateDataModel → 只更新状态，不渲染新 UI
 */

import React, { useMemo, useEffect, useState, useCallback } from 'react';
import type { ComponentRegistry } from './renderer';
import type { JsonRenderActivityProps, JsonRenderSchema } from './types';
import { JsonRenderActivityRenderer } from './JsonRenderActivityRenderer';
import { convertA2UIMessagesToJsonRender } from './adapters';
import { surfaceStateManager } from './SurfaceStateManager';
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
 * 从消息中提取 surfaceId
 */
function extractSurfaceId(messages: A2UIMessage[]): string | null {
  for (const msg of messages) {
    if (msg.createSurface) return msg.createSurface.surfaceId;
    if (msg.updateComponents) return msg.updateComponents.surfaceId;
    if (msg.updateDataModel) return msg.updateDataModel.surfaceId;
    if (msg.deleteSurface) return msg.deleteSurface.surfaceId;
  }
  return null;
}

/**
 * 判断消息是否为"UI型"（需要渲染/更新 UI）
 * 包括 createSurface / updateComponents / deleteSurface
 * 只有纯 updateDataModel 消息不需要渲染
 */
function isUIMessages(messages: A2UIMessage[]): boolean {
  return messages.some(msg => msg.createSurface || msg.updateComponents || msg.deleteSurface);
}

/**
 * 判断消息是否包含删除操作
 */
function hasDeletionMessages(messages: A2UIMessage[]): boolean {
  return messages.some(msg => msg.deleteSurface);
}

/**
 * 判断消息是否包含创建/更新操作（需要渲染 UI 的）
 */
function hasCreationMessages(messages: A2UIMessage[]): boolean {
  return messages.some(msg => msg.createSurface || msg.updateComponents);
}

/**
 * A2UI v0.9 + json-render Activity 渲染器组件
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
  // 设置调试模式
  useEffect(() => {
    surfaceStateManager.setDebug(debug);
  }, [debug]);

  // 用于触发重渲染的版本号
  const [schemaVersion, setSchemaVersion] = useState(0);

  // 分析消息类型
  const { surfaceId, isUI, isDeletion, isCreation, messages } = useMemo(() => {
    const msgs = content.messages;
    if (!Array.isArray(msgs) || msgs.length === 0) {
      return { surfaceId: null, isUI: false, isDeletion: false, isCreation: false, messages: [] };
    }
    return {
      surfaceId: extractSurfaceId(msgs),
      isUI: isUIMessages(msgs),
      isDeletion: hasDeletionMessages(msgs),
      isCreation: hasCreationMessages(msgs),
      messages: msgs,
    };
  }, [content.messages]);

  // 处理消息并获取 Schema
  const initialSchema = useMemo<JsonRenderSchema | null>(() => {
    if (!surfaceId || messages.length === 0) {
      return null;
    }

    if (debug) {
      // eslint-disable-next-line no-console
      console.log('[A2UI Adapter] 处理消息:', {
        messageId,
        surfaceId,
        messagesCount: messages.length,
        messageTypes: messages.map(m => 
          Object.keys(m).filter(k => ['createSurface', 'updateComponents', 'updateDataModel', 'deleteSurface'].includes(k))[0]
        ),
        isUI,
        isCreation,
        isDeletion,
        cachedSurfaces: surfaceStateManager.getAllSurfaceIds(),
      });
    }

    // 删除型消息：清理缓存
    if (isDeletion) {
      surfaceStateManager.deleteSurface(surfaceId);
      if (debug) {
        // eslint-disable-next-line no-console
        console.log('[A2UI Adapter] 删除 Surface:', surfaceId);
      }
      return null;
    }

    // 创建型消息：转换并注册
    if (isCreation) {
      const schema = convertA2UIMessagesToJsonRender(messages);
      if (schema) {
        // 提取 catalogId
        const catalogId = messages.find(m => m.createSurface)?.createSurface?.catalogId;
        surfaceStateManager.registerSurface(surfaceId, schema, catalogId);
        
        if (debug) {
          // eslint-disable-next-line no-console
          console.log('[A2UI Adapter] 创建型消息，注册 Surface:', {
            surfaceId,
            elementsCount: Object.keys(schema.elements).length,
            data: schema.data,
          });
        }
      }
      return schema;
    }

    // 更新型消息：通过 SurfaceStateManager 更新数据
    for (const msg of messages) {
      if (msg.updateDataModel) {
        const { path, op, value } = msg.updateDataModel;
        const success = surfaceStateManager.updateData(surfaceId, path, op || 'replace', value);
        
        if (debug) {
          // eslint-disable-next-line no-console
          console.log('[A2UI Adapter] 更新型消息，更新数据:', {
            surfaceId,
            path,
            op: op || 'replace',
            value,
            success,
          });
        }
      }
    }

    // 更新型消息不需要渲染，返回 null
    return null;
  }, [messages, surfaceId, isCreation, isDeletion, isUI, debug, messageId]);

  // 订阅状态变化的回调
  const handleSchemaUpdate = useCallback(() => {
    if (debug) {
      // eslint-disable-next-line no-console
      console.log('[A2UI Adapter] 收到状态更新通知，触发重渲染');
    }
    setSchemaVersion(v => v + 1);
  }, [debug]);

  // 订阅 Surface 状态变化（仅当是创建型消息时）
  useEffect(() => {
    if (!isCreation || !surfaceId) {
      return;
    }

    if (debug) {
      // eslint-disable-next-line no-console
      console.log('[A2UI Adapter] 订阅 Surface 状态:', surfaceId);
    }

    const unsubscribe = surfaceStateManager.subscribe(surfaceId, handleSchemaUpdate);

    return () => {
      if (debug) {
        // eslint-disable-next-line no-console
        console.log('[A2UI Adapter] 取消订阅 Surface 状态:', surfaceId);
      }
      unsubscribe();
    };
  }, [isCreation, surfaceId, handleSchemaUpdate, debug]);

  // 获取当前 Schema（考虑版本变化）
  const currentSchema = useMemo(() => {
    if (!isCreation || !surfaceId) {
      return null;
    }
    // schemaVersion 变化时从缓存获取最新 Schema
    return surfaceStateManager.getSchema(surfaceId) || initialSchema;
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isCreation, surfaceId, initialSchema, schemaVersion]);

  // 非 UI 型消息不渲染（仅 updateDataModel 的消息）
  if (!isUI) {
    if (debug && messages.length > 0) {
      // eslint-disable-next-line no-console
      console.log('[A2UI Adapter] 纯数据更新消息，跳过渲染');
    }
    return null;
  }

  // 删除型消息：返回 null（UI 已被删除）
  if (isDeletion && !isCreation) {
    if (debug) {
      // eslint-disable-next-line no-console
      console.log('[A2UI Adapter] 删除型消息，跳过渲染');
    }
    return null;
  }

  // 渲染 UI
  return (
    <JsonRenderActivityRenderer
      activityType={activityType}
      content={currentSchema}
      messageId={messageId}
      ext={ext}
      registry={registry}
      actionHandlers={actionHandlers}
    />
  );
};

export default A2UIJsonRenderActivityRenderer;
