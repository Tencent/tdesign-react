/**
 * A2UI 消息处理器 v2
 * 完全按照 A2UI v0.9 协议实现
 * 
 * 支持四种消息类型：
 * - createSurface: 创建 Surface
 * - updateComponents: 更新组件
 * - updateDataModel: 更新数据模型
 * - deleteSurface: 删除 Surface
 * 
 * 实现 External Store 模式，支持 useSyncExternalStore
 */

import type {
  A2UISurface,
  A2UIComponentBase,
  A2UIServerMessage,
  A2UIAction,
  ActionHandler,
  SkeletonHint,
  ResolvedComponent,
  UserActionMessage,
} from '../types';
import { DataStore } from './DataStore';
import { ComponentTree } from './ComponentTree';
import { PathResolver } from './PathResolver';

export type SurfaceSnapshot = Map<string, A2UISurface>;
export type SurfaceListener = () => void;

/**
 * A2UI 消息处理器配置
 */
export interface A2uiMessageProcessorOptions {
  /** Action 处理回调 */
  onAction?: ActionHandler;
  /** 用户行为消息发送回调 */
  onSendMessage?: (message: UserActionMessage) => void;
  /** 数据变更回调 */
  onDataChange?: (surfaceId: string, path: string, value: unknown) => void;
  /** 验证错误回调 */
  onValidationError?: (errors: Array<{ type: string; message: string; path?: string }>) => void;
}

/**
 * 内部 Surface 数据结构
 */
interface InternalSurface {
  id: string;
  catalogId: string;
  state: 'active' | 'closed' | 'pending';
  components: Map<string, A2UIComponentBase>;
  dataStore: DataStore;
  componentTree: ComponentTree | null;
  skeletonHint?: SkeletonHint;
  updatedAt: number;
}

/**
 * A2UI 消息处理器
 * 
 * 核心功能：
 * 1. 处理 A2UI v0.9 协议消息
 * 2. 管理 Surface 生命周期
 * 3. 维护组件注册表和数据模型
 * 4. 构建组件树
 * 5. 支持 useSyncExternalStore 订阅
 */
export class A2uiMessageProcessor {
  private surfaces = new Map<string, InternalSurface>();
  private listeners = new Set<SurfaceListener>();
  private pathResolver = new PathResolver();
  private options: A2uiMessageProcessorOptions;
  
  // 缓存的快照，避免 useSyncExternalStore 无限循环
  private cachedSnapshot: SurfaceSnapshot = new Map();
  private snapshotVersion = 0;

  constructor(options: A2uiMessageProcessorOptions = {}) {
    this.options = options;
    // 绑定方法以确保 this 指向正确
    this.subscribe = this.subscribe.bind(this);
    this.getSnapshot = this.getSnapshot.bind(this);
    this.getServerSnapshot = this.getServerSnapshot.bind(this);
  }

  // ============= External Store 接口 =============

  /**
   * 订阅状态变化（供 useSyncExternalStore 使用）
   */
  subscribe(listener: SurfaceListener): () => void {
    this.listeners.add(listener);
    return () => {
      this.listeners.delete(listener);
    };
  }

  /**
   * 获取当前快照（供 useSyncExternalStore 使用）
   * 返回缓存的快照，确保引用稳定
   */
  getSnapshot(): SurfaceSnapshot {
    return this.cachedSnapshot;
  }

  /**
   * 获取服务端快照（SSR 场景）
   */
  getServerSnapshot(): SurfaceSnapshot {
    return this.cachedSnapshot;
  }

  /**
   * 更新缓存的快照
   * 只在数据变更时调用
   */
  private updateCachedSnapshot(): void {
    const snapshot = new Map<string, A2UISurface>();
    
    this.surfaces.forEach((internal, id) => {
      snapshot.set(id, {
        id: internal.id,
        catalogId: internal.catalogId,
        state: internal.state,
        components: internal.components,
        root: internal.componentTree?.root || null,
        data: internal.dataStore.getSnapshot(),
        skeletonHint: internal.skeletonHint,
        updatedAt: internal.updatedAt,
      });
    });
    
    this.cachedSnapshot = snapshot;
    this.snapshotVersion++;
  }

  // ============= A2UI v0.9 消息处理 =============

  /**
   * 处理单条 A2UI v0.9 消息
   */
  processMessage(message: A2UIServerMessage): void {
    this.processMessageInternal(message);
    this.emitChange();
  }

  /**
   * 批量处理消息
   */
  processMessages(messages: A2UIServerMessage[]): void {
    for (const message of messages) {
      this.processMessageInternal(message);
    }

    // 所有消息处理完后统一通知
    this.emitChange();
  }

  /**
   * 增量处理消息（性能优化）
   * 当已知消息是新增的时候使用，避免重复处理
   */
  processMessagesIncremental(messages: A2UIServerMessage[]): void {
    if (messages.length === 0) return;

    for (const message of messages) {
      this.processMessageInternal(message);
    }

    this.emitChange();
  }

  /**
   * 内部消息处理（不触发 emitChange）
   */
  private processMessageInternal(message: A2UIServerMessage): void {
    if ('createSurface' in message) {
      this.handleCreateSurface(message.createSurface);
    } else if ('updateComponents' in message) {
      this.handleUpdateComponents(message.updateComponents);
    } else if ('updateDataModel' in message) {
      this.handleUpdateDataModel(message.updateDataModel);
    } else if ('deleteSurface' in message) {
      this.handleDeleteSurface(message.deleteSurface);
    }
  }

  // ============= 消息处理器 =============

  /**
   * 处理 createSurface 消息
   */
  private handleCreateSurface(payload: { surfaceId: string; catalogId: string }): void {
    const surface: InternalSurface = {
      id: payload.surfaceId,
      catalogId: payload.catalogId,
      state: 'pending',
      components: new Map(),
      dataStore: new DataStore(),
      componentTree: null,
      updatedAt: Date.now(),
    };

    this.surfaces.set(payload.surfaceId, surface);
  }

  /**
   * 处理 updateComponents 消息
   */
  private handleUpdateComponents(payload: { surfaceId: string; components: A2UIComponentBase[] }): void {
    let surface = this.surfaces.get(payload.surfaceId);
    
    // 如果 Surface 不存在，自动创建（容错处理）
    if (!surface) {
      console.warn(`[A2UI] Surface ${payload.surfaceId} not found, auto-creating`);
      surface = {
        id: payload.surfaceId,
        catalogId: 'default',
        state: 'pending',
        components: new Map(),
        dataStore: new DataStore(),
        componentTree: null,
        updatedAt: Date.now(),
      };
      this.surfaces.set(payload.surfaceId, surface);
    }

    // 添加/更新组件到平铺注册表
    for (const component of payload.components) {
      surface.components.set(component.id, component);
    }

    // 重建组件树
    this.rebuildComponentTree(surface);

    // 如果有 root 组件，激活 Surface
    if (surface.components.has('root') && surface.state === 'pending') {
      surface.state = 'active';
    }

    surface.updatedAt = Date.now();
  }

  /**
   * 处理 updateDataModel 消息
   */
  private handleUpdateDataModel(payload: {
    surfaceId: string;
    path?: string;
    op?: 'add' | 'replace' | 'remove';
    value?: unknown;
  }): void {
    const surface = this.surfaces.get(payload.surfaceId);
    if (!surface) {
      console.warn(`[A2UI] Surface ${payload.surfaceId} not found`);
      return;
    }

    const path = payload.path || '/';
    const op = payload.op || 'replace';

    if (op === 'remove') {
      surface.dataStore.remove(path);
    } else {
      // add 和 replace 都使用 set
      surface.dataStore.set(path, payload.value);
    }

    // 只有当数据变化可能影响 template 渲染时才重建组件树
    // 优化：检查是否有组件使用了 template children
    if (this.needsTreeRebuild(surface, path)) {
      this.rebuildComponentTree(surface);
    }
    surface.updatedAt = Date.now();
  }

  /**
   * 检查是否需要重建组件树
   * 优化：只有当路径可能影响 template 渲染时才需要重建
   */
  private needsTreeRebuild(surface: InternalSurface, path: string): boolean {
    // 如果是根路径替换，需要重建
    if (path === '/' || path === '') {
      return true;
    }

    // 检查是否有组件的 children 使用了这个路径作为 template
    for (const component of surface.components.values()) {
      const children = (component as any).children;
      if (children && typeof children === 'object' && !Array.isArray(children)) {
        // A2UI v0.9 格式: { componentId, path }
        const templatePath = (children as any).path;
        if (templatePath && (path.startsWith(templatePath) || templatePath.startsWith(path))) {
          return true;
        }
      }
    }

    return false;
  }

  /**
   * 只更新数据模型，不重建组件树（性能优化）
   * 适用于不影响组件结构的数据更新（如表单输入）
   */
  updateDataOnly(surfaceId: string, path: string, value: unknown): void {
    const surface = this.surfaces.get(surfaceId);
    if (!surface) return;

    surface.dataStore.set(path, value);
    surface.updatedAt = Date.now();
    
    // 只更新快照，不重建组件树
    this.updateCachedSnapshot();
    this.listeners.forEach((listener) => listener());
    
    // 触发回调
    this.options.onDataChange?.(surfaceId, path, value);
  }

  /**
   * 处理 deleteSurface 消息
   */
  private handleDeleteSurface(payload: { surfaceId: string }): void {
    this.surfaces.delete(payload.surfaceId);
  }

  // ============= 组件树构建 =============

  /**
   * 重建组件树
   */
  private rebuildComponentTree(surface: InternalSurface): void {
    // 只有存在 root 组件时才构建树
    if (!surface.components.has('root')) {
      surface.componentTree = null;
      return;
    }

    surface.componentTree = new ComponentTree(
      surface.components,
      surface.dataStore,
      this.pathResolver
    );
  }

  // ============= 数据访问（供 React 组件使用）=============

  /**
   * 获取数据
   * @param surfaceId Surface ID
   * @param path 数据路径
   * @param dataContextPath 当前组件的数据上下文
   */
  getData(surfaceId: string, path: string, dataContextPath: string = ''): unknown {
    const surface = this.surfaces.get(surfaceId);
    if (!surface) return undefined;

    const resolvedPath = this.pathResolver.resolve(path, dataContextPath);
    return surface.dataStore.get(resolvedPath);
  }

  /**
   * 设置数据（双向绑定）
   */
  setData(surfaceId: string, path: string, dataContextPath: string, value: unknown): void {
    const surface = this.surfaces.get(surfaceId);
    if (!surface) return;

    const resolvedPath = this.pathResolver.resolve(path, dataContextPath);
    surface.dataStore.set(resolvedPath, value);

    // 重建组件树并通知
    this.rebuildComponentTree(surface);
    surface.updatedAt = Date.now();
    this.emitChange();

    // 触发回调
    this.options.onDataChange?.(surfaceId, resolvedPath, value);
  }

  /**
   * 更新数据值（简化接口，不需要 dataContextPath）
   */
  updateDataValue(surfaceId: string, path: string, value: unknown): void {
    this.setData(surfaceId, path, '', value);
  }

  // ============= Action 处理 =============

  /**
   * 分发 Action
   */
  dispatchAction(action: A2UIAction, surfaceId?: string, componentId?: string): void {
    // 调用外部回调
    if (this.options.onAction) {
      const context = surfaceId ? {
        surfaceId,
        componentId,
        updateData: (path: string, value: unknown) => {
          this.updateDataValue(surfaceId, path, value);
        },
        getData: (path?: string) => {
          const surface = this.surfaces.get(surfaceId);
          if (!surface) return undefined;
          return path ? surface.dataStore.get(path) : surface.dataStore.getSnapshot();
        },
      } : undefined;

      this.options.onAction(action, context);
    }

    // 发送用户行为消息
    if (this.options.onSendMessage && surfaceId && componentId) {
      this.options.onSendMessage({
        userAction: {
          name: action.name,
          surfaceId,
          sourceComponentId: componentId,
          timestamp: new Date().toISOString(),
          context: action.context || {},
        },
      });
    }
  }

  // ============= Surface 管理（扩展方法）=============

  /**
   * 创建 Pending 状态的 Surface（用于显示骨架屏）
   */
  createPendingSurface(surfaceId: string, skeletonHint?: SkeletonHint): void {
    if (this.surfaces.has(surfaceId)) return;

    const surface: InternalSurface = {
      id: surfaceId,
      catalogId: 'default',
      state: 'pending',
      components: new Map(),
      dataStore: new DataStore(),
      componentTree: null,
      skeletonHint,
      updatedAt: Date.now(),
    };

    this.surfaces.set(surfaceId, surface);
    this.emitChange();
  }

  /**
   * 激活 Surface
   */
  activateSurface(surfaceId: string): void {
    const surface = this.surfaces.get(surfaceId);
    if (!surface) return;

    surface.state = 'active';
    surface.updatedAt = Date.now();
    this.emitChange();
  }

  /**
   * 关闭 Surface
   */
  closeSurface(surfaceId: string): void {
    const surface = this.surfaces.get(surfaceId);
    if (!surface) return;

    surface.state = 'closed';
    surface.updatedAt = Date.now();
    this.emitChange();
  }

  /**
   * 直接设置整个数据模型
   */
  setSurfaceData(surfaceId: string, data: Record<string, unknown>): void {
    const surface = this.surfaces.get(surfaceId);
    if (!surface) return;

    surface.dataStore.set('/', data);
    this.rebuildComponentTree(surface);
    surface.updatedAt = Date.now();
    this.emitChange();
  }

  /**
   * 合并数据（保留用户输入）
   */
  mergeSurfaceData(surfaceId: string, data: Record<string, unknown>): void {
    const surface = this.surfaces.get(surfaceId);
    if (!surface) return;

    surface.dataStore.merge('/', data);
    this.rebuildComponentTree(surface);
    surface.updatedAt = Date.now();
    this.emitChange();
  }

  // ============= 工具方法 =============

  /**
   * 获取单个 Surface
   */
  getSurface(surfaceId: string): A2UISurface | undefined {
    const internal = this.surfaces.get(surfaceId);
    if (!internal) return undefined;

    return {
      id: internal.id,
      catalogId: internal.catalogId,
      state: internal.state,
      components: internal.components,
      root: internal.componentTree?.root || null,
      data: internal.dataStore.getSnapshot(),
      skeletonHint: internal.skeletonHint,
      updatedAt: internal.updatedAt,
    };
  }

  /**
   * 获取所有 Surface ID
   */
  getSurfaceIds(): string[] {
    return Array.from(this.surfaces.keys());
  }

  /**
   * 获取所有 Surface
   */
  getAllSurfaces(): A2UISurface[] {
    return this.getSurfaceIds().map((id) => this.getSurface(id)!);
  }

  /**
   * 获取组件树
   */
  getComponentTree(surfaceId: string): ResolvedComponent | null {
    const surface = this.surfaces.get(surfaceId);
    return surface?.componentTree?.root || null;
  }

  /**
   * 查找组件
   */
  findComponent(surfaceId: string, componentId: string): A2UIComponentBase | undefined {
    const surface = this.surfaces.get(surfaceId);
    return surface?.components.get(componentId);
  }

  /**
   * 清空所有 Surface
   */
  clear(): void {
    this.surfaces.clear();
    this.emitChange();
  }

  /**
   * 清空所有 Surface（别名）
   */
  clearAllSurfaces(): void {
    this.clear();
  }

  /**
   * 销毁处理器
   */
  destroy(): void {
    this.clear();
    this.listeners.clear();
  }

  // ============= 内部方法 =============

  /**
   * 通知所有订阅者
   * 先更新缓存快照，再通知订阅者
   */
  private emitChange(): void {
    // 先更新缓存快照
    this.updateCachedSnapshot();
    // 再通知订阅者
    this.listeners.forEach((listener) => {
      listener();
    });
  }
}

/**
 * 创建 A2UI 消息处理器实例
 */
export function createA2uiProcessor(options?: A2uiMessageProcessorOptions): A2uiMessageProcessor {
  return new A2uiMessageProcessor(options);
}

export default A2uiMessageProcessor;
