import React, { useEffect, useState } from 'react';
import classNames from 'classnames';
import isObject from 'lodash/isObject';
import useConfig from '../_util/useConfig';
import { StyledProps } from '../common';
import { TdRowProps } from './type';
import Col from './Col';

/**
 * Row 组件支持的属性。
 */
export interface RowProps extends TdRowProps, StyledProps {
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

const calcRowStyle = (gutter: TdRowProps['gutter'], currentSize: string): object => {
  const rowStyle = {};
  if (typeof gutter === 'number') {
    Object.assign(rowStyle, {
      marginLeft: `${gutter / -2}px`,
      marginRight: `${gutter / -2}px`,
    });
  } else if (Array.isArray(gutter) && gutter.length) {
    if (typeof gutter[0] === 'number') {
      Object.assign(rowStyle, {
        marginLeft: `${gutter[0] / -2}px`,
        marginRight: `${gutter[0] / -2}px`,
      });
    }
    if (typeof gutter[1] === 'number') {
      Object.assign(rowStyle, { rowGap: `${gutter[1]}px` });
    }

    if (isObject(gutter[0]) && gutter[0][currentSize] !== undefined) {
      Object.assign(rowStyle, {
        marginLeft: `${gutter[0][currentSize] / -2}px`,
        marginRight: `${gutter[0][currentSize] / -2}px`,
      });
    }
    if (isObject(gutter[1]) && gutter[1][currentSize] !== undefined) {
      Object.assign(rowStyle, { rowGap: `${gutter[1][currentSize]}px` });
    }
  } else if (isObject(gutter) && gutter[currentSize]) {
    if (Array.isArray(gutter[currentSize]) && gutter[currentSize].length) {
      Object.assign(rowStyle, {
        marginLeft: `${gutter[currentSize][0] / -2}px`,
        marginRight: `${gutter[currentSize][0] / -2}px`,
      });
      Object.assign(rowStyle, { rowGap: `${gutter[currentSize][1]}px` });
    } else {
      Object.assign(rowStyle, {
        marginLeft: `${gutter[currentSize] / -2}px`,
        marginRight: `${gutter[currentSize] / -2}px`,
      });
    }
  }
  return rowStyle;
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

  const updateSize = () => {
    const currentSize = calcSize(window.innerWidth);
    if (currentSize !== size) {
      setSize(size);
    }
  };

  const { classPrefix } = useConfig();
  const rowClassNames = classNames(`${classPrefix}-row`, className, {
    [`${classPrefix}-row-${justify}`]: true,
    [`${classPrefix}-row-${align}`]: true,
  });
  const rowStyle = {
    ...calcRowStyle(gutter, size),
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
