import React, { createContext, useContext, useSyncExternalStore, useCallback } from "react";
import type {
  UIElement,
  UITree,
} from "@json-render/core";
import { Store } from "./store";
import type { ComponentRenderer, ComponentRegistry } from '../types';

/**
 * TreeStore - 外部 store，支持细粒度订阅
 * 
 * 继承自通用 Store 基类，提供 UITree 的管理能力：
 * - 配合上游 Structural Sharing（结构共享）使用
 * - 上游 applyPatchImmutable 只重建被修改的节点
 * - 未修改的节点保持原引用
 * - getSnapshot 直接比较引用即可判断是否变化
 */
export class TreeStore extends Store<UITree | null> {
  constructor() {
    super(null);
  }
  
  setTree(tree: UITree | null) {
    this.setState(tree);
  }
  
  getTree() {
    return this.getState();
  }
  
  getElement(key: string): UIElement | undefined {
    return this.getState()?.elements[key];
  }
  
  getRoot(): string | undefined {
    return this.getState()?.root;
  }
}

/**
 * Context 只传递稳定引用
 */
interface RenderContextValue {
  store: TreeStore;
  registry: ComponentRegistry;
  loading?: boolean;
  fallback?: ComponentRenderer;
}

export const RenderContext = createContext<RenderContextValue | null>(null);

export function useRenderContext(): RenderContextValue {
  const ctx = useContext(RenderContext);
  if (!ctx) throw new Error('ElementRenderer must be used within RenderContext');
  return ctx;
}

/**
 * 使用 useSyncExternalStore 订阅特定 element
 * 
 * 依赖上游的 Structural Sharing：
 * - 如果 element 引用没变，说明内容没变，直接返回
 * - 如果 element 引用变了，说明内容变了，返回新引用触发重渲染
 */
export function useElement(elementKey: string): UIElement | undefined {
  const { store } = useRenderContext();
  
  const subscribe = useCallback(
    (onStoreChange: () => void) => store.subscribe(onStoreChange),
    [store]
  );
  
  // 直接返回 element 引用
  // 由于上游使用 Structural Sharing，引用相同 = 内容相同
  const getSnapshot = useCallback(() => {
    return store.getElement(elementKey);
  }, [store, elementKey]);
  
  return useSyncExternalStore(subscribe, getSnapshot, getSnapshot);
}

/**
 * Hook: 订阅 root key
 */
export function useRoot(): string | undefined {
  const { store } = useRenderContext();
  
  const subscribe = useCallback(
    (onStoreChange: () => void) => store.subscribe(onStoreChange),
    [store]
  );
  
  const getSnapshot = useCallback(() => store.getRoot(), [store]);
  
  return useSyncExternalStore(subscribe, getSnapshot, getSnapshot);
}
