import React from 'react';
import classNames from 'classnames';
import useConfig from '../hooks/useConfig';
import forwardRefWithStatics from '../_util/forwardRefWithStatics';
import { StyledProps } from '../common';
import Text from './Text';
import Title from './Title';
import Link from './Link';
import Copy from './Copy';
import Paragraph from './Paragraph';

export interface TypographyProps extends StyledProps {
  children?: React.ReactNode;
}

const Typography = forwardRefWithStatics(
  (props: TypographyProps, ref) => {
    const { classPrefix } = useConfig();

    const { className, style, children } = props;

    return (
      <article ref={ref} style={style} className={classNames(`${classPrefix}-typography`, className)}>
        {children}
      </article>
    );
  },
  { Text, Link, Copy, Title, Paragraph },
);

Typography.displayName = 'Typography';

export default Typography;
