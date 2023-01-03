import React, { forwardRef, useMemo } from 'react';
import classNames from 'classnames';
import useConfig from '../hooks/useConfig';
import { TdTypographyTextProps } from './type';
import { StyledProps } from '../common';
import Copy from './Copy';
import { getWrappedElement } from './utils';

export interface TypographyTextProps extends TdTypographyTextProps, StyledProps {}

const TypographyText = forwardRef<HTMLSpanElement, TypographyTextProps>((props, ref) => {
  const { classPrefix } = useConfig();

  const { className, style, content, children, status, disabled, copyable, ellipsis } = props;

  const renderCopy = useMemo(() => {
    if (copyable === true) return <Copy text={String(content || children)} />;
    if (typeof copyable === 'object') return <Copy {...copyable} />;

    return null;
  }, [copyable, content, children]);

  return (
    <span
      ref={ref}
      style={style}
      className={classNames(`${classPrefix}-typography`, className, {
        [`${classPrefix}-typography--${status}`]: status,
        [`${classPrefix}-typography--disabled`]: disabled,
        [`${classPrefix}-typography--ellipsis`]: ellipsis,
        [`${classPrefix}-typography--ellipsis-single`]: ellipsis,
      })}
    >
      {getWrappedElement(props, content || children)}
      {renderCopy}
    </span>
  );
});

TypographyText.displayName = 'TypographyText';

export default TypographyText;
