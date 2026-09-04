/**
 * A2UI v0.9.1 + json-render Activity 渲染器（增量分帧版 + Ownership 机制）
 *
 * 与旧版差异：
 * - 旧版：每次 content.messages 变化都全量重跑 convertA2UIMessagesToJsonRender，
 *         且 isCreation 判定基于全量数组，导致分帧下发时首帧只有 createSurface 不出 UI、
 *         数据 DELTA 也会走全量转换（性能损耗）。
 * - 新版：用 ref 记住 lastProcessedIndex，每次只处理"本次新增"的 messages 切片；
 *         按消息类型分派到 SurfaceStateManager 的对应能力（applyA2UIUpdates / updateData / deleteSurface）。
 *
 * 生产场景支持：LLM 分步输出 A2UI 消息（先 createSurface → 停顿 → updateComponents →
 * 停顿 → updateDataModel），每一步都能正确增量渲染。
 *
 * 消息路由策略（与 useA2UISurface hook 保持一致 + 遵循 A2UI 官方规范）：
 * 1. deleteSurface  → surfaceStateManager.deleteSurface（并通知所有订阅者）
 * 2. createSurface  → 记录 surfaceId + catalogId；若切片内已有 root 组件则立即 registerSurface；
 *                     否则进入"等待 root"状态，后续切片凑齐 root 时才注册
 * 3. Attach 已存在 Surface → 后续会话只发 update 消息时，surfaceStateManager 里已有该 Surface，
 *                            renderer 直接挂载并订阅，跳过重建（A2UI 官方规范：surfaceId 全局唯一）
 * 4. updateComponents（Surface 已注册） → applyA2UIUpdates 增量合并 schema，触发 updateSchema
 * 5. updateDataModel（Surface 已注册） → surfaceStateManager.updateData（原有路径）
 * 6. updateComponents / updateDataModel（Surface 尚不存在） → 累积等待 root 到位后建 Schema
 *
 * Ownership 机制（"先到先得"语义，符合 A2UI 官方"surfaceId 全局唯一"）：
 * - 每个 renderer 实例 mount 生成唯一 ownerToken
 * - 处理消息时（无论 createSurface 还是 attach）→ 尝试 claimOwnership：
 *   * 成功 → 本 renderer 成为 owner，实时渲染 UI（首屏加载的 activity 块）
 *   * 失败 → 说明已有 owner（首屏那个 activity 块），本 renderer 是"消息通道"，
 *           不渲染 UI（后续用户交互产生的 activity 块）
 * - 所有对 Surface 的更新通过 subscribers 广播到 owner，实时反映到唯一 UI 显示实体
 * - deleteSurface 时，owner 收到 isOwner=false 通知 → 隐藏 UI（Surface 结束生命）
 * - Unmount 时 releaseOwnership，让其他 renderer 有机会接管（仅在 owner 组件卸载后可能）
 */

import React, { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import {
  applyA2UIUpdates,
  convertA2UIMessagesToJsonRender,
  extractSurfaceId,
  surfaceStateManager,
} from '@tdesign/web-components-chat/chat-engine';

import { JsonRenderActivityRenderer } from './JsonRenderActivityRenderer';

import type { A2UIMessage, JsonRenderSchema } from '@tdesign/web-components-chat/chat-engine';
import type { ComponentRegistry, JsonRenderActivityProps } from '../types';

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
 * 单个 activity 块内部的分帧处理状态
 * 每个 renderer 实例有独立的一份，通过 ref 持久化，跨 render 生效
 */
interface FrameState {
  /** 已处理到 messages 数组的哪个 index（切片起点） */
  lastProcessedIndex: number;
  /** 已识别到的 surfaceId（createSurface 后确定） */
  surfaceId: string | null;
  /** 已识别到的 catalogId */
  catalogId: string | undefined;
  /** Surface 是否已注册到 surfaceStateManager */
  registered: boolean;
  /**
   * 等待 root 到位期间累积的消息缓冲
   * 一旦某次切片让整体 messages 里出现了 root 组件，就整批 flush 给 convertA2UIMessagesToJsonRender
   */
  pendingMessages: A2UIMessage[];
}

function createInitialFrameState(): FrameState {
  return {
    lastProcessedIndex: 0,
    surfaceId: null,
    catalogId: undefined,
    registered: false,
    pendingMessages: [],
  };
}

/**
 * A2UI v0.9.1 + json-render Activity 渲染器组件（增量分帧版）
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

  // 分帧处理状态（跨 render 持久化）
  const frameStateRef = useRef<FrameState>(createInitialFrameState());

  // Ownership token（本 renderer 实例的唯一身份，用于 claimOwnership）
  // 用 useRef + 首次访问初始化，保证跨 render 引用稳定
  const ownerTokenRef = useRef<symbol | null>(null);
  if (ownerTokenRef.current === null) {
    ownerTokenRef.current = Symbol(`A2UIRenderer:${messageId || 'anon'}`);
  }

  // 用于触发重渲染的版本号（surfaceStateManager 通知回来时递增）
  const [renderVersion, setRenderVersion] = useState(0);

  // Ownership 状态：本 renderer 是否是当前 Surface 的 owner
  //   - true  → 渲染 UI（首屏创建 Surface 的 activity 块）
  //   - false → 不渲染 UI（后续用户交互产生的 activity 块，只作为消息通道）
  const [isOwner, setIsOwner] = useState(false);

  // messageId 变化时重置状态（activity 块换了实例）
  useEffect(() => {
    frameStateRef.current = createInitialFrameState();
    setIsOwner(false);
  }, [messageId]);

  // ============ 核心：增量处理本次新增的 messages 切片 ============
  //
  // 依赖 content.messages（引用变化即触发）；用 ref.lastProcessedIndex 做游标，
  // 保证每条消息只被处理一次。
  //
  useEffect(() => {
    const msgs = content.messages;
    if (!Array.isArray(msgs) || msgs.length === 0) return;

    const state = frameStateRef.current;
    // 兼容情况：如果 messages 长度回退（理论上不应发生），重置状态从头处理
    if (msgs.length < state.lastProcessedIndex) {
      if (debug) {
        // eslint-disable-next-line no-console
        console.log('[A2UI Adapter] messages 长度回退，重置分帧状态');
      }
      frameStateRef.current = createInitialFrameState();
    }

    // 本次要处理的消息切片
    const slice = msgs.slice(frameStateRef.current.lastProcessedIndex);
    if (slice.length === 0) return;

    if (debug) {
      // eslint-disable-next-line no-console
      console.log('[A2UI Adapter] 增量处理切片:', {
        messageId,
        fromIndex: frameStateRef.current.lastProcessedIndex,
        sliceLength: slice.length,
        sliceTypes: slice.map(
          (m) =>
            Object.keys(m).filter((k) =>
              ['createSurface', 'updateComponents', 'updateDataModel', 'deleteSurface'].includes(k),
            )[0],
        ),
      });
    }

    processIncrementalSlice(slice, frameStateRef.current, msgs, () => setRenderVersion((v) => v + 1), debug);

    // 更新游标
    frameStateRef.current.lastProcessedIndex = msgs.length;

    // Ownership 认领（"先到先得"）：切片处理完后如果 Surface 已注册，尝试 claim
    //   - 首屏 activity 块：Surface 首次创建，claim 成功 → owner 位空 → 本 renderer 成为 owner
    //   - 后续用户交互 activity 块：Surface 已被首屏 renderer 认领 → claim 失败 → 不渲染 UI
    //     （但通过 subscribe 拿到的 update 消息会广播给首屏 owner，实时反映到唯一 UI）
    const currentState = frameStateRef.current;
    if (currentState.registered && currentState.surfaceId && ownerTokenRef.current) {
      surfaceStateManager.claimOwnership(currentState.surfaceId, ownerTokenRef.current);
    }
    // 依赖 messages 数组引用（每次 SNAPSHOT/DELTA 变化都会新建）
  }, [content.messages, messageId, debug]);

  // ============ 订阅 surfaceStateManager 状态变化（schema + ownership） ============
  //
  // 一旦 Surface 注册成功，就订阅它的 schema 变化（updateComponents / updateDataModel 都会通知）
  // 同时订阅 ownership 变化：
  //   - claim 成功时 → 收到 isOwner=true 通知 → 渲染 UI
  //   - deleteSurface 时 → 收到 isOwner=false 通知 → 隐藏 UI
  //
  const surfaceIdForSubscribe = frameStateRef.current.registered ? frameStateRef.current.surfaceId : null;

  const handleSchemaUpdate = useCallback(() => {
    if (debug) {
      // eslint-disable-next-line no-console
      console.log('[A2UI Adapter] 收到 surface 状态更新通知，触发重渲染');
    }
    setRenderVersion((v) => v + 1);
  }, [debug]);

  useEffect(() => {
    if (!surfaceIdForSubscribe || !ownerTokenRef.current) return;

    if (debug) {
      // eslint-disable-next-line no-console
      console.log('[A2UI Adapter] 订阅 Surface 状态 + Ownership:', surfaceIdForSubscribe);
    }

    // 订阅 schema 变化
    const unsubSchema = surfaceStateManager.subscribe(surfaceIdForSubscribe, handleSchemaUpdate);

    // 订阅 ownership 变化
    const myToken = ownerTokenRef.current;
    const unsubOwnership = surfaceStateManager.subscribeOwnership(surfaceIdForSubscribe, myToken, (nowIsOwner) => {
      if (debug) {
        // eslint-disable-next-line no-console
        console.log('[A2UI Adapter] Ownership 变化:', {
          surfaceId: surfaceIdForSubscribe,
          isOwner: nowIsOwner,
        });
      }
      setIsOwner(nowIsOwner);
    });

    // 主动同步一次 ownership 状态（订阅后立即查询当前是不是 owner）
    setIsOwner(surfaceStateManager.isOwner(surfaceIdForSubscribe, myToken));

    return () => {
      if (debug) {
        // eslint-disable-next-line no-console
        console.log('[A2UI Adapter] 取消订阅 Surface 状态 + Ownership:', surfaceIdForSubscribe);
      }
      unsubSchema();
      unsubOwnership();
    };
  }, [surfaceIdForSubscribe, handleSchemaUpdate, debug]);

  // Unmount 时释放 ownership（避免 dangling owner 占用 surface 显示权，让其他 renderer 有机会接管）
  useEffect(() => {
    return () => {
      const { surfaceId } = frameStateRef.current;
      const token = ownerTokenRef.current;
      if (surfaceId && token) {
        surfaceStateManager.releaseOwnership(surfaceId, token);
      }
    };
  }, []);

  // ============ 派生渲染用的 schema ============
  //
  // 只有当"是 owner 且 Surface 有效"时才渲染 UI；其他情况（非 owner / Surface 已删）返回 null。
  //
  const currentSchema = useMemo<JsonRenderSchema | null>(() => {
    const state = frameStateRef.current;
    if (!state.registered || !state.surfaceId) return null;
    if (!isOwner) return null;
    return surfaceStateManager.getSchema(state.surfaceId);
    // renderVersion 变化时重新取 schema（订阅回调 / 增量处理都会递增它）
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [renderVersion, isOwner]);

  // 非 owner 或 Surface 无效 → 不渲染
  if (!currentSchema) {
    return null;
  }

  // 委托 JsonRenderActivityRenderer 渲染最终 UI
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

/* ------------------------------------------------------------------ */
/* 核心：分帧增量处理（纯函数式，方便单测）                             */
/* ------------------------------------------------------------------ */

/**
 * 处理一批新增消息切片
 *
 * @param slice        本次新增的消息（未曾处理过）
 * @param state        分帧状态（会被 mutate）
 * @param fullMessages 完整消息数组（用于"从头补 root"场景）
 * @param bumpRender   触发外层重新读取 schema 的回调（用于首次 register 后立刻显示 UI）
 * @param debug        调试开关
 */
function processIncrementalSlice(
  slice: A2UIMessage[],
  state: FrameState,
  fullMessages: A2UIMessage[],
  bumpRender: () => void,
  debug: boolean,
): void {
  // 1) 先检查 deleteSurface —— 后续消息在 delete 之后无意义
  for (const msg of slice) {
    if (msg.deleteSurface) {
      const { surfaceId } = msg.deleteSurface;
      surfaceStateManager.deleteSurface(surfaceId);
      if (state.surfaceId === surfaceId) {
        state.registered = false;
      }
      if (debug) {
        // eslint-disable-next-line no-console
        console.log('[A2UI Adapter] 删除 Surface:', surfaceId);
      }
      // 关键：state.registered 只是 ref 内部字段，React 不知道它变了。
      // 必须显式触发一次重渲染，才能让 currentSchema useMemo 重新计算并返回 null，
      // 从而让 <JsonRenderActivityRenderer /> 真正卸载，UI 从画面上消失。
      bumpRender();
      // 简化处理：delete 消息内的其他消息类型忽略（协议中不会同批混发）
      return;
    }
  }

  // 2) 提取本切片中的 createSurface（如有）
  for (const msg of slice) {
    if (msg.createSurface && !state.surfaceId) {
      state.surfaceId = msg.createSurface.surfaceId;
      state.catalogId = msg.createSurface.catalogId;
      if (debug) {
        // eslint-disable-next-line no-console
        console.log('[A2UI Adapter] 识别 Surface:', state.surfaceId);
      }
    }
  }

  // 也允许通过其他消息类型反推 surfaceId（兼容极端场景：没有 createSurface 直接 updateComponents）
  if (!state.surfaceId) {
    state.surfaceId = extractSurfaceId(slice);
  }
  if (!state.surfaceId) {
    if (debug) {
      // eslint-disable-next-line no-console
      console.log('[A2UI Adapter] 切片无 surfaceId，跳过');
    }
    return;
  }

  // 3) Attach 到已存在的 Surface（A2UI 官方规范：surfaceId 全局唯一，不允许重复 create）
  //
  // 场景：服务端本次会话只发 updateComponents/updateDataModel，不发 createSurface
  //      （因为该 Surface 已经在前一次会话中创建过）。
  // 处理：直接把本 renderer 实例挂到已有 Surface 上，标记 registered=true，触发订阅。
  //      本次切片里的 updateComponents/updateDataModel 会在下一个分支处理。
  if (!state.registered && surfaceStateManager.hasSurface(state.surfaceId)) {
    state.registered = true;
    // 触发外层 useMemo 重取 schema + useEffect 建立订阅
    bumpRender();
    if (debug) {
      // eslint-disable-next-line no-console
      console.log('[A2UI Adapter] Attach 到已存在的 Surface:', state.surfaceId);
    }
  }

  // 4) 已注册 Surface 的常规分派
  if (state.registered) {
    let mergedSchema = surfaceStateManager.getSchema(state.surfaceId);
    let schemaDirty = false;

    for (const msg of slice) {
      if (msg.updateComponents && mergedSchema) {
        mergedSchema = applyA2UIUpdates(mergedSchema, msg.updateComponents.components as any[]);
        schemaDirty = true;
        if (debug) {
          // eslint-disable-next-line no-console
          console.log('[A2UI Adapter] 增量合并组件:', {
            surfaceId: state.surfaceId,
            componentsCount: msg.updateComponents.components?.length,
            incomingIds: msg.updateComponents.components?.map((c) => c.id),
            allElementIds: Object.keys(mergedSchema.elements),
          });
        }
      } else if (msg.updateDataModel) {
        const { path, op, value } = msg.updateDataModel;
        surfaceStateManager.updateData(state.surfaceId, path, op || 'replace', value);
      }
    }

    if (schemaDirty && mergedSchema) {
      surfaceStateManager.updateSchema(state.surfaceId, mergedSchema);
    }
    return;
  }

  // 5) Surface 尚未注册且 surfaceStateManager 里也不存在：从头建 Schema
  //    fullMessages 是完整已到达的消息数组，convertA2UIMessagesToJsonRender 会做累积合并
  const schema = convertA2UIMessagesToJsonRender(fullMessages);
  if (schema) {
    surfaceStateManager.registerSurface(state.surfaceId, schema, state.catalogId);
    state.registered = true;
    // 主动触发一次外层重取 schema，让首屏立即显示
    bumpRender();
    if (debug) {
      // eslint-disable-next-line no-console
      console.log('[A2UI Adapter] Surface 注册成功:', {
        surfaceId: state.surfaceId,
        elementsCount: Object.keys(schema.elements).length,
        allElementIds: Object.keys(schema.elements),
        dataKeys: Object.keys(schema.data || {}),
      });
    }
  } else if (debug) {
    // eslint-disable-next-line no-console
    console.log('[A2UI Adapter] Surface 尚未凑齐 root 组件，等待后续切片:', state.surfaceId, {
      fullMessagesCount: fullMessages.length,
    });
  }
}

export default A2UIJsonRenderActivityRenderer;
