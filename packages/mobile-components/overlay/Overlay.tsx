import React, { useMemo, useRef } from 'react';
import { CSSTransition } from 'react-transition-group';
import classNames from 'classnames';

import parseTNode from '../_util/parseTNode';
import { usePrefixClass } from '../hooks/useClass';
import useDefaultProps from '../hooks/useDefaultProps';
import { useLockScroll } from '../hooks/useLockScroll';
import { overlayDefaultProps } from './defaultProps';

import type { StyledProps } from '../common';
import type { TdOverlayProps } from './type';

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
