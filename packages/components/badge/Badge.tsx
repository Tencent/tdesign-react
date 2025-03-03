import React, { forwardRef } from 'react';
import classNames from 'classnames';
import { StyledProps } from '../common';
import useConfig from '../hooks/useConfig';
import { TdBadgeProps } from './type';
import { badgeDefaultProps } from './defaultProps';
import useDefaultProps from '../hooks/useDefaultProps';

export interface BadgeProps extends TdBadgeProps, StyledProps {}

const Badge = forwardRef<HTMLSpanElement, BadgeProps>((props, ref) => {
  const {
    color,
    dot,
    maxCount,
    count,
    size,
    shape,
    showZero,
    offset,
    className,
    content,
    children,
    style,
    ...restProps
  } = useDefaultProps<BadgeProps>(props, badgeDefaultProps);
  const { classPrefix } = useConfig();

  const childNode = content || children;

  const badgeClassName = classNames(
    !childNode && `${classPrefix}-badge--static`,
    dot ? `${classPrefix}-badge--dot` : `${classPrefix}-badge--${shape}`,
    size === 'small' && `${classPrefix}-size-s`,
    !childNode && className,
  );
  const getDisplayCount = () => {
    if (typeof count === 'number' && count > maxCount) {
      return `${maxCount}+`;
    }
    return count;
  };

  let isHidden = !count;
  if (typeof count === 'number') {
    isHidden = count < 1 && !showZero;
  }

  const getStyle = () => {
    const mergedStyle: React.CSSProperties = { ...style };
    if (color) {
      mergedStyle.backgroundColor = color;
    }
    if (offset) {
      if (offset[0]) {
        mergedStyle.right = +offset[0];
      }
      if (offset[1]) {
        mergedStyle.marginTop = +offset[1];
      }
    }
    return mergedStyle;
  };

  const badge = !isHidden ? (
    <span {...(childNode ? {} : restProps)} className={badgeClassName} style={getStyle()}>
      {!dot ? getDisplayCount() : null}
    </span>
  ) : null;

  if (!childNode) {
    return badge;
  }

  return (
    <span {...restProps} className={classNames(`${classPrefix}-badge`, className)} ref={ref}>
      {childNode}
      {badge}
    </span>
  );
});

Badge.displayName = 'Badge';

export default Badge;
