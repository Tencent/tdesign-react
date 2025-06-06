import React, { useState, useEffect, useMemo, CSSProperties } from 'react';
import classnames from 'classnames';
import { canUseDocument } from '../_util/dom';
import useConfig from '../hooks/useConfig';
import { StyledProps } from '../common';
import { TdLoadingProps } from './type';
import Portal from '../common/Portal';
import Gradient from './gradient';
import { loadingDefaultProps } from './defaultProps';
import useDefaultProps from '../hooks/useDefaultProps';
import { addClass, removeClass } from '../_util/style';

export interface LoadingProps extends TdLoadingProps, StyledProps {}

const Loading: React.FC<LoadingProps> = (props) => {
  const {
    attach,
    indicator,
    text,
    loading,
    size,
    delay,
    fullscreen,
    preventScrollThrough,
    showOverlay,
    content,
    children,
    inheritColor,
    zIndex,
    className,
    style,
  } = useDefaultProps<LoadingProps>(props, loadingDefaultProps);

  const [showLoading, setShowLoading] = useState(() => (delay ? false : loading));

  const { classPrefix } = useConfig();

  const name = `${classPrefix}-loading`;
  const centerClass = `${classPrefix}-loading--center`;
  const inheritColorClass = `${classPrefix}-loading--inherit-color`;
  const fullClass = `${classPrefix}-loading--full`;
  const fullscreenClass = `${classPrefix}-loading__fullscreen`;
  const lockClass = `${classPrefix}-loading--lock`;
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

  const calcStyles = useMemo<React.CSSProperties>(() => {
    const styles: CSSProperties = {};

    if (zIndex !== undefined) {
      styles.zIndex = zIndex;
    }

    if (!['small', 'medium', 'large'].includes(size)) {
      styles.fontSize = size;
    }

    return styles;
  }, [size, zIndex]);

  const sizeMap = {
    large: `${classPrefix}-size-l`,
    small: `${classPrefix}-size-s`,
    medium: `${classPrefix}-size-m`,
  };

  const baseClasses = classnames(
    centerClass,
    sizeMap[size],
    {
      [inheritColorClass]: inheritColor,
    },
    className,
  );

  useEffect(() => {
    if (preventScrollThrough && fullscreen && canUseDocument && loading) {
      addClass(document.body, lockClass);
    }
    return () => {
      removeClass(document.body, lockClass);
    };
  }, [loading, preventScrollThrough, fullscreen, lockClass]);

  const commonContent = () => {
    let renderIndicator = <Gradient />;

    if (indicator && typeof indicator !== 'boolean') {
      renderIndicator = indicator as React.ReactElement;
    }
    return (
      <>
        {indicator ? renderIndicator : null}
        {text ? <div className={textClass}>{text}</div> : null}
      </>
    );
  };

  if (fullscreen) {
    return loading ? (
      <div className={classnames(name, fullscreenClass, centerClass, overlayClass)} style={{ ...calcStyles, ...style }}>
        <div className={baseClasses}>{commonContent()}</div>
      </div>
    ) : null;
  }

  if (content || children) {
    return (
      <div className={relativeClass} style={style}>
        {content || children}
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
      <Portal attach={attach}>
        {loading ? (
          <div
            className={classnames(name, baseClasses, fullClass, { [overlayClass]: showOverlay })}
            style={{ ...calcStyles, ...style }}
          >
            {commonContent()}
          </div>
        ) : null}
      </Portal>
    );
  }

  return loading ? (
    <div className={classnames(name, baseClasses)} style={{ ...calcStyles, ...style }}>
      {commonContent()}
    </div>
  ) : null;
};

Loading.displayName = 'Loading';

export default Loading;
