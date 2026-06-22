/**
 * json-render 集成模块入口
 * 导出所有核心 API 和类型
 */

// ==================== 核心组件 ====================
// 主要渲染器组件
export {
  JsonRenderActivityRenderer,
  type JsonRenderActivityRendererProps,
} from './renderer/JsonRenderActivityRenderer';

// A2UI 渲染器组件
export {
  A2UIJsonRenderActivityRenderer,
  type A2UIJsonRenderActivityRendererProps,
} from './renderer/A2UIJsonRenderActivityRenderer';

// ==================== 上下文 (Contexts) ====================
export * from './contexts';

// ==================== 注册表 (Registry) ====================
export type { A2UIBindingConfig, CreateCustomRegistryOptions, JsonRenderActivityConfigOptions } from './registry';
export {
  A2UIButton,
  a2uiRegistry,
  A2UITextField,
  createA2UIRegistry,
  createCustomRegistry,
  tdesignRegistry,
  withA2UIBinding,
  withStableProps,
} from './registry';

// ==================== 配置工厂 ====================
export { createA2UIJsonRenderActivityConfig, createJsonRenderActivityConfig } from './registry';

// ==================== 目录 (Catalog) ====================
export * from './catalog/catalog-to-prompt';

// ==================== 类型定义 ====================
export type { JSONUIProviderProps } from './renderer/JsonUIRenderer';
export type * from './types';
