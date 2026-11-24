import React, { useRef, useMemo } from 'react';
import classNames from 'classnames';
import { CSSTransition } from 'react-transition-group';
import { StyledProps } from '../common';
import { TdOverlayProps } from './type';
import { overlayDefaultProps } from './defaultProps';
import { useLockScroll } from '../hooks/useLockScroll';
import parseTNode from '../_util/parseTNode';
import useDefaultProps from '../hooks/useDefaultProps';
import { usePrefixClass } from '../hooks/useClass';

export interface OverlayProps extends TdOverlayProps, StyledProps {}

const Overlay: React.FC<OverlayProps> = (props) => {
  const overlayClass = usePrefixClass('overlay');
  const overlayRef = useRef<HTMLDivElement>(null);

  const {
    className,
    style,
    backgroundColor,
    children,
    duration,
    preventScrollThrough,
    visible,
    zIndex,
    onClick,
    onClose,
    onClosed,
    onOpen,
    onOpened,
  } = useDefaultProps<OverlayProps>(props, overlayDefaultProps);

  useLockScroll(overlayRef, visible && preventScrollThrough, overlayClass);

  const overlayStyles = useMemo(
    () => ({
      ...style,
      zIndex,
      backgroundColor,
      animationDuration: `${duration}ms`,
    }),
    [zIndex, backgroundColor, duration, style],
  );

  const handleClick = (e) => {
    onClick?.({ e });
  };

  const transitionCallbacks = {
    onEnter: () => {
      onOpen?.();
    },
    onEntered: () => {
      onOpened?.();
    },
    onExit: () => {
      onClose?.();
    },
    onExited: () => {
      onClosed?.();
    },
  };

  return (
    <CSSTransition
      in={visible}
      appear
      timeout={duration}
      nodeRef={overlayRef}
      classNames={`${overlayClass}-fade`}
      unmountOnExit
      {...transitionCallbacks}
    >
      <div ref={overlayRef} className={classNames(className, overlayClass)} style={overlayStyles} onClick={handleClick}>
        {parseTNode(children)}
      </div>
    </CSSTransition>
  );
};

Overlay.displayName = 'Overlay';

export default Overlay;
