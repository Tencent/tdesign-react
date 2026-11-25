import React, { useEffect, useRef, useState } from 'react';
import { CSSTransition } from 'react-transition-group';
import classNames from 'classnames';
import { CheckCircleIcon, CloseCircleIcon, ErrorCircleIcon, LoadingIcon } from 'tdesign-icons-react';

import { isBrowser } from '../_util/dom';
import useCssTransition from '../_util/hooks/useCssTransition';
import parseTNode from '../_util/parseTNode';
import { usePrefixClass } from '../hooks/useClass';
import useConfig from '../hooks/useConfig';
import useDefaultProps from '../hooks/useDefaultProps';
import { useLockScroll } from '../hooks/useLockScroll';
import Overlay from '../overlay';
import { toastDefaultProps } from './defaultProps';

import type { FC } from 'react';
import type { StyledProps } from '../common';
import type { TdToastProps } from './type';

interface ToastProps extends TdToastProps, StyledProps {
  children?: React.ReactNode;
  el: HTMLElement;
}

const themeIconMap = {
  loading: <LoadingIcon />,
  success: <CheckCircleIcon />,
  warning: <ErrorCircleIcon />,
  error: <CloseCircleIcon />,
};

const topOptions = {
  top: '25%',
  bottom: '75%',
};

const Toast: FC<ToastProps> = (originProps) => {
  const props = useDefaultProps<ToastProps>(originProps, toastDefaultProps);
  const {
    className,
    style,
    direction,
    placement,
    icon,
    message,
    duration,
    theme,
    preventScrollThrough,
    showOverlay,
    overlayProps,
    el,
    onClose,
  } = props;

  const { classPrefix } = useConfig();
  const toastClass = usePrefixClass('toast');
  const contentRef = useRef<HTMLDivElement>(null);
  const [toastVisible, setToastVisible] = useState(true);

  const iconClasses = classNames({
    [`${toastClass}__icon--${direction}`]: direction,
  });
  const containerClass = classNames(
    `${toastClass}`,
    `${toastClass}__content`,
    `${toastClass}__icon`,
    {
      [`${toastClass}--${direction}`]: direction,
      [`${toastClass}__content--${direction}`]: direction,
      [`${toastClass}--loading`]: theme === 'loading',
    },
    className,
  );
  const textClasses = classNames(`${toastClass}__text`, {
    [`${toastClass}__text--${direction}`]: direction,
  });

  const cssTransitionState = useCssTransition({
    contentRef,
    classPrefix,
    container: el,
  });

  useLockScroll(contentRef, toastVisible && preventScrollThrough, toastClass);

  useEffect(() => {
    if (!isBrowser || !duration) return undefined;

    const timer = setTimeout(() => {
      setToastVisible(false);
      onClose?.();
    }, duration);

    return () => {
      clearTimeout(timer);
    };
  }, [duration, onClose]);

  return (
    <>
      {showOverlay && <Overlay {...overlayProps} preventScrollThrough={preventScrollThrough} visible={showOverlay} />}
      <CSSTransition in={toastVisible} appear {...cssTransitionState.props} unmountOnExit>
        <div className={containerClass} ref={contentRef} style={{ ...style, top: topOptions[placement] ?? '45%' }}>
          <div className={iconClasses}>{icon ? parseTNode(icon) : themeIconMap[theme]}</div>
          {message && <div className={textClasses}>{parseTNode(message)}</div>}
        </div>
      </CSSTransition>
    </>
  );
};

Toast.displayName = 'Toast';

export default Toast;
