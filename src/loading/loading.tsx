import React, { useState, useEffect } from 'react';
import classnames from 'classnames';
import { addClass, removeClass } from '../_util/dom';
import useConfig from '../_util/useConfig';
import { StyledProps } from '../_type';
import { Icon } from '../icon/Icon';

enum SIZE {
  LARGE = 'large',
  MIDDLE = 'middle',
  SMALL = 'small',
}
export interface LoadingProps extends StyledProps {
  /**
   * 加载指示符（支持function、slot、reactNode。不支持string）
   *
   *  @default 圆圈图标
   */
  indicator?: Function | string;
  /**
   * 当作为包裹元素时，自定义的加载提示文案
   */
  text?: string;
  /**
   * 是否为加载中状态
   *
   *  @default true
   */
  loading: boolean;
  /**
   * 加载组件大小，包括图标和文字。可选值为 large | middle | small
   *
   *  @default 'middle'
   */
  size?: SIZE;
  /**
   * 延迟显示加载效果的时间（防止闪烁）  毫秒
   *
   */
  delay?: number;
  /**
   * 是否全屏遮罩，遮罩会插入至 body 上
   *
   *  @default false
   */
  fullscreen?: boolean;
  /**
   * 是否需要锁定屏幕的滚动
   *
   *  @default false
   */
  preventScrollThrough?: boolean;
  /**
   * 包裹器的自定义类名
   */
  className?: string;
  /**
   * 是否需要遮罩层
   *
   *  @default true
   */
  showOverlay?: boolean;
  children?: HTMLSpanElement[];
}

/**
 * Loading组件
 */
const Loading = (props: LoadingProps) => {
  const {
    indicator,
    text,
    loading,
    size,
    delay,
    fullscreen,
    preventScrollThrough,
    className,
    showOverlay,
    children,
  } = props;

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
  const loadingContent = loadingFucValue || loadingSlot || <Icon name="loading"></Icon>;
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
