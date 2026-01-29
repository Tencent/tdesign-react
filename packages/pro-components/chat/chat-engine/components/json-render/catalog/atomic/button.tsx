/**
 * TDesign Button 组件适配 json-render
 * 
 * 这是纯净的 json-render Button 组件，不包含 A2UI 协议绑定逻辑
 * 如需 A2UI 支持，请使用 a2uiRegistry 中的 A2UIButton
 */

import React, { useCallback } from 'react';
import { Button } from 'tdesign-react';
import type { ButtonProps } from 'tdesign-react';
import type { Action } from '@json-render/core';
import { ComponentRenderProps } from '../../renderer/JsonUIRenderer';

/**
 * json-render Button 组件
 * 符合 @json-render/react 的 ComponentRenderProps 接口
 */
export const JsonRenderButton: React.FC<ComponentRenderProps> = ({
  element,
  children,
  onAction,
  loading: parentLoading,
}) => {
  const {
    label,
    variant = 'base',
    size = 'medium',
    theme = 'default',
    disabled = false,
    loading = false,
    block = false,
    shape = 'rectangle',
    ghost = false,
    action,
    onClick,
    ...restProps
  } = element.props as ButtonProps & {
    label?: string;
    action?: string | Action;
    [key: string]: any;
  };

  // 处理点击事件
  const handleClick = useCallback(
    (e: React.MouseEvent<HTMLButtonElement>) => {
      if (onClick) {
        onClick(e);
      }

      if (action && onAction) {
        const actionObj: Action = typeof action === 'string'
          ? { name: action, params: {} }
          : action;

        console.log('[JsonRenderButton] 触发 action:', actionObj);
        onAction(actionObj);
      }
    },
    [onClick, action, onAction],
  );

  const isLoading = loading || parentLoading;
  const content = label || children;

  return (
    <Button
      variant={variant}
      size={size}
      theme={theme}
      disabled={disabled}
      loading={isLoading}
      block={block}
      shape={shape}
      ghost={ghost}
      onClick={handleClick}
      {...restProps}
    >
      {content}
    </Button>
  );
};

JsonRenderButton.displayName = 'JsonRenderButton';

export default JsonRenderButton;
