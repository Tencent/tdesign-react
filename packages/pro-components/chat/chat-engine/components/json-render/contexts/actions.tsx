"use client";

import React, {
  createContext,
  useContext,
  useState,
  useCallback,
  useMemo,
  useRef,
  type ReactNode,
} from "react";
import {
  resolveAction,
  executeAction,
  type Action,
  type ActionHandler,
  type ActionConfirm,
  type ResolvedAction,
} from "@json-render/core";
import { useDataStore, type DataStore } from "./data";
import { useStableCallback } from "./store";

/**
 * Pending confirmation state
 */
export interface PendingConfirmation {
  /** The resolved action */
  action: ResolvedAction;
  /** The action handler */
  handler: ActionHandler;
  /** Resolve callback */
  resolve: () => void;
  /** Reject callback */
  reject: () => void;
}

/**
 * Action context value
 */
export interface ActionContextValue {
  /** Registered action handlers */
  handlers: Record<string, ActionHandler>;
  /** Currently loading action names */
  loadingActions: Set<string>;
  /** Pending confirmation dialog */
  pendingConfirmation: PendingConfirmation | null;
  /** Execute an action */
  execute: (action: Action) => Promise<void>;
  /** Confirm the pending action */
  confirm: () => void;
  /** Cancel the pending action */
  cancel: () => void;
  /** Register an action handler */
  registerHandler: (name: string, handler: ActionHandler) => void;
}

const ActionContext = createContext<ActionContextValue | null>(null);

/**
 * Props for ActionProvider
 */
export interface ActionProviderProps {
  /** Initial action handlers */
  handlers?: Record<string, ActionHandler>;
  /** Navigation function */
  navigate?: (path: string) => void;
  children: ReactNode;
}

/**
 * Provider for action execution
 * 
 * 性能优化：
 * - execute 函数使用 DataStore 延迟读取 data，避免 data 变化导致函数重建
 * - handlers 和 navigate 通过 ref 访问，保持 execute 引用稳定
 * - Context value 只在必要时更新
 */
export function ActionProvider({
  handlers: initialHandlers = {},
  navigate,
  children,
}: ActionProviderProps) {
  // 获取 DataStore 实例，不订阅状态变化
  const dataStore = useDataStore();
  
  const [handlers, setHandlers] =
    useState<Record<string, ActionHandler>>(initialHandlers);
  const [loadingActions, setLoadingActions] = useState<Set<string>>(new Set());
  const [pendingConfirmation, setPendingConfirmation] =
    useState<PendingConfirmation | null>(null);

  // 使用 ref 存储依赖，保持 execute 函数引用稳定
  const storeRef = useRef<DataStore>(dataStore);
  storeRef.current = dataStore;
  
  const handlersRef = useRef(handlers);
  handlersRef.current = handlers;
  
  const navigateRef = useRef(navigate);
  navigateRef.current = navigate;

  const registerHandler = useCallback(
    (name: string, handler: ActionHandler) => {
      setHandlers((prev) => ({ ...prev, [name]: handler }));
    },
    [],
  );

  // executeRef 用于递归调用
  const executeRef = useRef<(action: Action) => Promise<void>>();

  // execute 函数引用稳定，通过 ref 访问最新依赖
  const execute = useStableCallback(async (action: Action) => {
    const store = storeRef.current;
    const data = store.getData();
    const setData = (path: string, value: unknown) => store.setByPath(path, value);
    const currentHandlers = handlersRef.current;
    const currentNavigate = navigateRef.current;

    const resolved = resolveAction(action, data);
    const handler = currentHandlers[resolved.name];

    if (!handler) {
      console.warn(`No handler registered for action: ${resolved.name}`);
      return;
    }

    // If confirmation is required, show dialog
    if (resolved.confirm) {
      return new Promise<void>((resolve, reject) => {
        setPendingConfirmation({
          action: resolved,
          handler,
          resolve: () => {
            setPendingConfirmation(null);
            resolve();
          },
          reject: () => {
            setPendingConfirmation(null);
            reject(new Error("Action cancelled"));
          },
        });
      }).then(async () => {
        setLoadingActions((prev) => new Set(prev).add(resolved.name));
        try {
          await executeAction({
            action: resolved,
            handler,
            setData,
            navigate: currentNavigate,
            executeAction: async (name) => {
              const subAction: Action = { name };
              await executeRef.current?.(subAction);
            },
          });
        } finally {
          setLoadingActions((prev) => {
            const next = new Set(prev);
            next.delete(resolved.name);
            return next;
          });
        }
      });
    }

    // Execute immediately
    setLoadingActions((prev) => new Set(prev).add(resolved.name));
    try {
      await executeAction({
        action: resolved,
        handler,
        setData,
        navigate: currentNavigate,
        executeAction: async (name) => {
          const subAction: Action = { name };
          await executeRef.current?.(subAction);
        },
      });
    } finally {
      setLoadingActions((prev) => {
        const next = new Set(prev);
        next.delete(resolved.name);
        return next;
      });
    }
  });

  executeRef.current = execute;

  const confirm = useCallback(() => {
    pendingConfirmation?.resolve();
  }, [pendingConfirmation]);

  const cancel = useCallback(() => {
    pendingConfirmation?.reject();
  }, [pendingConfirmation]);

  const value = useMemo<ActionContextValue>(
    () => ({
      handlers,
      loadingActions,
      pendingConfirmation,
      execute,
      confirm,
      cancel,
      registerHandler,
    }),
    [
      handlers,
      loadingActions,
      pendingConfirmation,
      execute,
      confirm,
      cancel,
      registerHandler,
    ],
  );

  return (
    <ActionContext.Provider value={value}>{children}</ActionContext.Provider>
  );
}

/**
 * Hook to access action context
 */
export function useActions(): ActionContextValue {
  const ctx = useContext(ActionContext);
  if (!ctx) {
    throw new Error("useActions must be used within an ActionProvider");
  }
  return ctx;
}

/**
 * Hook to execute an action
 */
export function useAction(action: Action): {
  execute: () => Promise<void>;
  isLoading: boolean;
} {
  const { execute, loadingActions } = useActions();
  const isLoading = loadingActions.has(action.name);

  const executeAction = useCallback(() => execute(action), [execute, action]);

  return { execute: executeAction, isLoading };
}

/**
 * Props for ConfirmDialog component
 */
export interface ConfirmDialogProps {
  /** The confirmation config */
  confirm: ActionConfirm;
  /** Called when confirmed */
  onConfirm: () => void;
  /** Called when cancelled */
  onCancel: () => void;
}

/**
 * Default confirmation dialog component
 */
export function ConfirmDialog({
  confirm,
  onConfirm,
  onCancel,
}: ConfirmDialogProps) {
  const isDanger = confirm.variant === "danger";

  return (
    <div
      style={{
        position: "fixed",
        inset: 0,
        backgroundColor: "rgba(0, 0, 0, 0.5)",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        zIndex: 50,
      }}
      onClick={onCancel}
    >
      <div
        style={{
          backgroundColor: "white",
          borderRadius: "8px",
          padding: "24px",
          maxWidth: "400px",
          width: "100%",
          boxShadow: "0 20px 25px -5px rgba(0, 0, 0, 0.1)",
        }}
        onClick={(e) => e.stopPropagation()}
      >
        <h3
          style={{
            margin: "0 0 8px 0",
            fontSize: "18px",
            fontWeight: 600,
          }}
        >
          {confirm.title}
        </h3>
        <p
          style={{
            margin: "0 0 24px 0",
            color: "#6b7280",
          }}
        >
          {confirm.message}
        </p>
        <div
          style={{
            display: "flex",
            gap: "12px",
            justifyContent: "flex-end",
          }}
        >
          <button
            onClick={onCancel}
            style={{
              padding: "8px 16px",
              borderRadius: "6px",
              border: "1px solid #d1d5db",
              backgroundColor: "white",
              cursor: "pointer",
            }}
          >
            {confirm.cancelLabel ?? "Cancel"}
          </button>
          <button
            onClick={onConfirm}
            style={{
              padding: "8px 16px",
              borderRadius: "6px",
              border: "none",
              backgroundColor: isDanger ? "#dc2626" : "#3b82f6",
              color: "white",
              cursor: "pointer",
            }}
          >
            {confirm.confirmLabel ?? "Confirm"}
          </button>
        </div>
      </div>
    </div>
  );
}
