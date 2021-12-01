import React from 'react';
import classNames from 'classnames';
import useConfig from '../_util/useConfig';
import { StyledProps } from '../common';
import { TdDividerProps } from './type';

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
const Divider = (props: DividerProps) => {
  const { theme = 'horizontal', dashed, align = 'center', className, style, children, ...otherDividerProps } = props;

  const { classPrefix } = useConfig();
  const dividerClassNames = classNames(`${classPrefix}-divider`, className, {
    [`${classPrefix}-divider--horizontal`]: theme === 'horizontal',
    [`${classPrefix}-divider--vertical`]: theme === 'vertical',
    [`${classPrefix}-divider--dashed`]: !!dashed,
    [`${classPrefix}-divider--with-text`]: !!children,
    [`${classPrefix}-divider--with-text-${align}`]: !!children,
  });

  return (
    <div className={dividerClassNames} style={style} {...otherDividerProps}>
      {children ? <span className={`${classPrefix}-divider-inner-text`}>{children}</span> : null}
    </div>
  );
};

Divider.displayName = 'Divider';

export default Divider;
