import React, { useState, useEffect } from 'react';
import classnames from 'classnames';
import { addClass, removeClass } from '../_util/dom';
import useConfig from '../_util/useConfig';
import { StyledProps } from '../_type';
import LoadingIcon from '../icon/icons/LoadingIcon';
import { TdLoadingProps } from '../_type/components/loading';

export interface LoadingProps extends TdLoadingProps, StyledProps {}

/**
 * Loading组件
 */
const Loading = (props: LoadingProps) => {
  const { indicator, text, loading, size, delay, fullscreen, preventScrollThrough, className, showOverlay, children } =
    props;

  const [showLoading, setShowLoading] = useState(false);

  const { classPrefix } = useConfig();
  const name = `${classPrefix}-loading`;
  const textClass = `${classPrefix}-loading-text`;
  const wrapperClass = `${classPrefix}-loading__wrapper`;
  const fullscreenClass = `${classPrefix}-loading-fullscreen`;
  const maskClass = `${classPrefix}-loading-mask`;
  const relativeClass = `${classPrefix}-loading-parent__relative`;

  const lockClass = `${classPrefix}-loading-lock`;

  const sizeMap = {
    large: `${classPrefix}-size-l`,
    small: `${classPrefix}-size-s`,
  };

  const itemClass = [
    name,
    sizeMap[size],
    className,
    // text ? textClass : null,
    // isService && (showOverlay || showOverlay === undefined) ? relativeClass : null,
  ];
  const parentClasses = [relativeClass];
  const wrapperList = [wrapperClass];
  if (text) itemClass.push(textClass);
  if (showOverlay !== false) wrapperList.push(maskClass);
  if (fullscreen) wrapperList.push(fullscreenClass);
  if (preventScrollThrough) wrapperList.push(lockClass);

  const loadingSlot = children;
  const loadingFucValue = typeof indicator === 'function' ? indicator() : '';
  const loadingContent = loadingFucValue || loadingSlot || <LoadingIcon />;
  const textDom = text ? <span>{text}</span> : '';
  const loadingDefaultDom = (
    <span className={classnames(itemClass)}>
      {loadingContent}
      {textDom}
    </span>
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
  if (showLoading) {
    if (fullscreen || showOverlay) {
      return (
        <div className={classnames(parentClasses)}>
          <div className={classnames(wrapperList)}>{loadingDefaultDom}</div>
        </div>
      );
    }
    return loadingDefaultDom;
  }
  return null;
};

export default Loading;
