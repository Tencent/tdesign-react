import React, { forwardRef, AnchorHTMLAttributes } from 'react';
import classNames from 'classnames';
import useConfig from '../hooks/useConfig';

const TypographyLink = forwardRef<HTMLAnchorElement, AnchorHTMLAttributes<HTMLAnchorElement>>((props, ref) => {
  const { classPrefix } = useConfig();

  const { className, style, children, ...resetProps } = props;

  return (
    <a ref={ref} style={style} className={classNames(`${classPrefix}-typography`, className)} {...resetProps}>
      {children}
    </a>
  );
});

TypographyLink.displayName = 'TypographyLink';

export default TypographyLink;
