import React, { useEffect, useState } from 'react';
import classNames from 'classnames';
import debounce from 'lodash/debounce';
import isObject from 'lodash/isObject';
import useConfig from '../_util/useConfig';
import { StyledProps } from '../_type';
import Col from './Col';

type Gutter = {
  xs?: number | number[];
  sm?: number | number[];
  md?: number | number[];
  lg?: number | number[];
  xl?: number | number[];
  xxl?: number | number[];
};

/**
 * Row 组件支持的属性。
 */
export interface RowProps extends StyledProps {
  // /**
  //  * 布局模式，flex
  //  *
  //  *  @default 'flex'
  //  */
  // type?: string;

  /**
   * flex 布局下的垂直对齐方式
   *
   * @default top
   */
  align?: 'top' | 'middle' | 'bottom';

  /**
   * 栅格间隔 {xs: 8, sm: 16, md: 24} [水平间距， 垂直间距]
   *
   * @default 0
   */

  gutter?: number | Gutter | number[];

  /**
   * flex 布局下的水平排列方式
   *
   * @default start
   */
  justify?: 'start' | 'end' | 'center' | 'space-around' | 'space-between';

  /**
   * 自定义元素标签
   *
   * @default div
   */
  tag?: string;

  /**
   * 默认子元素内容
   */
  children: React.ReactNode;
}

const calcSize = (width: number) => {
  let size = 'xs';
  if (width < 768) {
    size = 'xs';
  } else if (width >= 768 && width < 992) {
    size = 'sm';
  } else if (width >= 992 && width < 1200) {
    size = 'md';
  } else if (width >= 1200 && width < 1400) {
    size = 'lg';
  } else if (width >= 1400 && width < 1880) {
    size = 'xl';
  } else {
    size = 'xxl';
  }
  return size;
};

const calcRowMargin = (gutter: any, currentSize: string) => {
  let margin = '';
  if (typeof gutter === 'number') {
    margin = `0 -${gutter / 2}px`;
  } else if (Array.isArray(gutter) && gutter.length) {
    margin = `0 -${gutter[0] / 2}px`;
  } else if (isObject(gutter) && gutter[currentSize]) {
    if (Array.isArray(gutter[currentSize])) {
      margin = `0 -${gutter[currentSize][0] / 2}px`;
    } else {
      margin = `0 -${gutter[currentSize] / 2}px`;
    }
  }
  return margin;
};

/**
 * Row组件
 */
const Row = (props: RowProps) => {
  const {
    align = 'top',
    gutter = 0,
    justify = 'start',
    tag = 'div',
    style: propStyle,
    className,
    children,
    ...otherRowProps
  } = props;

  const [size, setSize] = useState(calcSize(window.innerWidth));

  const updateSize = debounce(() => {
    const size = calcSize(window.innerWidth);
    setSize(size);
  }, 50);

  const { classPrefix } = useConfig();
  const rowClassNames = classNames(`${classPrefix}-row`, className, {
    [`${classPrefix}-row-${justify}`]: true,
    [`${classPrefix}-row-${align}`]: true,
  });
  const rowStyle = {
    margin: calcRowMargin(gutter, size),
    ...propStyle,
  };

  useEffect(() => {
    window.addEventListener('resize', updateSize);
    return () => {
      window.removeEventListener('resize', updateSize);
    };
  });

  return React.createElement(
    tag,
    {
      className: rowClassNames,
      style: rowStyle,
      ...otherRowProps,
    },
    React.Children.map(children, (child: React.ReactElement) => {
      if (child && child.type === Col) {
        return React.cloneElement(child, { gutter, size });
      }
      return child;
    }),
  );
};

Row.displayName = 'Row';

export default Row;
