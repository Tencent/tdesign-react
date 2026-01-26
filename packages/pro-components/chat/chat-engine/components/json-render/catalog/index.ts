/**
 * TDesign ComponentRegistry（React 组件注册表）
 * 用于 json-render 渲染层的组件映射
 * 
 * 重要概念区分：
 * - ComponentRegistry（本文件）：渲染层，映射组件名到 React 组件（传给 Renderer）
 * - Catalog（catalog.ts）：约束层，定义组件 props schema 和 actions 白名单（给 AI/服务端）
 * 
 * Registry 分类：
 * - tdesignRegistry: 纯净的 TDesign 组件，用于直接的 json-render schema
 * - a2uiRegistry: 支持 A2UI 协议的组件，自动处理 valuePath/disabledPath/action.context
 * 
 * 详见：ARCHITECTURE.md
 */

import React from 'react';
import isEqual from 'react-fast-compare';
import type { ComponentRegistry, ComponentRenderProps } from '@json-render/react';
import { JsonRenderButton } from './button';
import { JsonRenderInput, JsonRenderTextField } from './input';
import { JsonRenderCard } from './card';
import { JsonRenderText } from './text';
import {
  JsonRenderRow,
  JsonRenderCol,
  JsonRenderSpace,
  JsonRenderColumn,
  JsonRenderDivider,
} from './layout';

/**
 * 高性能组件包装器
 * 使用 React.memo + react-fast-compare 实现深比较
 * 
 * 原理：
 * - json-render 每次渲染都会创建新的 element 对象引用
 * - 默认的 React.memo 浅比较会认为 props 变化了
 * - 使用 react-fast-compare 进行高效深比较，只在内容真正变化时才重渲染
 * 
 * 性能说明（来自 performance_suggestion.md）：
 * - react-fast-compare 比 JSON.stringify 更快（短路比较）
 * - 发现第一个不同属性时立即停止，不会遍历整个对象
 * - 处理了循环引用等边缘情况
 */
export function withStableProps<P extends ComponentRenderProps>(
  Component: React.ComponentType<P>,
): React.MemoExoticComponent<React.ComponentType<P>> {
  return React.memo(Component, (prevProps, nextProps) => {
    const prevElement = prevProps.element as any;
    const nextElement = nextProps.element as any;
    
    // 1. 引用相同，直接返回 true（不渲染）
    if (prevElement === nextElement) return true;
    
    // 2. 快速路径：id 或 type 不同，需要重渲染
    if (prevElement.id !== nextElement.id || prevElement.type !== nextElement.type) {
      return false;
    }
    
    // 3. 使用 react-fast-compare 进行高效深比较
    return isEqual(prevElement.props, nextElement.props);
  });
}

/**
 * TDesign 内置组件注册表（渲染层）
 * 
 * 这是框架内置的原子组件集合，提供基础 UI 渲染能力
 * 业务层可以通过 createCustomRegistry 扩展自定义组件
 * 
 * 使用方式：
 * ```tsx
 * import { tdesignRegistry } from '@tdesign-react/chat';
 * 
 * const config = createJsonRenderActivityConfig({
 *   registry: tdesignRegistry,
 *   actionHandlers: { ... },
 * });
 * ```
 * 
 * Schema 示例：
 * ```json
 * {
 *   "root": "btn1",
 *   "elements": {
 *     "btn1": {
 *       "key": "btn1",
 *       "type": "Button",
 *       "props": {
 *         "variant": "base",
 *         "theme": "primary",
 *         "children": "点击我",
 *         "action": "submit"
 *       }
 *     }
 *   }
 * }
 * ```
 */
export const tdesignRegistry: ComponentRegistry = {
  // 基础组件
  Button: JsonRenderButton,
  Input: JsonRenderInput,
  TextField: JsonRenderTextField,
  Card: JsonRenderCard,
  Text: JsonRenderText,

  // 布局组件
  Row: JsonRenderRow,
  Col: JsonRenderCol,
  Space: JsonRenderSpace,
  Column: JsonRenderColumn,
  Divider: JsonRenderDivider,

  // 别名（兼容不同命名风格）
  button: JsonRenderButton,
  input: JsonRenderInput,
  textfield: JsonRenderTextField,
  card: JsonRenderCard,
  text: JsonRenderText,
  row: JsonRenderRow,
  col: JsonRenderCol,
  space: JsonRenderSpace,
  column: JsonRenderColumn,
  divider: JsonRenderDivider,
};

/**
 * createCustomRegistry 配置选项
 */
export interface CreateCustomRegistryOptions {
  /**
   * 是否自动包装组件以优化性能
   * 使用 React.memo + react-fast-compare 深比较 element.props
   * 
   * @default true
   */
  enableStableProps?: boolean;
}

/**
 * 创建自定义组件注册表（扩展内置组件）
 * 
 * 用于渲染层：扩展自定义业务组件的 React 实现
 * 
 * 性能优化（默认开启）：
 * - 自动使用 withStableProps 包装组件
 * - 使用 react-fast-compare 进行高效深比较
 * - 业务组件无需手动写 React.memo 比较函数
 * 
 * @example
 * ```tsx
 * import { createCustomRegistry } from '@tdesign-react/chat';
 * import type { ComponentRenderProps } from '@json-render/react';
 * 
 * // 定义自定义组件（无需手动 React.memo）
 * const StatusCard: React.FC<ComponentRenderProps> = ({ element }) => (
 *   <div className="status-card">{element.props.status}</div>
 * );
 * 
 * const ProgressBar: React.FC<ComponentRenderProps> = ({ element }) => (
 *   <div className="progress-bar" style={{ width: `${element.props.percentage}%` }} />
 * );
 * 
 * // 扩展 registry（自动优化性能）
 * const customRegistry = createCustomRegistry({
 *   StatusCard,
 *   ProgressBar,
 * });
 * 
 * // 禁用自动优化（如果需要自己控制）
 * const customRegistry = createCustomRegistry(
 *   { StatusCard, ProgressBar },
 *   { enableStableProps: false }
 * );
 * ```
 * 
 * 注意：
 * - 这里只定义渲染层的组件映射
 * - 约束层（Catalog）需要使用 createCustomCatalog 定义（见 catalog.ts）
 * - 两者需要保持组件名称一致
 */
export function createCustomRegistry(
  customComponents: ComponentRegistry,
  options: CreateCustomRegistryOptions = {},
): ComponentRegistry {
  const { enableStableProps = true } = options;

  // 如果启用性能优化，自动包装组件
  const processedComponents: ComponentRegistry = {};
  
  if (enableStableProps) {
    for (const [name, Component] of Object.entries(customComponents)) {
      processedComponents[name] = withStableProps(Component as React.ComponentType<ComponentRenderProps>);
    }
  } else {
    Object.assign(processedComponents, customComponents);
  }

  return {
    ...tdesignRegistry,
    ...processedComponents,
  };
}

// ==================== 重新导出 Catalog（约束层）====================
// 从 ../catalog.ts 重新导出，避免路径混淆
export {
  tdesignCatalog,
  createCustomCatalog,
  tdesignComponentList,
  tdesignActionList,
} from '../catalog';

// ==================== 重新导出 A2UI Registry ====================
// A2UI 专用组件，支持 valuePath/disabledPath/action.context 自动绑定
export { a2uiRegistry, createA2UIRegistry, A2UITextField, A2UIButton } from './a2ui-registry';

// ==================== 重新导出 A2UI Binding HOC ====================
export { withA2UIBinding } from './a2ui-binding';
export type { A2UIBindingConfig } from './a2ui-binding';

export default tdesignRegistry;
