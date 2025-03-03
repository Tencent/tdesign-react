import React, { forwardRef } from 'react';
import classNames from 'classnames';
import Ellipsis from './ellipsis/Ellipsis';
import { paragraphDefaultProps } from './defaultProps';

import useConfig from '../hooks/useConfig';
import useEllipsis from './ellipsis/useEllipsis';
import useDefaultProps from '../hooks/useDefaultProps';

import type { StyledProps } from '../common';
import type { TdParagraphProps } from './type';

export type TypographyParagraphProps = TdParagraphProps &
  StyledProps & {
    children: React.ReactNode;
  };

const Paragraph = forwardRef<HTMLDivElement, TypographyParagraphProps>((originalProps, ref) => {
  const { classPrefix } = useConfig();
  const props = useDefaultProps<TypographyParagraphProps>(originalProps, paragraphDefaultProps);

  const { ellipsis, children, className, content, ...rest } = props;
  const prefixCls = `${classPrefix}-typography`;

  const { ellipsisProps } = useEllipsis(ellipsis);

  if (!ellipsis) {
    return (
      <div className={classNames(className, prefixCls)} ref={ref} {...rest}>
        {children || content}
      </div>
    );
  }

  return (
    <Ellipsis {...ellipsisProps} className={classNames(className, prefixCls)} {...rest}>
      {children || content}
    </Ellipsis>
  );
});

Paragraph.displayName = 'Paragraph';

export default Paragraph;
