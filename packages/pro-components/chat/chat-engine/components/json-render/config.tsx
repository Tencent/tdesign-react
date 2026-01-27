/**
 * json-render Activity 配置工厂函数
 * 便捷创建 ActivityConfig 用于注册
 */

import React from 'react';
import type { ComponentRegistry } from './renderer';
import type { ActivityConfig } from '../activity/types';
import type { JsonRenderActivityProps } from './types';
import { JsonRenderActivityRenderer } from './JsonRenderActivityRenderer';
import { A2UIJsonRenderActivityRenderer } from './A2UIJsonRenderActivityRenderer';
import { tdesignRegistry } from './catalog/index';
import { a2uiRegistry } from './catalog/a2ui-registry';

/**
 * json-render Activity 配置选项
 */
export interface JsonRenderActivityConfigOptions {
  /** Activity 类型标识，默认 'json-render' */
  activityType?: string;
  /** 组件注册表，默认使用 tdesignRegistry */
  registry?: ComponentRegistry;
  /** 
   * Action 处理器映射表
   * 
   * 重要：json-render 采用预定义 action 模式
   * - AI/服务端只能生成在此预定义的 action 名称
   * - 每个 action 对应一个具体的处理函数
   * - 这确保了生成式 UI 的安全性和可控性
   * 
   * @example
   * ```tsx
   * actionHandlers: {
   *   // 表单提交
   *   submit: async (params) => {
   *     await api.submitForm(params);
   *     MessagePlugin.success('提交成功');
   *   },
   *   
   *   // 表单重置
   *   reset: async (params) => {
   *     // 注意：如需清空表单，应在组件内部使用 useData().update()
   *     MessagePlugin.info('表单已重置');
   *   },
   *   
   *   // 删除操作
   *   delete: async (params) => {
   *     await api.deleteItem(params.id);
   *   },
   *   
   *   // 刷新数据
   *   refresh: async () => {
   *     await refetchData();
   *   }
   * }
   * ```
   */
  actionHandlers?: Record<string, (params: Record<string, unknown>) => void | Promise<void>>;
  /** 显示调试信息 */
  debug?: boolean;
  /** 描述信息 */
  description?: string;
}

/**
 * 创建 json-render Activity 配置
 * 
 * @example
 * 基础用法 - 预定义 action handlers
 * ```tsx
 * const jsonRenderConfig = createJsonRenderActivityConfig({
 *   activityType: 'json-render',
 *   actionHandlers: {
 *     submit: async (params) => {
 *       console.log('提交表单:', params);
 *       await api.submit(params);
 *       MessagePlugin.success('提交成功');
 *     },
 *     reset: async (params) => {
 *       MessagePlugin.info('表单已重置');
 *     },
 *     delete: async (params) => {
 *       await api.delete(params.id);
 *     }
 *   },
 * });
 * 
 * useAgentActivity(jsonRenderConfig);
 * ```
 * 
 * @example
 * 结合 ChatEngine 发送消息到服务端
 * ```tsx
 * const jsonRenderConfig = createJsonRenderActivityConfig({
 *   actionHandlers: {
 *     submit: async (params) => {
 *       // 发送到服务端处理
 *       await chatEngine.sendAIMessage({
 *         params: { userActionMessage: { name: 'submit', params } },
 *         sendRequest: true,
 *       });
 *     },
 *     reset: async (params) => {
 *       // 本地处理，不发送到服务端
 *       MessagePlugin.info('已重置');
 *     },
 *   },
 * });
 * ```
 * 
 * @example
 * 配合自定义组件注册表
 * ```tsx
 * import { createCustomRegistry } from './catalog';
 * 
 * const jsonRenderConfig = createJsonRenderActivityConfig({
 *   registry: createCustomRegistry({
 *     MyCustomComponent: MyComponentRenderer,
 *   }),
 *   actionHandlers: {
 *     custom_action: async (params) => {
 *       // 处理自定义操作
 *     },
 *   },
 * });
 * ```
 */
export function createJsonRenderActivityConfig(
  options: JsonRenderActivityConfigOptions = {},
): ActivityConfig<JsonRenderActivityProps['content']> {
  const {
    activityType = 'json-render',
    registry = tdesignRegistry,
    actionHandlers = {},
    debug = false,
    description = 'json-render 动态 UI 渲染器',
  } = options;

  return {
    activityType,
    component: React.memo((props: JsonRenderActivityProps) => (
      <JsonRenderActivityRenderer
        {...props}
        registry={registry}
        actionHandlers={actionHandlers}
        debug={debug}
      />
    )),
    description,
  };
}

/**
 * 默认 json-render Activity 配置
 * 使用默认 TDesign Catalog，适用于大多数场景
 */
export const defaultJsonRenderActivityConfig = createJsonRenderActivityConfig();

/**
 * 创建 A2UI + json-render Activity 配置
 * 支持将 A2UI 协议转换为 json-render Schema 渲染
 * 
 * 注意：默认使用 a2uiRegistry，自动支持 valuePath/disabledPath/action.context 绑定
 * 
 * @example
 * ```tsx
 * const a2uiJsonRenderConfig = createA2UIJsonRenderActivityConfig({
 *   activityType: 'a2ui-json-render',
 *   actionHandlers: {
 *     submit: async (params) => {
 *       console.log('提交:', params);
 *     },
 *     cancel: async (params) => {
 *       console.log('取消');
 *     },
 *   },
 * });
 * 
 * useAgentActivity(a2uiJsonRenderConfig);
 * ```
 */
export function createA2UIJsonRenderActivityConfig(
  options: JsonRenderActivityConfigOptions = {},
): ActivityConfig<any> {
  const {
    activityType = 'a2ui-json-render',
    registry = a2uiRegistry, // A2UI 默认使用 a2uiRegistry
    actionHandlers = {},
    debug = false,
    description = 'A2UI + json-render 适配渲染器',
  } = options;

  return {
    activityType,
    component: React.memo((props: any) => (
      <A2UIJsonRenderActivityRenderer
        {...props}
        registry={registry}
        actionHandlers={actionHandlers}
        debug={debug}
      />
    )),
    description,
  };
}

/**
 * 默认 A2UI + json-render Activity 配置
 */
export const defaultA2UIJsonRenderActivityConfig = createA2UIJsonRenderActivityConfig();

export default createJsonRenderActivityConfig;
