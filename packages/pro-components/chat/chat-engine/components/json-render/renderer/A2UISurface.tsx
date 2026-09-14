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
   * ⚠️ 关键语义：A2UI 协议本身是"消息独立且按序处理"，但被外层 AG-UI 协议 batch 后
   *   一条 event 内可能出现"生命周期粘连"的合法组合，例如：
   *     1) update → delete （删除前的更新虽会被清理，但顺序必须保留以触发订阅者副作用）
   *     2) delete → create（同 id 重建）  ← 最关键：绝不能因为发现 delete 就丢弃后续 create
   *     3) 跨 surfaceId 混发
   *   因此这里按 surfaceId 分组后，仍需**逐条按序处理**每条消息，让 delete/create 都是
   *   独立的原子动作，而不是"发现 delete 就整批 return"。
   *
   * 路由策略（逐条按序处理）：
   * - createSurface   → 建 root（若同批内跟着 updateComponents 一起到，走 convert 整批注册；
   *                     否则记录 catalogId 等后续 update 到齐再注册）
   * - updateComponents → 已注册：applyA2UIUpdates 增量合并；未注册：累积等 root 到位
   * - updateDataModel → 走 surfaceStateManager.updateData 标准订阅通知路径
   * - deleteSurface   → deleteSurface 并从本地列表移除；之后仍继续处理该 surfaceId 的后续消息
   */
  const processMessages = useCallback(
    (messages: A2UIMessage[]) => {
      if (!Array.isArray(messages) || messages.length === 0) return;

      const grouped = groupMessagesBySurface(messages);

      grouped.forEach((surfaceMessages, surfaceId) => {
        // 待建 Schema 用的消息缓冲（当 surface 尚未注册时累积 createSurface + updateComponents）
        let pendingForBuild: A2UIMessage[] = [];
        // 已注册期的合并快照
        let mergedSchema: JsonRenderSchema | null = surfaceStateManager.hasSurface(surfaceId)
          ? surfaceStateManager.getSchema(surfaceId)
          : null;
        let schemaDirty = false;
        let pendingCatalogId: string | undefined;

        const flushSchemaDirty = () => {
          if (schemaDirty && mergedSchema) {
            surfaceStateManager.updateSchema(surfaceId, mergedSchema);
            addSurfaceId(surfaceId);
            schemaDirty = false;
          }
        };

        const tryBuildAndRegister = () => {
          if (surfaceStateManager.hasSurface(surfaceId)) return;
          if (pendingForBuild.length === 0) return;
          const schema = convertA2UIMessagesToJsonRender(pendingForBuild);
          if (schema) {
            const catalogId =
              pendingCatalogId || pendingForBuild.find((m) => m.createSurface)?.createSurface?.catalogId;
            surfaceStateManager.registerSurface(surfaceId, schema, catalogId);
            addSurfaceId(surfaceId);
            mergedSchema = schema;
            pendingForBuild = [];
            pendingCatalogId = undefined;
            if (debug) {
              // eslint-disable-next-line no-console
              console.log('[useA2UISurface] 注册 Surface:', surfaceId);
            }
          }
        };

        for (const msg of surfaceMessages) {
          if (msg.deleteSurface) {
            // 先把已注册期累积但未 flush 的更新落盘（可能触发外部订阅副作用），
            // 然后按 A2UI 协议独立删除；不影响后续消息（例如同 id 重建）。
            flushSchemaDirty();
            surfaceStateManager.deleteSurface(surfaceId);
            removeSurfaceId(surfaceId);
            // 复位本 surface 的所有累积上下文，让后续 createSurface 能全新起步
            pendingForBuild = [];
            pendingCatalogId = undefined;
            mergedSchema = null;
            schemaDirty = false;
            if (debug) {
              // eslint-disable-next-line no-console
              console.log('[useA2UISurface] 删除 Surface:', surfaceId);
            }
            continue;
          }

          if (msg.createSurface) {
            pendingCatalogId = msg.createSurface.catalogId;
            // Surface 已在 manager 中存在（例如同批先 delete 后再 create 到这里，
            // 但 delete 分支已经清空过；再或者跨批场景），把 create 消息也纳入 pendingForBuild
            // 以驱动首次注册。
            pendingForBuild.push(msg);
            tryBuildAndRegister();
            continue;
          }

          if (msg.updateComponents) {
            if (surfaceStateManager.hasSurface(surfaceId)) {
              // 已注册 → 增量合并
              if (!mergedSchema) mergedSchema = surfaceStateManager.getSchema(surfaceId);
              if (mergedSchema) {
                mergedSchema = applyA2UIUpdates(mergedSchema, msg.updateComponents.components as any[]);
                schemaDirty = true;
              }
            } else {
              // 未注册 → 累积等 root 到位后一次性 convert 建 schema
              pendingForBuild.push(msg);
              tryBuildAndRegister();
            }
            continue;
          }

          if (msg.updateDataModel) {
            if (surfaceStateManager.hasSurface(surfaceId)) {
              // 已注册 → 走标准订阅路径
              // 先把待落盘的组件更新 flush 出去，避免顺序错乱
              flushSchemaDirty();
              const { path, op, value } = msg.updateDataModel;
              surfaceStateManager.updateData(surfaceId, path, op || 'replace', value);
            } else {
              // 未注册 → 累积等待，convertA2UIMessagesToJsonRender 内部会处理初始数据
              pendingForBuild.push(msg);
            }
            continue;
          }
        }

        // 循环结束后统一 flush 组件树变化
        flushSchemaDirty();
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
