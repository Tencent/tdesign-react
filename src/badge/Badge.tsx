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
  count = 0,
  size = 'medium',
  shape = 'circle',
  showZero = false,
  offset = [],
  className,
  content = null,
  children = null,
  style = {},
  ...restProps
}) => {
  const { classPrefix } = useConfig();

  const childNode = children || content;

  const badgeClassName = classNames(
    !childNode && `${classPrefix}-badge--static`,
    dot ? `${classPrefix}-badge--dot` : shape && `${classPrefix}-badge--${shape}`,
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
    if (color) mergedStyle.backgroundColor = color;
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

  if (!childNode) return badge;

  return (
    <span {...restProps} className={classNames(`${classPrefix}-badge`, className)}>
      {childNode}
      {badge}
    </span>
  );
};

Badge.displayName = 'Badge';

export default Badge;
