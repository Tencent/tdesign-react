import React from 'react';
import classNames from 'classnames';

import parseTNode from '../_util/parseTNode';
import useConfig from '../hooks/useConfig';
import useDefaultProps from '../hooks/useDefaultProps';
import { dividerDefaultProps } from './defaultProps';

import type { FC } from 'react';
import type { StyledProps } from '../common';
import type { TdDividerProps } from './type';

export interface DividerProps extends TdDividerProps, StyledProps {}

const Divider: FC<DividerProps> = (props) => {
  const { children, align, dashed, layout, content, style } = useDefaultProps<DividerProps>(props, dividerDefaultProps);
  const { classPrefix } = useConfig();
  const dividerClass = `${classPrefix}-divider`;
  const contentNode = content || children;

  const classes = classNames([
    dividerClass,
    `${dividerClass}--${layout}`,
    `${dividerClass}--${align}`,
    {
      [`${dividerClass}--dashed`]: dashed,
    },
  ]);

  return (
    <div className={classes} style={style} role="separator">
      <div className={`${dividerClass}__content`}>{parseTNode(contentNode)}</div>
    </div>
  );
};

Divider.displayName = 'Divider';

export default Divider;
