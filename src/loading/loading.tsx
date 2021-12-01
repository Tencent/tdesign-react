import React, { useState, useEffect, FC, ReactElement, useRef } from 'react';
import ReactDOM from 'react-dom';
import classnames from 'classnames';
import { addClass, removeClass } from '../_util/dom';
import useConfig from '../_util/useConfig';
import { StyledProps } from '../common';
import { LoadingMethod, TdLoadingProps } from './type';
import Portal from '../common/Portal';

export interface LoadingProps extends TdLoadingProps, StyledProps {
  // 是否继承颜色, 用于改变loading的颜色，跟随当前节点，暂时内部组件使用
  inheritColor?: boolean;
}
/**
 * Loading组件
 */
const Loading: FC<LoadingProps> = (props) => {
  const {
    attach,
    indicator = true,
    text,
    loading,
    size = 'medium',
    delay,
    fullscreen,
    preventScrollThrough,
    className,
    showOverlay,
    content,
    children = content,
    zIndex,
    inheritColor,
  } = props;

  const [showLoading, setShowLoading] = useState(delay ? false : loading);
  const [styleFromEnv, setStyleFromEnv] = useState({});
  const conicRef = useRef();

  useEffect(() => {
    if (indicator === true) {
      const el = conicRef?.current;
      let basicStyle = {};

      if (el) {
        const { fontSize, color } = getComputedStyle(el);
        // to fix the browser compat of foreignObject in Safari,
        // https://bugs.webkit.org/show_bug.cgi?id=23113
        const ua = window?.navigator?.userAgent;
        const isSafari = /Safari/.test(ua) && !/Chrome/.test(ua);
        if (isSafari) {
          basicStyle = {
            transformOrigin: '-1px -1px',
            transform: `scale(${parseInt(fontSize, 10) / 14})`,
          };
        }
        if (color) {
          const matched = color.match(/[\d.]+/g);
          const endColor = `rgba(${matched[0]}, ${matched[1]}, ${matched[2]}, 0)`;
          setStyleFromEnv({
            ...basicStyle,
            background: `conic-gradient(from 90deg at 50% 50%,${endColor} 0deg, ${color} 360deg)`,
          });
        } else {
          setStyleFromEnv({
            ...basicStyle,
            background: '',
          });
        }
      }
    }
  }, [indicator]);

  const { classPrefix } = useConfig();
  const name = `${classPrefix}-loading`;
  const textClass = `${classPrefix}-loading-text`;
  const relativeClass = `${classPrefix}-loading-parent__relative`;
  const wrapperClass = `${classPrefix}-loading__wrapper`;
  const inheritClass = `${classPrefix}-loading--inherit-color`;
  const fullscreenClass = `${classPrefix}-loading-fullscreen`;
  const maskClass = `${classPrefix}-loading-mask`;
  const gradientClass = `${classPrefix}-loading__gradient`;
  const defaultChildClass = classnames(gradientClass, `${classPrefix}-icon-loading`);

  const lockClass = `${classPrefix}-loading-lock`;

  const sizeMap = {
    large: `${classPrefix}-size-l`,
    small: `${classPrefix}-size-s`,
    medium: `${classPrefix}-size-m`,
  };

  const itemClass = classnames(name, sizeMap[size], className, {
    [inheritClass]: inheritColor,
  });
  const wrapperList = [wrapperClass];
  if (showOverlay || fullscreen) wrapperList.push(maskClass);
  if (fullscreen) wrapperList.push(fullscreenClass);
  if (preventScrollThrough) wrapperList.push(lockClass);

  const loadingFucValue = typeof indicator === 'function' ? indicator() : null;
  const loadingChild =
    indicator === true ? (
      <svg
        className={defaultChildClass}
        viewBox="0 0 14 14"
        version="1.1"
        width="1em"
        height="1em"
        xmlns="http://www.w3.org/2000/svg"
      >
        <foreignObject x="1" y="1" width="12" height="12">
          <div className={`${gradientClass}-conic`} style={styleFromEnv} ref={conicRef} />
        </foreignObject>
      </svg>
    ) : null;

  const loadingContent = children;
  const textDom = text ? <div className={textClass}>{text}</div> : '';
  const loadingDefaultDom = (
    <>
      {loadingFucValue || loadingChild}
      {textDom}
    </>
  );

  if (preventScrollThrough && fullscreen) {
    if (loading) {
      addClass(document.body, lockClass);
    } else {
      removeClass(document.body, lockClass);
    }
  }

  useEffect(() => {
    if (delay && loading) {
      setTimeout(() => {
        setShowLoading(loading);
      }, delay);
    } else {
      setShowLoading(loading);
    }
  }, [delay, loading]);

  let dom: ReactElement = null;

  if (showLoading) {
    if (fullscreen || showOverlay) {
      dom = (
        <div className={relativeClass}>
          {loadingContent}
          <div className={classnames(wrapperList, itemClass)} style={{ zIndex }}>
            {loadingDefaultDom}
          </div>
        </div>
      );
    } else {
      dom = (
        <div className={classnames(itemClass)}>
          {loadingDefaultDom}
          {loadingContent}
        </div>
      );
    }
  } else if (loadingContent) {
    dom = <div className={relativeClass}>{loadingContent} </div>;
  }

  if (attach) {
    return <Portal getContainer={attach}>{dom}</Portal>;
  }

  return dom;
};

const createContainer = (attach?: TdLoadingProps['attach']) => {
  if (typeof attach === 'string') return document.querySelector(attach);
  if (typeof attach === 'function') return attach();
  return document.body;
};

export const loading: LoadingMethod = (options) => {
  if (options === false) return { hide: () => null };

  const props = typeof options === 'boolean' ? {} : options;
  const { attach } = props;
  const container = createContainer(attach);
  const div = document.createElement('div');
  div.setAttribute('style', 'width: 100%; height: 100%; position: absolute; top: 0;');

  const defaultProps = {
    loading: true,
    attach: null,
    fullscreen: !attach,
    showOverlay: !!attach,
  };

  ReactDOM.render(<Loading {...defaultProps} {...props} attach={null}></Loading>, div);

  container.appendChild(div);

  return {
    hide: () => {
      ReactDOM.unmountComponentAtNode(div);
      div.remove();
    },
  };
};

export default Loading;
