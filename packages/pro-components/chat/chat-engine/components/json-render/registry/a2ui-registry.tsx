/**
 * A2UI 专用组件注册表
 * 
 * 使用 withA2UIBinding HOC 包装原子组件，自动处理 A2UI 协议字段：
 * - valuePath: 值的数据绑定（如 /userInfo/name）
 * - disabledPath: disabled 状态的数据绑定（如 /formDisabled）
 * - action.context: action 参数中的动态数据绑定（{ path: '/xxx' } 格式）
 * 
 * 与 tdesignRegistry 的区别：
 * - tdesignRegistry: 纯净的 TDesign 组件，用于直接的 json-render schema
 * - a2uiRegistry: 支持 A2UI 协议的组件，用于 A2UI → json-render 转换后的渲染
 * 
 * 使用方式：
 * ```tsx
 * // 业务使用 A2UI 协议时
 * const config = createA2UIJsonRenderActivityConfig({
 *   registry: a2uiRegistry,  // 内置 A2UI 组件
 *   // 或扩展自定义组件
 *   registry: createA2UIRegistry({
 *     MyCustomComponent: withA2UIBinding(MyComponent, { supportsAction: true }),
 *   }),
 * });
 * ```
 */

import React from 'react';
import { Input, Button, Space } from 'tdesign-react';
import type { InputProps, ButtonProps } from 'tdesign-react';
import { withA2UIBinding } from './a2ui-binding';

// 导入纯净组件和布局组件（这些不需要 A2UI 绑定）
import { JsonRenderCard } from '../catalog/atomic/card';
import { JsonRenderText } from '../catalog/atomic/text';
import {
  JsonRenderRow,
  JsonRenderCol,
  JsonRenderSpace,
  JsonRenderColumn,
  JsonRenderDivider,
} from '../catalog/atomic/layout';

import { type ComponentRegistry } from '../types';

// ==================== 基础组件包装器 ====================

/**
 * 基础 Input 组件（用于 HOC 包装）
 * 接收标准 InputProps，由 HOC 注入 value/onChange/disabled
 */
const BaseInput: React.FC<InputProps & { label?: string }> = ({
  label,
  ...props
}) => {
  if (label) {
    return (
      <Space direction="vertical" size={4} style={{ width: '100%' }}>
        <label style={{ fontSize: '14px', fontWeight: 500 }}>{label}</label>
        <Input {...props} />
      </Space>
    );
  }
  return <Input {...props} />;
};

BaseInput.displayName = 'BaseInput';

/**
 * 基础 Button 组件（用于 HOC 包装）
 * 接收标准 ButtonProps，由 HOC 注入 onClick/disabled
 */
const BaseButton: React.FC<ButtonProps & { label?: string }> = ({
  label,
  children,
  ...props
}) => {
  const content = label || children;
  return <Button {...props}>{content}</Button>;
};

BaseButton.displayName = 'BaseButton';

// ==================== A2UI 组件（通过 HOC 生成）====================

/**
 * A2UI TextField 组件
 * 自动支持 valuePath/disabledPath 数据绑定
 */
export const A2UITextField = withA2UIBinding<InputProps & { label?: string }>(
  BaseInput,
  {
    valueField: 'value',
    onChangeField: 'onChange',
    supportsAction: false,
  },
);

/**
 * A2UI Button 组件
 * 自动支持 disabledPath 和 action.context 动态绑定
 */
export const A2UIButton = withA2UIBinding<ButtonProps & { label?: string }>(
  BaseButton,
  {
    supportsAction: true,
  },
);

// ==================== A2UI Registry ====================

/**
 * A2UI 专用组件注册表
 * 
 * 用于 A2UI 协议转换后的渲染，组件自动支持：
 * - valuePath: 值绑定到 dataModel
 * - disabledPath: disabled 状态绑定到 dataModel
 * - action.context: action 参数动态解析
 * 
 * @example
 * ```tsx
 * import { a2uiRegistry } from './catalog/a2ui-registry';
 * 
 * const config = createA2UIJsonRenderActivityConfig({
 *   registry: a2uiRegistry,  // 使用 A2UI 专用 registry
 *   actionHandlers: { ... },
 * });
 * ```
 */
export const a2uiRegistry: ComponentRegistry = {
  // A2UI 绑定组件（通过 HOC 包装）
  TextField: A2UITextField,
  Button: A2UIButton,
  
  // 纯净组件（布局类不需要 A2UI 绑定）
  Card: JsonRenderCard,
  Text: JsonRenderText,
  Row: JsonRenderRow,
  Col: JsonRenderCol,
  Space: JsonRenderSpace,
  Column: JsonRenderColumn,
  Divider: JsonRenderDivider,
};

/**
 * 创建自定义 A2UI 组件注册表
 * 
 * 基于 a2uiRegistry 扩展自定义组件
 * 自定义组件如需支持 A2UI 协议，请使用 withA2UIBinding 包装
 * 
 * @example
 * ```tsx
 * import { createA2UIRegistry, withA2UIBinding } from '@tdesign-react/chat';
 * 
 * // 创建支持 A2UI 的自定义组件
 * const A2UIDatePicker = withA2UIBinding(DatePicker, {
 *   valueField: 'value',
 *   onChangeField: 'onChange',
 * });
 * 
 * const customRegistry = createA2UIRegistry({
 *   DatePicker: A2UIDatePicker,
 * });
 * ```
 */
export function createA2UIRegistry(
  customComponents: ComponentRegistry,
): ComponentRegistry {
  return {
    ...a2uiRegistry,
    ...customComponents,
  };
}

export default a2uiRegistry;
