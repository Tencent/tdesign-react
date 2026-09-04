/**
 * TDesign Card 组件适配 json-render
 */

import React from 'react';
import { Card } from 'tdesign-react';
import type { CardProps } from 'tdesign-react';
import { ComponentRenderProps } from '../../types';

/**
 * json-render Card 组件
 * 符合 @json-render/react 的 ComponentRenderProps 接口
 */
export const JsonRenderCard: React.FC<ComponentRenderProps> = ({ element, children }) => {
  const {
    title,
    subtitle,
    description,
    avatar,
    cover,
    actions,
    bordered = true,
    size = 'medium',
    loading = false,
    shadow = false,
    hoverable = false,
    header,
    footer,
    ...restProps
  } = element.props as CardProps;

  return (
    <Card
      title={title}
      subtitle={subtitle}
      description={description}
      avatar={avatar}
      cover={cover}
      actions={actions}
      bordered={bordered}
      size={size}
      loading={loading}
      shadow={shadow}
      hoverable={hoverable}
      header={header}
      footer={footer}
      {...restProps}
    >
      {children}
    </Card>
  );
};

JsonRenderCard.displayName = 'JsonRenderCard';

export default JsonRenderCard;
