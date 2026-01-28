/**
 * json-render 集成模块入口
 * 导出所有核心 API 和类型
 */

// 核心组件
export { JsonRenderActivityRenderer } from './renderer/JsonRenderActivityRenderer';
export type { JsonRenderActivityRendererProps } from './renderer/JsonRenderActivityRenderer';

export { A2UIJsonRenderActivityRenderer } from './renderer/A2UIJsonRenderActivityRenderer';
export type { A2UIJsonRenderActivityRendererProps } from './renderer/A2UIJsonRenderActivityRenderer';

// 类型定义
export type {
  // JsonRenderSchema,
  ComponentCatalog,
  // JsonRenderContext,
  // DeltaInfo,
  JsonRenderActivityProps,
} from './types';

// Catalog（约束层）
export * from './catalog';

// Renderer
export {
  JsonRenderElement,
  JSONUIProvider,
  createRendererFromCatalog,
  type ComponentRenderProps,
  type ComponentRenderer,
  type ComponentRegistry,
  type RendererProps,
  type JSONUIProviderProps,
} from "./renderer";

export * from './contexts';
