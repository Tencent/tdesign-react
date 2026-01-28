/**
 * Surface 状态管理器（框架无关）
 * 
 * 职责：
 * 1. 缓存已创建的 Surface Schema（跨消息/跨轮次）
 * 2. 提供订阅机制，当 Surface 数据更新时通知已渲染的组件
 * 
 * 使用场景：
 * - 第一轮对话：createSurface + updateComponents → 创建完整 UI，注册到缓存
 * - 后续轮次：仅 updateDataModel → 更新缓存中的数据，通知订阅者重渲染
 * 
 * 设计原则：
 * 1. 服务端是状态的单一数据源（updateDataModel 来自服务端）
 * 2. 本模块只负责存储和订阅，不负责 A2UI → JsonRender 的转换
 * 3. 转换逻辑由 a2ui-to-jsonrender.ts 中的函数完成
 */

import type { JsonRenderSchema } from './types/core';
import { applyA2UIDataUpdate } from './a2ui-to-jsonrender';

export interface SurfaceCache {
  /** Surface ID */
  surfaceId: string;
  /** Catalog ID */
  catalogId?: string;
  /** 当前的 json-render Schema */
  schema: JsonRenderSchema;
  /** 创建时间 */
  createdAt: number;
  /** 最后更新时间 */
  updatedAt: number;
}

/** 订阅者回调函数类型 */
export type SurfaceSubscriber = (schema: JsonRenderSchema) => void;

/**
 * Surface 状态管理器
 * 单例模式，全局共享 Surface 缓存
 * 框架无关，不依赖 React 或其他 UI 框架
 */
class SurfaceStateManager {
  private surfaces: Map<string, SurfaceCache> = new Map();
  /** 订阅者映射：surfaceId → Set<subscriber> */
  private subscribers: Map<string, Set<SurfaceSubscriber>> = new Map();
  private debug: boolean = false;

  /**
   * 设置调试模式
   */
  setDebug(enabled: boolean): void {
    this.debug = enabled;
  }

  /**
   * 注册 Surface（由创建型消息调用）
   * 
   * @param surfaceId Surface ID
   * @param schema 转换后的 json-render Schema
   * @param catalogId 可选的 Catalog ID
   */
  registerSurface(surfaceId: string, schema: JsonRenderSchema, catalogId?: string): void {
    const cache: SurfaceCache = {
      surfaceId,
      catalogId,
      schema,
      createdAt: Date.now(),
      updatedAt: Date.now(),
    };
    
    this.surfaces.set(surfaceId, cache);
    
    if (this.debug) {
      console.log('[SurfaceStateManager] 注册 Surface:', {
        surfaceId,
        elementsCount: Object.keys(schema.elements).length,
      });
    }
  }

  /**
   * 更新 Surface 数据（由更新型消息调用）
   * 
   * @param surfaceId Surface ID
   * @param path JSON Pointer 路径
   * @param op 操作类型
   * @param value 值
   * @returns 是否成功（Surface 存在）
   */
  updateData(
    surfaceId: string,
    path: string | undefined,
    op: 'add' | 'replace' | 'remove' = 'replace',
    value?: unknown,
  ): boolean {
    const cache = this.surfaces.get(surfaceId);
    if (!cache) {
      if (this.debug) {
        console.warn('[SurfaceStateManager] updateData: Surface 不存在', surfaceId);
      }
      return false;
    }

    // 使用已有的增量更新函数
    cache.schema = applyA2UIDataUpdate(cache.schema, path, op, value);
    cache.updatedAt = Date.now();

    if (this.debug) {
      console.log('[SurfaceStateManager] 更新数据:', {
        surfaceId,
        path,
        op,
        value,
        newData: cache.schema.data,
      });
    }

    // 异步通知订阅者
    this.notifySubscribersAsync(surfaceId, cache.schema);
    
    return true;
  }

  /**
   * 订阅 Surface 状态变化
   * 
   * @param surfaceId Surface ID
   * @param subscriber 订阅者回调
   * @returns 取消订阅函数
   */
  subscribe(surfaceId: string, subscriber: SurfaceSubscriber): () => void {
    if (!this.subscribers.has(surfaceId)) {
      this.subscribers.set(surfaceId, new Set());
    }
    this.subscribers.get(surfaceId)!.add(subscriber);

    if (this.debug) {
      console.log('[SurfaceStateManager] 订阅 Surface:', surfaceId);
    }

    // 返回取消订阅函数
    return () => {
      const subs = this.subscribers.get(surfaceId);
      if (subs) {
        subs.delete(subscriber);
        if (subs.size === 0) {
          this.subscribers.delete(surfaceId);
        }
      }
      if (this.debug) {
        console.log('[SurfaceStateManager] 取消订阅 Surface:', surfaceId);
      }
    };
  }

  /**
   * 异步通知订阅者（避免在渲染期间调用回调）
   */
  private notifySubscribersAsync(surfaceId: string, schema: JsonRenderSchema): void {
    const subs = this.subscribers.get(surfaceId);
    if (!subs || subs.size === 0) {
      return;
    }

    if (this.debug) {
      console.log('[SurfaceStateManager] 准备通知订阅者:', { surfaceId, subscriberCount: subs.size });
    }

    // 使用 queueMicrotask 延迟到当前执行栈完成后执行
    queueMicrotask(() => {
      // 重新获取订阅者（可能在这期间已被取消）
      const currentSubs = this.subscribers.get(surfaceId);
      if (!currentSubs || currentSubs.size === 0) {
        return;
      }

      if (this.debug) {
        console.log('[SurfaceStateManager] 执行通知订阅者:', { surfaceId });
      }

      currentSubs.forEach(subscriber => {
        try {
          subscriber(schema);
        } catch (e) {
          console.error('[SurfaceStateManager] 订阅者回调出错:', e);
        }
      });
    });
  }

  /**
   * 获取指定 Surface 的缓存
   */
  getSurface(surfaceId: string): SurfaceCache | undefined {
    return this.surfaces.get(surfaceId);
  }

  /**
   * 获取指定 Surface 的 Schema
   */
  getSchema(surfaceId: string): JsonRenderSchema | null {
    return this.surfaces.get(surfaceId)?.schema || null;
  }

  /**
   * 检查 Surface 是否存在
   */
  hasSurface(surfaceId: string): boolean {
    return this.surfaces.has(surfaceId);
  }

  /**
   * 获取所有 Surface ID
   */
  getAllSurfaceIds(): string[] {
    return Array.from(this.surfaces.keys());
  }

  /**
   * 删除 Surface（由 deleteSurface 消息调用）
   */
  deleteSurface(surfaceId: string): boolean {
    this.subscribers.delete(surfaceId);
    const deleted = this.surfaces.delete(surfaceId);
    
    if (this.debug && deleted) {
      console.log('[SurfaceStateManager] 删除 Surface:', surfaceId);
    }
    
    return deleted;
  }

  /**
   * 清除所有 Surface 缓存
   */
  clearAll(): void {
    this.surfaces.clear();
    this.subscribers.clear();
    if (this.debug) {
      console.log('[SurfaceStateManager] 清除所有缓存');
    }
  }

  /**
   * 获取缓存统计信息
   */
  getStats(): { 
    count: number; 
    surfaces: Array<{ id: string; elementsCount: number; updatedAt: number; subscriberCount: number }>;
  } {
    const surfaces = Array.from(this.surfaces.entries()).map(([id, cache]) => ({
      id,
      elementsCount: Object.keys(cache.schema.elements).length,
      updatedAt: cache.updatedAt,
      subscriberCount: this.subscribers.get(id)?.size || 0,
    }));

    return {
      count: this.surfaces.size,
      surfaces,
    };
  }
}

// 导出单例实例
export const surfaceStateManager = new SurfaceStateManager();

// 导出类供测试或创建独立实例
export { SurfaceStateManager };