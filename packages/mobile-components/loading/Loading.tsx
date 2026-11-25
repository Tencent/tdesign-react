import React, { useEffect, useMemo, useRef, useState } from 'react';
import classNames from 'classnames';

import { canUseDOM } from '../_util/dom';
import parseTNode from '../_util/parseTNode';
import Portal from '../common/Portal';
import { usePrefixClass } from '../hooks/useClass';
import useDefaultProps from '../hooks/useDefaultProps';
import { useLockScroll } from '../hooks/useLockScroll';
import { loadingDefaultProps } from './defaultProps';
import Gradient from './icon/Gradient';
import Spinner from './icon/Spinner';

import type { StyledProps } from '../common';
import type { TdLoadingProps } from './type';

export interface LoadingProps extends TdLoadingProps, StyledProps {}

const Loading: React.FC<LoadingProps> = (props) => {
  const {
    className,
    style,
    attach,
    content,
    children,
    delay,
    duration,
    fullscreen,
    indicator,
    inheritColor,
    layout,
    loading,
    pause,
    preventScrollThrough,
    reverse,
    size,
    text,
    theme,
  } = useDefaultProps<LoadingProps>(props, loadingDefaultProps);

  const loadingClass = usePrefixClass('loading');
  const loadingRef = useRef<HTMLDivElement>(null);

  const childNode = content || children;

  const centerClass = `${loadingClass}--center`;
  const fullClass = `${loadingClass}--full`;
  const relativeClass = `${loadingClass}__parent`;

  useLockScroll(loadingRef, canUseDOM() && loading && fullscreen && preventScrollThrough, loadingClass);

  // 当延时加载delay有值时，值会发生变化
  const [reloading, setReloading] = useState(!delay && loading);

  useEffect(() => {
    let timer: NodeJS.Timeout | null = null;
    if (delay && loading) {
      timer = setTimeout(() => {
        setReloading(loading);
      }, delay);
    } else {
      setReloading(loading);
    }
    return () => {
      if (timer) {
        clearTimeout(timer);
      }
    };
  }, [delay, loading]);

  const baseClasses = classNames(loadingClass, centerClass, {
    [`${loadingClass}--vertical`]: layout === 'vertical',
    [`${loadingClass}--fullscreen`]: fullscreen,
    [`${loadingClass}--full`]: !fullscreen && (!!attach || childNode),
  });

  const rootStyle = useMemo<React.CSSProperties>(
    () => ({
      color: inheritColor ? 'inherit' : undefined,
      fontSize: size,
    }),
    [inheritColor, size],
  );

  const textClass = classNames(`${loadingClass}__text`, {
    [`${loadingClass}__text--only`]: !indicator,
  });

  const dostLoading = () => (
    <div
      className={`${loadingClass}__dots`}
      style={{
        animationPlayState: pause ? 'paused' : '',
        animationDirection: reverse ? 'reverse' : '',
        animationDuration: `${duration}ms`,
        width: size,
        height: size,
      }}
    >
      {Array.from({ length: 3 }).map((val, i) => (
        <div
          key={i}
          className={`${loadingClass}__dot`}
          style={{
            animationDuration: `${duration / 1000}s`,
            animationDelay: `${(duration * i) / 3000}s`,
          }}
        ></div>
      ))}
    </div>
  );

  const renderContent = () => {
    if (!reloading) return null;

    const themeMap = {
      circular: <Gradient reverse={reverse} duration={duration} pause={pause} />,
      spinner: <Spinner reverse={reverse} duration={duration} pause={pause} />,
      dots: dostLoading(),
    };

    let renderIndicator = themeMap[theme];

    if (indicator && typeof indicator !== 'boolean') {
      renderIndicator = indicator as React.ReactElement;
    }
    return (
      <>
        {indicator && renderIndicator}
        {text && <span className={textClass}>{parseTNode(text)}</span>}
      </>
    );
  };

  if (childNode) {
    return (
      <div className={classNames(relativeClass, className)} style={style}>
        {parseTNode(childNode)}
        {reloading && (
          <div ref={loadingRef} className={classNames(baseClasses)} style={{ ...rootStyle }}>
            {renderContent()}
          </div>
        )}
      </div>
    );
  }

  if (attach) {
    return (
      <Portal attach={attach}>
        {loading && (
          <div
            ref={loadingRef}
            className={classNames(baseClasses, fullClass, className)}
            style={{ ...rootStyle, ...style }}
          >
            {renderContent()}
          </div>
        )}
      </Portal>
    );
  }

  return (
    loading && (
      <div ref={loadingRef} className={classNames(baseClasses, className)} style={{ ...rootStyle, ...style }}>
        {renderContent()}
      </div>
    )
  );
};

Loading.displayName = 'Loading';

export default Loading;
