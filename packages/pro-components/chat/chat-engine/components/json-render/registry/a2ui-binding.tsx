/**
 * A2UI 数据绑定 HOC
 * 
 * 统一处理 A2UI 协议的标准字段：
 * - valuePath: 值的数据绑定路径（如 /userInfo/name）
 * - disabledPath: disabled 状态的数据绑定路径（如 /formDisabled）
 * - action.context: action 参数中的动态数据绑定
 * 
 * 性能优化：
 * - 使用 React.memo + 精确值比较避免不必要渲染
 * - Action 参数延迟解析（触发时才计算）
 * - 使用 useRef 缓存回调函数避免重建
 * 
 * 使用方式：
 * ```tsx
 * // 创建支持 A2UI 绑定的 Input
 * const A2UIInput = withA2UIBinding(Input, {
 *   valueField: 'value',
 *   onChangeField: 'onChange',
 * });
 * 
 * // 创建支持 action 的 Button
 * const A2UIButton = withA2UIBinding(Button, {
 *   supportsAction: true,
 *   actionTrigger: 'onClick',  // 默认
 * });
 * 
 * // Input 支持 onEnter 触发 action
 * const A2UISearchInput = withA2UIBinding(Input, {
 *   valueField: 'value',
 *   onChangeField: 'onChange',
 *   supportsAction: true,
 *   actionTrigger: 'onEnter',
 * });
 * ```
 */

import React, { useCallback, useRef, memo, useMemo } from 'react';
import type { ComponentRenderProps } from '../renderer';
import { getByPath } from '@json-render/core';
import type { Action } from '@json-render/core';
import { useData } from '..';

/**
 * A2UI 绑定配置
 */
export interface A2UIBindingConfig {
  /** 组件的值字段名，默认 'value' */
  valueField?: string;
  /** 组件的 onChange 字段名，默认 'onChange' */
  onChangeField?: string;
  /** 是否支持 action 绑定，默认 false */
  supportsAction?: boolean;
  /** 
   * Action 触发事件名，默认 'onClick'
   * 可设置为 'onEnter'、'onChange' 等
   */
  actionTrigger?: string;
}

/**
 * 解析 action params 中的动态数据绑定
 * 将 { path: '/xxx' } 格式的引用替换为实际数据
 * 
 * 性能优化：使用迭代替代递归，减少调用栈深度
 */
function resolveActionParams(
  params: Record<string, unknown>,
  data: Record<string, unknown>,
  maxDepth = 10,
): Record<string, unknown> {
  const resolved: Record<string, unknown> = {};
  
  // 使用栈迭代处理，避免深递归
  const stack: Array<{
    source: Record<string, unknown>;
    target: Record<string, unknown>;
    depth: number;
  }> = [{ source: params, target: resolved, depth: 0 }];
  
  while (stack.length > 0) {
    const { source, target, depth } = stack.pop()!;
    
    if (depth >= maxDepth) {
      // 防止无限递归
      Object.assign(target, source);
      continue;
    }
    
    for (const [key, value] of Object.entries(source)) {
      if (value && typeof value === 'object' && 'path' in value) {
        // 动态绑定：{ path: '/userInfo' } → 实际数据
        const pathValue = (value as { path: string }).path;
        target[key] = getByPath(data, pathValue);
      } else if (value && typeof value === 'object' && !Array.isArray(value)) {
        // 嵌套对象，加入栈处理
        const nestedTarget: Record<string, unknown> = {};
        target[key] = nestedTarget;
        stack.push({
          source: value as Record<string, unknown>,
          target: nestedTarget,
          depth: depth + 1,
        });
      } else {
        // 静态值直接保留
        target[key] = value;
      }
    }
  }
  
  return resolved;
}

/**
 * A2UI 数据绑定 HOC 内部组件
 * 处理实际的数据绑定逻辑
 */
interface A2UIBoundInnerProps<P> extends ComponentRenderProps {
  WrappedComponent: React.ComponentType<P>;
  valueField: string;
  onChangeField: string;
  supportsAction: boolean;
  actionTrigger: string;
}

function A2UIBoundInner<P extends Record<string, any>>({
  element,
  children,
  onAction,
  WrappedComponent,
  valueField,
  onChangeField,
  supportsAction,
  actionTrigger,
}: A2UIBoundInnerProps<P>) {
  const { data, set } = useData();
  
  // 提取 A2UI 特有字段
  const {
    valuePath,
    disabledPath,
    action,
    disabled: staticDisabled,
    ...componentProps
  } = element.props as P & {
    valuePath?: string;
    disabledPath?: string;
    action?: string | Action;
    disabled?: boolean;
  };

  // 使用 ref 缓存 data，action 触发时获取最新值
  const dataRef = useRef(data);
  dataRef.current = data;

  // 提取绑定的值（只在真正需要的路径变化时才变）
  const boundValue = useMemo(() => {
    if (valuePath) {
      return getByPath(data, valuePath) ?? '';
    }
    return undefined;
  }, [valuePath, valuePath ? getByPath(data, valuePath) : undefined]);

  // 提取 disabled 状态
  const boundDisabled = useMemo(() => {
    if (disabledPath) {
      return Boolean(getByPath(data, disabledPath));
    }
    return staticDisabled ?? false;
  }, [disabledPath, disabledPath ? getByPath(data, disabledPath) : undefined, staticDisabled]);

  // 使用 ref 缓存 set 函数，避免 handleChange 重建
  const setRef = useRef(set);
  setRef.current = set;

  // 创建稳定的 onChange 处理器
  const handleChange = useCallback((newValue: unknown) => {
    if (valuePath) {
      setRef.current(valuePath, newValue);
    }
  }, [valuePath]);

  // 创建稳定的 action 处理器（延迟解析，触发时才获取最新 data）
  const handleAction = useCallback(() => {
    if (!action || !onAction) return;

    // 标准化 action 格式
    const actionObj: Action = typeof action === 'string'
      ? { name: action, params: {} }
      : action;

    // 使用最新的 data 解析参数
    const resolvedParams = actionObj.params
      ? resolveActionParams(actionObj.params as Record<string, unknown>, dataRef.current)
      : {};

    const resolvedAction: Action = {
      name: actionObj.name,
      params: resolvedParams,
    };

    onAction(resolvedAction);
  }, [action, onAction]);

  // 构建最终 props
  const finalProps = useMemo(() => {
    const props: any = {
      ...componentProps,
      disabled: boundDisabled,
    };

    // 如果有 valuePath，注入值和 onChange
    if (valuePath !== undefined) {
      props[valueField] = boundValue;
      props[onChangeField] = handleChange;
    }

    // 如果支持 action，注入到指定的触发事件
    if (supportsAction && action) {
      const originalHandler = componentProps[actionTrigger];
      props[actionTrigger] = (...args: unknown[]) => {
        // 先调用原始处理器
        if (typeof originalHandler === 'function') {
          originalHandler(...args);
        }
        // 再触发 action
        handleAction(...args);
      };
    }

    return props;
  }, [
    componentProps,
    boundDisabled,
    valuePath,
    valueField,
    boundValue,
    onChangeField,
    handleChange,
    supportsAction,
    action,
    actionTrigger,
    handleAction,
  ]);

  return (
    <WrappedComponent {...finalProps as P}>
      {children}
    </WrappedComponent>
  );
}

/**
 * A2UI 数据绑定 HOC
 * 
 * 自动处理 A2UI 协议的标准字段，让原子组件保持纯净
 * 
 * @param WrappedComponent 原始组件
 * @param config 绑定配置
 */
export function withA2UIBinding<P extends Record<string, any>>(
  WrappedComponent: React.ComponentType<P>,
  config: A2UIBindingConfig = {},
): React.FC<ComponentRenderProps> {
  const {
    valueField = 'value',
    onChangeField = 'onChange',
    supportsAction = false,
    actionTrigger = 'onClick',
  } = config;

  const A2UIBoundComponent: React.FC<ComponentRenderProps> = (props) => {
    return (
      <A2UIBoundInner
        {...props}
        WrappedComponent={WrappedComponent}
        valueField={valueField}
        onChangeField={onChangeField}
        supportsAction={supportsAction}
        actionTrigger={actionTrigger}
      />
    );
  };

  A2UIBoundComponent.displayName = `withA2UIBinding(${WrappedComponent.displayName || WrappedComponent.name || 'Component'})`;

  // 使用 memo 包装，通过精确比较避免不必要渲染
  return memo(A2UIBoundComponent, (prevProps, nextProps) => {
    // element 引用相同，跳过渲染
    if (prevProps.element === nextProps.element) return true;
    
    // 比较关键字段
    const prevEl = prevProps.element;
    const nextEl = nextProps.element;
    
    if (prevEl.type !== nextEl.type) return false;
    if (prevEl.key !== nextEl.key) return false;
    
    // 比较 props（浅比较）
    const prevElProps = prevEl.props || {};
    const nextElProps = nextEl.props || {};
    const prevKeys = Object.keys(prevElProps);
    const nextKeys = Object.keys(nextElProps);
    
    if (prevKeys.length !== nextKeys.length) return false;
    
    for (const key of prevKeys) {
      if (prevElProps[key] !== nextElProps[key]) return false;
    }
    
    return true;
  });
}

export default withA2UIBinding;
