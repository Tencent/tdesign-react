"use client";

import React, {
  useCallback,
  useEffect,
  useRef,
  useSyncExternalStore,
  type ReactNode,
} from "react";
import { produce } from "immer";
import {
  getByPath,
  setByPath as setByPathMutable,
  type DataModel,
  type AuthState,
} from "@json-render/core";
import { Store, createStoreContext, useStableCallback } from "./store";

/**
 * DataStore 状态类型
 */
export interface DataStoreState {
  /** 数据模型 */
  data: DataModel;
  /** 认证状态 */
  authState?: AuthState;
}

/**
 * DataStore - 管理表单/组件的数据状态
 * 
 * 性能优化：
 * - 使用外部 Store 模式，避免 Context 传递整个 data 导致级联重渲染
 * - 支持细粒度订阅：组件只订阅自己需要的路径
 * - 配合 Structural Sharing，通过引用比较判断变化
 */
export class DataStore extends Store<DataStoreState> {
  private onDataChange?: (path: string, value: unknown) => void;

  constructor(
    initialData: DataModel = {},
    authState?: AuthState,
    onDataChange?: (path: string, value: unknown) => void,
  ) {
    super({ data: initialData, authState });
    this.onDataChange = onDataChange;
  }

  /**
   * 获取数据模型
   */
  getData(): DataModel {
    return this.getState().data;
  }

  /**
   * 获取认证状态
   */
  getAuthState(): AuthState | undefined {
    return this.getState().authState;
  }

  /**
   * 通过路径获取值
   */
  getByPath(path: string): unknown {
    return getByPath(this.getState().data, path);
  }

  /**
   * 通过路径设置值（使用 immer 实现 Structural Sharing）
   */
  setByPath(path: string, value: unknown): void {
    this.updateState((prev) => 
      produce(prev, (draft) => {
        setByPathMutable(draft.data, path, value);
      })
    );
    this.onDataChange?.(path, value);
  }

  /**
   * 批量更新多个路径
   */
  updatePaths(updates: Record<string, unknown>): void {
    this.updateState((prev) =>
      produce(prev, (draft) => {
        for (const [path, value] of Object.entries(updates)) {
          setByPathMutable(draft.data, path, value);
          this.onDataChange?.(path, value);
        }
      })
    );
  }

  /**
   * 合并新数据到现有数据
   */
  mergeData(newData: DataModel): void {
    this.updateState((prev) =>
      produce(prev, (draft) => {
        for (const [key, value] of Object.entries(newData)) {
          if (
            typeof value === "object" &&
            value !== null &&
            !Array.isArray(value) &&
            typeof draft.data[key] === "object" &&
            draft.data[key] !== null
          ) {
            Object.assign(draft.data[key] as object, value);
          } else {
            draft.data[key] = value;
          }
        }
      })
    );
  }

  /**
   * 更新认证状态
   */
  setAuthState(authState: AuthState | undefined): void {
    this.updateState((prev) => ({ ...prev, authState }));
  }

  /**
   * 设置 onDataChange 回调
   */
  setOnDataChange(callback: ((path: string, value: unknown) => void) | undefined): void {
    this.onDataChange = callback;
  }
}

// 创建 Store Context
const {
  Provider: DataStoreProvider,
  useStore: useDataStore,
  useSelector: useDataSelector,
  useStoreState: useDataStoreState,
} = createStoreContext<DataStoreState, DataStore>("DataStore");

export { useDataStore, useDataSelector, useDataStoreState };

/**
 * Data context value（兼容旧 API）
 */
export interface DataContextValue {
  /** The current data model */
  data: DataModel;
  /** Auth state for visibility evaluation */
  authState?: AuthState;
  /** Get a value by path */
  get: (path: string) => unknown;
  /** Set a value by path */
  set: (path: string, value: unknown) => void;
  /** Update multiple values at once */
  update: (updates: Record<string, unknown>) => void;
}

/**
 * Props for DataProvider
 */
export interface DataProviderProps {
  /** Initial data model */
  initialData?: DataModel;
  /** Auth state */
  authState?: AuthState;
  /** Callback when data changes */
  onDataChange?: (path: string, value: unknown) => void;
  children: ReactNode;
}

/**
 * Provider for data model context
 * 
 * 性能优化：
 * - 内部使用 DataStore，支持细粒度订阅
 * - 提供兼容旧 API 的 useData() hook
 * - 推荐使用 useDataValue() 进行细粒度订阅
 */
export function DataProvider({
  initialData = {},
  authState,
  onDataChange,
  children,
}: DataProviderProps) {
  // 创建稳定的 store 实例
  const storeRef = useRef<DataStore | null>(null);
  if (!storeRef.current) {
    storeRef.current = new DataStore(initialData, authState, onDataChange);
  }
  const store = storeRef.current;

  // 同步 initialData 变化（服务端推送更新）
  useEffect(() => {
    store.mergeData(initialData);
  }, [initialData, store]);

  // 同步 authState 变化
  useEffect(() => {
    store.setAuthState(authState);
  }, [authState, store]);

  // 同步 onDataChange 回调
  useEffect(() => {
    store.setOnDataChange(onDataChange);
  }, [onDataChange, store]);

  return <DataStoreProvider store={store}>{children}</DataStoreProvider>;
}

/**
 * Hook to access the data context（兼容旧 API）
 * 
 * 注意：此 hook 订阅整个 data，任何数据变化都会触发重渲染
 * 推荐使用 useDataValue() 进行细粒度订阅
 */
export function useData(): DataContextValue {
  const store = useDataStore();
  const state = useDataStoreState();

  // 使用稳定回调，避免函数重建
  const get = useStableCallback((path: string) => store.getByPath(path));
  const set = useStableCallback((path: string, value: unknown) =>
    store.setByPath(path, value),
  );
  const update = useStableCallback((updates: Record<string, unknown>) =>
    store.updatePaths(updates),
  );

  return {
    data: state.data,
    authState: state.authState,
    get,
    set,
    update,
  };
}

/**
 * Hook to get a value from the data model（细粒度订阅）
 * 
 * 性能优化：只有指定路径的值变化时才重渲染
 */
export function useDataValue<T>(path: string): T | undefined {
  const store = useDataStore();

  const subscribe = useCallback(
    (onStoreChange: () => void) => store.subscribe(onStoreChange),
    [store],
  );

  const getSnapshot = useCallback(() => {
    return store.getByPath(path) as T | undefined;
  }, [store, path]);

  return useSyncExternalStore(subscribe, getSnapshot, getSnapshot);
}

/**
 * Hook to get and set a value from the data model (like useState)
 */
export function useDataBinding<T>(
  path: string,
): [T | undefined, (value: T) => void] {
  const store = useDataStore();
  const value = useDataValue<T>(path);
  
  const setValue = useStableCallback((newValue: T) => {
    store.setByPath(path, newValue);
  });

  return [value, setValue];
}
