import React, { useMemo } from 'react';
import type { CSSProperties } from 'react';
import { ChevronLeftIcon } from 'tdesign-icons-react';
import classNames from 'classnames';
import { usePrefixClass } from '../hooks/useClass';
import { StyledProps } from '../common';
import { TdNavbarProps } from './type';
import { navbarDefaultProps } from './defaultProps';
import parseTNode from '../_util/parseTNode';
import useDefaultProps from '../hooks/useDefaultProps';

export interface NavbarProps extends TdNavbarProps, StyledProps {
  children?: React.ReactNode;
}

const Navbar: React.FC<NavbarProps> = (originProps) => {
  const props = useDefaultProps(originProps, navbarDefaultProps);
  const {
    visible,
    title,
    children,
    titleMaxLength,
    leftArrow,
    left,
    capsule,
    right,
    fixed,
    animation,
    placeholder,
    zIndex,
    className,
    safeAreaInsetTop,
    style,
    onLeftClick,
    onRightClick,
  } = props;
  const prefixClass = usePrefixClass();
  const navbarClass = usePrefixClass('navbar');
  const animationSuffix = useMemo(() => (animation ? '-animation' : ''), [animation]);

  // 左侧胶囊区域
  const renderCapsule = () => {
    const capsuleContent = parseTNode(capsule);
    if (!capsuleContent) {
      return null;
    }
    return <div className={`${navbarClass}__capsule`}>{capsuleContent}</div>;
  };

  const titleChildren = useMemo(() => {
    let titleNode = children || title;
    const isStringTitle = typeof titleNode === 'string';

    if (isStringTitle && !isNaN(titleMaxLength)) {
      if (titleMaxLength <= 0) {
        console.warn('titleMaxLength must be greater than 0');
      } else if ((titleNode as string).length > titleMaxLength) {
        titleNode = `${(titleNode as string).slice(0, titleMaxLength)}...`;
      }
    }

    return isStringTitle ? (
      <span className={`${navbarClass}__center-title`}>{parseTNode(titleNode)}</span>
    ) : (
      parseTNode(titleNode)
    );
  }, [children, navbarClass, title, titleMaxLength]);

  // 右侧icon
  const renderRight = () =>
    right ? (
      <div className={`${navbarClass}__right`} onClick={onRightClick}>
        {parseTNode(right)}
      </div>
    ) : null;

  const navClass = useMemo<string>(
    () =>
      classNames(
        navbarClass,
        { [`${navbarClass}--fixed`]: fixed },
        visible ? `${navbarClass}--visible${animationSuffix}` : `${navbarClass}--hide${animationSuffix}`,
      ),
    [navbarClass, fixed, visible, animationSuffix],
  );

  // 顶部安全区适配需同时作用于固定导航条与占位元素，保证两者高度一致。避免固定定位的 __content 不继承根元素 padding 而导致占位多预留、露出底部空白
  const safeAreaTopClass = useMemo<string>(
    () => (safeAreaInsetTop ? `${prefixClass}-safe-area-top` : ''),
    [prefixClass, safeAreaInsetTop],
  );

  const navStyle = useMemo<CSSProperties>(
    () => ({
      zIndex,
      ...style,
    }),
    [zIndex, style],
  );

  const renderLeftArrow = () => {
    if (leftArrow) {
      return <ChevronLeftIcon className={`${navbarClass}__left-arrow`} />;
    }
    return null;
  };

  const renderLeft = () => (
    <div className={`${navbarClass}__left`} onClick={onLeftClick}>
      {renderLeftArrow()}
      {parseTNode(left)}
      {renderCapsule()}
    </div>
  );

  const renderCenter = () => <div className={`${navbarClass}__center`}>{titleChildren}</div>;

  const renderPlaceholder = () => {
    if (fixed && placeholder) {
      return <div className={classNames(`${navbarClass}__placeholder`, safeAreaTopClass)}></div>;
    }
    return null;
  };

  return (
    <div className={classNames(navClass, className)} style={navStyle}>
      {renderPlaceholder()}
      <div className={classNames(`${navbarClass}__content`, safeAreaTopClass)}>
        {renderLeft()}
        {renderCenter()}
        {renderRight()}
      </div>
    </div>
  );
};

Navbar.displayName = 'Navbar';

export default Navbar;
