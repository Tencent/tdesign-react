import React, { useState, useEffect, FC, ReactElement } from 'react';
import ReactDOM from 'react-dom';
import classnames from 'classnames';
import { addClass, removeClass } from '../_util/dom';
import useConfig from '../_util/useConfig';
import { StyledProps } from '../_type';
import { LoadingMethod, TdLoadingProps } from '../_type/components/loading';
import Portal from '../common/Portal';

export interface LoadingProps extends TdLoadingProps, StyledProps {}
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
  } = props;

  const [showLoading, setShowLoading] = useState(delay ? false : loading);

  const { classPrefix } = useConfig();
  const name = `${classPrefix}-loading`;
  const textClass = `${classPrefix}-loading-text`;
  const relativeClass = `${classPrefix}-loading-parent__relative`;
  const wrapperClass = `${classPrefix}-loading__wrapper`;
  const fullscreenClass = `${classPrefix}-loading-fullscreen`;
  const maskClass = `${classPrefix}-loading-mask`;
  const defaultChildClass = `${classPrefix}-loading__gradient ${classPrefix}-loading__gradient-${size} t-icon-loading`;

  const lockClass = `${classPrefix}-loading-lock`;

  const sizeMap = {
    large: `${classPrefix}-size-l`,
    small: `${classPrefix}-size-s`,
    medium: `${classPrefix}-size-m`,
  };

  const itemClass = [name, sizeMap[size], className];
  const wrapperList = [wrapperClass];
  if (showOverlay || fullscreen) wrapperList.push(maskClass);
  if (fullscreen) wrapperList.push(fullscreenClass);
  if (preventScrollThrough) wrapperList.push(lockClass);

  const loadingFucValue = typeof indicator === 'function' ? indicator() : null;
  const loadingChild =
    indicator === true ? (
      <div className={defaultChildClass}>
        <div></div>
      </div>
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
