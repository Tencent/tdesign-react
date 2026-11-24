import React, { forwardRef } from 'react';
import classNames from 'classnames';
import useConfig from '../hooks/useConfig';
import useDefaultProps from '../hooks/useDefaultProps';
import { titleDefaultProps } from './defaultProps';
import Ellipsis from './Ellipsis';

import type { StyledProps } from '../common';
import type { TdTitleProps } from './type';

export interface TitleProps extends TdTitleProps, StyledProps {}

const Title = forwardRef<HTMLHeadingElement, TitleProps>((originalProps, ref) => {
  const props = useDefaultProps<TitleProps>(originalProps, titleDefaultProps);
  const { classPrefix } = useConfig();
  const prefixCls = `${classPrefix}-typography`;

  const { className, style, children, content, ellipsis, level } = props;

  const Tag = level as 'h1' | 'h2' | 'h3' | 'h4' | 'h5' | 'h6';
  const renderContent = (children ?? content) as React.ReactNode;

  if (ellipsis) {
    return (
      <Ellipsis className={classNames(prefixCls, className)} style={style} ellipsis={ellipsis}>
        <Tag>{renderContent}</Tag>
      </Ellipsis>
    );
  }

  return (
    <Tag className={classNames(prefixCls, className)} style={style} ref={ref}>
      {renderContent}
    </Tag>
  );
});

Title.displayName = 'Title';

export default Title;
