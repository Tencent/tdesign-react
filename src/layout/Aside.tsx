import React from 'react';
import classNames from 'classnames';
import useConfig from '../hooks/useConfig';
import { TdAsideProps } from './type';
import { StyledProps } from '../common';

export interface AsideProps extends TdAsideProps, StyledProps {
  /**
   * 文本内容
   */
  children?: React.ReactNode;
}

/**
 * Aside 组件
 */
const Aside = (props: AsideProps) => {
  const { width, className, style, children, ...otherAsideProps } = props;

  const { classPrefix } = useConfig();
  const asideClassNames = classNames(`${classPrefix}-layout__sider`, className);
  const asideWidth = isNaN(Number(width)) ? width : `${width}px`;

  const asideStyle = {
    width: asideWidth,
    maxWidth: asideWidth,
    minWidth: asideWidth,
    flex: `0 0 ${asideWidth}`,
    ...style,
  };

  return (
    <aside className={asideClassNames} style={asideStyle} {...otherAsideProps}>
      {children}
    </aside>
  );
};

Aside.defaultProps = {
  width: 232,
};

Aside.displayName = 'Aside';

export default Aside;
