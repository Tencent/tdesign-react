import React, { useEffect, useState } from 'react';
import classNames from 'classnames';
import useConfig from '../_util/useConfig';
import { StyledProps } from '../common';
import { TdHeaderProps, TdFooterProps } from './type';
import Sider from './Sider';

export interface LayoutProps extends StyledProps {
  children?: React.ReactNode;
}
export interface HeaderProps extends TdHeaderProps, StyledProps {
  children?: React.ReactNode;
}
export interface ContentProps extends StyledProps {
  children?: React.ReactNode;
}
export interface FooterProps extends TdFooterProps, StyledProps {
  children?: React.ReactNode;
}

const Header = (props: HeaderProps) => {
  const { classPrefix } = useConfig();
  const { className, style, children, ...others } = props;
  const headerClassNames = classNames(`${classPrefix}-layout--header`, className);
  return (
    <header className={headerClassNames} style={style} {...others}>
      {children}
    </header>
  );
};

const Footer = (props: FooterProps) => {
  const { classPrefix } = useConfig();
  const { className, style, children, ...others } = props;
  const footerClassNames = classNames(`${classPrefix}-layout--footer`, className);
  return (
    <footer className={footerClassNames} style={style} {...others}>
      {children}
    </footer>
  );
};

const Content = (props: ContentProps) => {
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
  const { className, style, children, ...otherLayoutProps } = props;
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
      [`${classPrefix}-layout-has-sider`]: !!siders.length,
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
