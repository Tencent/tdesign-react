import React, { forwardRef } from 'react';
import classNames from 'classnames';
import Ellipsis from './ellipsis/Ellipsis';

import { TdTitleProps } from './type';
import { titleDefaultProps } from './defaultProps';

import useConfig from '../hooks/useConfig';
import useEllipsis from './ellipsis/useEllipsis';
import useDefaultProps from '../hooks/useDefaultProps';

import type { StyledProps } from '../common';

export type TypographyTitleProps = TdTitleProps &
  StyledProps & {
    children: React.ReactNode;
  };

export const Title = forwardRef<HTMLHeadingElement, TypographyTitleProps>((originalProps, ref) => {
  const { classPrefix } = useConfig();
  const props = useDefaultProps<TypographyTitleProps>(originalProps, titleDefaultProps);

  const { level: Component = 'h1', children, className, content, ellipsis, ...rest } = props;
  const prefixCls = `${classPrefix}-typography`;

  const { ellipsisProps } = useEllipsis(ellipsis);

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
