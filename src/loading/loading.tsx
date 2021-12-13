import React, { useState, useEffect, FC, useMemo, CSSProperties } from 'react';
import classnames from 'classnames';

import { addClass, removeClass } from '../_util/dom';
import useConfig from '../_util/useConfig';
import { StyledProps } from '../common';
import { TdLoadingProps } from './type';
import Portal from '../common/Portal';
import Gradient from './gradient';

export interface LoadingProps extends TdLoadingProps, StyledProps {}

const Loading: FC<LoadingProps> = (props) => {
  const {
    attach,
    indicator = true,
    text,
    loading = true,
    size = 'medium',
    delay,
    fullscreen,
    preventScrollThrough = true,
    showOverlay = true,
    content,
    children = content,
    inheritColor = false,
    zIndex,
    className,
  } = props;

  const [showLoading, setShowLoading] = useState(delay ? false : loading);

  const { classPrefix } = useConfig();

  const name = `${classPrefix}-loading`;
  const centerClass = `${classPrefix}-loading--center`;
  const inheritColorClass = `${classPrefix}-loading--inherit-color`;
  const fullClass = `${classPrefix}-loading--full`;
  const fullscreenClass = `${classPrefix}-loading__fullscreen`;
  const lockClass = `${classPrefix}-loading-lock`;
  const overlayClass = `${classPrefix}-loading__overlay`;
  const relativeClass = `${classPrefix}-loading__parent`;
  const textClass = `${classPrefix}-loading__text`;

  useEffect(() => {
    let timer: NodeJS.Timeout;

    if (delay && loading) {
      timer = setTimeout(() => {
        setShowLoading(loading);
      }, delay);
    } else {
      setShowLoading(loading);
    }
    return () => {
      clearTimeout(timer);
    };
  }, [delay, loading]);

  const calcStyles = useMemo(() => {
    const styles: CSSProperties = {};

    if (zIndex !== undefined) {
      styles.zIndex = zIndex;
    }

    if (!['small', 'medium', 'large'].includes(size)) {
      styles['font-size'] = size;
    }

    return styles;
  }, [size, zIndex]);

  const sizeMap = {
    large: `${classPrefix}-size-l`,
    small: `${classPrefix}-size-s`,
    medium: `${classPrefix}-size-m`,
  };

  const baseClasses = classnames(centerClass, sizeMap[size], {
    [inheritColorClass]: inheritColor,
    className,
  });

  if (preventScrollThrough && fullscreen) {
    if (loading) {
      addClass(document.body, lockClass);
    } else {
      removeClass(document.body, lockClass);
    }
  }

  const commonContent = () => {
    let renderIndicator = <Gradient />;

    if (indicator && typeof indicator !== 'boolean') {
      renderIndicator = indicator as JSX.Element;
    }
    return (
      <>
        {indicator ? renderIndicator : null}
        <div className={textClass}>{text}</div>
      </>
    );
  };

  if (fullscreen) {
    return loading ? (
      <div className={classnames(name, fullscreenClass, centerClass, overlayClass)} style={calcStyles}>
        <div className={baseClasses}>{commonContent()}</div>
      </div>
    ) : null;
  }

  if (children) {
    return (
      <div className={relativeClass}>
        {children}
        {showLoading ? (
          <div
            className={classnames(name, baseClasses, fullClass, {
              [overlayClass]: showOverlay,
            })}
            style={calcStyles}
          >
            {commonContent()}
          </div>
        ) : null}
      </div>
    );
  }
  if (attach) {
    return (
      <Portal getContainer={attach}>
        <div className={classnames(name, baseClasses, fullClass, { [overlayClass]: showOverlay })} style={calcStyles}>
          {commonContent()}
        </div>
      </Portal>
    );
  }

  return (
    <div className={classnames(name, baseClasses)} style={calcStyles}>
      {commonContent()}
    </div>
  );
};

export default Loading;
