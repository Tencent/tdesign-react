import React, { forwardRef, useMemo } from 'react';
import cls from 'classnames';

import parseTNode from '../_util/parseTNode';
import useConfig from '../hooks/useConfig';
import useDefaultProps from '../hooks/useDefaultProps';
import { gridDefaultProps } from './defaultProps';
import { GirdProvider } from './GridContext';

import type { PropsWithChildren } from 'react';
import type { StyledProps } from '../common';
import type { TdGridProps } from './type';

export interface GridProps extends TdGridProps, StyledProps {
  children?: React.ReactNode;
}

const Grid = forwardRef<HTMLDivElement, PropsWithChildren<GridProps>>((props, ref) => {
  const { children, align, border, column, gutter, theme, className, style } = useDefaultProps(props, gridDefaultProps);
  const { classPrefix } = useConfig();
  const name = `${classPrefix}-grid`;

  const rootStyle = useMemo(() => {
    if (column === 0) return {};
    return {
      padding: `${gutter}px`,
      gridTemplateColumns: `repeat(${column}, 1fr)`,
      gridGap: `${gutter}px`,
      ...style,
    };
  }, [column, gutter, style]);

  return (
    <GirdProvider gutter={gutter} border={border} column={column} align={align} theme={theme}>
      <div
        ref={ref}
        className={cls(name, className, {
          [`${name}--card`]: theme === 'card',
          [`${name}--auto-size`]: column === 0,
          [`${name}--bordered`]: border && !gutter,
        })}
        style={rootStyle}
      >
        {parseTNode(children)}
      </div>
    </GirdProvider>
  );
});

Grid.displayName = 'Grid';

export default Grid;
