import React from 'react';
import classNames from 'classnames';
import { StyledProps } from '../common';
import useConfig from '../_util/useConfig';
import { TdBadgeProps } from './type';

export interface BadgeProps extends TdBadgeProps, StyledProps {}

const Badge: React.FC<BadgeProps> = ({
  color,
  dot = false,
  maxCount = 99,
  count,
  size = 'medium',
  shape = 'circle',
  showZero = false,
  offset = [],
  className,
  children = null,
  style = {},
  ...restProps
}) => {
  const { classPrefix } = useConfig();

  const badgeClassName = classNames(
    !children && `${classPrefix}-badge-static`,
    dot ? `${classPrefix}-badge--dot` : shape && `${classPrefix}-badge--${shape}`,
    size === 'small' && `${classPrefix}-size-s`,
    !children && className,
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
    if (color) mergedStyle.backgroundColor = color;
    if (offset) {
      if (offset[0]) {
        mergedStyle.right = -offset[0];
      }
      if (offset[1]) {
        mergedStyle.marginTop = -offset[1];
      }
    }
    return mergedStyle;
  };

  const badge = !isHidden ? (
    <span {...(children ? {} : restProps)} className={badgeClassName} style={getStyle()}>
      {!dot ? getDisplayCount() : null}
    </span>
  ) : null;

  if (!children) return badge;

  return (
    <span {...restProps} className={classNames(`${classPrefix}-badge`, className)}>
      {children}
      {badge}
    </span>
  );
};

Badge.displayName = 'Badge';

export default Badge;
