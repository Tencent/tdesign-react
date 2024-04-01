// @ts-nocheck
import React, { forwardRef } from 'react';
import classNames from 'classnames';
import Ellipsis from './Ellipsis';

import { TdTitleProps } from './type';
import { titleDefaultProps } from './defaultProps';
import useConfig from '../hooks/useConfig';
import useEllipsis from './useEllipsis';

export type TypographyTitleProps = TdTitleProps;

const TitleFunction = (props: TypographyTitleProps, ref: React.Ref<HTMLDivElement>) => {
  const { classPrefix } = useConfig();
  const { level: Component = 'h1', children, className, ellipsis, ...rest } = props;
  const prefixCls = `${classPrefix}-typography`;

  const { ellipsisProps } = useEllipsis(ellipsis);

  if (!ellipsis) {
    return (
      <Component className={classNames(className, prefixCls)} ref={ref} {...rest}>
        {children}
      </Component>
    );
  }

  return (
    <Ellipsis className={classNames(className, prefixCls)} {...ellipsisProps} ref={ref} component={Component} {...rest}>
      {children}
    </Ellipsis>
  );
};

export const Title = forwardRef(TitleFunction);

Title.displayName = 'Title';
Title.defaultProps = titleDefaultProps;

export default Title;
