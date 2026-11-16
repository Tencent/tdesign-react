import React, { FC, useRef, useState, useEffect } from 'react';
import { LoadingIcon, CheckCircleIcon, ErrorCircleIcon, CloseCircleIcon } from 'tdesign-icons-react';
import { CSSTransition } from 'react-transition-group';
import classNames from 'classnames';
import Overlay from '../overlay';
import useCssTransition from '../_util/hooks/useCssTransition';
import useConfig from '../hooks/useConfig';
import { TdToastProps } from './type';
import { StyledProps } from '../common';
import { toastDefaultProps } from './defaultProps';
import { usePrefixClass } from '../hooks/useClass';
import { useLockScroll } from '../hooks/useLockScroll';
import useDefaultProps from '../hooks/useDefaultProps';
import parseTNode from '../_util/parseTNode';
import { isBrowser } from '../_util/dom';

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
