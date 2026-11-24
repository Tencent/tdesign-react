import React, { useRef, useEffect, useMemo } from 'react';
import classNames from 'classnames';
import { useScroll, useMount, useBoolean } from 'ahooks';
import smoothscroll from 'smoothscroll-polyfill';
import { isBoolean } from 'lodash-es';
import { BacktopIcon } from 'tdesign-icons-react';
import useDefaultProps from '../hooks/useDefaultProps';
import parseTNode from '../_util/parseTNode';
import withNativeProps, { NativeProps } from '../_util/withNativeProps';
import useConfig from '../hooks/useConfig';
import { TdBackTopProps } from './type';
import { backTopDefaultProps } from './defaultProps';
import { canUseDOM } from '../_util/dom';

export type ThemeList = 'round' | 'half-round' | 'round-dark' | 'half-round-dark';

export type BackTopProps = TdBackTopProps & NativeProps;

const BackTop: React.FC<BackTopProps> = (props) => {
  const { fixed, icon, target, text, theme, onToTop, visibilityHeight, container } = useDefaultProps(
    props,
    backTopDefaultProps,
  );

  const [show, { setTrue, setFalse }] = useBoolean(false);

  const backTopDom = useRef<HTMLElement>(null);

  const getBackTopDom = () => {
    if (target) return target();
    if (canUseDOM()) return window.document.documentElement;
    return null;
  };
  backTopDom.current = getBackTopDom();

  const { classPrefix } = useConfig();

  const name = `${classPrefix}-back-top`;

  const getContainer = (container: TdBackTopProps['container']) => {
    if (typeof container === 'function') {
      return container();
    }
    return document.documentElement;
  };
  const containerDom = useRef<HTMLElement>(null);
  containerDom.current = getContainer(container);

  const scroll = useScroll(typeof container === 'function' ? containerDom.current : document);

  useMount(() => {
    smoothscroll.polyfill();
  });

  const isWindow = (obj) => obj !== null && obj.window === window;

  const targetHeight = isWindow(backTopDom.current) ? 0 : backTopDom.current?.offsetTop || 0;

  const renderIcon = useMemo(() => {
    if (isBoolean(icon) && icon) {
      return <BacktopIcon className={`${name}__icon`} />;
    }

    return parseTNode(icon);
  }, [icon, name]);

  useEffect(() => {
    // 当滚动条滚动到 设置滚动高度时，显示回到顶部按钮
    if (scroll?.top >= visibilityHeight) {
      setTrue();
    } else {
      setFalse();
    }
  }, [scroll, setTrue, setFalse, visibilityHeight]);

  const onClick = () => {
    containerDom.current.scrollTo({ top: 0 + targetHeight, behavior: 'smooth' });
    onToTop?.();
  };

  return withNativeProps(
    props,
    <div
      className={classNames(`${name}`, `${name}--${theme}`, {
        [`${name}--fixed`]: fixed,
      })}
      style={{ zIndex: 99999, opacity: show ? 1 : 0 }}
      onClick={onClick}
    >
      {renderIcon}
      {text && (
        <div className={classNames(`${name}__text--${theme}`)} style={{ width: 'auto', minWidth: 12, maxWidth: 24 }}>
          {text}
        </div>
      )}
    </div>,
  );
};

BackTop.displayName = 'BackTop';

export default BackTop;
