/**
 * json-render Activity 便捷 Hook
 * 简化 json-render Activity 的注册和使用
 */

import { useMemo } from 'react';
import { useAgentActivity } from './useAgentActivity';
import type { UseAgentActivityReturn } from './useAgentActivity';
import {
  createJsonRenderActivityConfig,
  createA2UIJsonRenderActivityConfig,
} from '../components/json-render';
import type {
  JsonRenderActivityConfigOptions,
  ComponentCatalog,
} from '../components/json-render';

/**
 * json-render Activity Hook 配置选项
 */
export interface UseJsonRenderActivityOptions extends JsonRenderActivityConfigOptions {
  /** 是否启用 A2UI 适配模式 */
  enableA2UIAdapter?: boolean;
}

/**
 * 使用 json-render Activity 渲染器
 * 
 * @example
 * ```tsx
 * // 直接模式
 * useJsonRenderActivity({
 *   activityType: 'json-render',
 *   onAction: async (actionName, params) => {
 *     console.log('Action:', actionName, params);
 *   },
 * });
 * 
 * // A2UI 适配模式
 * useJsonRenderActivity({
 *   activityType: 'a2ui-json-render',
 *   enableA2UIAdapter: true,
 *   onAction: async (actionName, params) => {
 *     console.log('Action:', actionName, params);
 *   },
 * });
 * ```
 */
export function useJsonRenderActivity(
  options: UseJsonRenderActivityOptions = {},
): UseAgentActivityReturn {
  const { enableA2UIAdapter = false, ...configOptions } = options;

  // 根据模式创建配置
  const config = useMemo(() => {
    if (enableA2UIAdapter) {
      return createA2UIJsonRenderActivityConfig(configOptions);
    }
    return createJsonRenderActivityConfig(configOptions);
  }, [enableA2UIAdapter, configOptions]);

  // 使用 useAgentActivity 注册
  return useAgentActivity(config);
}

/**
 * 创建自定义 Catalog 的 json-render Activity Hook
 * 
 * @example
 * ```tsx
 * const customCatalog = {
 *   MyButton: MyCustomButton,
 *   MyInput: MyCustomInput,
 * };
 * 
 * useJsonRenderActivityWithCatalog(customCatalog, {
 *   onAction: async (actionName, params) => {
 *     console.log('Action:', actionName, params);
 *   },
 * });
 * ```
 */
export function useJsonRenderActivityWithCatalog(
  catalog: ComponentCatalog,
  options: Omit<UseJsonRenderActivityOptions, 'catalog'> = {},
): UseAgentActivityReturn {
  return useJsonRenderActivity({
    ...options,
    catalog,
  });
}

export default useJsonRenderActivity;
