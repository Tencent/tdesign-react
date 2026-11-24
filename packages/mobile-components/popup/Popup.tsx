import React, { useMemo, useRef, useState } from 'react';
import classnames from 'classnames';
import { CloseIcon } from 'tdesign-icons-react';
import { CSSTransition } from 'react-transition-group';
import { CSSTransitionClassNames } from 'react-transition-group/CSSTransition';
import Overlay from '../overlay';
import useDefault from '../_util/useDefault';
import withNativeProps, { NativeProps } from '../_util/withNativeProps';
import { TdPopupProps } from './type';
import { popupDefaultProps } from './defaultProps';
import useDefaultProps from '../hooks/useDefaultProps';
import parseTNode from '../_util/parseTNode';
import { usePrefixClass } from '../hooks/useClass';
import { useLockScroll } from '../hooks/useLockScroll';
import Portal from '../common/Portal';

export interface PopupProps extends TdPopupProps, NativeProps {}

enum PopupSourceEnum {
  OVERLAY = 'overlay',
  CLOSEBTN = 'close-btn',
}

const Popup: React.FC<PopupProps> = (props) => {
  const {
    children,
    placement,
    showOverlay,
    visible,
    defaultVisible,
    zIndex,
    overlayProps,
    preventScrollThrough,
    attach,
    destroyOnClose,
    closeBtn,
    closeOnOverlayClick,
    duration,
    onClose,
    onClosed,
    onOpen,
    onOpened,
    onVisibleChange,
  } = useDefaultProps(props, popupDefaultProps);

  const name = usePrefixClass('popup');

  const contentRef = useRef<HTMLDivElement>(null);

  const [show, setShow] = useDefault<boolean, any>(visible, defaultVisible, onVisibleChange);

  useLockScroll(contentRef, show && preventScrollThrough, name);

  const [active, setActive] = useState(show);

  const handleOverlayClick = (e) => {
    if (!closeOnOverlayClick) return;
    onClose?.(e);
    setShow(false, PopupSourceEnum.OVERLAY);
  };

  const handleCloseClick = (e) => {
    onClose?.(e);
    setShow(false, PopupSourceEnum.CLOSEBTN);
  };

  const contentStyle = useMemo<React.CSSProperties>(
    () => ({
      zIndex,
      display: active ? null : 'none',
      animationFillMode: 'forwards',
    }),
    [zIndex, active],
  );

  const overlayPropsWithZIndex = useMemo(
    () => ({
      ...overlayProps,
      zIndex: overlayProps?.zIndex ?? zIndex,
    }),
    [overlayProps, zIndex],
  );

  const classNames = useMemo<CSSTransitionClassNames>(
    () => ({
      enterActive: placement === 'center' ? 'fade-zoom-enter-active' : `slide-${placement}-enter-active`,
      exitActive: placement === 'center' ? 'fade-zoom-leave-active' : `slide-${placement}-leave-active`,
    }),
    [placement],
  );

  const closeBtnNode = !closeBtn ? null : (
    <div className={`${name}__close`} onClick={handleCloseClick}>
      {parseTNode(closeBtn, props, <CloseIcon size={24} />)}
    </div>
  );

  const node = (
    <>
      <Overlay
        className={`${name}-zIndex`}
        visible={show && showOverlay}
        onClick={handleOverlayClick}
        preventScrollThrough={preventScrollThrough}
        duration={duration}
        {...overlayPropsWithZIndex}
      />
      <CSSTransition
        in={show}
        timeout={duration}
        nodeRef={contentRef}
        unmountOnExit={destroyOnClose}
        classNames={classNames}
        onEnter={() => {
          onOpen?.();
          setActive(true);
        }}
        onEntered={() => {
          onOpened?.();
        }}
        onExited={() => {
          onClosed?.();
          setActive(false);
        }}
      >
        {withNativeProps(
          props,
          <div ref={contentRef} className={classnames([name, `${name}--${placement}`])} style={contentStyle}>
            {closeBtnNode}
            {parseTNode(children)}
          </div>,
        )}
      </CSSTransition>
    </>
  );
  return <Portal attach={attach}>{node}</Portal>;
};

Popup.displayName = 'Popup';

export default Popup;
