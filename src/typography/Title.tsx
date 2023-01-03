import React, { forwardRef } from 'react';
import classNames from 'classnames';
import useConfig from '../hooks/useConfig';
import { TdTypographyTitleProps } from './type';
import { StyledProps } from '../common';
import Copy from './Copy';
import { getWrappedElement } from './utils';

export interface TypographyTitleProps extends TdTypographyTitleProps, StyledProps {}

const TypographyTitle = forwardRef<HTMLSpanElement, TypographyTitleProps>((props, ref) => {
  const { classPrefix } = useConfig();

  const { className, style, level, content, children, status, disabled, copyable, ellipsis } = props;

  return React.createElement(
    `h${Math.min(level, 5)}`,
    {
      ref,
      style,
      className: classNames(`${classPrefix}-typography`, className, {
        [`${classPrefix}-typography--${status}`]: status,
        [`${classPrefix}-typography--disabled`]: disabled,
        [`${classPrefix}-typography--ellipsis`]: ellipsis,
      }),
    },
    <>
      {getWrappedElement(props, content || children)}
      {copyable && <Copy text={String(content || children)} />}
    </>,
  );
});

TypographyTitle.displayName = 'TypographyTitle';

export default TypographyTitle;
