/**
 * Text 组件 - 用于 json-render 静态文本 / 数据绑定文本展示
 */

import React from 'react';

import { useDataValue } from '../../contexts';

import type { ComponentRenderProps } from '../../types';

/**
 * json-render Text 组件
 *
 * 支持两种模式：
 * 1. 静态文本：props.content 直接是字符串
 * 2. 数据绑定：props.contentPath 是 dataModel 的 JSON Pointer 路径
 *    （A2UI Text 的 `text: { path: '/xxx' }` 会经 mapProps 转成 contentPath）
 */
export const JsonRenderText: React.FC<ComponentRenderProps> = ({ element, children }) => {
  const { content, contentPath, style, className, ...restProps } = element.props as {
    content?: string;
    contentPath?: string;
    style?: React.CSSProperties;
    className?: string;
    [key: string]: any;
  };

  // 数据绑定优先：若声明了 contentPath，从 dataModel 订阅值
  const boundValue = useDataValue<unknown>(contentPath);

  // 展示优先级：contentPath 绑定值 > 静态 content > children
  let text: React.ReactNode;
  if (contentPath !== undefined) {
    text = boundValue == null ? '' : String(boundValue);
  } else if (content !== undefined) {
    text = content;
  } else {
    text = children;
  }

  return (
    <span style={style} className={className} {...restProps}>
      {text}
    </span>
  );
};

JsonRenderText.displayName = 'JsonRenderText';

export default JsonRenderText;
