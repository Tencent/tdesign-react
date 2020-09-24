import React from 'react';
import classNames from 'classnames';
import useConfig from '../_util/useConfig';
import { StyledProps } from '../_type';

/**
 * Divider 组件支持的属性。
 */
export interface DividerProps extends StyledProps {
  /**
   * 水平还是垂直类型
   *
   *  @default 'horizontal'
   */
  type?: string;

  /**
   * 是否虚线，仅在水平分割线有效
   *
   * @default false
   */
  dashed?: boolean;

  /**
   * 文本位置，左、中、右，可选值为 left / right / center（默认），仅在水平分割线有效
   *
   * @default center
   * */

  orientation?: 'left' | 'center' | 'right';

  /**
   * 文本内容
   */
  children?: React.ReactNode;
}

/**
 * 分割线组件
 */
const Divider = (props: DividerProps) => {
  const {
    type = 'horizontal',
    dashed,
    orientation = 'center',
    className,
    style,
    children,
    ...otherDividerProps
  } = props;

  const { classPrefix } = useConfig();
  const dividerClassNames = classNames(`${classPrefix}-divider`, className, {
    [`${classPrefix}-divider--horizontal`]: type === 'horizontal',
    [`${classPrefix}-divider--vertical`]: type === 'vertical',
    [`${classPrefix}-divider--dashed`]: !!dashed,
    [`${classPrefix}-divider--with-text`]: !!children,
    [`${classPrefix}-divider--with-text-${orientation}`]: !!children,
  });

  return (
    <div className={dividerClassNames} style={style} {...otherDividerProps}>
      {!!children ? <span className={`${classPrefix}-divider-inner-text`}>{children}</span> : null}
    </div>
  );
};

Divider.displayName = 'Divider';

export default Divider;
