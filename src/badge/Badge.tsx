import React from 'react';
import classNames from 'classnames';
import { StyledProps } from '../_type';
import useConfig from '../_util/useConfig';
import { TdBadgeProps } from '../_type/components/badge';

export interface BadgeProps extends TdBadgeProps, StyledProps {}

const Badge: React.FC<BadgeProps> = ({
  color,
  dot = false,
  maxCount = 99,
  content,
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
    if (typeof content === 'number' && content > maxCount) {
      return `${maxCount}+`;
    }
    return content;
  };

  let isHidden = !content;
  if (typeof content === 'number') {
    isHidden = content < 1 && !showZero;
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
