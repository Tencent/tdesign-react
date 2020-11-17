import React from 'react';
import classNames from 'classnames';
import useConfig from '../_util/useConfig';
import { SiderProps } from './LayoutInterface';

/**
 * Sider 组件
 */
const Sider = (props: SiderProps) => {
  const { width, className, style, children, ...otherSiderProps } = props;

  const { classPrefix } = useConfig();
  const siderClassNames = classNames(`${classPrefix}-layout--sider`, className);
  const siderWidth = typeof width === 'number' ? `${width}px` : String(width);

  const siderStyle = {
    width: siderWidth,
    maxWidth: siderWidth,
    minWidth: siderWidth,
    flex: `0 0 ${siderWidth}`,
    ...style,
  };

  return (
    <aside className={siderClassNames} style={siderStyle} {...otherSiderProps}>
      {children}
    </aside>
  );
};

Sider.defaultProps = {
  width: 232,
};

Sider.displayName = 'Sider';

export default Sider;
