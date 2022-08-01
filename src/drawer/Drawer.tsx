import React, { forwardRef, useState, useEffect, useImperativeHandle, useRef, useCallback } from 'react';
import classnames from 'classnames';
import { CloseIcon as TdCloseIcon } from 'tdesign-icons-react';

import { addClass, removeClass } from '../_util/dom';
import { useLocaleReceiver } from '../locale/LocalReceiver';
import getScrollbarWidth from '../_util/getScrollbarWidth';
import hasScrollBar from '../_util/hasScrollBar';
import { TdDrawerProps, DrawerEventSource } from './type';
import { StyledProps } from '../common';
import DrawerWrapper from './DrawerWrapper';
import Button from '../button';
import useConfig from '../hooks/useConfig';
import useGlobalIcon from '../hooks/useGlobalIcon';
import { drawerDefaultProps } from './defaultProps';
import useDrag from './hooks/useDrag';

export const CloseTriggerType: { [key: string]: DrawerEventSource } = {
  CLICK_OVERLAY: 'overlay',
  CLICK_CLOSE_BTN: 'close-btn',
  CLICK_CANCEL_BTN: 'cancel',
  KEYDOWN_ESC: 'esc',
};

export interface DrawerProps extends TdDrawerProps, StyledProps {}

const Drawer = forwardRef((props: DrawerProps, ref: React.Ref<HTMLDivElement>) => {
  const {
    className,
    style,
    visible,
    attach = '',
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
    mode,
    preventScrollThrough = true,
    sizeDraggable,
  } = props;

  // 国际化文本初始化
  const [local, t] = useLocaleReceiver('drawer');
  const { CloseIcon } = useGlobalIcon({ CloseIcon: TdCloseIcon });
  const size = propsSize ?? local.size;
  const confirmText = t(local.confirm);
  const cancelText = t(local.cancel);

  const { classPrefix } = useConfig();
  const containerRef = useRef<HTMLDivElement>();
  const contentWrapperRef = useRef<HTMLDivElement>();
  const drawerWrapperRef = useRef<HTMLElement>(); // 即最终的 attach dom，默认为 document.body
  const prefixCls = `${classPrefix}-drawer`;
  const lockCls = `${prefixCls}--lock`;

  const transform = visible ? 'translate(0px)' : '';
  const closeIcon = React.isValidElement(closeBtn) ? closeBtn : <CloseIcon />;
  const { dragSizeValue, enableDrag, draggableLineStyles } = useDrag(placement, sizeDraggable);
  const [isDestroyOnClose, setIsDestroyOnClose] = useState(false);

  useImperativeHandle(ref, () => containerRef.current);

  useEffect(() => {
    if (preventScrollThrough) {
      if (visible && !showInAttachedElement) {
        addClass(document.body, lockCls);
      } else {
        removeClass(document.body, lockCls);
      }
    }
  }, [visible, showInAttachedElement, lockCls, preventScrollThrough]);

  // 重置销毁钩子判断
  useEffect(() => {
    if (!destroyOnClose || !visible) return;
    setIsDestroyOnClose(false);
  }, [visible, destroyOnClose]);

  const getSizeValue = useCallback(
    (size: string): string => {
      if (dragSizeValue) return dragSizeValue;

      const defaultSize = isNaN(Number(size)) ? size : `${size}px`;
      return (
        {
          small: '300px',
          medium: '500px',
          large: '760px',
        }[size] || defaultSize
      );
    },
    [dragSizeValue],
  );

  useEffect(() => {
    let documentBodyCssText = '';

    if (visible) {
      if (attach !== '' && hasScrollBar()) {
        // 处理滚动条宽度导致晃动的问题。
        const scrollbarWidth = getScrollbarWidth();
        documentBodyCssText = `overflow: hidden; width: calc(100% - ${scrollbarWidth}px);`;

        if (mode !== 'push') {
          // 这里做简单的性能优化，如果是 body 那么在下面 mode=push 的模式下，一起使用 cssText 设置，减少重绘重排
          document.body.style.cssText = documentBodyCssText;
        }
      }
    }

    if (mode === 'push') {
      drawerWrapperRef.current.style.cssText = 'transition: margin 300ms cubic-bezier(0.7, 0.3, 0.1, 1) 0s';

      const marginStr = {
        left: `margin: 0 0 0 ${getSizeValue(size)}`,
        right: `margin: 0 0 0 -${getSizeValue(size)}`,
        top: `margin: ${getSizeValue(size)} 0 0 0`,
        bottom: `margin: -${getSizeValue(size)} 0 0 0`,
      }[placement];

      if (visible) {
        drawerWrapperRef.current.style.cssText += marginStr;
      } else {
        drawerWrapperRef.current.style.cssText = drawerWrapperRef.current.style.cssText.replace(/margin:.+;/, '');
      }
    }

    if (contentWrapperRef.current) {
      // 聚焦到 Drawer 最外层元素即 containerRef.current，KeyDown 事件才有效。
      containerRef.current.focus();

      contentWrapperRef.current.style.transform = transform;
    }
  }, [attach, mode, transform, visible, placement, size, getSizeValue]);

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

  function onTransitionEnd() {
    if (!visible) {
      // 重置样式
      document.body.style.display = 'none';
      document.body.style.overflow = '';
      document.body.style.width = '';
      document.body.style.margin = '';
      document.body.style.display = 'block';

      destroyOnClose && setIsDestroyOnClose(true);
    }
  }

  const drawerClass = classnames(prefixCls, className, `${prefixCls}--${placement}`, {
    [`${prefixCls}--open`]: visible,
    [`${prefixCls}--attach`]: showInAttachedElement,
    [`${prefixCls}--without-mask`]: !showOverlay,
  });

  const contentWrapperClass = classnames(
    `${prefixCls}__content-wrapper`,
    `${prefixCls}__content-wrapper--${placement}`,
  );

  const getContentWrapperStyle = useCallback(
    () => ({
      transform: visible ? 'translateX(0)' : undefined,
      width: ['left', 'right'].includes(placement) ? getSizeValue(size) : '',
      height: ['top', 'bottom'].includes(placement) ? getSizeValue(size) : '',
    }),
    [visible, placement, size, getSizeValue],
  );

  const [contentWrapperStyle, setContentWrapperStyle] = useState(getContentWrapperStyle());

  useEffect(() => {
    setContentWrapperStyle(getContentWrapperStyle());
  }, [getContentWrapperStyle]);

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

  const renderOverlay = showOverlay && <div className={`${prefixCls}__mask`} onClick={onMaskClick} />;
  const renderCloseBtn = closeBtn && (
    <div onClick={onClickCloseBtn} className={`${prefixCls}__close-btn`}>
      {closeIcon}
    </div>
  );
  const renderHeader = header && <div className={`${prefixCls}__header`}>{header}</div>;
  const renderBody = <div className={`${prefixCls}__body`}>{body || children}</div>;
  const renderFooter = footer && <div className={`${prefixCls}__footer`}>{getFooter()}</div>;

  if (isDestroyOnClose && !visible) return null;

  return (
    <DrawerWrapper attach={attach} ref={drawerWrapperRef}>
      <div
        ref={containerRef}
        className={drawerClass}
        style={{ zIndex, ...style }}
        tabIndex={-1} // https://stackoverflow.com/questions/43503964/onkeydown-event-not-working-on-divs-in-react
        onKeyDown={onKeyDownEsc}
        onTransitionEnd={onTransitionEnd}
      >
        {renderOverlay}
        <div ref={contentWrapperRef} className={contentWrapperClass} style={contentWrapperStyle}>
          {renderCloseBtn}
          {renderHeader}
          {renderBody}
          {renderFooter}
          {sizeDraggable && <div style={draggableLineStyles} onMouseDown={enableDrag}></div>}
        </div>
      </div>
    </DrawerWrapper>
  );
});

Drawer.displayName = 'Drawer';
Drawer.defaultProps = drawerDefaultProps;

export default Drawer;
