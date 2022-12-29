import React from 'react';
import classNames from 'classnames';
import useConfig from '../hooks/useConfig';
import forwardRefWithStatics from '../_util/forwardRefWithStatics';
import { TdTypographyTextProps } from './type';
import { StyledProps } from '../common';
import Text from './Text';
import Title from './Title';
import Link from './Link';
import Copy from './Copy';

export interface TypographyTextProps extends TdTypographyTextProps, StyledProps {}

const Typography = forwardRefWithStatics(
  (props: TypographyTextProps, ref) => {
    const { classPrefix } = useConfig();

    const { className, style, children } = props;

    return (
      <article ref={ref} style={style} className={classNames(`${classPrefix}-typography`, className)}>
        {children}
      </article>
    );
  },
  { Text, Link, Copy, Title },
);

Typography.displayName = 'Typography';

export default Typography;
