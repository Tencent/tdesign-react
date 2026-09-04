"use client";

import React, {
  createContext,
  useContext,
  useRef,
  type ReactNode,
} from "react";
import {
  evaluateVisibility,
  type VisibilityCondition,
  type VisibilityContext as CoreVisibilityContext,
} from "@json-render/core";
import { useDataStore, type DataStore } from "./data";
import { useStableCallback } from "./store";

/**
 * Visibility context value
 */
export interface VisibilityContextValue {
  /** Evaluate a visibility condition */
  isVisible: (condition: VisibilityCondition | undefined) => boolean;
  /** Get the current visibility context (for advanced use) */
  getCtx: () => CoreVisibilityContext;
}

const VisibilityContext = createContext<VisibilityContextValue | null>(null);

/**
 * Props for VisibilityProvider
 */
export interface VisibilityProviderProps {
  children: ReactNode;
}

/**
 * Provider for visibility evaluation
 * 
 * 性能优化：
 * - 不订阅 data 变化，避免 data 变化导致所有组件重渲染
 * - isVisible 函数在调用时才读取最新 data（延迟读取）
 * - Context value 保持稳定引用
 * 
 * 设计说明：
 * - Visibility 判断通常在渲染时执行，不需要触发重渲染
 * - 当 data 变化时，ElementRenderer 会因其他原因重渲染，然后调用 isVisible
 * - 此时 isVisible 读取最新的 data 进行判断
 */
export function VisibilityProvider({ children }: VisibilityProviderProps) {
  // 获取 DataStore 实例，不订阅状态变化
  const dataStore = useDataStore();
  
  // 使用 ref 存储 store，保持函数引用稳定
  const storeRef = useRef<DataStore>(dataStore);
  storeRef.current = dataStore;

  // 延迟读取：isVisible 在调用时才读取最新 data
  const isVisible = useStableCallback(
    (condition: VisibilityCondition | undefined) => {
      const store = storeRef.current;
      const ctx: CoreVisibilityContext = {
        dataModel: store.getData(),
        authState: store.getAuthState(),
      };
      return evaluateVisibility(condition, ctx);
    },
  );

  // 获取当前 context（用于高级场景）
  const getCtx = useStableCallback((): CoreVisibilityContext => {
    const store = storeRef.current;
    return {
      dataModel: store.getData(),
      authState: store.getAuthState(),
    };
  });

  // Context value 使用 ref 保持稳定引用
  const valueRef = useRef<VisibilityContextValue>({ isVisible, getCtx });

  return (
    <VisibilityContext.Provider value={valueRef.current}>
      {children}
    </VisibilityContext.Provider>
  );
}

/**
 * Hook to access visibility evaluation
 */
export function useVisibility(): VisibilityContextValue {
  const ctx = useContext(VisibilityContext);
  if (!ctx) {
    throw new Error("useVisibility must be used within a VisibilityProvider");
  }
  return ctx;
}

/**
 * Hook to check if a condition is visible
 */
export function useIsVisible(
  condition: VisibilityCondition | undefined,
): boolean {
  const { isVisible } = useVisibility();
  return isVisible(condition);
}
