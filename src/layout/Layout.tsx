import React, { useEffect, useState } from 'react';
import classNames from 'classnames';
import useConfig from '../_util/useConfig';
import Sider from './Sider';
import { LayoutProps, HeaderProps as BasicProps } from './LayoutInterface';

const Header = (props: BasicProps) => {
  const { classPrefix } = useConfig();
  const { className, style, children, ...others } = props;
  const headerClassNames = classNames(`${classPrefix}-layout--header`, className);
  return (
    <header className={headerClassNames} style={style} {...others}>
      {children}
    </header>
  );
};

const Footer = (props: BasicProps) => {
  const { classPrefix } = useConfig();
  const { className, style, children, ...others } = props;
  const footerClassNames = classNames(`${classPrefix}-layout--footer`, className);
  return (
    <footer className={footerClassNames} style={style} {...others}>
      {children}
    </footer>
  );
};

const Content = (props: BasicProps) => {
  const { classPrefix } = useConfig();
  const { className, style, children, ...others } = props;
  const contentClassNames = classNames(`${classPrefix}-layout--content`, className);
  return (
    <main className={contentClassNames} style={style} {...others}>
      {children}
    </main>
  );
};

/**
 * 布局组件
 */
const Layout = (props: LayoutProps) => {
  const { hasSider, className, style, children, ...otherLayoutProps } = props;
  const [siders, setSiders] = useState([]);

  useEffect(() => {
    React.Children.forEach(children, (child: any) => {
      if (child.type === Sider) setSiders([child]);
    });
  }, [children]);

  const { classPrefix } = useConfig();
  const layoutClassNames = classNames(
    `${classPrefix}-layout`,
    {
      [`${classPrefix}-layout-has-sider`]: typeof hasSider === 'boolean' ? hasSider : !!siders.length,
    },
    className,
  );

  return (
    <div className={layoutClassNames} style={style} {...otherLayoutProps}>
      {children}
    </div>
  );
};

Layout.Header = Header;
Layout.Content = Content;
Layout.Footer = Footer;
Layout.Sider = Sider;

Header.displayName = 'Header';
Content.displayName = 'Content';
Footer.displayName = 'Footer';
Layout.displayName = 'Layout';

export default Layout;
