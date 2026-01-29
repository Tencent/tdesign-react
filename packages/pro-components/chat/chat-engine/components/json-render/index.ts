/**
 * json-render 集成模块入口
 * 导出所有核心 API 和类型
 */

// ==================== 核心组件 ====================
// 主要渲染器组件
export { type JsonRenderActivityRendererProps, JsonRenderActivityRenderer } from './renderer/JsonRenderActivityRenderer';

// A2UI 渲染器组件
export { type A2UIJsonRenderActivityRendererProps, A2UIJsonRenderActivityRenderer } from './renderer/A2UIJsonRenderActivityRenderer';

// ==================== 上下文 (Contexts) ====================
export * from './contexts';

// ==================== 注册表 (Registry) ====================
export {
  tdesignRegistry,
  createCustomRegistry,
  withStableProps,
  a2uiRegistry,
  createA2UIRegistry,
  A2UITextField,
  A2UIButton,
  withA2UIBinding,
} from './registry';
export type {
  CreateCustomRegistryOptions,
  JsonRenderActivityConfigOptions,
  A2UIBindingConfig,
} from './registry';

// ==================== 配置工厂 ====================
export {
  createJsonRenderActivityConfig,
  createA2UIJsonRenderActivityConfig,
} from './registry'; 

// ==================== 目录 (Catalog) ====================
export * from './catalog/catalog-to-prompt';


// ==================== 类型定义 ====================
export type * from './types';
export type {
  JSONUIProviderProps,
} from "./renderer/JsonUIRenderer";
