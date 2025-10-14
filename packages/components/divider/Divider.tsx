import React, { useMemo } from 'react';
import classNames from 'classnames';
import { isFinite } from 'lodash-es';
import useConfig from '../hooks/useConfig';
import { StyledProps } from '../common';
import { TdDividerProps } from './type';
import { dividerDefaultProps } from './defaultProps';
import useDefaultProps from '../hooks/useDefaultProps';

/**
 * Divider 组件支持的属性。
 */
export interface DividerProps extends TdDividerProps, StyledProps {
  /**
   * 文本内容
   */
  children?: React.ReactNode;
}

/**
 * 分割线组件
 */
const Divider: React.FC<DividerProps> = (props) => {
  const { layout, dashed, align, className, style, children, content, size, ...otherDividerProps } = useDefaultProps(
    props,
    dividerDefaultProps,
  );

  const { classPrefix } = useConfig();
  const childrenNode = content || children;

  const showText = layout !== 'vertical' && !!childrenNode;

  const dividerClassNames = classNames(`${classPrefix}-divider`, className, {
    [`${classPrefix}-divider--${layout}`]: layout,
    [`${classPrefix}-divider--dashed`]: !!dashed,
    [`${classPrefix}-divider--with-text`]: showText,
    [`${classPrefix}-divider--with-text-${align}`]: showText,
  });

  const dividerWrapperStyle = useMemo<React.CSSProperties>(() => {
    if (layout === 'horizontal' && isFinite(size)) {
      return {
        margin: `${size}px 0`,
        ...style,
      };
    }

    return style;
  }, [layout, size, style]);

  return (
    <div {...otherDividerProps} className={dividerClassNames} style={dividerWrapperStyle}>
      {showText ? <span className={`${classPrefix}-divider__inner-text`}>{childrenNode}</span> : null}
    </div>
  );
};

Divider.displayName = 'Divider';

export default Divider;
