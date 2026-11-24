import React, { forwardRef, useContext } from 'react';
import classNames from 'classnames';

import { TdColProps } from './type';
import { colDefaultProps } from './defaultProps';

import { StyledProps } from '../common';

import { convertUnit } from '../_util/convertUnit';
import parseTNode from '../_util/parseTNode';
import useDefaultProps from '../hooks/useDefaultProps';
import { usePrefixClass } from '../hooks/useClass';

import { RowContext, RowProps } from './Row';

export interface ColProps extends TdColProps, StyledProps {
  children?: React.ReactNode;
}

const calcColPadding = (gutter: RowProps['gutter']) => {
  const styles: React.CSSProperties = {};

  if (!gutter) {
    return styles;
  }
  const gutterVal = convertUnit(Number(gutter) / 2);
  styles.paddingRight = gutterVal;
  styles.paddingLeft = gutterVal;
  return styles;
};

const Col = forwardRef<HTMLDivElement, ColProps>((props, ref) => {
  const { offset, span, className, children, style: propStyle } = useDefaultProps<ColProps>(props, colDefaultProps);

  const colClass = usePrefixClass('col');

  const { gutter } = useContext(RowContext);

  const colClassNames = classNames(colClass, className, {
    [`${colClass}--${span}`]: span !== undefined,
    [`${colClass}--offset-${offset}`]: parseInt(offset as string, 10) >= 0,
  });

  const colStyle = {
    ...calcColPadding(gutter),
    ...propStyle,
  };

  return (
    <div className={colClassNames} ref={ref} style={colStyle}>
      {parseTNode(children)}
    </div>
  );
});

Col.displayName = 'Col';

export default Col;
