"use client";

import React, { type ComponentType, type ReactNode } from "react";
import type {
  UIElement,
  UITree,
  Action,
  Catalog,
  ComponentDefinition,
} from "@json-render/core";
import { useIsVisible, useActions, ConfirmDialog } from "../contexts";
import { DataProvider, ValidationProvider, ActionProvider, VisibilityProvider } from "../contexts";

/**
 * Props passed to component renderers
 */
export interface ComponentRenderProps<P = Record<string, unknown>> {
  /** The element being rendered */
  element: UIElement<string, P>;
  /** Rendered children */
  children?: ReactNode;
  /** Execute an action */
  onAction?: (action: Action) => void;
  /** Whether the parent is loading */
  loading?: boolean;
}

/**
 * Component renderer type
 */
export type ComponentRenderer<P = Record<string, unknown>> = ComponentType<
  ComponentRenderProps<P>
>;

/**
 * Registry of component renderers
 */
export type ComponentRegistry = Record<string, ComponentRenderer<any>>;

/**
 * Props for the Renderer component
 */
export interface RendererProps {
  /** The UI tree to render */
  tree: UITree | null;
  /** Component registry */
  registry: ComponentRegistry;
  /** Whether the tree is currently loading/streaming */
  loading?: boolean;
  /** Fallback component for unknown types */
  fallback?: ComponentRenderer;
}

/**
 * Element renderer component
 */
function ElementRenderer({
  element,
  tree,
  registry,
  loading,
  fallback,
}: {
  element: UIElement;
  tree: UITree;
  registry: ComponentRegistry;
  loading?: boolean;
  fallback?: ComponentRenderer;
}) {
  const isVisible = useIsVisible(element.visible);
  const { execute } = useActions();

  // Don't render if not visible
  if (!isVisible) {
    return null;
  }

  // Get the component renderer
  const Component = registry[element.type] ?? fallback;

  if (!Component) {
    console.warn(`No renderer for component type: ${element.type}`);
    return null;
  }

  // Render children
  const children = element.children?.map((childKey) => {
    const childElement = tree.elements[childKey];
    if (!childElement) {
      return null;
    }
    return (
      <ElementRenderer
        key={childKey}
        element={childElement}
        tree={tree}
        registry={registry}
        loading={loading}
        fallback={fallback}
      />
    );
  });

  return (
    <Component element={element} onAction={execute} loading={loading}>
      {children}
    </Component>
  );
}

/**
 * Main renderer component
 */
export function JsonRenderElement({ tree, registry, loading, fallback }: RendererProps) {
  if (!tree || !tree.root) {
    return null;
  }

  const rootElement = tree.elements[tree.root];
  if (!rootElement) {
    return null;
  }

  return (
    <ElementRenderer
      element={rootElement}
      tree={tree}
      registry={registry}
      loading={loading}
      fallback={fallback}
    />
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
 * Renders the confirmation dialog when needed
 */
function ConfirmationDialogManager() {
  const { pendingConfirmation, confirm, cancel } = useActions();

  if (!pendingConfirmation?.action.confirm) {
    return null;
  }

  return (
    <ConfirmDialog
      confirm={pendingConfirmation.action.confirm}
      onConfirm={confirm}
      onCancel={cancel}
    />
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
