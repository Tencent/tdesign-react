import React from 'react';
import classNames from 'classnames';
import isObject from 'lodash/isObject';
import useConfig from '../_util/useConfig';
import { StyledProps } from '../_type';

type FlexType = number | 'none' | 'auto' | string;

/**
 * Divider 组件支持的属性。
 */
export interface ColProps extends StyledProps {
  /**
   * flex 布局填充
   *
   *  @default
   */
  flex?: FlexType;

  /**
   * 栅格左侧的间隔格数，间隔内不可以有栅格
   *
   * @default 0
   */
  offset?: number;

  /**
   * 栅格向左移动格数
   *
   * @default 0
   */
  pull?: number;

  /**
   * 栅格向右移动格数
   *
   * @default 0
   */
  push?: number;

  /**
   * 栅格所占位格数，为 0 时相当于 display: none
   *
   * @default 0
   */
  span?: number;

  /**
   * 栅格所占位格数，为 0 时相当于 display: none
   *
   * @default 0
   */
  order?: number;

  /**
   * 自定义元素标签
   *
   * @default div
   */
  tag?: string;

  /**
   * 响应式栅格
   *
   */
  xs?: number | number[];
  sm?: number | number[];
  md?: number | number[];
  lg?: number | number[];
  xl?: number | number[];
  xxl?: number | number[];

  /**
   * 文本内容
   */
  children?: React.ReactNode;
}

const calcColPadding = (gutter: any, currentSize: string) => {
  let padding = '';
  if (typeof gutter === 'number') {
    padding = `0 ${gutter / 2}px`;
  } else if (Array.isArray(gutter) && gutter.length) {
    padding = `0 ${gutter[0] / 2}px`;
  } else if (isObject(gutter) && gutter[currentSize]) {
    if (Array.isArray(gutter[currentSize])) {
      padding = `0 ${gutter[currentSize][0] / 2}px`;
    } else {
      padding = `0 ${gutter[currentSize] / 2}px`;
    }
  }
  return padding;
};

const parseFlex = (flex: FlexType) => {
  if (typeof flex === 'number') {
    return `${flex} ${flex} auto`;
  }

  if (/^\d+(\.\d+)?(px|em|rem|%)$/.test(flex)) {
    return `0 0 ${flex}`;
  }

  return flex;
};

/**
 * Col组件
 */
const Col = (props: ColProps | any) => {
  const {
    flex,
    offset,
    order,
    pull,
    push,
    span,
    tag = 'div',
    className,
    children,
    style: propStyle,
    ...otherColProps
  } = props;
  const { gutter: rowGutter, size: rowSize } = otherColProps;

  const { classPrefix } = useConfig();
  const allSizes = ['xs', 'sm', 'md', 'lg', 'xl', 'xxl'];
  const sizeClassObj = allSizes.reduce((acc, currSize) => {
    const propSize = props[currSize];
    let sizeProps: any = {};
    if (typeof propSize === 'number') {
      sizeProps.span = propSize;
    } else if (isObject(propSize)) {
      sizeProps = propSize || {};
    }

    delete otherColProps[currSize];

    return {
      ...acc,
      [`${classPrefix}-col-${currSize}-${sizeProps.span}`]: sizeProps.span !== undefined,
      [`${classPrefix}-col-${currSize}-order-${sizeProps.order}`]: sizeProps.order !== undefined,
      [`${classPrefix}-col-${currSize}-offset-${sizeProps.offset}`]: sizeProps.offset !== undefined,
      [`${classPrefix}-col-${currSize}-push-${sizeProps.push}`]: sizeProps.push !== undefined,
      [`${classPrefix}-col-${currSize}-pull-${sizeProps.pull}`]: sizeProps.pull !== undefined,
    };
  }, {});

  const colClassNames = classNames(
    `${classPrefix}-col`,
    className,
    {
      [`${classPrefix}-col-${span}`]: span !== undefined,
      [`${classPrefix}-col-offset-${offset}`]: offset !== undefined,
      [`${classPrefix}-col-pull-${pull}`]: pull !== undefined,
      [`${classPrefix}-col-push-${push}`]: push !== undefined,
      [`${classPrefix}-col-order-${order}`]: order !== undefined,
    },
    sizeClassObj,
  );

  const ColStyle = {
    padding: calcColPadding(rowGutter, rowSize),
    ...propStyle,
  };
  flex && (ColStyle.flex = parseFlex(flex));

  return React.createElement(
    tag,
    {
      className: colClassNames,
      style: ColStyle,
      ...otherColProps,
    },
    children,
  );
};

Col.displayName = 'Col';

export default Col;
