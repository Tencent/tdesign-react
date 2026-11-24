import React, { forwardRef, useMemo } from 'react';
import classNames from 'classnames';
import { isNumber, isString } from 'lodash-es';
import type { StyledProps } from '../common';
import type { TdBadgeProps } from './type';
import { badgeDefaultProps } from './defaultProps';
import parseTNode from '../_util/parseTNode';
import useDefaultProps from '../hooks/useDefaultProps';
import useConfig from '../hooks/useConfig';
import { usePrefixClass } from '../hooks/useClass';

export interface BadgeProps extends TdBadgeProps, StyledProps {}

const hasUnit = (value: string): boolean => /px|rpx|em|rem|%|vh|vw/.test(value);

const addUnit = (value: string | number): string => {
  const strValue = value.toString();
  return hasUnit(strValue) ? strValue : `${value}px`;
};

const Badge = forwardRef<HTMLDivElement, BadgeProps>((originProps, ref) => {
  const props = useDefaultProps(originProps, badgeDefaultProps);
  const { children, className, style, color, content, count, dot, maxCount, offset, shape, showZero, size } = props;

  const { classPrefix } = useConfig();
  const badgeClass = usePrefixClass('badge');

  const childNode = content || children;

  // 徽标自定义样式
  const badgeInnerStyles = useMemo(() => {
    const styles: React.CSSProperties = {};
    if (color) styles.backgroundColor = color;
    const [xOffset = 0, yOffset = 0]: Array<string | number> = offset || [];

    if (xOffset) {
      styles.left = `calc(100% + ${addUnit(xOffset)})`;
    }

    if (yOffset) {
      styles.top = addUnit(yOffset);
    }

    return styles;
  }, [color, offset]);

  // 是否使用外层类名
  const useOuterClass = useMemo(() => {
    const target = ['ribbon', 'ribbon-right', 'ribbon-left', 'triangle-right', 'triangle-left'];
    if (content || !target.includes(shape)) {
      return false;
    }
    return !parseTNode(childNode);
  }, [content, shape, childNode]);

  // 徽标外层样式类
  const badgeClasses = classNames(className, {
    [`${badgeClass}`]: true,
    [`${badgeClass}__${shape}-outer`]: useOuterClass,
  });

  // 徽标内层样式类
  const badgeInnerClasses = classNames({
    [`${badgeClass}--basic`]: true,
    [`${badgeClass}--dot`]: dot,
    [`${badgeClass}--${size}`]: true,
    [`${badgeClass}--${shape}`]: true,
    [`${badgeClass}--count`]: !dot && count,
    [`${classPrefix}-has-count`]: true,
  });

  // 是否展示角标
  const isShowBadge = useMemo(() => {
    if (dot) {
      return true;
    }
    if (!showZero && Number(count) === 0) {
      return false;
    }
    if (count == null) return false;
    return true;
  }, [dot, count, showZero]);

  const readerCount = useMemo(() => {
    if (dot) return null;
    if (isString(count) || isNumber(count)) {
      if (Number(count) === 0) {
        return showZero ? count : null;
      }
      return Number(count) > Number(maxCount) ? `${maxCount}+` : count;
    }
    return parseTNode(count);
  }, [dot, count, maxCount, showZero]);

  const readerContent = () => {
    if (typeof content === 'string') {
      return <span className={`${badgeClass}__content-text`}>{content}</span>;
    }
    return parseTNode(childNode);
  };

  const readerBadge = () => {
    if (!isShowBadge) return null;
    return (
      <div className={badgeInnerClasses} style={badgeInnerStyles}>
        <div className={`${badgeClass}__count`}>{readerCount}</div>
      </div>
    );
  };

  return (
    <div ref={ref} className={badgeClasses} style={style}>
      <div className={`${badgeClass}__content`}>{readerContent()}</div>
      {readerBadge()}
    </div>
  );
});

Badge.displayName = 'Badge';

export default Badge;
