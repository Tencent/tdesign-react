/**
 * TDesign Button 组件适配 json-render
 *
 * 这是纯净的 json-render Button 组件，不包含 A2UI 协议绑定逻辑
 * 如需 A2UI 支持，请使用 a2uiRegistry 中的 A2UIButton
 */

import React, { useCallback } from 'react';
import { Button } from 'tdesign-react';

import type { ActionBinding } from '@json-render/core';
import type { ButtonProps } from 'tdesign-react';
import type { ComponentRenderProps } from '../../types';

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
    action?: string | ActionBinding;
    [key: string]: any;
  };

  // 处理点击事件
  const handleClick = useCallback(
    (e: React.MouseEvent<HTMLElement>) => {
      if (onClick) {
        onClick(e);
      }

      if (action && onAction) {
        // 协议适配：归一化 action 字段
        // - 字符串简写："submit"
        // - 标准 ActionBinding：{ action, params? }
        // - 兼容旧协议（A2UI / 旧版 mock 数据）：{ name, context? }
        let actionObj: ActionBinding;
        if (typeof action === 'string') {
          actionObj = { action, params: {} };
        } else {
          const raw = action as ActionBinding & {
            name?: string;
            context?: Record<string, unknown>;
          };
          actionObj = {
            ...raw,
            action: raw.action ?? raw.name ?? '',
            params: raw.params ?? raw.context ?? {},
          };
        }

        if (!actionObj.action) {
          console.error(
            '[JsonRenderButton] 按钮 action 字段缺失或不符合 ActionBinding 协议（应为字符串或 { action, params? }），实际收到：',
            action,
          );
          return;
        }

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
