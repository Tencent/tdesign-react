import React, { useMemo } from 'react';
import classNames from 'classnames';
import useConfig from '../hooks/useConfig';
import { StyledProps } from '../common';
import { TdLayoutProps, TdHeaderProps, TdFooterProps } from './type';
import Aside from './Aside';
import parseTNode from '../_util/parseTNode';

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

const Header: React.FC<HeaderProps> = (props) => {
  const { classPrefix } = useConfig();
  const { className, style = {}, children, height, ...others } = props;
  const renderHeight = isNaN(Number(height)) ? height : `${height}px`;
  const headerClassNames = classNames(`${classPrefix}-layout__header`, className);
  return (
    <header className={headerClassNames} style={{ height: renderHeight, ...style }} {...others}>
      {parseTNode(children)}
    </header>
  );
};

const Footer: React.FC<FooterProps> = (props) => {
  const { classPrefix } = useConfig();
  const { className, style = {}, children, height, ...others } = props;
  const renderHeight = isNaN(Number(height)) ? height : `${height}px`;
  const footerClassNames = classNames(`${classPrefix}-layout__footer`, className);
  return (
    <footer className={footerClassNames} style={{ height: renderHeight, ...style }} {...others}>
      {parseTNode(children)}
    </footer>
  );
};

const Content: React.FC<ContentProps> = (props) => {
  const { classPrefix } = useConfig();
  const { className, style, children, content, ...others } = props;
  const contentClassNames = classNames(`${classPrefix}-layout__content`, className);
  return (
    <main className={contentClassNames} style={style} {...others}>
      {parseTNode(content) || parseTNode(children)}
    </main>
  );
};

/**
 * 布局组件
 */
const Layout: React.FC<LayoutProps> & {
  Header: typeof Header;
  Content: typeof Content;
  Footer: typeof Footer;
  Aside: typeof Aside;
} = (props) => {
  const { direction, className, style, children, ...otherLayoutProps } = props;

  const shouldAsides = useMemo(() => {
    const asides: React.ReactElement[] = [];
    React.Children.forEach(children, (child: React.ReactElement) => {
      if (!child || typeof child !== 'object') {
        return;
      }
      if (child.type === Aside) {
        asides.push(child);
      }
    });
    return !!asides.length;
  }, [children]);

  const { classPrefix } = useConfig();
  const layoutClassNames = classNames(
    `${classPrefix}-layout`,
    {
      [`${classPrefix}-layout--with-sider`]: shouldAsides,
      [`${classPrefix}-layout__direction-${direction}`]: direction,
    },
    className,
  );

  return (
    <div className={layoutClassNames} style={style} {...otherLayoutProps}>
      {parseTNode(children)}
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
