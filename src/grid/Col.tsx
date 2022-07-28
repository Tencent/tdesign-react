import React, { useContext, forwardRef } from 'react';
import classNames from 'classnames';
import isObject from 'lodash/isObject';
import useConfig from '../hooks/useConfig';
import { StyledProps } from '../common';
import { TdColProps, TdRowProps } from './type';
import { colDefaultProps } from './defaultProps';
import { RowContext } from './Row';

type FlexType = number | 'none' | 'auto' | string;

export interface ColProps extends TdColProps, StyledProps {
  /**
   * 文本内容
   */
  children?: React.ReactNode;
}

const calcColPadding = (gutter: TdRowProps['gutter'], currentSize: string) => {
  const paddingObj = {};
  if (typeof gutter === 'number') {
    Object.assign(paddingObj, {
      paddingLeft: `${gutter / 2}px`,
      paddingRight: `${gutter / 2}px`,
    });
  } else if (Array.isArray(gutter) && gutter.length) {
    if (typeof gutter[0] === 'number') {
      Object.assign(paddingObj, {
        paddingLeft: `${gutter[0] / 2}px`,
        paddingRight: `${gutter[0] / 2}px`,
      });
    }

    if (isObject(gutter[0]) && gutter[0][currentSize]) {
      Object.assign(paddingObj, {
        paddingLeft: `${gutter[0][currentSize] / 2}px`,
        paddingRight: `${gutter[0][currentSize] / 2}px`,
      });
    }
  } else if (isObject(gutter) && gutter[currentSize]) {
    Object.assign(paddingObj, {
      paddingLeft: `${gutter[currentSize] / 2}px`,
      paddingRight: `${gutter[currentSize] / 2}px`,
    });
  }
  return paddingObj;
};

const parseFlex = (flex: FlexType) => {
  if (typeof flex === 'number') {
    return `${flex} ${flex} auto`;
  }

  if (/^\d+(\.\d+)?(px|r?em|%)$/.test(flex)) {
    return `0 0 ${flex}`;
  }

  return flex;
};

const Col = forwardRef((props: ColProps | any, ref) => {
  const { flex, offset, order, pull, push, span, tag, className, children, style: propStyle, ...otherColProps } = props;
  const { gutter: rowGutter, size: rowSize } = useContext(RowContext);

  const { classPrefix } = useConfig();
  const allSizes = ['xs', 'sm', 'md', 'lg', 'xl', 'xxl'];
  const sizeClasses = allSizes.reduce((acc, currSize) => {
    const sizeProp = props[currSize];
    let sizeObj: any = {};
    if (typeof sizeProp === 'number') {
      sizeObj.span = sizeProp;
    } else if (isObject(sizeProp)) {
      sizeObj = sizeProp || {};
    }

    return {
      ...acc,
      [`${classPrefix}-col-${currSize}-${sizeObj.span}`]: sizeObj.span !== undefined,
      [`${classPrefix}-col-${currSize}-order-${sizeObj.order}`]: parseInt(sizeObj.order, 10) >= 0,
      [`${classPrefix}-col-${currSize}-offset-${sizeObj.offset}`]: parseInt(sizeObj.offset, 10) >= 0,
      [`${classPrefix}-col-${currSize}-push-${sizeObj.push}`]: parseInt(sizeObj.push, 10) >= 0,
      [`${classPrefix}-col-${currSize}-pull-${sizeObj.pull}`]: parseInt(sizeObj.pull, 10) >= 0,
    };
  }, {});

  const colClassNames = classNames(
    `${classPrefix}-col`,
    className,
    {
      [`${classPrefix}-col-${span}`]: span !== undefined,
      [`${classPrefix}-col-offset-${offset}`]: parseInt(offset, 10) >= 0,
      [`${classPrefix}-col-pull-${pull}`]: parseInt(pull, 10) >= 0,
      [`${classPrefix}-col-push-${push}`]: parseInt(push, 10) >= 0,
      [`${classPrefix}-col-order-${order}`]: parseInt(order, 10) >= 0,
    },
    sizeClasses,
  );

  const colStyle = {
    ...calcColPadding(rowGutter, rowSize),
    ...propStyle,
  };
  flex && (colStyle.flex = parseFlex(flex));

  return React.createElement(
    tag,
    {
      ref,
      className: colClassNames,
      style: colStyle,
      ...otherColProps,
    },
    children,
  );
});

Col.displayName = 'Col';
Col.defaultProps = colDefaultProps;

export default Col;
