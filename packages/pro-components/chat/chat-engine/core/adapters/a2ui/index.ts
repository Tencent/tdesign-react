/**
 * A2UI 核心层导出
 * 框架无关，可跨 React/Vue 复用
 */

// 类型定义
export * from './types';

// 工具函数
export * from './utils';

// 消息处理器
export {
  A2uiMessageProcessor,
  createA2uiProcessor,
  type A2uiMessageProcessorOptions,
  type SurfaceSnapshot,
  type SurfaceListener,
} from './processor/A2uiMessageProcessor';

// 数据存储
export { DataStore, createDataStore } from './processor/DataStore';

// 组件树
export { ComponentTree } from './processor/ComponentTree';

// 路径解析
export { PathResolver, pathResolver } from './processor/PathResolver';
