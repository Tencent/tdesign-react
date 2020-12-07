import React from 'react';
import classNames from 'classnames';
import { StyledProps } from '../_type';
import useConfig from '../_util/useConfig';

export interface BadgeProps extends StyledProps {
  /**
   * 自定义颜色
   */
  color?: string;
  /**
   * 展示的数字
   */
  count?: number;
  /**
   * 是否为红点
   * @default false
   */
  dot?: boolean;
  /**
   * 封顶数字值
   * @default 99
   */
  maxCount?: number;
  /**
   * 自定义文字，优先于 count
   */
  content?: React.ReactNode;
  /**
   * 尺寸
   * @default medium
   */
  size?: 'medium' | 'small';
  /**
   * 形状
   * @default circle
   */
  shape?: 'circle' | 'round';
  /**
   * 数值为 0 时是否展示
   * @default false
   */
  showZero?: boolean;
  /**
   * 设置状态点的位置偏移，格式 [x, y]
   */
  offset?: [number, number];
}

const Badge: React.FC<BadgeProps> = ({
  color,
  count = null,
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
  const getDisplayCount = () => ((count as number) > maxCount ? `${maxCount}+` : count);

  const isHidden = !content && (typeof count !== 'number' || (count < 1 && !showZero));

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
      {!dot ? content || getDisplayCount() : null}
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
