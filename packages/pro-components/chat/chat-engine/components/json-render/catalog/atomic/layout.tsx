/* eslint-disable @typescript-eslint/no-unused-vars */
/**
 * TDesign 布局组件适配 json-render
 * 包含 Row、Col、Space、Column、Divider 等布局组件
 */

import React from 'react';
import { Col, Divider, Row, Space } from 'tdesign-react';

import { sanitizeProps } from '../../utils/sanitize-props';

import type { ColProps, DividerProps, RowProps, SpaceProps } from 'tdesign-react';
import type { ComponentRenderProps } from '../../types';

/**
 * json-render Row 组件
 */
export const JsonRenderRow: React.FC<ComponentRenderProps> = ({ element, children }) => {
  const { align = 'top', gutter = 0, justify = 'start', ...restProps } = element.props as unknown as RowProps;

  // 安全过滤：剔除 dangerouslySetInnerHTML 等危险字段，避免 XSS 注入
  const safeRestProps = sanitizeProps(restProps as Record<string, unknown>);

  return (
    <Row align={align} gutter={gutter} justify={justify} {...safeRestProps}>
      {children}
    </Row>
  );
};

JsonRenderRow.displayName = 'JsonRenderRow';

/**
 * json-render Col 组件
 */
export const JsonRenderCol: React.FC<ComponentRenderProps> = ({ element, children }) => {
  const { span, offset, order, push, pull, flex, ...restProps } = element.props as ColProps;

  // 安全过滤：剔除 dangerouslySetInnerHTML 等危险字段，避免 XSS 注入
  const safeRestProps = sanitizeProps(restProps as Record<string, unknown>);

  return (
    <Col span={span} offset={offset} order={order} push={push} pull={pull} flex={flex} {...safeRestProps}>
      {children}
    </Col>
  );
};

JsonRenderCol.displayName = 'JsonRenderCol';

/**
 * json-render Space 组件
 */
export const JsonRenderSpace: React.FC<ComponentRenderProps> = ({ element, children }) => {
  const {
    align = 'center',
    direction = 'horizontal',
    size = 'small',
    separator,
    breakLine = false,
    ...restProps
  } = element.props as SpaceProps;

  // 安全过滤：剔除 dangerouslySetInnerHTML 等危险字段，避免 XSS 注入
  const safeRestProps = sanitizeProps(restProps as Record<string, unknown>);

  return (
    <Space
      align={align}
      direction={direction}
      size={size}
      separator={separator}
      breakLine={breakLine}
      {...safeRestProps}
    >
      {children}
    </Space>
  );
};

JsonRenderSpace.displayName = 'JsonRenderSpace';

/**
 * json-render Column 组件
 * 垂直布局的便捷组件（基于 Space direction="vertical"）
 */
export interface JsonRenderColumnProps extends Omit<SpaceProps, 'align' | 'direction'> {
  /** 间距大小 */
  gap?: number | string;
  /** Horizontal alignment */
  align?: SpaceProps['align'] | 'stretch';
}

export const JsonRenderColumn: React.FC<ComponentRenderProps> = ({ element, children }) => {
  const {
    gap,
    size = gap || 'small',
    align = 'stretch',
    style,
    ...restProps
  } = element.props as unknown as JsonRenderColumnProps;

  // 安全过滤：剔除 dangerouslySetInnerHTML 等危险字段，避免 XSS 注入
  const safeRestProps = sanitizeProps(restProps as Record<string, unknown>);

  return (
    <Space
      direction="vertical"
      align={align === 'stretch' ? undefined : align}
      size={size}
      style={{ width: '100%', alignItems: align, ...style }}
      {...safeRestProps}
    >
      {children}
    </Space>
  );
};

JsonRenderColumn.displayName = 'JsonRenderColumn';

/**
 * json-render Divider 组件
 */
export const JsonRenderDivider: React.FC<DividerProps & { children?: React.ReactNode }> = (props) => {
  const {
    align = 'center',
    dashed = false,
    layout = 'horizontal',
    children,
    // 过滤掉不支持的属性
    lineColor: _lineColor,
    theme: _theme,
    onAction: _onAction,
    ...restProps
  } = props as any;

  // 安全过滤：剔除 dangerouslySetInnerHTML 等危险字段，避免 XSS 注入
  const safeRestProps = sanitizeProps(restProps as Record<string, unknown>);

  return (
    <Divider align={align} dashed={dashed} layout={layout} {...safeRestProps}>
      {children}
    </Divider>
  );
};

JsonRenderDivider.displayName = 'JsonRenderDivider';

export default {
  JsonRenderRow,
  JsonRenderCol,
  JsonRenderSpace,
  JsonRenderColumn,
  JsonRenderDivider,
};
