/**
 * A2UI Surface React 集成
 *
 * 在 React 端提供两类 API：
 * 1. useA2UISurface：管理一组 A2UI Surface 的生命周期，处理 A2UI v0.9.1 消息流
 * 2. A2UISurfaceRenderer：渲染指定 surfaceId 的 UI，订阅 surfaceStateManager 状态变化
 *
 * 设计原则：
 * - 协议解析 / Surface 状态管理：复用 ai-core 的 json-render 适配器（surfaceStateManager + convertA2UIMessagesToJsonRender）
 * - React 相关逻辑（hook / 订阅 / 渲染）：实现在 react 仓库
 * - 不再依赖已废弃的 adapters/a2ui 模块
 */

import React, { useCallback, useMemo, useRef, useSyncExternalStore } from 'react';
import {
  applyA2UIDataUpdate,
  applyA2UIUpdates,
  convertA2UIMessagesToJsonRender,
  groupMessagesBySurface,
  surfaceStateManager,
} from '@tdesign/web-components-chat/chat-engine';

import { JsonRenderActivityRenderer } from './JsonRenderActivityRenderer';

import type { A2UIMessage, JsonRenderSchema } from '@tdesign/web-components-chat/chat-engine';
import type { ComponentRegistry } from '../types';

/* ------------------------------------------------------------------ */
/* A2UI Surface hook                                                  */
/* ------------------------------------------------------------------ */

/**
 * useA2UISurface hook 返回值
 */
export interface A2UISurfaceController {
  /** 当前活跃的 Surface ID 列表（已按出现顺序排列） */
  surfaceIds: string[];
  /** 处理一批 A2UI v0.9.1 消息（createSurface / updateComponents / updateDataModel / deleteSurface） */
  processMessages: (messages: A2UIMessage[]) => void;
  /** 清除所有 Surface 缓存与本地记录 */
  clearAllSurfaces: () => void;
  /** 检查指定 Surface 是否存在 */
  hasSurface: (surfaceId: string) => boolean;
}

/**
 * useA2UISurface 配置
 */
export interface UseA2UISurfaceOptions {
  /** 是否打印调试日志 */
  debug?: boolean;
}

/**
 * 管理一组 A2UI Surface 的生命周期
 *
 * 内部状态：
 * - 仅维护"哪些 surfaceId 是当前 hook 创建的"这一份本地快照（不存 schema，避免与 surfaceStateManager 双源）
 * - 真正的 schema/data 由 surfaceStateManager 持有，通过 A2UISurfaceRenderer 订阅渲染
 */
export function useA2UISurface(options: UseA2UISurfaceOptions = {}): A2UISurfaceController {
  const { debug = false } = options;

  // 当前 hook 持有的 surfaceId 集合（用版本号驱动 useSyncExternalStore 重渲染）
  const surfaceIdsRef = useRef<string[]>([]);
  const versionRef = useRef(0);
  const listenersRef = useRef<Set<() => void>>(new Set());

  const subscribe = useCallback((listener: () => void) => {
    listenersRef.current.add(listener);
    return () => {
      listenersRef.current.delete(listener);
    };
  }, []);

  // 缓存版本相关的快照对象，避免无限重渲染
  const snapshotRef = useRef<{ ids: string[]; version: number }>({
    ids: surfaceIdsRef.current,
    version: versionRef.current,
  });
  const getSnapshot = useCallback(() => {
    if (snapshotRef.current.version !== versionRef.current) {
      snapshotRef.current = {
        ids: surfaceIdsRef.current.slice(),
        version: versionRef.current,
      };
    }
    return snapshotRef.current;
  }, []);

  const snapshot = useSyncExternalStore(subscribe, getSnapshot, getSnapshot);

  const notify = useCallback(() => {
    versionRef.current += 1;
    listenersRef.current.forEach((listener) => listener());
  }, []);

  const addSurfaceId = useCallback(
    (surfaceId: string) => {
      if (!surfaceIdsRef.current.includes(surfaceId)) {
        surfaceIdsRef.current = [...surfaceIdsRef.current, surfaceId];
        notify();
      }
    },
    [notify],
  );

  const removeSurfaceId = useCallback(
    (surfaceId: string) => {
      if (surfaceIdsRef.current.includes(surfaceId)) {
        surfaceIdsRef.current = surfaceIdsRef.current.filter((id) => id !== surfaceId);
        notify();
      }
    },
    [notify],
  );

  /**
   * 处理一批 A2UI v0.9.1 消息
   *
   * 路由策略：
   * - createSurface + updateComponents（同批）：调用 convertA2UIMessagesToJsonRender 一次性产出 schema 并 registerSurface
   * - 已存在 surface 上的 updateComponents：调用 applyA2UIUpdates 增量更新现有 schema
   * - updateDataModel：通过 surfaceStateManager.updateData 走标准订阅通知路径
   * - deleteSurface：调用 surfaceStateManager.deleteSurface 并从本地列表移除
   */
  const processMessages = useCallback(
    (messages: A2UIMessage[]) => {
      if (!Array.isArray(messages) || messages.length === 0) return;

      const grouped = groupMessagesBySurface(messages);

      grouped.forEach((surfaceMessages, surfaceId) => {
        // 先处理删除：删除后该批后续消息无意义
        const hasDelete = surfaceMessages.some((msg) => msg.deleteSurface);
        if (hasDelete) {
          surfaceStateManager.deleteSurface(surfaceId);
          removeSurfaceId(surfaceId);
          if (debug) {
            // eslint-disable-next-line no-console
            console.log('[useA2UISurface] 删除 Surface:', surfaceId);
          }
          return;
        }

        const hasCreate = surfaceMessages.some((msg) => msg.createSurface);
        const existed = surfaceStateManager.hasSurface(surfaceId);

        // 创建型 / 首次出现 → 整批转换并注册
        if (hasCreate || !existed) {
          const schema = convertA2UIMessagesToJsonRender(surfaceMessages);
          if (schema) {
            const catalogId = surfaceMessages.find((m) => m.createSurface)?.createSurface?.catalogId;
            surfaceStateManager.registerSurface(surfaceId, schema, catalogId);
            addSurfaceId(surfaceId);
            if (debug) {
              // eslint-disable-next-line no-console
              console.log('[useA2UISurface] 注册 Surface:', surfaceId);
            }
            // 同批内已经包含 updateDataModel 的初始数据，convertA2UIMessagesToJsonRender 已处理
            // 不需要再次走 updateData 路径
            return;
          }
        }

        // 已存在的 Surface：分别派发各类消息
        let mergedSchema: JsonRenderSchema | null = surfaceStateManager.getSchema(surfaceId);
        let schemaDirty = false;

        for (const msg of surfaceMessages) {
          if (msg.updateComponents && mergedSchema) {
            mergedSchema = applyA2UIUpdates(mergedSchema, msg.updateComponents.components as any[]);
            schemaDirty = true;
          } else if (msg.updateDataModel) {
            // updateDataModel 走 surfaceStateManager 标准订阅路径
            const { path, op, value } = msg.updateDataModel;
            surfaceStateManager.updateData(surfaceId, path, op || 'replace', value);
          }
        }

        // 组件树变化：通过 updateSchema 通知订阅者
        if (schemaDirty && mergedSchema) {
          surfaceStateManager.updateSchema(surfaceId, mergedSchema);
          addSurfaceId(surfaceId);
        }
      });
    },
    [addSurfaceId, removeSurfaceId, debug],
  );

  const clearAllSurfaces = useCallback(() => {
    // 仅清除本 hook 创建的 surface，避免影响其他模块
    surfaceIdsRef.current.forEach((id) => surfaceStateManager.deleteSurface(id));
    surfaceIdsRef.current = [];
    notify();
  }, [notify]);

  const hasSurface = useCallback((surfaceId: string) => surfaceStateManager.hasSurface(surfaceId), []);

  return useMemo<A2UISurfaceController>(
    () => ({
      surfaceIds: snapshot.ids,
      processMessages,
      clearAllSurfaces,
      hasSurface,
    }),
    [snapshot, processMessages, clearAllSurfaces, hasSurface],
  );
}

/* ------------------------------------------------------------------ */
/* A2UI Surface Renderer                                              */
/* ------------------------------------------------------------------ */

export interface A2UISurfaceRendererProps {
  /** Surface ID */
  surfaceId: string;
  /** 组件注册表（必传） */
  registry: ComponentRegistry;
  /** Action 处理器映射，与 JsonRenderActivityRenderer.actionHandlers 协议一致 */
  actionHandlers?: Record<string, (params: Record<string, unknown>) => void | Promise<void>>;
}

/**
 * 渲染指定 Surface 的 UI
 * 内部订阅 surfaceStateManager 状态变化，自动响应 schema/data 更新
 *
 * 渲染委托给 JsonRenderActivityRenderer，复用其 DataProvider/VisibilityProvider/ActionProvider 链路
 */
export const A2UISurfaceRenderer: React.FC<A2UISurfaceRendererProps> = ({ surfaceId, registry, actionHandlers }) => {
  // 订阅指定 surface 的 schema 变化
  const subscribe = useCallback(
    (listener: () => void) => surfaceStateManager.subscribe(surfaceId, listener),
    [surfaceId],
  );

  // 缓存最近一次 schema 引用，确保 getSnapshot 引用稳定（避免 useSyncExternalStore 抖动）
  const lastSchemaRef = useRef<JsonRenderSchema | null>(null);
  const getSnapshot = useCallback(() => {
    const next = surfaceStateManager.getSchema(surfaceId);
    if (next !== lastSchemaRef.current) {
      lastSchemaRef.current = next;
    }
    return lastSchemaRef.current;
  }, [surfaceId]);

  const schema = useSyncExternalStore(subscribe, getSnapshot, getSnapshot);

  if (!schema) {
    return null;
  }

  return (
    <JsonRenderActivityRenderer
      activityType="a2ui-surface"
      content={schema}
      messageId={surfaceId}
      registry={registry}
      actionHandlers={actionHandlers}
    />
  );
};

export default A2UISurfaceRenderer;

/* ------------------------------------------------------------------ */
/* Re-export 给消费方使用的工具                                        */
/* ------------------------------------------------------------------ */

export { applyA2UIDataUpdate, applyA2UIUpdates, convertA2UIMessagesToJsonRender };
export type { A2UIMessage, JsonRenderSchema };
