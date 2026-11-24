import React, { forwardRef, ReactNode } from 'react';
import classNames from 'classnames';
import useConfig from '../hooks/useConfig';
import useDefaultProps from '../hooks/useDefaultProps';
import { paragraphDefaultProps } from './defaultProps';
import Ellipsis from './Ellipsis';

import type { StyledProps } from '../common';
import type { TdParagraphProps } from './type';

export interface ParagraphProps extends TdParagraphProps, StyledProps {}

const Paragraph = forwardRef<HTMLParagraphElement, ParagraphProps>((originalProps, ref) => {
  const props = useDefaultProps<ParagraphProps>(originalProps, paragraphDefaultProps);
  const { classPrefix } = useConfig();
  const prefixCls = `${classPrefix}-typography`;

  const { className, style, children, content, ellipsis } = props;

  const renderContent = (children ?? content) as ReactNode;

  if (ellipsis) {
    return (
      <Ellipsis className={classNames(prefixCls, className)} style={style} ellipsis={ellipsis}>
        {renderContent}
      </Ellipsis>
    );
  }

  return (
    <div className={classNames(prefixCls, className)} style={style} ref={ref}>
      {renderContent}
    </div>
  );
});

Paragraph.displayName = 'Paragraph';

export default Paragraph;
