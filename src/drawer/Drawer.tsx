import React, { forwardRef, useState, useContext, useEffect, useImperativeHandle, useRef } from 'react';
import classnames from 'classnames';

import { CloseIcon } from '@tencent/tdesign-icons-react';
import { useLocaleReceiver } from '@tencent/tdesign-react/locale/LocalReceiver';
import { ConfigContext } from '../config-provider';
import getScrollbarWidth from '../_util/getScrollbarWidth';
import hasScrollBar from '../_util/hasScrollBar';
import { TdDrawerProps, DrawerEventSource } from '../_type/components/drawer';
import { StyledProps } from '../_type';
import DrawerWrapper from './DrawerWrapper';
import Button from '../button';

export const CloseTriggerType: { [key: string]: DrawerEventSource } = {
  CLICK_OVERLAY: 'overlay',
  CLICK_CLOSE_BTN: 'close-btn',
  CLICK_CANCEL_BTN: 'cancel',
  KEYDOWN_ESC: 'esc',
};

export interface DrawerProps extends TdDrawerProps, StyledProps {}

const getSizeValue = (size: string): string => {
  const defaultSize = isNaN(Number(size)) ? size : `${size}px`;
  return (
    {
      small: '300px',
      medium: '500px',
      large: '760px',
    }[size] || defaultSize
  );
};

const Drawer = forwardRef((props: DrawerProps, ref: React.Ref<HTMLDivElement>) => {
  const {
    className,
    style,
    visible,
    attach = '',
    showOverlay,
    size,
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
  } = props;

  // 国际化文本初始化
  const [local, t] = useLocaleReceiver('drawer');
  const confirmText = t(local.confirm);
  const cancelText = t(local.cancel);

  const { classPrefix } = useContext(ConfigContext);
  const containerRef = useRef<HTMLDivElement>();
  const contentWrapperRef = useRef<HTMLDivElement>();
  const drawerRef = useRef<HTMLElement>(); // 即最终的 attach dom，默认为 document.body
  const prefixCls = `${classPrefix}-drawer`;

  const transform = visible ? 'translate(0px)' : '';
  const closeIcon = React.isValidElement(closeBtn) ? closeBtn : <CloseIcon />;

  const [isDestroyOnClose, setIsDestroyOnClose] = useState(false);

  useImperativeHandle(ref, () => containerRef.current);

  // 重置销毁钩子判断
  useEffect(() => {
    if (!destroyOnClose || !visible) return;
    setIsDestroyOnClose(false);
  }, [visible, destroyOnClose]);

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
      drawerRef.current.style.cssText = 'transition: margin 300ms cubic-bezier(0.7, 0.3, 0.1, 1) 0s';

      const marginStr = {
        left: `margin: 0 0 0 ${getSizeValue(size)}`,
        right: `margin: 0 0 0 -${getSizeValue(size)}`,
        top: `margin: ${getSizeValue(size)} 0 0 0`,
        bottom: `margin: -${getSizeValue(size)} 0 0 0`,
      }[placement];

      if (visible) {
        drawerRef.current.style.cssText += marginStr;
      } else {
        drawerRef.current.style.cssText = drawerRef.current.style.cssText.replace(/margin:.+;/, '');
      }
    }

    if (contentWrapperRef.current) {
      // 聚焦到 Drawer 最外层元素即 containerRef.current，KeyDown 事件才有效。
      containerRef.current.focus();

      contentWrapperRef.current.style.transform = transform;
    }
  }, [attach, mode, transform, visible, placement, size]);

  function onMaskClick(e: React.MouseEvent<HTMLDivElement>) {
    onOverlayClick?.({ e });
    closeOnOverlayClick && onClose?.({ e, trigger: CloseTriggerType.CLICK_OVERLAY });
  }
  function onClickCloseBtn(e: React.MouseEvent<HTMLDivElement>) {
    onCloseBtnClick?.({ e });
    onClose?.({ e, trigger: CloseTriggerType.CLICK_CLOSE_BTN });
  }
  function onKeyDownEsc(e: React.KeyboardEvent<HTMLDivElement>) {
    if (e.key !== 'Escape') return;

    onEscKeydown?.({ e });
    closeOnEscKeydown && onClose?.({ e, trigger: CloseTriggerType.KEYDOWN_ESC });
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

  const drawerClass = classnames(prefixCls, className, `${prefixCls}-${placement}`, {
    [`${prefixCls}-open`]: visible,
    [`${prefixCls}-attach`]: showInAttachedElement,
    [`${prefixCls}-no-mask`]: !showOverlay,
  });

  const contentWrapperClass = classnames(`${prefixCls}__content-wrapper`, `${prefixCls}__content-wrapper-${placement}`);
  const contentWrapperStyle = {
    transform: visible ? 'translateX(0)' : undefined,
    width: ['left', 'right'].includes(placement) ? getSizeValue(size) : '',
    height: ['top', 'bottom'].includes(placement) ? getSizeValue(size) : '',
  };

  function getFooter(): React.ReactNode {
    if (footer !== true) return footer;

    const defaultCancelBtn = (
      <Button theme="default" onClick={onCancelClick} className={`${prefixCls}-cancel`}>
        {cancelText}
      </Button>
    );

    const defaultConfirmBtn = (
      <Button theme="primary" onClick={onConfirmClick} className={`${prefixCls}-confirm`}>
        {confirmText}
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
        {placement === 'right' ? renderConfirmBtn : null}
        {renderCancelBtn}
        {placement !== 'right' ? renderConfirmBtn : null}
      </div>
    );
  }

  const renderOverlay = showOverlay ? <div className={`${prefixCls}__mask`} onClick={onMaskClick} /> : null;
  const renderCloseBtn = closeBtn ? (
    <div onClick={onClickCloseBtn} className={`${prefixCls}__close-btn`}>
      {closeIcon}
    </div>
  ) : null;
  const renderHeader = header && <div className={`${prefixCls}__header`}>{header}</div>;
  const renderBody = <div className={`${prefixCls}__body`}>{body || children}</div>;
  const renderFooter = footer && <div className={`${prefixCls}__footer`}>{getFooter()}</div>;

  if (isDestroyOnClose && !visible) return null;

  return (
    <DrawerWrapper attach={attach} ref={drawerRef}>
      <div
        ref={containerRef}
        className={drawerClass}
        style={{ zIndex, ...style }}
        tabIndex={0} // https://stackoverflow.com/questions/43503964/onkeydown-event-not-working-on-divs-in-react
        onKeyDown={onKeyDownEsc}
        onTransitionEnd={onTransitionEnd}
      >
        {renderOverlay}
        <div ref={contentWrapperRef} className={contentWrapperClass} style={contentWrapperStyle}>
          {renderCloseBtn}
          {renderHeader}
          {renderBody}
          {renderFooter}
        </div>
      </div>
    </DrawerWrapper>
  );
});

Drawer.defaultProps = {
  attach: '',
  closeBtn: true,
  closeOnOverlayClick: true,
  closeOnEscKeydown: true,
  size: 'small',
  placement: 'right',
  mode: 'overlay',
  destroyOnClose: false,
  showOverlay: true,
  header: undefined,
  footer: true,
};

Drawer.displayName = 'Drawer';

export default Drawer;
