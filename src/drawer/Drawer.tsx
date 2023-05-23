import React, { forwardRef, useState, useEffect, useImperativeHandle, useRef, useMemo } from 'react';
import classnames from 'classnames';
import { CSSTransition } from 'react-transition-group';
import { CloseIcon as TdCloseIcon } from 'tdesign-icons-react';

import { useLocaleReceiver } from '../locale/LocalReceiver';
import { TdDrawerProps, DrawerEventSource } from './type';
import { StyledProps } from '../common';
import Button from '../button';
import useConfig from '../hooks/useConfig';
import useGlobalIcon from '../hooks/useGlobalIcon';
import { drawerDefaultProps } from './defaultProps';
import useDrag from './hooks/useDrag';
import Portal from '../common/Portal';
import useLockStyle from './hooks/useLockStyle';
import useDefaultProps from '../hooks/useDefaultProps';

export const CloseTriggerType: { [key: string]: DrawerEventSource } = {
  CLICK_OVERLAY: 'overlay',
  CLICK_CLOSE_BTN: 'close-btn',
  CLICK_CANCEL_BTN: 'cancel',
  KEYDOWN_ESC: 'esc',
};

export interface DrawerProps extends TdDrawerProps, StyledProps {}

const Drawer = forwardRef<HTMLDivElement, DrawerProps>((originalProps, ref) => {
  const props = useDefaultProps<DrawerProps>(originalProps, drawerDefaultProps);
  const {
    className,
    style,
    visible,
    attach,
    showOverlay,
    size: propsSize,
    placement,
    onCancel,
    onConfirm,
    onClose,
    onCloseBtnClick,
    onOverlayClick,
    onEscKeydown,
    showInAttachedElement,
    closeOnOverlayClick,
    closeOnEscKeydown,
    children,
    header,
    body,
    footer,
    closeBtn,
    cancelBtn,
    confirmBtn,
    zIndex,
    destroyOnClose,
    sizeDraggable,
  } = props;

  // 国际化文本初始化
  const [local, t] = useLocaleReceiver('drawer');
  const { CloseIcon } = useGlobalIcon({ CloseIcon: TdCloseIcon });
  const size = propsSize ?? local.size;
  const confirmText = t(local.confirm);
  const cancelText = t(local.cancel);

  const { classPrefix } = useConfig();
  const maskRef = useRef<HTMLDivElement>();
  const containerRef = useRef<HTMLDivElement>();
  const drawerWrapperRef = useRef<HTMLElement>(); // 即最终的 attach dom，默认为 document.body
  const prefixCls = `${classPrefix}-drawer`;

  const closeIcon = React.isValidElement(closeBtn) ? closeBtn : <CloseIcon />;
  const { dragSizeValue, enableDrag, draggableLineStyles } = useDrag(placement, sizeDraggable);
  const [animationStart, setAnimationStart] = useState(false);

  const sizeValue = useMemo(() => {
    const sizeMap = { small: '300px', medium: '500px', large: '760px' };
    return dragSizeValue || sizeMap[size] || size;
  }, [dragSizeValue, size]);

  useLockStyle({ ...props, sizeValue });
  useImperativeHandle(ref, () => containerRef.current);

  useEffect(() => {
    if (!visible) return;
    // 聚焦到 Drawer 最外层元素即 containerRef.current，KeyDown 事件才有效。
    containerRef.current?.focus?.();
  }, [visible]);

  function onMaskClick(e: React.MouseEvent<HTMLDivElement>) {
    onOverlayClick?.({ e });
    (closeOnOverlayClick ?? local.closeOnOverlayClick) && onClose?.({ e, trigger: CloseTriggerType.CLICK_OVERLAY });
  }
  function onClickCloseBtn(e: React.MouseEvent<HTMLDivElement>) {
    onCloseBtnClick?.({ e });
    onClose?.({ e, trigger: CloseTriggerType.CLICK_CLOSE_BTN });
  }
  function onKeyDownEsc(e: React.KeyboardEvent<HTMLDivElement>) {
    if (e.key !== 'Escape') return;

    onEscKeydown?.({ e });
    (closeOnEscKeydown ?? local.closeOnEscKeydown) && onClose?.({ e, trigger: CloseTriggerType.KEYDOWN_ESC });
  }
  function onCancelClick(e: React.MouseEvent<HTMLButtonElement>) {
    onCancel?.({ e });
    onClose?.({ e, trigger: CloseTriggerType.CLICK_CANCEL_BTN });
  }
  function onConfirmClick(e: React.MouseEvent<HTMLButtonElement>) {
    onConfirm?.({ e });
  }

  const contentWrapperStyle = useMemo(
    () => ({
      transform: visible && animationStart ? 'translateX(0)' : undefined,
      width: ['left', 'right'].includes(placement) ? sizeValue : '',
      height: ['top', 'bottom'].includes(placement) ? sizeValue : '',
    }),
    [visible, placement, sizeValue, animationStart],
  );

  function getFooter(): React.ReactNode {
    if (footer !== true) return footer;

    const defaultCancelBtn = (
      <Button theme="default" onClick={onCancelClick} className={`${prefixCls}__cancel`}>
        {cancelBtn && typeof cancelBtn === 'string' ? cancelBtn : cancelText}
      </Button>
    );

    const defaultConfirmBtn = (
      <Button theme="primary" onClick={onConfirmClick} className={`${prefixCls}__confirm`}>
        {confirmBtn && typeof confirmBtn === 'string' ? confirmBtn : confirmText}
      </Button>
    );

    const renderCancelBtn = cancelBtn && React.isValidElement(cancelBtn) ? cancelBtn : defaultCancelBtn;
    const renderConfirmBtn = confirmBtn && React.isValidElement(confirmBtn) ? confirmBtn : defaultConfirmBtn;

    const footerStyle = {
      display: 'flex',
      justifyContent: placement === 'right' ? 'flex-start' : 'flex-end',
    };

    return (
      <div style={footerStyle}>
        {placement === 'right' && renderConfirmBtn}
        {renderCancelBtn}
        {placement !== 'right' && renderConfirmBtn}
      </div>
    );
  }

  const renderOverlay = showOverlay && (
    <CSSTransition in={visible} timeout={200} classNames={`${prefixCls}-fade`} nodeRef={maskRef}>
      <div ref={maskRef} className={`${prefixCls}__mask`} onClick={onMaskClick} />
    </CSSTransition>
  );
  const renderCloseBtn = closeBtn && (
    <div onClick={onClickCloseBtn} className={`${prefixCls}__close-btn`}>
      {closeIcon}
    </div>
  );
  const renderHeader = header && <div className={`${prefixCls}__header`}>{header}</div>;
  const renderBody = <div className={`${prefixCls}__body`}>{body || children}</div>;
  const renderFooter = footer && <div className={`${prefixCls}__footer`}>{getFooter()}</div>;

  return (
    <CSSTransition
      in={visible}
      nodeRef={drawerWrapperRef}
      unmountOnExit={destroyOnClose}
      timeout={{ appear: 10, enter: 10, exit: 300 }}
      onEntered={() => setAnimationStart(true)}
      onExited={() => setAnimationStart(false)}
    >
      <Portal attach={attach} ref={drawerWrapperRef}>
        <div
          ref={containerRef}
          className={classnames(prefixCls, className, `${prefixCls}--${placement}`, {
            [`${prefixCls}--open`]: visible,
            [`${prefixCls}--attach`]: showInAttachedElement,
            [`${prefixCls}--without-mask`]: !showOverlay,
          })}
          style={{ zIndex, ...style }}
          tabIndex={-1} // https://stackoverflow.com/questions/43503964/onkeydown-event-not-working-on-divs-in-react
          onKeyDown={onKeyDownEsc}
        >
          {renderOverlay}
          <div
            className={classnames(`${prefixCls}__content-wrapper`, `${prefixCls}__content-wrapper--${placement}`)}
            style={contentWrapperStyle}
          >
            {renderCloseBtn}
            {renderHeader}
            {renderBody}
            {renderFooter}
            {sizeDraggable && <div style={draggableLineStyles} onMouseDown={enableDrag}></div>}
          </div>
        </div>
      </Portal>
    </CSSTransition>
  );
});

Drawer.displayName = 'Drawer';

export default Drawer;
