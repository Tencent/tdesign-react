import React, { forwardRef } from 'react';
import classNames from 'classnames';

import useConfig from '../hooks/useConfig';
import useDefaultProps from '../hooks/useDefaultProps';
import { titleDefaultProps } from './defaultProps';
import Ellipsis from './ellipsis/Ellipsis';
import useEllipsis from './ellipsis/useEllipsis';

import type { StyledProps } from '../common';
import type { TdTitleProps } from './type';

export type TypographyTitleProps = TdTitleProps &
  StyledProps & {
    children: React.ReactNode;
  };

const VALID_LEVELS = ['h1', 'h2', 'h3', 'h4', 'h5', 'h6'];

export const Title = forwardRef<HTMLHeadingElement, TypographyTitleProps>((originalProps, ref) => {
  const { classPrefix } = useConfig();
  const prefixCls = `${classPrefix}-typography`;

  const props = useDefaultProps<TypographyTitleProps>(originalProps, titleDefaultProps);
  const { level, children, className, content, ellipsis, ...rest } = props;

  const { ellipsisProps } = useEllipsis(ellipsis);

  const formatLevel = (level: string | number) => {
    const normalizedLevel = typeof level === 'number' ? `h${level}` : level;
    const levelProp = VALID_LEVELS.includes(normalizedLevel) ? normalizedLevel : 'h1';
    return levelProp as TypographyTitleProps['level'];
  };
  const Component = formatLevel(level);

  if (!ellipsis) {
    return (
      <Component className={classNames(className, prefixCls)} ref={ref} {...rest}>
        {children || content}
      </Component>
    );
  }

  return (
    <Ellipsis className={classNames(className, prefixCls)} {...ellipsisProps} component={Component} {...rest}>
      {children || content}
    </Ellipsis>
  );
});

export default Title;
