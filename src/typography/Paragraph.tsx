import React, { forwardRef } from 'react';
import classNames from 'classnames';
import Ellipsis from './Ellipsis';
import { TdParagraphProps } from './type';
import { paragraphDefaultProps } from './defaultProps';
import useConfig from '../hooks/useConfig';
import useEllipsis from './useEllipsis';

export type TypographyParagraphProps = TdParagraphProps;

const ParagraphFunction = (props: TypographyParagraphProps, ref: React.Ref<HTMLDivElement>) => {
  const { classPrefix } = useConfig();
  const { ellipsis, children, className, ...rest } = props;
  const prefixCls = `${classPrefix}-typography`;

  const { ellipsisProps } = useEllipsis(ellipsis);

  if (!ellipsis) {
    return (
      <div className={classNames(className, prefixCls)} ref={ref} {...rest}>
        {children}
      </div>
    );
  }

  return (
    <Ellipsis {...ellipsisProps} className={classNames(className, prefixCls)} ref={ref} {...rest}>
      {children}
    </Ellipsis>
  );
};

export const Paragraph = forwardRef(ParagraphFunction);

Paragraph.displayName = 'Paragraph';
Paragraph.defaultProps = paragraphDefaultProps;

export default Paragraph;
