import React, {
  createContext,
  useContext,
  useRef,
  useSyncExternalStore,
  useCallback,
  type ReactNode,
} from "react";

/**
 * 泛型 Store 基类
 * 
 * 提供统一的外部状态管理模式，支持细粒度订阅。
 * 设计原则：
 * 1. 状态存储在 React 外部，避免 Context 传递整个状态导致的级联重渲染
 * 2. 使用 useSyncExternalStore 实现细粒度订阅
 * 3. 配合 Structural Sharing 使用，通过引用比较判断变化
 */
export class Store<T> {
  private state: T;
  private listeners = new Set<() => void>();

  constructor(initialState: T) {
    this.state = initialState;
  }

  /**
   * 获取当前状态
   */
  getState(): T {
    return this.state;
  }

  /**
   * 设置新状态并通知订阅者
   */
  setState(newState: T): void {
    // 引用相同则不触发更新
    if (this.state === newState) return;
    this.state = newState;
    this.emitChange();
  }

  /**
   * 通过 updater 函数更新状态
   */
  updateState(updater: (prev: T) => T): void {
    const newState = updater(this.state);
    this.setState(newState);
  }

  /**
   * 订阅状态变化
   */
  subscribe = (listener: () => void): (() => void) => {
    this.listeners.add(listener);
    return () => this.listeners.delete(listener);
  };

  /**
   * 通知所有订阅者
   */
  protected emitChange(): void {
    this.listeners.forEach((listener) => listener());
  }
}

/**
 * 创建 Store Context 的工厂函数
 * 
 * 返回：
 * - Provider: 提供 store 实例的组件
 * - useStore: 获取 store 实例的 hook
 * - useSelector: 细粒度订阅 store 状态的 hook
 */
export function createStoreContext<T, S extends Store<T>>(
  displayName: string,
) {
  const StoreContext = createContext<S | null>(null);

  /**
   * Store Provider
   */
  function StoreProvider({
    store,
    children,
  }: {
    store: S;
    children: ReactNode;
  }) {
    // store 实例应该是稳定的，不需要 useMemo
    return (
      <StoreContext.Provider value={store}>{children}</StoreContext.Provider>
    );
  }
  StoreProvider.displayName = `${displayName}Provider`;

  /**
   * 获取 store 实例
   */
  function useStore(): S {
    const store = useContext(StoreContext);
    if (!store) {
      throw new Error(`use${displayName} must be used within ${displayName}Provider`);
    }
    return store;
  }

  /**
   * 细粒度订阅 store 状态
   * 
   * @param selector - 从 state 中选取需要的部分
   * @returns 选取的状态片段
   * 
   * 性能优化：
   * - selector 返回的引用不变时，组件不会重渲染
   * - 配合 Structural Sharing 使用效果最佳
   */
  function useSelector<R>(selector: (state: T) => R): R {
    const store = useStore();

    const getSnapshot = useCallback(() => {
      return selector(store.getState());
    }, [store, selector]);

    return useSyncExternalStore(store.subscribe, getSnapshot, getSnapshot);
  }

  /**
   * 订阅整个 state（谨慎使用，会导致任何变化都重渲染）
   */
  function useStoreState(): T {
    const store = useStore();

    const getSnapshot = useCallback(() => {
      return store.getState();
    }, [store]);

    return useSyncExternalStore(store.subscribe, getSnapshot, getSnapshot);
  }

  return {
    Provider: StoreProvider,
    useStore,
    useSelector,
    useStoreState,
  };
}

/**
 * 使用 ref 保持稳定引用的 hook
 * 
 * 用于需要在回调中访问最新值，但不希望回调函数重建的场景
 */
export function useStableRef<T>(value: T): React.MutableRefObject<T> {
  const ref = useRef(value);
  ref.current = value;
  return ref;
}

/**
 * 创建稳定的回调函数
 * 
 * 类似 useCallback，但依赖通过 ref 访问，回调函数引用永远稳定
 */
export function useStableCallback<T extends (...args: any[]) => any>(
  callback: T,
): T {
  const callbackRef = useRef(callback);
  callbackRef.current = callback;

  // eslint-disable-next-line react-hooks/exhaustive-deps
  return useCallback(((...args) => callbackRef.current(...args)) as T, []);
}
