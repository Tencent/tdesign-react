/**
 * TDesign 布局组件适配 json-render
 * 包含 Row、Col、Space、Column、Divider 等布局组件
 */

import React from 'react';
import { Row, Col, Space, Divider } from 'tdesign-react';
import type { RowProps, ColProps, SpaceProps, DividerProps } from 'tdesign-react';
import type { ComponentRenderProps } from '../../renderer';

/**
 * json-render Row 组件
 */
export const JsonRenderRow: React.FC<ComponentRenderProps> = ({ element, children }) => {
  const {
    align = 'top',
    gutter = 0,
    justify = 'start',
    ...restProps
  } = element.props as RowProps;

  return (
    <Row align={align} gutter={gutter} justify={justify} {...restProps}>
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

  return (
    <Col span={span} offset={offset} order={order} push={push} pull={pull} flex={flex} {...restProps}>
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

  return (
    <Space
      align={align}
      direction={direction}
      size={size}
      separator={separator}
      breakLine={breakLine}
      {...restProps}
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
export interface JsonRenderColumnProps extends Omit<SpaceProps, 'direction'> {
  /** 间距大小 */
  gap?: number | string;
}

export const JsonRenderColumn: React.FC<ComponentRenderProps> = ({ element, children }) => {
  const {
    gap,
    size = gap || 'small',
    align = 'stretch',
    ...restProps
  } = element.props as JsonRenderColumnProps;

  return (
    <Space direction="vertical" align={align} size={size} style={{ width: '100%' }} {...restProps}>
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

  return (
    <Divider
      align={align}
      dashed={dashed}
      layout={layout}
      {...restProps}
    >
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
