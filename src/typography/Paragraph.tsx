import React, { forwardRef, useMemo } from 'react';
import classNames from 'classnames';
import useConfig from '../hooks/useConfig';
import { TdTypographyTextProps } from './type';
import { StyledProps } from '../common';
import { getWrappedElement } from './utils';
import Copy from './Copy';

export interface TypographyParagraphProps extends TdTypographyTextProps, StyledProps {}

const TypographyParagraph = forwardRef<HTMLDivElement, TypographyParagraphProps>((props, ref) => {
  const { classPrefix } = useConfig();

  const { className, style, content, children, status, disabled, copyable } = props;

  const renderCopy = useMemo(() => {
    if (copyable === true) return <Copy text={String(content || children)} />;
    if (typeof copyable === 'object') return <Copy {...copyable} />;

    return null;
  }, [copyable, content, children]);

  return (
    <div
      ref={ref}
      className={classNames(`${classPrefix}-typography`, className, {
        [`${classPrefix}-typography--${status}`]: status,
        [`${classPrefix}-typography--disabled`]: disabled,
      })}
      style={style}
    >
      {getWrappedElement(props, content || children)}
      {renderCopy}
    </div>
  );
});

TypographyParagraph.displayName = 'TypographyParagraph';

export default TypographyParagraph;
