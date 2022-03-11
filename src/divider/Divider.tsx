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
  const {
    layout = 'horizontal',
    dashed,
    align = 'center',
    className,
    style,
    children,
    content,
    ...otherDividerProps
  } = props;

  const { classPrefix } = useConfig();
  const hasChildren = typeof children !== 'undefined';
  const hasContent = typeof content !== 'undefined';
  let childrenNode = children;

  if (!hasChildren && hasContent) {
    childrenNode = content;
  }
  const dividerClassNames = classNames(`${classPrefix}-divider`, className, {
    [`${classPrefix}-divider--horizontal`]: layout === 'horizontal',
    [`${classPrefix}-divider--vertical`]: layout === 'vertical',
    [`${classPrefix}-divider--dashed`]: !!dashed,
    [`${classPrefix}-divider--with-text`]: !!childrenNode,
    [`${classPrefix}-divider--with-text-${align}`]: !!childrenNode,
  });

  return (
    <div {...otherDividerProps} className={dividerClassNames} style={style}>
      {childrenNode ? <span className={`${classPrefix}-divider__inner-text`}>{childrenNode}</span> : null}
    </div>
  );
};

Divider.displayName = 'Divider';

export default Divider;
