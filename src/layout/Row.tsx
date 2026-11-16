import React, { createContext, forwardRef, useMemo } from 'react';
import classNames from 'classnames';

import type { TdRowProps } from './type';

import { convertUnit } from '../_util/convertUnit';
import parseTNode from '../_util/parseTNode';
import useDefaultProps from '../hooks/useDefaultProps';
import { usePrefixClass } from '../hooks/useClass';
import { StyledProps } from '../common';

import { rowDefaultProps } from './defaultProps';

export interface RowProps extends TdRowProps, StyledProps {
  children?: React.ReactNode;
}

export const RowContext = createContext<{ gutter: RowProps['gutter'] }>({ gutter: undefined });

const Row = forwardRef<HTMLDivElement, RowProps>((props, ref) => {
  const { children, className = '', gutter, style } = useDefaultProps<RowProps>(props, rowDefaultProps);

  const colClass = usePrefixClass('row');

  const computedStyle = useMemo(() => {
    const mergedStyle = { ...style };
    if (!gutter) {
      return mergedStyle;
    }

    const gutterVal = convertUnit(-gutter / 2);

    mergedStyle.marginRight = gutterVal;
    mergedStyle.marginLeft = gutterVal;

    return mergedStyle;
  }, [gutter, style]);

  return (
    <div className={classNames([colClass], className)} ref={ref} style={computedStyle}>
      <RowContext.Provider value={{ gutter }}>{parseTNode(children)}</RowContext.Provider>
    </div>
  );
});

Row.displayName = 'Row';

export default Row;
