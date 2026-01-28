/**
 * Text 组件 - 用于 json-render 静态文本展示
 */

import React from 'react';
import type { ComponentRenderProps } from '../../renderer';

/**
 * json-render Text 组件
 * 简单的文本展示组件
 */
export const JsonRenderText: React.FC<ComponentRenderProps> = ({ element, children }) => {
  const { content, style, className, ...restProps } = element.props as {
    content?: string;
    style?: React.CSSProperties;
    className?: string;
    [key: string]: any;
  };

  // 优先使用 content（Schema 中定义的），其次是 children（子元素）
  const text = content || children;

  return (
    <span style={style} className={className} {...restProps}>
      {text}
    </span>
  );
};

JsonRenderText.displayName = 'JsonRenderText';

export default JsonRenderText;
