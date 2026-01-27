/**
 * json-render 集成模块入口
 * 导出所有核心 API 和类型
 */

// 核心组件
export { JsonRenderActivityRenderer } from './JsonRenderActivityRenderer';
export type { JsonRenderActivityRendererProps } from './JsonRenderActivityRenderer';

export { A2UIJsonRenderActivityRenderer } from './A2UIJsonRenderActivityRenderer';
export type { A2UIJsonRenderActivityRendererProps } from './A2UIJsonRenderActivityRenderer';

// 引擎和工具
export { JsonRenderEngine, createJsonRenderEngine } from './engine';

// 性能监控
export {
  PerformanceMonitor,
  globalPerformanceMonitor,
  checkPerformance,
  PERFORMANCE_THRESHOLDS,
} from './performance';
export type { PerformanceMetrics } from './performance';

// 类型定义
export type {
  JsonRenderSchema,
  ComponentCatalog,
  JsonRenderContext,
  DeltaInfo,
  JsonRenderActivityProps,
  A2UIAdapterConfig,
} from './types';

// ComponentRegistry（渲染层）和 Catalog（约束层）
// 从 catalog 目录导出（catalog/index.ts 会重新导出 catalog.ts 的内容）
export { createCustomRegistry, tdesignRegistry, withStableProps } from './catalog/index';
export type { CreateCustomRegistryOptions } from './catalog/index';
export {
  tdesignCatalog,
  createCustomCatalog,
  tdesignComponentList,
  tdesignActionList,
} from './catalog/index';
export type { Catalog } from '@json-render/core';

// A2UI 专用 Registry（支持 valuePath/disabledPath/action.context 自动绑定）
export { a2uiRegistry, createA2UIRegistry, A2UITextField, A2UIButton } from './catalog/index';

// A2UI Binding HOC（用于业务扩展自定义 A2UI 组件）
export { withA2UIBinding } from './catalog/index';
export type { A2UIBindingConfig } from './catalog/index';

// 具体组件实现（用于自定义扩展）
export { JsonRenderButton } from './catalog/button';
export { JsonRenderInput } from './catalog/input';
export { JsonRenderCard } from './catalog/card';
export {
  JsonRenderRow,
  JsonRenderCol,
  JsonRenderSpace,
  JsonRenderDivider,
} from './catalog/layout';

// 配置工厂
export {
  createJsonRenderActivityConfig,
  defaultJsonRenderActivityConfig,
  createA2UIJsonRenderActivityConfig,
  defaultA2UIJsonRenderActivityConfig,
} from './config';
export type { JsonRenderActivityConfigOptions } from './config';

// 适配器
export * from './adapters';

// Surface 状态管理器（跨轮次状态维护）
export { surfaceStateManager, SurfaceStateManager } from './SurfaceStateManager';
export type { SurfaceCache, SurfaceSubscriber } from './SurfaceStateManager';

// 默认导出配置函数
export { createJsonRenderActivityConfig as default } from './config';

// Contexts
export {
  DataProvider,
  useData,
  useDataValue,
  useDataBinding,
  type DataContextValue,
  type DataProviderProps,
} from "./contexts/data";

export {
  VisibilityProvider,
  useVisibility,
  useIsVisible,
  type VisibilityContextValue,
  type VisibilityProviderProps,
} from "./contexts/visibility";

export {
  ActionProvider,
  useActions,
  useAction,
  ConfirmDialog,
  type ActionContextValue,
  type ActionProviderProps,
  type PendingConfirmation,
  type ConfirmDialogProps,
} from "./contexts/actions";

export {
  ValidationProvider,
  useValidation,
  useFieldValidation,
  type ValidationContextValue,
  type ValidationProviderProps,
  type FieldValidationState,
} from "./contexts/validation";

// Renderer
export {
  Renderer,
  JSONUIProvider,
  createRendererFromCatalog,
  type ComponentRenderProps,
  type ComponentRenderer,
  type ComponentRegistry,
  type RendererProps,
  type JSONUIProviderProps,
} from "./renderer";
