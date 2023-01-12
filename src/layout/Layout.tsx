import React, { useEffect, useState } from 'react';
import classNames from 'classnames';
import useConfig from '../hooks/useConfig';
import { StyledProps } from '../common';
import { TdLayoutProps, TdHeaderProps, TdFooterProps } from './type';
import Aside from './Aside';

export interface LayoutProps extends TdLayoutProps, StyledProps, React.HTMLAttributes<HTMLDivElement> {
  children?: React.ReactNode;
}
export interface HeaderProps extends TdHeaderProps, StyledProps, React.HTMLAttributes<HTMLElement> {
  children?: React.ReactNode;
}
export interface ContentProps extends StyledProps, React.HTMLAttributes<HTMLElement> {
  children?: React.ReactNode;
}
export interface FooterProps extends TdFooterProps, StyledProps, React.HTMLAttributes<HTMLElement> {
  children?: React.ReactNode;
}

const Header = (props: HeaderProps) => {
  const { classPrefix } = useConfig();
  const { className, style = {}, children, height, ...others } = props;
  const renderHeight = isNaN(Number(height)) ? height : `${height}px`;

  const headerClassNames = classNames(`${classPrefix}-layout__header`, className);
  return (
    <header
      className={headerClassNames}
      style={{
        height: renderHeight,
        ...style,
      }}
      {...others}
    >
      {children}
    </header>
  );
};

const Footer = (props: FooterProps) => {
  const { classPrefix } = useConfig();
  const { className, style = {}, children, height, ...others } = props;
  const renderHeight = isNaN(Number(height)) ? height : `${height}px`;
  const footerClassNames = classNames(`${classPrefix}-layout__footer`, className);
  return (
    <footer
      className={footerClassNames}
      style={{
        height: renderHeight,
        ...style,
      }}
      {...others}
    >
      {children}
    </footer>
  );
};

const Content = (props: ContentProps) => {
  const { classPrefix } = useConfig();
  const { className, style, children, ...others } = props;
  const contentClassNames = classNames(`${classPrefix}-layout__content`, className);
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
  const { direction, className, style, children, ...otherLayoutProps } = props;
  const [asides, setAsides] = useState([]);

  useEffect(() => {
    React.Children.forEach(children, (child: React.ReactChild) => {
      if (!child || typeof child !== 'object') return;

      if (child.type === Aside) setAsides([child]);
    });
  }, [children]);

  const { classPrefix } = useConfig();
  const layoutClassNames = classNames(
    `${classPrefix}-layout`,
    {
      [`${classPrefix}-layout--with-sider`]: !!asides.length,
      [`${classPrefix}-layout__direction-${direction}`]: direction,
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
Layout.Aside = Aside;

Header.displayName = 'Header';
Content.displayName = 'Content';
Footer.displayName = 'Footer';
Layout.displayName = 'Layout';

export default Layout;
