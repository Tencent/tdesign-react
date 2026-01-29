"use client";

import React, { type ComponentType, type ReactNode, useRef, useLayoutEffect, useMemo } from "react";
import type {
  Catalog,
  ComponentDefinition,
} from "@json-render/core";
import { 
  useIsVisible, 
  useActions,
  DataProvider, 
  ValidationProvider, 
  ActionProvider, 
  VisibilityProvider,
} from "../contexts";

import {
  useElement,
  useRoot,
  useRenderContext,
  TreeStore,
  RenderContext,
} from "../contexts/tree";

import type { ComponentRegistry, RendererProps } from "../types";

/**
 * ElementRenderer - 使用 selector 模式订阅特定 element
 * 
 * 性能优化原理：
 * 1. 上游使用 Structural Sharing，未修改的节点保持原引用
 * 2. useSyncExternalStore 的 getSnapshot 返回 element 引用
 * 3. 引用相同 → 不重渲染；引用不同 → 重渲染
 */
const ElementRenderer = React.memo(function ElementRenderer({
  elementKey,
}: {
  elementKey: string;
}) {
  const { registry, loading, fallback } = useRenderContext();
  const element = useElement(elementKey);
  const isVisible = useIsVisible(element?.visible);
  const { execute } = useActions();

  // Don't render if element doesn't exist or not visible
  if (!element || !isVisible) {
    return null;
  }

  // Get the component renderer
  const Component = registry[element.type] ?? fallback;

  if (!Component) {
    console.warn(`No renderer for component type: ${element.type}`);
    return null;
  }

  console.count(`ElementRenderer-${element.type}`);

  // 子组件独立订阅
  const children = element.children?.map((childKey) => (
    <ElementRenderer key={childKey} elementKey={childKey} />
  ));

  return (
    <Component element={element} onAction={execute} loading={loading}>
      {children}
    </Component>
  );
});

/**
 * Root renderer - 订阅 root 变化
 */
function RootRenderer() {
  const root = useRoot();
  
  if (!root) {
    return null;
  }
  
  return <ElementRenderer elementKey={root} />;
}

/**
 * Main renderer component
 * 
 * 架构说明：
 * - JsonRenderElement 作为入口，不因 tree 变化而重渲染
 * - tree 更新通过 store.setTree() 通知订阅者
 * - 每个 ElementRenderer 独立订阅自己的 element
 * - 配合上游 Structural Sharing，只有真正变化的节点才重渲染
 */
export function JsonRenderElement({ tree, registry, loading, fallback }: RendererProps) {
   // 边界保护
  if (!tree || !tree.root) {
    return null;
  }
  // 创建稳定的 store 引用
  const storeRef = useRef<TreeStore | null>(null);
  if (!storeRef.current) {
    storeRef.current = new TreeStore();
  }
  const store = storeRef.current;
  
  // 确保子组件在 useEffect 或布局计算前能获取到最新的 tree。
  useLayoutEffect(() => {
    store.setTree(tree);
  }, [tree, store]);
  
  const contextValue = useMemo(() => ({
    store,
    registry,
    loading,
    fallback,
  }), [store, registry, loading, fallback]);



  return (
    <RenderContext.Provider value={contextValue}>
      <RootRenderer />
    </RenderContext.Provider>
  );
}

/**
 * Props for JSONUIProvider
 */
export interface JSONUIProviderProps {
  /** Component registry */
  registry: ComponentRegistry;
  /** Initial data model */
  initialData?: Record<string, unknown>;
  /** Auth state */
  authState?: { isSignedIn: boolean; user?: Record<string, unknown> };
  /** Action handlers */
  actionHandlers?: Record<
    string,
    (params: Record<string, unknown>) => Promise<unknown> | unknown
  >;
  /** Navigation function */
  navigate?: (path: string) => void;
  /** Custom validation functions */
  validationFunctions?: Record<
    string,
    (value: unknown, args?: Record<string, unknown>) => boolean
  >;
  /** Callback when data changes */
  onDataChange?: (path: string, value: unknown) => void;
  children: ReactNode;
}


/**
 * Combined provider for all JSONUI contexts
 */
export function JSONUIProvider({
  registry,
  initialData,
  authState,
  actionHandlers,
  navigate,
  validationFunctions,
  onDataChange,
  children,
}: JSONUIProviderProps) {
  return (
    <DataProvider
      initialData={initialData}
      authState={authState}
      onDataChange={onDataChange}
    >
      <VisibilityProvider>
        <ActionProvider handlers={actionHandlers} navigate={navigate}>
          <ValidationProvider customFunctions={validationFunctions}>
            {children}
            <ConfirmationDialogManager />
          </ValidationProvider>
        </ActionProvider>
      </VisibilityProvider>
    </DataProvider>
  );
}

/**
 * Helper to create a renderer component from a catalog
 */
export function createRendererFromCatalog<
  C extends Catalog<Record<string, ComponentDefinition>>,
>(
  _catalog: C,
  registry: ComponentRegistry,
): ComponentType<Omit<RendererProps, "registry">> {
  return function CatalogRenderer(props: Omit<RendererProps, "registry">) {
    return <JsonRenderElement {...props} registry={registry} />;
  };
}
